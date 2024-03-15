"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const LoginButton = () => {
    return (
        <button style={{ marginRight: 10 }} onClick={() => signIn()}>
            Sign in
        </button>
    );
};

export const LogoutButton = () => {
    return (
        <button style={{ marginRight: 10 }} onClick={() => signOut()}>
            Sign Out
        </button>
    );
};


export const LoginOrLogout = () => {
    const { status } = useSession();
    if (status != "authenticated") {
        // return <LoginButton />;
        return <div>
            <p className="text-center bg-blue-400 text-white py-4 mb-6 rounded">请先登录</p>
        </div>
    }
    else {
        return <LogoutButton />;
    }
}