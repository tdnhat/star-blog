import { TagStat } from "@/types";
import { TagItem } from "./TagItem";

interface TagListProps {
    tags: TagStat[];
    selectedTag?: string;
    onTagSelect: (tag: string) => void;
    isLoading: boolean;
}

export const TagList = ({ tags, selectedTag, onTagSelect, isLoading }: TagListProps) => {
    const handleTagClick = (tagName: string) => {
        if (selectedTag === tagName) {
            onTagSelect('');
        } else {
            onTagSelect(tagName);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {tags.map((tag, index) => (
                <TagItem 
                    key={index}
                    tag={tag}
                    isSelected={selectedTag === tag.name}
                    onClick={() => handleTagClick(tag.name)}
                />
            ))}
        </div>
    );
};
