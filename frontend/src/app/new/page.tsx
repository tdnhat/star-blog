"use client";

import React from "react";
import QuillWrapper from "./components/main-content/QuillWrapper";
import TitleSection from "./components/title-section";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { File } from "buffer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export interface QuillContent {
    ops: Array<{
        insert: string | { image: string };
        attributes?: {
            header?: number;
            bold?: boolean;
            italic?: boolean;
            "code-block"?: boolean;
        };
    }>;
}
export interface PostData {
    title: string;
    thumbnail?: File | null;
    tags: string[];
    content: QuillContent;
    status: "draft" | "published";
}
// Function to send POST request
const createPost = async (postData: PostData) => {
    const token = AuthService.getToken();

    // Use FormData for file upload
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", JSON.stringify(postData.content));
    formData.append("status", postData.status);

    if (postData.thumbnail) {
        formData.append("thumbnail", postData.thumbnail); // Add the file
    }

    postData.tags.forEach((tag) => formData.append("tags", tag)); // Add tags as individual form fields

    const response = await fetch("http://localhost:5000/api/v1/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, // Only include Authorization header
        },
        body: formData, // Use FormData as the request body
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return response.json();
};

export default function NewPostPage() {
    useAuthRedirect();
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [thumbnail, setThumbnail] = React.useState<File | null>(null);
    const [tags, setTags] = React.useState<string[]>([]);
    const [content, setContent] = React.useState("");
    const [delta, setDelta] = React.useState<QuillContent>({ ops: [] });
    const [pendingButton, setPendingButton] = React.useState<"draft" | "publish" | null>(null);

    // Handle content change
    const handleContentChange = (data: { html: string; delta: QuillContent }) => {
        setContent(data.html);
        setDelta(data.delta);
    };

    // React Query mutation for post submission
    const { mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            // console.log("Post created successfully:", data);
            toast.success("Post created successfully");
            router.push("/home"); // Redirect to posts list or success page
        },
        onError: (error: Error) => {
            console.error(error.message);
        },
        onSettled: () => {
            setPendingButton(null); // Reset pending state after request finishes
        },
    });

    const handleDraft = (e: React.FormEvent) => {
        e.preventDefault();
        setPendingButton("draft");
        const postData: PostData = {
            title,
            content: delta,
            tags,
            status: "draft",
        };
        mutate(postData);
        toast.info("Post saved as draft");
    };

    // Form submission handler
    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        setPendingButton("publish");
    
        const postData: PostData = {
            title,
            thumbnail,
            tags,
            content: delta,
            status: "published",
        };

        // console.log(postData);
        mutate(postData);
    };

    return (
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto pt-16 space-y-4 p-4 mt-4">
            <TitleSection
                title={title}
                tags={tags}
                thumbnail={thumbnail}
                onTitleChange={setTitle}
                onTagsChange={setTags}
                onThumbnailChange={setThumbnail}
            />
            <QuillWrapper value={content} onChange={handleContentChange} />
            <div className="flex justify-end gap-4 pt-12">
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleDraft}
                    disabled={!!pendingButton}
                >
                    {pendingButton === "draft" ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Save draft"
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePublish}
                    disabled={!!pendingButton}
                >
                    {pendingButton === "publish" ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Publish"
                    )}
                </button>
            </div>
        </div>
    );
}
