import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesService } from "../../client";
import React from "react";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";


export default function Categories(){
    const queryClient = useQueryClient()
    const {
        data:categories,
        isPending
    } = useQuery({
        queryFn:CategoriesService.readCategories,
        queryKey:["categories"]
    })

    return(
        <section>
            <h2>Categories</h2>
        <AddCategory/>
        <CategoryList categories={categories? categories : []}/>        

        </section>
    )
    


}

