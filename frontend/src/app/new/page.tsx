"use client";

import React from "react";
import QuillWrapper from "./components/main-content/QuillWrapper";
import TitleSection from "./components/title-section";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

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

interface PostData {
    title: string;
    content: QuillContent;
    tags: string[];
    status: "published" | "draft";
}

// Function to send POST request
const createPost = async (postData: PostData) => {
    const token = AuthService.getToken();
    const response = await fetch("http://localhost:5000/api/v1/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return response.json();
};

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
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
            content: delta,
            tags,
            status: "published",
        };
        mutate(postData);
    };

    return (
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto pt-16 space-y-4 p-4 mt-4">
            <TitleSection
                title={title}
                tags={tags}
                onTitleChange={setTitle}
                onTagsChange={setTags}
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
