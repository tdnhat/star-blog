
'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function EmailVerifiedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h1 className="text-3xl font-bold">Your Email has been verified</h1>
                    <p className="text-base-content/70 mt-4">
                        Your email has been successfully verified. You can now log in to your account.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link href="/login" className="btn btn-primary w-full">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
