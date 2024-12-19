"use client";

import React, { use } from "react";
import QuillWrapper from "@/app/new/components/main-content/QuillWrapper";
import TitleSection from "./components/title-section";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface PostData {
    title: string;
    tags: string[];
    content: string;
    status: "draft" | "published";
}

export default function EditPostPage({
    params: paramsPromise,
}: {
    params: Promise<{ postId: string }>;
}) {
    useAuthRedirect();
    const queryClient = useQueryClient();
    const router = useRouter();
    const token = AuthService.getToken();

    const params = use(paramsPromise); // Unwrap params correctly
    const postId = params.postId;

    const [title, setTitle] = React.useState("");
    const [tags, setTags] = React.useState<string[]>([]);
    const [content, setContent] = React.useState("");
    const [pendingButton, setPendingButton] = React.useState<
        "draft" | "publish" | null
    >(null);

    const { data: post, error } = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch post");
            return response.json();
        },
    });

    React.useEffect(() => {
        if (post?.post) {
            // Access the nested post object
            setTitle(post.post.title || "");
            setTags(post.post.tags || []);
            setContent(post.post.content || "");
        }
    }, [post]);

    if (error) {
        console.error("Error fetching post:", error);
    }

    const handleContentChange = (data: { html: string }) => {
        setContent(data.html);
    };

    const { mutate: updatePost } = useMutation({
        mutationFn: async (postData: PostData) => {
            const response = await fetch(
                `http://localhost:5000/api/v1/posts/${params.postId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(postData), // Send as JSON instead of FormData
                }
            );

            if (!response.ok) throw new Error("Failed to update post");
            return response.json();
        },
        onSuccess: (data) => {
            toast.success("Post updated successfully");
            queryClient.invalidateQueries({ queryKey: ["post", params.postId] });
            router.push(`/post/${params.postId}`);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            setPendingButton(null);
        },
    });

    const handleDraft = (e: React.FormEvent) => {
        e.preventDefault();
        setPendingButton("draft");
        updatePost({ title, content, tags, status: "draft" });
    };

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();
        setPendingButton("publish");
        console.log("Publishing post:", { title, tags, content });
        updatePost({ title, tags, content, status: "published" });
    };

    return (
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto pt-16 space-y-4 p-4 mt-4">
            <h1 className="text-4xl font-bold my-4">Edit Post</h1>
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
                        "Update"
                    )}
                </button>
            </div>
        </div>
    );
}
