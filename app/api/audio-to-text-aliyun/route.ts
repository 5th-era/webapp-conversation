import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from 'axios';

export async function POST(request: NextRequest) {
    let login_name = ''
    const session = await getServerSession(authOptions);
    if (session) login_name = session?.user?.name as string
    if (session) {
        try {
            const formData = await request.formData()
            // const { user } = getInfo(request)
            const { user } = getInfo(request, login_name)
            formData.append('user', user)
            // console.log("user: ", user)
            // 调用本地ASR服务
            const response = await axios.post('http://asr.d5j.tech/asr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 获取ASR服务返回的转录文本
            const res = response.data;

            return new Response(res.transcription);
        }
        catch (e: any) {
            return new Response(e.message)
        }
    }
    else {
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "请先登录，谢谢。" }),
            { status: 401 }
        );
    }
}
