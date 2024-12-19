interface User {
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
export class AuthService {
    private static isAuthCallback: (() => void) | null = null;

    // static setUserData(userData: User & { token: string }) {
    //     localStorage.setItem('user', JSON.stringify(userData));
    //     localStorage.setItem('token', userData.token);
    // }

    static getUserData(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static getToken(): string | null {
        return localStorage.getItem('token');
    }

    static login(authToken: string, userData: User) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        if (this.isAuthCallback) this.isAuthCallback();
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static onAuthChange(callback: () => void) {
        this.isAuthCallback = callback;
    }

    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}
