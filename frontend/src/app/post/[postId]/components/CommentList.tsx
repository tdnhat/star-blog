import { AuthService } from "@/services/auth.service";
import { getRelativeTime } from "@/utils/getRelativeTime";
import { useQuery } from "@tanstack/react-query";
import { Heart, Reply } from "lucide-react";

export const CommentList = ({ postId }: { postId: string }) => {
    const token = AuthService.getToken();

    const { data: comments, isLoading } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/v1/comments/post/${postId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch comments");
                const data = await response.json();
                return data.comments || [];
            } catch (error) {
                throw error;
            }
        },
    });

    if (isLoading) return <div className="loading loading-spinner" />;

    // Handle like and reply actions (you can adjust these to match your backend logic)
    const handleLike = (commentId: string) => {
        try {
            console.log(`Liked comment with id: ${commentId}`);
            // You can call a mutation for liking the comment here
        } catch (error) {
        }
    };

    const handleReply = (commentId: string) => {
        try {
            console.log(`Replying to comment with id: ${commentId}`);
            // You can handle the reply functionality here (like opening a reply form)
        } catch (error) {
        }
    };

    return (
        <div className="space-y-4">
            {comments && comments.length > 0 ? (
                comments.map((comment: any) => (
                    <div key={comment._id} className="flex gap-4 items-start">
                        <div className="w-6 rounded-full">
                            <img
                                src={
                                    comment.author.profilePicture ||
                                    "/default-avatar.png"
                                }
                                alt="Author avatar"
                            />
                        </div>
                        <div className="flex flex-1 flex-col items-center">
                            <div className="w-full border border-gray-500 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-500">
                                        {comment.author.username}
                                    </span>
                                    <span className="text-gray-500">
                                        {" • "}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {getRelativeTime(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="mt-1">{comment.content}</p>
                            </div>
                            <div className="w-full flex gap-4 mt-2">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handleLike(comment._id)}
                                >
                                    <Heart className="w-4 h-4" />
                                    Like
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handleReply(comment._id)}
                                >
                                    <Reply className="w-4 h-4" />
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center italic">No comments yet</p>
            )}
        </div>
    );
};