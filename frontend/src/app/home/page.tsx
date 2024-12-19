"use client";

import LeftSidebar from "./components/left-sidebar";
import MainContent from "./components/main-content";
import RightSidebar from "./components/right-sidebar";
import React from "react";

export default function HomePage() {
    const [selectedTag, setSelectedTag] = React.useState<string | undefined>();

    const handleTagSelect = (tag: string) => {
        setSelectedTag(tag);
    };
    return (
        <div className="min-h-screen flex max-w-7xl mx-auto pt-16">
            <LeftSidebar />
            <MainContent selectedTag={selectedTag} />
            <RightSidebar
                onTagSelect={handleTagSelect}
                selectedTag={selectedTag}
            />
        </div>
    );
}
