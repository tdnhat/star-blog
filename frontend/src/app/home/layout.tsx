import Header from "@/components/header";
import LeftSidebar from "./components/left-sidebar";
import RightSidebar from "./components/right-sidebar";
import MainContent from "./components/main-content";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex max-w-7xl mx-auto pt-16">
                <LeftSidebar />
                <MainContent />
                <RightSidebar />
            </div>
        </div>
    );}
