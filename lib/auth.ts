
// import { useTranslation } from 'react-i18next'
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { t } from 'i18next';
import { verify_code } from "@/app/api/send-sms/verifycodeStore"
import { get_user } from "@/app/api/get-user/get_user"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 180 * 24 * 60 * 60, // 以秒为单位
    },
    jwt: {
        maxAge: 180 * 24 * 60 * 60, // 以秒为单位
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
                    const user = { id: phoneNumber, name: phoneNumber };
                    const user_info = await get_user(phoneNumber);
                    user.customData = user_info;
                    // console.log('user.customData:', user.customData);
                    console.log("login success: ", phoneNumber);
                    if (user.customData['sn'] === "trialed_key") console.info("This is a trial user: ", phoneNumber);
                    return user;
                } else {
                    throw new Error("Invalid code");
                }
            },
        }),
    ],

    // 添加session回调以将自定义数据包含在用户会话中
    callbacks: {
        async session({ session, user, token }) {
            // 将自定义数据添加到会话对象中
            session.user.customData = token.customData;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            // 如果user对象存在，则将自定义数据添加到JWT token中
            if (user?.customData) {
                token.customData = user.customData;
            }
            return token;
        }
    }
};
