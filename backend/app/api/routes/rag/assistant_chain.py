from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.api.routes.rag.vector import retriever
import re
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from collections import deque
from app.core.config import settings

# Load environment variables from .env file
load_dotenv()

# Get API key from .env file
api_key = settings.GOOGLE_API_KEY
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

# Initialize Gemini model
model = ChatGoogleGenerativeAI(api_key=api_key,model="gemini-2.0-flash-lite")

# Improved prompting with system and user messages
system_template = """
You are acting as a personal assistant for a web developer named Guilherme Augusto. Your job is to provide clear, accurate information about their skills, technical knowledge, and experience to recruiters.
You first message you explain what you are and what you job is.
When responding to questions, follow these guidelines:
1. Be professional and friendly in your tone
2. Provide specific, concrete examples of the developer's capabilities
3. Highlight relevant skills that match the recruiter's question
4. Organize information logically and coherently 
5. If asked for contact information, provide the developer's email: [YOUR EMAIL], phone: [YOUR PHONE], and portfolio: [YOUR WEBSITE/PORTFOLIO]
6. Consider the previous conversation context when answering questions
"""

user_template = """
Previous conversation:
{messages}

Current question: {question}

Relevant skills and experience information: 
{skills}

Please provide a response to the current question, taking into account the previous conversation context.
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_template),
    ("user", user_template),
])

# Parse keywords from question to improve retrieval
def extract_keywords(question: str) -> list[str]:
    # Simple keyword extraction
    tech_keywords = ["React", "FastAPI", "Docker", "TypeScript", "Python", "PostgreSQL", 
                     "DevOps", "Frontend", "Backend", "Database", "CI/CD"]
    
    found_keywords = []
    for keyword in tech_keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', question, re.IGNORECASE):
            found_keywords.append(keyword)
    
    return found_keywords

# Create the chain
chain = prompt | model | StrOutputParser()


def process_question( question: str, messages: list[str]) -> str:
    """
    Process a question using the RAG system and return the response.
    
    Args:
        question (str): The question to process
        messages (list[str]): the message history
        
    Returns:
        str: The generated response
    """
    # Get relevant skills from the retriever
    skills = retriever.invoke(question)
    
    # Generate response using the chain
    result = chain.invoke({
        "skills": skills,
        "question": question,
        "messages": messages
    })   
    return result