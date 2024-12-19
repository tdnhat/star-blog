import React from "react";
import Link from "next/link";
import { Search, Bell, Menu, PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { User } from "@/types";

const Header = () => {
    const router = useRouter();
    const [isAuth, setIsAuth] = React.useState(false);
    const [userData, setUserData] = React.useState<User | null>(null);

    React.useEffect(() => {
        const updateAuthState = () => {
            setIsAuth(AuthService.isAuthenticated());
            setUserData(AuthService.getUserData());
        };

        // Initial state setup
        updateAuthState();

        // Subscribe to auth changes
        AuthService.onAuthChange(updateAuthState);

        // Cleanup the callback
        return () => AuthService.onAuthChange(() => {});
    }, []);

    const handleSignOut = () => {
        AuthService.logout();
        setIsAuth(false);
        setUserData(null);
        router.push("/login");
    };

    return (
        <header className="fixed top-0 z-50 w-full bg-base-200 border-b border-base-200 px-4">
            <div className="navbar max-w-7xl mx-auto gap-2">
                {/* Left Section */}
                <div className="flex-1 gap-2">
                    <button className="btn btn-ghost lg:hidden">
                        <Menu size={24} />
                    </button>

                    <Link
                        href="/home"
                        className="border-white border-1 text-2xl text-white font-bold mr-2"
                    >
                        Star Blog
                    </Link>

                    <div className="hidden lg:flex form-control relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full"
                        />
                        <button className="btn btn-ghost btn-circle absolute right-0">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Right Section with conditional rendering */}
                <div className="flex-none gap-2">
                    <button className="btn btn-ghost btn-circle">
                        <Search size={20} className="lg:hidden" />
                    </button>

                    {!isAuth ? (
                        <div className="flex gap-2">
                            <Link href="/login" className="btn btn-ghost">
                                Login
                            </Link>
                            <Link href="/signup" className="btn btn-primary">
                                Sign up
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/new" className="btn btn-outline">
                                <PenSquare
                                    size={20}
                                    className="hidden sm:block"
                                />
                                <span className="hidden sm:block">
                                    Create Post
                                </span>
                                <PenSquare size={20} className="sm:hidden" />
                            </Link>

                            <div className="dropdown dropdown-end">
                                <button className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <Bell size={20} />
                                        <span className="badge badge-sm badge-primary indicator-item">
                                            2
                                        </span>
                                    </div>
                                </button>
                            </div>

                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle avatar"
                                >
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User avatar"
                                            src={
                                                userData?.profilePicture ||
                                                "/default-avatar.png"
                                            }
                                        />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52"
                                >
                                    <li>
                                        <Link
                                            href="/profile"
                                            className="text-base"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <div className="divider m-0"></div>
                                    <li>
                                        <Link
                                            href="/dashboard"
                                            className="text-base"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/new" className="text-base">
                                            Create Post
                                        </Link>
                                    </li>
                                    <div className="divider m-0"></div>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="text-base"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
