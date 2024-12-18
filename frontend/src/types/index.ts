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
    author: Author;
    tags: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    comments: any[];
    likes: string[];
}