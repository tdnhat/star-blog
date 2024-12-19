import { Author } from "@/types";

interface AuthorInfoProps {
    author: Author;
}

export const AuthorInfo = ({ author }: AuthorInfoProps) => {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="avatar">
                <div className="w-8 rounded-full">
                    <img
                        src={author?.profilePicture || "/default-avatar.png"}
                        alt={author.username}
                    />
                </div>
            </div>
            <span className="font-medium">{author.username}</span>
        </div>
    );
};
