
'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h1 className="text-3xl font-bold">Verify your email</h1>
                    <p className="text-base-content/70 mt-4">
                        We've sent you an email with a verification link. Please check your inbox and click the link to activate your account.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link href="/login" className="btn btn-primary w-full">
                        Go to Login
                    </Link>

                    <p className="text-center text-sm text-base-content/70">
                        Didn't receive the email?{" "}
                        <button className="text-primary hover:underline">
                            Resend verification email
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
