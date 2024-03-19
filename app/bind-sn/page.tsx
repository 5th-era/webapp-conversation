'use client'
import type { FC } from 'react'
import React from 'react'
import s from './style.module.css'
import { LoginOrLogout } from '@/app/components/auth/buttons'
import { BindForm } from './form'

export default function BindPage() {
    return (
        <BindForm />
    );
}