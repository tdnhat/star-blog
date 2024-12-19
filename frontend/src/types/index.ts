export interface User {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    oauthId?: string;
    oauthProvider?: string;
    verificationToken: string | null;
    profilePicture: string | null;
    coverPhoto: string | null;
    dateOfBirth?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Author {
    _id: string;
    username: string;
    profilePicture: string;
}

export interface Post {
    _id: string;
    title: string;
    content: {
        ops: Array<{
            insert: string | { image: string };
            attributes?: Record<string, any>;
        }>;
    };
    thumbnail: string;
    author: Author;
    tags: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    comments: any[];
    likes: string[];
}

export interface TagStat {
    name: string;
    postsCount: number;
}