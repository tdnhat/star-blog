export const getRelativeTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMilliseconds = now.getTime() - commentDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
            return `${minutes} minutes ago`;
        }
        return `${Math.floor(diffInHours)} hours ago`;
    }
    
    return commentDate.toLocaleDateString();
};