'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { AuthService } from '@/services/auth.service';

interface LoginForm {
    email: string;
    password: string;
}

const login = async (formData: LoginForm) => {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};

export default function LoginPage() {
    useAuthRedirect();
    const router = useRouter();
    const [formData, setFormData] = React.useState<LoginForm>({
        email: '',
        password: '',
    });

    // Handle Google OAuth token from URL
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            // Fetch user data after getting token
            fetch('http://localhost:5000/api/v1/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                // Store both token and user data
                AuthService.login(token, data.user);
                router.push('/home');
            });
        }
    }, [router]);

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // After successful login, store user data
            fetch('http://localhost:5000/api/v1/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            })
            .then(res => res.json())
            .then(userData => {
                AuthService.login(data.token, userData.user);
                router.push('/home');
            });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-base-content/70 mt-2">
                        Log in to your Star Blog account
                    </p>
                </div>

                <div className="space-y-4">
                    <Link href="http://localhost:5000/api/v1/auth/google" className="btn btn-outline w-full gap-2">
                        <Image
                            src="/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Continue with Google
                    </Link>

                    <div className="divider">OR</div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                'Log in'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/70">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
