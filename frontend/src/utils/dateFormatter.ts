export const formatPostDate = (dateString: string): string => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        return `${diffInDays} days ago`;
    }

    return postDate.toLocaleDateString();
};
