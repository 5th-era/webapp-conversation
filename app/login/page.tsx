'use client'
import type { FC } from 'react'
import React from 'react'
import s from './style.module.css'
import { LoginOrLogout } from '@/app/components/auth/buttons'
import { LoginForm } from './form'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

export default function LoginOrLogoutButton() {
    const { status } = useSession();
    const { t } = useTranslation()
    if (status == "authenticated") {
        // return <LoginButton />;
        return <div>
            <p className="text-center bg-blue-400 text-white py-4 mb-6 rounded">已登录</p>
        </div>
    }
    else {
        return <LoginForm />;
    }
}
