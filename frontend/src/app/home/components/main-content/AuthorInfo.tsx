import { AuthService } from "@/services/auth.service";
import { Post } from "@/types";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AuthorInfoProps {
    post: Post;
    onDelete: () => void;
}

export const AuthorInfo = ({ post, onDelete }: AuthorInfoProps) => {
    const user = AuthService.getUserData();
    const token = AuthService.getToken();
    const isAuthor = user?._id === post.author?._id;
    const queryClient = useQueryClient();

    const { mutate: deletePost } = useMutation({
        mutationFn: async () => {
            onDelete();
            await new Promise((resolve) => setTimeout(resolve, 300));
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${post._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete post");
            }
            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch posts after deletion
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const handleEditPost = () => {
        // Navigate to the edit post page
        window.location.href = `/post/${post._id}/edit`;
    };

    return (
        <div className="flex justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="avatar">
                    <div className="w-8 rounded-full">
                        <img
                            src={post.author?.profilePicture || "/default-avatar.png"}
                            alt={post.author.username}
                        />
                    </div>
                </div>
                <span className="font-medium">{post.author.username}</span>
            </div>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost btn-xs tooltip" data-tip="More options">
                    <Image
                        src="/three-dots.svg"
                        alt="More options"
                        width={20}
                        height={20}
                    />
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                >
                    {isAuthor && (
                        <li>
                            <button 
                                className=""
                                onClick={() => handleEditPost()}
                            >
                                Edit
                            </button>
                        </li>
                    )}
                    {isAuthor && (
                        <li>
                            <button 
                                className="text-error"
                                onClick={() => deletePost()}
                            >
                                Delete
                            </button>
                        </li>
                    )}
                    <li>
                        <a className="text-error">Report</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};
