import { Post } from "@/types";
import { AuthorInfo } from "./AuthorInfo";
import { TagList } from "./TagList";
import { PostActions } from "./PostActions";

interface PostCardProps {
    post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
    return (
        <article className="card bg-base-200">
            <div className="card-body">
                <AuthorInfo author={post.author} />
                <h2 className="card-title hover:text-primary cursor-pointer">
                    {post.title}
                </h2>
                <TagList tags={post.tags} />
                <PostActions post={post} />
            </div>
        </article>
    );
};
