"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/auth.service';
import { InteractionButtons } from './components/InteractionButtons';
import { PostContent } from './components/PostContent';
import { TableOfContents } from './components/TableOfContents';

const getPost = async (postId: string) => {
    const token = AuthService.getToken();
    const response = await fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }
    
    return response.json();
};

export default function PostPage() {
    const params = useParams();
    const postId = params.postId as string;
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPost(postId)
    });

    if (isLoading) {
        return (
            <div className="flex flex-1 justify-center items-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 max-w-5xl mx-auto px-4 py-6 text-center">
                <span>Failed to load post. Please try again later.</span>
            </div>
        );
    }

    return (
        <div className="flex-1 max-w-5xl mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-4">
                <InteractionButtons post={data.post} />
                <PostContent post={data.post} />
                <TableOfContents />
            </div>
        </div>
    );
}
