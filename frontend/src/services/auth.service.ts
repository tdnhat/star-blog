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
    static setUserData(userData: User & { token: string }) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    }

    static getUserData(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static getToken(): string | null {
        return localStorage.getItem('token');
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}
