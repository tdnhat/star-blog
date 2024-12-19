"use client";

import { Post } from "@/types";
import React from "react";

interface PostContentProps {
    post: Post;
}

export const PostContent = ({ post }: PostContentProps) => {
    return (
        <div className="col-span-8 pt-16">
            <article className="space-y-4">
                <img
                    src={post.thumbnail || "/default-thumbnail.jpg"}
                    alt={post.title}
                    className="w-full h-[400px] object-cover rounded-lg"
                />
                <h1 className="text-4xl font-bold">{post.title}</h1>
                <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                        <button
                            key={index}
                            className="px-3.5 py-1 rounded-full text-sm bg-transparent hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-12 rounded-full">
                            <a href={`/profile/${post.author?._id}`}>
                                <img
                                    src={
                                        post.author?.profilePicture ||
                                        "/default-avatar.png"
                                    }
                                    alt="Author avatar"
                                />
                            </a>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">
                            <a href={`/profile/${post.author?._id}`}>
                                {post.author?.username}
                            </a>
                        </p>
                        <p className="text-base-content/60 text-xs">
                            Posted on{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                            {post.updatedAt !== post.createdAt && (
                                <>
                                    {" "}
                                    • Edited on{" "}
                                    {new Date(
                                        post.updatedAt
                                    ).toLocaleDateString()}
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <div className="divider"></div>
                {/* Global style for code block */}
                <style jsx global>{`
                    /* Target Quill's code block container */
                    .ql-code-block-container {
                        background-color: #2d2d2d; /* Dark background */
                        border-radius: 0.5rem;
                        padding: 1rem;
                        margin: 1rem 0;
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
                            Consolas, "Liberation Mono", "Courier New",
                            monospace;
                        color: #e0e0e0; /* Light text for contrast */
                    }
                    /* Styling the individual code blocks inside Quill */
                    .ql-code-block {
                        color: #e0e0e0; /* Light gray text */
                        white-space: pre-wrap;
                        font-size: 0.875rem;
                        line-height: 1.25rem;
                    }
                    /* Styling <pre> elements */
                    pre {
                        background-color: #2d2d2d; /* Dark background */
                        border-radius: 0.5rem;
                        padding: 1rem;
                        color: #e0e0e0; /* Light text for contrast */
                    }
                    /* Styling <code> elements */
                    code {
                        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
                            Consolas, "Liberation Mono", "Courier New",
                            monospace;
                        font-size: 0.875rem;
                        line-height: 1.25rem;
                        color: #e0e0e0; /* Light gray text */
                    }
                `}</style>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    );
};
