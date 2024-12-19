import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface AddCommentProps {
    postId: string;
    onCommentAdded: () => void;
    isPending: boolean;
}

export default function AddComment({
    postId,
    onCommentAdded,
    isPending,
}: AddCommentProps) {
    const [comment, setComment] = useState("");
    const token = AuthService.getToken();
    const user = AuthService.getUserData();

    const { mutate: addComment } = useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/comments/post/${postId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: comment }),
                }
            );
            if (!response.ok) throw new Error("Failed to add comment");
            return response.json();
        },
        onSuccess: () => {
            setComment("");
            setTimeout(() => {
                toast.success("Comment added successfully");
            }, 2000);
            onCommentAdded();
        },
    });

    return (
        <div className="flex gap-4 items-start">
            <div className="avatar">
                <div className="w-6 rounded-full">
                    <img
                        src={user?.profilePicture || "/default-avatar.png"}
                        alt="User avatar"
                    />
                </div>
            </div>
            <div className="flex-1">
                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isPending}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => addComment()}
                    disabled={isPending || !comment.trim()}
                >
                    {isPending ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Posting...
                        </>
                    ) : (
                        "Post Comment"
                    )}
                </button>
            </div>
        </div>
    );
}
