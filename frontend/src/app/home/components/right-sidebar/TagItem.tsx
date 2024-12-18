import { TagStat } from "@/types";

interface TagItemProps {
    tag: TagStat;
    isSelected: boolean;
    onClick: () => void;
}

export const TagItem = ({ tag, isSelected, onClick }: TagItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
        >
            <span className={isSelected ? 'font-medium' : 'text-primary font-medium'}>
                #{tag.name}
            </span>
            <span className={isSelected ? 'text-sm' : 'text-sm text-base-content/70'}>
                {tag.postsCount} posts
            </span>
        </button>
    );
};
