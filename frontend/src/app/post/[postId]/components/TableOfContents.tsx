import { List } from 'lucide-react';

export const TableOfContents = () => {
    return (
        <div className="col-span-3 sticky top-20 h-fit">
            <div className="bg-base-200 rounded-lg p-4">
                <h2 className="flex items-center gap-2 font-bold mb-4">
                    <List className="w-5 h-5" />
                    Table of Contents
                </h2>
                <nav>
                    <ul className="menu menu-sm p-0">
                        <li><a>Introduction</a></li>
                        <li><a>Getting Started</a></li>
                        <li><a>Conclusion</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};