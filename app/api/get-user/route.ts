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
        const url = process.env['SN_DB_URL'] + '/user_get';
        const username = process.env['SN_DB_USER'];
        const password = process.env['SN_DB_PW'];

        try {
            const body = await request.json();
            const { phoneNumber } = body;
            const data = { "user_name": phoneNumber };

            // 使用async/await发送POST请求
            const response = await axios.post(url, data, {
                auth: {
                    username: username,
                    password: password
                }
            });

            const result = response.data['result'];
            const user_info = response.data['info']
            // console.log('Response:', result);
            // console.log("session.user.customData:::", session.user.customData);
            if (result === 'OK') {
                session.user.customData = user_info;
                // console.log("session.user.customData::::", session.user.customData);
                return new NextResponse(
                    JSON.stringify({ status: "OK", message: user_info }),
                    { status: 200 }
                );
            } else {
                return new NextResponse(
                    JSON.stringify({ status: "fail", message: result }),
                    { status: 401 }
                );
            }
        } catch (error) {
            console.log('Error:', error);
            return new NextResponse(
                JSON.stringify({ status: "fail", message: "请求处理异常。" }),
                { status: 401 }
            );
        }
    }
    else {
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "请先登录，谢谢。" }),
            { status: 401 }
        );
    }
}

