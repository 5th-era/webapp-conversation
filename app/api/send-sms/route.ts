import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import Client from "./aliyun-sms"
import { generateVerificationCode, isValidPhoneNumber } from "./verifycodeStore"

export async function POST(request: NextRequest) {

    const body = await request.json()
    const {
        phoneNumber,
    } = body

    // 验证手机号码格式
    if (!isValidPhoneNumber(phoneNumber)) {
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "手机号格式错误。" }),
            { status: 401 }
        );
    }

    //生成验证码并存储
    const verificationCode = generateVerificationCode(phoneNumber);
    if (verificationCode === -1) {
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "生成验证码失败，请稍后重试。" }),
            { status: 401 }
        );
    }

    // 调用短信服务提供商的API发送验证码
    try {
        const result = await Client.send_sms(phoneNumber, verificationCode);
        return new NextResponse(
            JSON.stringify({ status: "ok", message: "验证码发送成功，有效期5分钟。" }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error.message);
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "验证码发送失败，请重试。" }),
            { status: 401 }
        );
    }
}

