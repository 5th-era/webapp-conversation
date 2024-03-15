
// import { useTranslation } from 'react-i18next'
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { t } from 'i18next';
import { verify_code } from "@/app/api/send-sms/verifycodeStore"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "手机验证码",
            credentials: {
                phoneNumber: {
                    label: '手机号' as string,
                    type: "text",
                },
                verifyCode: { label: '验证码' as string, type: "text" },
            },
            async authorize(credentials) {
                const { phoneNumber, verifyCode } = credentials ?? { phoneNumber: '', verifyCode: '' };

                const isValid = verify_code(phoneNumber, verifyCode); // 假设这里是验证逻辑

                if (isValid) {
                    return { id: phoneNumber, name: phoneNumber };
                } else {
                    throw new Error("Invalid code");
                }
            },
        }),
    ],

};
