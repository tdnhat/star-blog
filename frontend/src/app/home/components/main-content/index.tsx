import React from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

interface Post {
    id: string;
    title: string;
    author: {
        name: string;
        avatar: string;
    };
    coverImage?: string;
    tags: string[];
    readTime: string;
    reactions: number;
    comments: number;
    createdAt: string;
}

const MainContent = () => {
    const posts: Post[] = [
        {
            id: "1",
            title: "Building Modern Web Applications with Next.js and TypeScript",
            author: {
                name: "John Developer",
                avatar: "https://github.com/shadcn.png",
            },
            coverImage: "https://picsum.photos/800/400",
            tags: ["nextjs", "typescript", "webdev"],
            readTime: "5 min read",
            reactions: 124,
            comments: 45,
            createdAt: "2024-02-20",
        },
        // Add more mock posts here
    ];

    return (
        <main className="flex-1 max-w-3xl mx-auto px-4 py-6">
            {/* Featured Post */}
            <div className="card bg-base-200 mb-6">
                <figure>
                    <img
                        src={posts[0].coverImage}
                        alt={posts[0].title}
                        className="w-full h-48 object-cover"
                    />
                </figure>
                <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="avatar">
                            <div className="w-8 rounded-full">
                                <img
                                    src={posts[0].author.avatar}
                                    alt={posts[0].author.name}
                                />
                            </div>
                        </div>
                        <span className="font-medium">
                            {posts[0].author.name}
                        </span>
                    </div>
                    <h2 className="card-title text-2xl hover:text-primary cursor-pointer">
                        {posts[0].title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {posts[0].tags.map((tag) => (
                            <span key={tag} className="badge badge-ghost">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                            <button className="btn btn-ghost btn-sm gap-2">
                                <Heart size={18} />
                                {posts[0].reactions}
                            </button>
                            <button className="btn btn-ghost btn-sm gap-2">
                                <MessageCircle size={18} />
                                {posts[0].comments}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-base-content/70">
                                {posts[0].readTime}
                            </span>
                            <button className="btn btn-ghost btn-sm">
                                <Bookmark size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <article key={post.id} className="card bg-base-200">
                        <div className="card-body">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="avatar">
                                    <div className="w-8 rounded-full">
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                        />
                                    </div>
                                </div>
                                <span className="font-medium">
                                    {post.author.name}
                                </span>
                            </div>
                            <h2 className="card-title hover:text-primary cursor-pointer">
                                {post.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="badge badge-ghost"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-4">
                                    <button className="btn btn-ghost btn-sm gap-2">
                                        <Heart size={18} />
                                        {post.reactions}
                                    </button>
                                    <button className="btn btn-ghost btn-sm gap-2">
                                        <MessageCircle size={18} />
                                        {post.comments}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-base-content/70">
                                        {post.readTime}
                                    </span>
                                    <button className="btn btn-ghost btn-sm">
                                        <Bookmark size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
};

export default MainContent;
