from langchain_ollama import OllamaEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import json
from app.core.config import settings

# Get API key from .env file
api_key = settings.GOOGLE_API_KEY
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

# Load the data from JSONL instead of CSV
def load_jsonl_data(file_path):
    data = []
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line:  # Skip empty lines
                try:
                    item = json.loads(line)
                    data.append(item)
                except json.JSONDecodeError:
                    print(f"Warning: Could not parse line: {line}")
    return data
# Load the JSONL data from the path of this file
base_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_dir, "web_developer_skillset.jsonl")
jsonl_data = load_jsonl_data(file_path)

# Initialize embeddings model
embeddings = GoogleGenerativeAIEmbeddings(api_key=api_key,model="models/text-embedding-004")

# Set up database location
db_location = "./chrome_langchain_db"

# Check if we need to add documents (first run)
add_documents = not os.path.exists(db_location)

# Process documents with enhanced metadata
if add_documents:
    documents = []
    ids = []
    
    for item in jsonl_data:
        # Extract data from each JSON object
        doc_id = item.get("id", "")
        text = item.get("text", "")
        metadata = item.get("metadata", {})
        
        # Enhance metadata for better retrieval if needed
        enhanced_metadata = {
            "id": doc_id
        }
        
        # If it's a detailed skill entry (vs. summary entries)
        if "category" in metadata:
            enhanced_metadata["category"] = metadata["category"]
        
        # If we have category and skill information in the item itself (not in metadata)
        if "category" in item:
            enhanced_metadata["category"] = item["category"]
        
        if "skill" in item:
            enhanced_metadata["skill"] = item["skill"]
            
        # Add experience level if we can determine it
        if "details" in item:
            details = item.get("details", "")
            if "Main" in details:
                enhanced_metadata["experience_level"] = "Expert"
            elif "Used" in details:
                enhanced_metadata["experience_level"] = "Advanced"
            elif "Basic" in details:
                enhanced_metadata["experience_level"] = "Intermediate"
            else:
                enhanced_metadata["experience_level"] = "Familiar"
        
        # Add skill information if available in metadata
        if "skill" in metadata:
            enhanced_metadata["skill"] = metadata["skill"]
            
        # Create document
        document = Document(
            page_content=text,
            metadata=enhanced_metadata
        )
        
        ids.append(str(doc_id))  # Ensure IDs are strings
        documents.append(document)
        
# Initialize the vector store
vector_store = Chroma(
    collection_name="web_developer_skillset",
    persist_directory=db_location,
    embedding_function=embeddings
)

# Add documents if this is the first run
if add_documents and documents:
    vector_store.add_documents(documents=documents, ids=ids)
    
# Create a more sophisticated retriever with filtering capabilities
def get_filtered_retriever(category=None, min_experience=None):
    """
    Get a retriever with optional filtering by category or experience level
    """
    filter_dict = {}
    
    if category:
        filter_dict["category"] = category
        
    if min_experience:
        # This would need more sophisticated logic based on experience levels
        if min_experience == "Expert":
            filter_dict["experience_level"] = "Expert"
        elif min_experience == "Advanced":
            filter_dict["experience_level"] = {"$in": ["Expert", "Advanced"]}
        elif min_experience == "Intermediate":
            filter_dict["experience_level"] = {"$in": ["Expert", "Advanced", "Intermediate"]}
            
    # Basic retriever with no filters
    if not filter_dict:
        return vector_store.as_retriever(
            search_kwargs={"k": 8}
        )
    
    # Retriever with filters
    return vector_store.as_retriever(
        search_kwargs={
            "k": 8,
            "filter": filter_dict
        }
    )

# Default retriever with increased k for better context
retriever = vector_store.as_retriever(
    search_kwargs={"k": 8}
)

# Function to get contextually relevant information
def get_contextual_info(question):
    """
    Get more relevant information based on question context
    """
    # Extract skills from the JSONL data to check against
    all_skills = set()
    for item in jsonl_data:
        # Check for skill in both item and metadata
        if "skill" in item:
            all_skills.add(item["skill"])
        elif "metadata" in item and "skill" in item["metadata"]:
            all_skills.add(item["metadata"]["skill"])
    
    # Check for specific skill mentions in the question
    mentioned_skills = [skill for skill in all_skills if skill.lower() in question.lower()]
    
    # If specific skills are mentioned, prioritize them
    if mentioned_skills:
        skill_retriever = vector_store.as_retriever(
            search_kwargs={
                "k": 5,
                "filter": {"skill": {"$in": mentioned_skills}}
            }
        )
        skill_results = skill_retriever.invoke(question)
        
        # Get some general context too
        general_results = retriever.invoke(question)
        
        # Combine results, prioritizing skill matches
        combined_results = skill_results + [doc for doc in general_results if doc not in skill_results]
        return combined_results[:8]  # Limit to 8 total results
    
    # Extract categories from the JSONL data
    all_categories = set()
    for item in jsonl_data:
        # Check for category in both item and metadata
        if "category" in item:
            all_categories.add(item["category"])
        elif "metadata" in item and "category" in item["metadata"]:
            all_categories.add(item["metadata"]["category"])
    
    # Check for category mentions
    mentioned_categories = [cat for cat in all_categories if cat.lower() in question.lower()]
    
    if mentioned_categories:
        category_retriever = vector_store.as_retriever(
            search_kwargs={
                "k": 5,
                "filter": {"category": {"$in": mentioned_categories}}
            }
        )
        category_results = category_retriever.invoke(question)
        
        # Get some general context too
        general_results = retriever.invoke(question)
        
        # Combine results, prioritizing category matches
        combined_results = category_results + [doc for doc in general_results if doc not in category_results]
        return combined_results[:8]  # Limit to 8 total results
    
    # Default to standard retrieval
    return retriever.invoke(question)

