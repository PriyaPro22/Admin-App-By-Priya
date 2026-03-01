"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== "/login") {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated && pathname !== "/login") {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
