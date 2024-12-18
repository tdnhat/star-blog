"use client";

import React from "react";
import { Hash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TagList } from "./TagList";
import { TagStat } from "@/types";

interface RightSidebarProps {
    onTagSelect: (tag: string) => void;
    selectedTag?: string;
}

const fetchTagStats = async (): Promise<TagStat[]> => {
    const response = await fetch(
        "http://localhost:5000/api/v1/posts/tags/stats"
    );
    const data = await response.json();
    return data.tags;
};

const RightSidebar = ({ onTagSelect, selectedTag }: RightSidebarProps) => {
    const { data: tags, isLoading } = useQuery({
        queryKey: ["tagStats"],
        queryFn: fetchTagStats,
    });

    const topTags = tags?.slice(0, 5) || [];

    return (
        <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 pt-4 px-2">
            <div className="card bg-base-200">
                <div className="card-body p-4">
                    <h2 className="card-title text-lg font-bold flex items-center gap-2">
                        <Hash size={20} />
                        Popular Tags
                    </h2>
                    <TagList 
                        tags={topTags}
                        selectedTag={selectedTag}
                        onTagSelect={onTagSelect}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
