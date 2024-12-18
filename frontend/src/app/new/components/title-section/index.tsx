import React from "react";

interface TitleSectionProps {
    title: string;
    tags: string[];
    onTitleChange: (value: string) => void;
    onTagsChange: (tags: string[]) => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ 
    title, 
    tags, 
    onTitleChange, 
    onTagsChange 
}) => {
    const [tagInput, setTagInput] = React.useState('');

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === ',' || e.key === 'Tab') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="input w-full border border-[#ccc] text-2xl font-bold rounded-none focus:border-[#ccc] focus:outline-none"
            />
            <div className="relative">
                <div className="flex flex-wrap gap-2 items-center p-2">
                    {tags.map(tag => (
                        <div key={tag} className="badge badge-outline gap-2 rounded-lg p-3.5">
                            {tag}
                            <button onClick={() => removeTag(tag)}>×</button>
                        </div>
                    ))}
                    {tags.length >= 4 ? (
                        <span className="text-sm text-gray-500">Tag limit reached</span>
                    ) : (
                        <input
                            type="text"
                            placeholder="Add tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            className="flex-1 outline-none min-w-[120px] bg-transparent"
                            disabled={tags.length >= 4}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};export default TitleSection;