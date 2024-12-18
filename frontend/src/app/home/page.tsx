'use client';

import { toast } from "sonner";

export default function HomePage() {
    return (
        <div className="space-y-4">
            <button className="btn btn-primary" onClick={() => toast.success("My first toast")}>
                Give me a toast
            </button>
        </div>
    );
}
