import { File } from "buffer";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface TitleSectionProps {
    title: string;
    tags: string[];
    thumbnail: File | null;
    onTitleChange: (value: string) => void;
    onTagsChange: (tags: string[]) => void;
    onThumbnailChange: (value: File | null) => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({
    title,
    tags,
    thumbnail,
    onTitleChange,
    onTagsChange,
    onThumbnailChange,
}) => {
    const [tagInput, setTagInput] = React.useState("");
    const [previewUrl, setPreviewUrl] = React.useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 5MB limit
                toast.error("File size must be less than 5MB.");
                return;
            }
            onThumbnailChange(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            onThumbnailChange(null);
            setPreviewUrl('');
        }
    };

    // Cleanup preview URL on unmount
    React.useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (
            e.key === "Enter" ||
            e.key === " " ||
            e.key === "," ||
            e.key === "Tab"
        ) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((tag) => tag !== tagToRemove));
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
            {/* Thumbnail Upload Section */}
            <div className="flex flex-col gap-4">
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        name="thumbnail"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                    />
                </div>
                {previewUrl && (
                    <div className="relative w-48 h-48 group">
                        <img
                            src={previewUrl}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full rounded-lg shadow-md transition-all duration-200 group-hover:brightness-50"
                        />
                        <button
                            onClick={() => {
                                onThumbnailChange(null);
                                setPreviewUrl("");
                            }}
                            className="absolute inset-0 m-auto hidden group-hover:flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full opacity-90"
                        >
                            <Trash size={20} />
                        </button>
                    </div>
                )}
            </div>
            <div className="relative">
                <div className="flex flex-wrap gap-2 items-center p-2">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="badge badge-outline gap-2 rounded-lg p-3.5"
                        >
                            {tag}
                            <button onClick={() => removeTag(tag)}>×</button>
                        </div>
                    ))}
                    {tags.length >= 4 ? (
                        <span className="text-sm text-gray-500">
                            Tag limit reached
                        </span>
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
};
export default TitleSection;
