import { Post } from "@/types";
import { AuthorInfo } from "./AuthorInfo";
import { TagList } from "./TagList";
import { PostActions } from "./PostActions";
import Link from "next/link";

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    return (
        <article className="card bg-base-200">
            <div className="card-body">
                <AuthorInfo author={post.author} />
                <Link href={`/post/${post._id}`}>
                    <h2 className="card-title hover:text-primary cursor-pointer">
                        {post.title}
                    </h2>
                </Link>
                <TagList tags={post.tags} />
                {post.thumbnail && (
                    <Link href={`/post/${post._id}`}>
                        <img 
                            src={post.thumbnail} 
                            alt={post.title} 
                            className="w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                        />
                    </Link>
                )}
                <PostActions post={post} />
            </div>
        </article>
    );
};
