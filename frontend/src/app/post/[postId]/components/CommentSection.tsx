import { Post } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentList } from "./CommentList";
import AddComment from "./AddComment";
import { useState } from "react";

interface CommentSectionProps {
    post: Post;
}

export default function CommentSection({ post }: CommentSectionProps) {
    const queryClient = useQueryClient();
    const [isPending, setIsPending] = useState(false);

    const { data: postData } = useQuery({
        queryKey: ["commentCount", post._id],
        queryFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${post._id}`
            );
            if (!response.ok) throw new Error("Failed to fetch comment count");
            return response.json();
        },
    });
    const handleCommentAdded = async () => {
        setIsPending(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
        queryClient.invalidateQueries({ queryKey: ["commentCount", post._id] });

        setIsPending(false);
    };

    console.log(postData);

    return (
        <div id="comments" className="flex flex-col gap-6">
            <span className="font-bold text-lg">
                Comments{" "}
                {postData?.commentsCount ? `(${postData.commentsCount})` : ""}
            </span>{" "}
            <AddComment
                postId={post._id}
                onCommentAdded={handleCommentAdded}
                isPending={isPending}
            />
            <CommentList postId={post._id} />
        </div>
    );
}
