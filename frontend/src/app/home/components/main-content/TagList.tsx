import Link from 'next/link';

interface TagListProps {
    tags: string[];
}

export const TagList = ({ tags }: TagListProps) => {
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag}`}>
                    <button className="badge badge-md p-4 hover:bg-primary hover:text-primary-content transition-colors">
                        #{tag}
                    </button>
                </Link>
            ))}
        </div>
    );
};
