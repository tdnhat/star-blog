'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
interface SignupForm {
    username: string;
    email: string;
    password: string;
}

const signup = async (formData: SignupForm) => {
    const response = await fetch('http://localhost:5000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return response.json();
};

export default function SignupPage() {
    // useAuthRedirect();
    const router = useRouter();
    const [formData, setFormData] = React.useState<SignupForm>({
        username: '',
        email: '',
        password: '',
    });

    const { mutate, isPending } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            router.push('/verify-email');
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
        console.log(formData);
        mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome to Star Blog</h1>
                    <p className="text-base-content/70 mt-2">
                        Star Blog is a community of developers sharing knowledge
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
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input input-bordered"
                                placeholder="Your name"
                                required
                            />
                        </div>

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
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-base-content/70">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}