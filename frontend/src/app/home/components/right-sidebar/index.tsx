import React from 'react';
import { MessageCircle, Hash } from 'lucide-react';
import Link from 'next/link';

const RightSidebar = () => {
  const activeDiscussions = [
    {
      title: "What's your favorite programming language and why?",
      author: "TechEnthusiast",
      comments: 342,
      timeAgo: "2h ago"
    },
    {
      title: "React vs Vue in 2024 - What's your take?",
      author: "WebDevPro",
      comments: 289,
      timeAgo: "4h ago"
    },
    {
      title: "Best practices for API security",
      author: "SecurityGuru",
      comments: 245,
      timeAgo: "6h ago"
    },
    {
      title: "How do you stay productive while coding?",
      author: "ProductivityNinja",
      comments: 198,
      timeAgo: "8h ago"
    },
    {
      title: "Docker vs Kubernetes - When to use what?",
      author: "DevOpsmaster",
      comments: 176,
      timeAgo: "12h ago"
    },
    {
      title: "The future of Web Development",
      author: "FutureWeb",
      comments: 156,
      timeAgo: "1d ago"
    },
    {
      title: "AI in Software Development",
      author: "AIExplorer",
      comments: 145,
      timeAgo: "1d ago"
    },
    {
      title: "Clean Code principles you swear by",
      author: "CodeCrafter",
      comments: 134,
      timeAgo: "1d ago"
    },
    {
      title: "MongoDB vs PostgreSQL",
      author: "DBWizard",
      comments: 123,
      timeAgo: "2d ago"
    },
    {
      title: "Your VS Code setup",
      author: "IDEMaster",
      comments: 112,
      timeAgo: "2d ago"
    }
  ];

  const popularTags = [
    { name: "javascript", postsCount: 45234 },
    { name: "python", postsCount: 32156 },
    { name: "webdev", postsCount: 28945 },
    { name: "react", postsCount: 25678 },
    { name: "programming", postsCount: 23456 }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 pt-4 px-2 gap-4 ">
      {/* Active Discussions */}
      <div className="card bg-base-200">
        <div className="card-body p-4">
          <h2 className="card-title text-lg font-bold flex items-center gap-2">
            <MessageCircle size={20} />
            Active Discussions
          </h2>
          <div className="space-y-3">
            {activeDiscussions.map((discussion, index) => (
              <button key={index} className="w-full text-left hover:bg-base-300 p-2 rounded-lg cursor-pointer hover:text-primary">
                <Link href={`/discussions/${discussion.title}`}>
                  <h3 className="font-medium line-clamp-2">{discussion.title}</h3>
                  <div className="flex justify-between text-sm text-base-content/70 mt-1">
                    <span className='italic'>{discussion.author}</span>
                    <div className="flex items-center gap-1">
                      <span>{discussion.comments} comments</span>
                      {/* <span className="ml-2">{discussion.timeAgo}</span> */}
                    </div>
                  </div>
                </Link>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Hash size={20} />
            Popular Tags
          </h2>
          <div className="space-y-2">
            {popularTags.map((tag, index) => (
              <div key={index} 
                className="flex justify-between items-center hover:bg-base-300 p-2 rounded-lg cursor-pointer">
                <span className="text-primary">#{tag.name}</span>
                <span className="text-sm text-base-content/70">{tag.postsCount} posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;