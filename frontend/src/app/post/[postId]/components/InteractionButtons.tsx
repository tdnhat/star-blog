'use client'

import { Post } from '@/types';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';

interface InteractionButtonsProps {
    post: Post;
}

export const InteractionButtons = ({ post }: InteractionButtonsProps) => {
    return (
        <div className="col-span-1 sticky top-20 h-fit pt-16">
            <div className="flex flex-col gap-6 items-center">
                <button className="btn btn-ghost btn-sm">
                    <div className="flex flex-col items-center">
                        <Heart className="w-5 h-5" />
                        <span className="badge badge-sm">{post.likesCount}</span>
                    </div>
                </button>
                <button className="btn btn-ghost btn-sm">
                    <div className="flex flex-col items-center">
                        <MessageCircle className="w-5 h-5" />
                        <span className="badge badge-sm">{post.commentsCount}</span>
                    </div>
                </button>
                <button className="btn btn-ghost btn-sm">
                    <div className="flex flex-col items-center">
                        <Bookmark className="w-5 h-5" />
                    </div>
                </button>
                <button className="btn btn-ghost btn-sm">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};