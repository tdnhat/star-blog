import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

export const useAuthRedirect = (redirectPath?: string) => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken();
            
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    AuthService.logout();
                    router.push('/login');
                } else if (response.ok && redirectPath) {
                    router.push(redirectPath);
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router, redirectPath]);
};