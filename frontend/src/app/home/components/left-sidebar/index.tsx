"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Tag,
    Bookmark,
    Lightbulb,
    FileText,
    Shield,
    FileCheck,
} from "lucide-react";

const LeftSidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <Home size={20} />, text: "Home", path: "/home" },
        { icon: <Tag size={20} />, text: "Tags", path: "/tags" },
        { icon: <Bookmark size={20} />, text: "Bookmarks", path: "/bookmarks" },
        { icon: <Lightbulb size={20} />, text: "FAQ", path: "/faq" },
    ];

    const otherLinks = [
        {
            icon: <FileText size={18} />,
            text: "Code of Conduct",
            path: "/code-of-conduct",
        },
        {
            icon: <Shield size={18} />,
            text: "Privacy Policy",
            path: "/privacy",
        },
        {
            icon: <FileCheck size={18} />,
            text: "Terms of Service",
            path: "/terms",
        },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen top-0 pt-4 px-2 bg-base-100">
            <nav className="menu menu-vertical px-4">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.path}
                            className={`flex items-center gap-2 hover:bg-base-300 hover:text-primary ${
                                pathname === item.path
                                    ? "bg-base-300 text-primary"
                                    : ""
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.text}</span>
                        </Link>
                    </li>
                ))}
            </nav>

            <div className="divider my-4"></div>
            <div className="px-4">
                <h3 className="text-sm font-bold text-base-content/70 uppercase mb-2">
                    Other
                </h3>
                <nav className="menu menu-vertical">
                    {otherLinks.map((link, index) => (
                        <li key={index}>
                            <Link
                                href={link.path}
                                className={`text-sm hover:bg-base-300 hover:text-primary ${
                                    pathname === link.path
                                        ? "bg-base-300 text-primary"
                                        : ""
                                }`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.text}</span>
                            </Link>
                        </li>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default LeftSidebar;
