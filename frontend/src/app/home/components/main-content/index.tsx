"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Post } from "@/types";
import { PostCard } from "./PostCard";

interface PostsResponse {
    posts: Post[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}



const MainContent = ({ selectedTag }: { selectedTag?: string }) => {
    const { ref, inView } = useInView();

    const fetchPosts = async ({ pageParam = 1 }): Promise<PostsResponse> => {
        const tagParam = selectedTag ? `&tags=${selectedTag}` : '';
        const response = await fetch(
            `http://localhost:5000/api/v1/posts?page=${pageParam}&limit=10&sortBy=createdAt&status=published${tagParam}`
        );
        return response.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["posts", selectedTag],
        queryFn: fetchPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    });

    React.useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex flex-1 justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 max-w-3xl mx-auto px-4 py-6 text-center">
                <span>Failed to load posts. Please try again later.</span>
            </div>
        );
    }

    const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

    return (
        <main className="flex-1 max-w-3xl mx-auto px-4 py-6">
            <div className="space-y-4">
                {allPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            <div ref={ref} className="mt-8 text-center">
                {isFetchingNextPage ? (
                    <span className="loading loading-dots loading-md"></span>
                ) : hasNextPage ? (
                    <span className="text-base-content/70">
                        Loading more posts...
                    </span>
                ) : (
                    <div className="font-medium text-base-content/70">
                        <span>
                            You have reached the end! No more posts to load.
                        </span>
                        <a
                            href=""
                            onClick={() => window.location.reload()}
                            className="text-primary"
                        >
                            {` Refresh`}
                        </a>{" "}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MainContent;
