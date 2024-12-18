import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Post } from "@/types";
import { formatPostDate } from "@/utils/dateFormatter";

interface PostActionsProps {
    post: Post;
}

export const PostActions = ({ post }: PostActionsProps) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
                <button className="btn btn-ghost btn-sm gap-2">
                    <Heart size={18} />
                    {post.likes.length}
                </button>
                <button className="btn btn-ghost btn-sm gap-2">
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