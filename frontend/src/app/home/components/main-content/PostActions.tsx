"use client";

import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Post } from "@/types";
import { formatPostDate } from "@/utils/dateFormatter";
import { AuthService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PostActionsProps {
    post: Post;
}

export const PostActions = ({ post }: PostActionsProps) => {
    const token = AuthService.getToken();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount);

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

    const handleRedirectComment = () => {
        window.location.href = `/post/${post._id}`;
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
                <button
                    className={`btn btn-ghost btn-sm tooltip flex gap-2 ${
                        isLiked ? "text-primary" : ""
                    }`}
                    onClick={handleLikeToggle}
                    data-tip={isLiked ? "Unlike post" : "Like post"}
                >
                    <Heart
                        size={18}
                        className={isLiked ? "fill-current" : ""}
                    />
                    {likesCount}
                </button>
                <button
                    className="btn btn-ghost tooltip flex btn-sm gap-2"
                    data-tip="Comment on post"
                    onClick={handleRedirectComment}
                >
                    <MessageCircle size={18} />
                    {post.comments.length}
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">
                    {formatPostDate(post.createdAt)}
                </span>
                <button className="btn btn-ghost btn-sm">
                    <Bookmark size={18} />
                </button>
            </div>
        </div>
    );
};
