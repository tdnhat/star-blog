"use client";

import { AuthService } from "@/services/auth.service";
import { Post } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import React from "react";

interface InteractionButtonsProps {
    post: Post;
}

export const InteractionButtons = ({ post }: InteractionButtonsProps) => {
    const token = AuthService.getToken();
    const [isLiked, setIsLiked] = React.useState(false);
    const [likesCount, setLikesCount] = React.useState(post.likesCount);

    useQuery({
        queryKey: ["postInteractions", post._id],
        queryFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${post._id}/interactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch interactions");
            }
            const data = await response.json();
            setIsLiked(data.isLiked);
            return data;
        },
        enabled: !!post._id,
    });
    const { mutate: likePost } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${post._id}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to like post");
            }
            return response.json();
        },
        onSuccess: (data) => {
            setIsLiked(true);
            setLikesCount(data.likesCount);
        },
    });

    const { mutate: unlikePost } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${post._id}/unlike`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to unlike post");
            }
            return response.json();
        },
        onSuccess: () => {
            setIsLiked(false);
            setLikesCount((prevCount) => prevCount - 1);
        },
    });

    const handleLikeToggle = () => {
        if (isLiked) {
            unlikePost();
        } else {
            likePost();
        }
    };

    return (
        <div className="col-span-1 sticky top-20 h-fit pt-16">
            <div className="flex flex-col gap-8 items-center">
                <button
                    className={`btn btn-ghost btn-sm hover:bg-transparent tooltip ${
                        isLiked ? "text-primary" : ""
                    }`}
                    onClick={handleLikeToggle}
                    data-tip={isLiked ? "Unlike post" : "Like post"}
                >
                    <div className="flex flex-col items-center">
                        <Heart
                            className={`w-5 h-5 hover:stroke-[3px] hover:stroke-primary transition-all ${
                                isLiked ? "fill-current" : ""
                            }`}
                        />
                        <span className="badge badge-sm mt-2">
                            {likesCount}
                        </span>
                    </div>
                </button>
                <button
                    className="btn btn-ghost btn-sm hover:bg-transparent tooltip"
                    data-tip="Jump to Comments"
                    onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <div className="flex flex-col items-center">
                        <MessageCircle className="w-5 h-5 hover:stroke-[3px] hover:stroke-primary transition-all" />
                        <span className="badge badge-sm"></span>
                    </div>
                </button>
                <button
                    className="btn btn-ghost btn-sm hover:bg-transparent tooltip"
                    data-tip="Save"
                >
                    <div className="flex flex-col items-center">
                        <Bookmark className="w-5 h-5 hover:stroke-[3px] hover:stroke-primary transition-all" />
                        <span className="badge badge-sm"></span>
                    </div>
                </button>
                <button className="btn btn-ghost btn-sm hover:bg-transparent tooltip"
                    data-tip="Share">
                    <div className="flex flex-col items-center">
                        <Share2 className="w-5 h-5 hover:stroke-[3px] hover:stroke-primary transition-all" />
                    </div>
                </button>
            </div>
        </div>
    );
};
