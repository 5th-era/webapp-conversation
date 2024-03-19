import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import axios from 'axios';

export async function get_user(phoneNumber: string) {
    const url = process.env['SN_DB_URL'] + '/user_get';
    const username = process.env['SN_DB_USER'];
    const password = process.env['SN_DB_PW'];
    const data = { "user_name": phoneNumber };

    try {
        // 使用async/await发送POST请求
        const response = await axios.post(url, data, {
            auth: {
                username: username,
                password: password
            }
        });

        const result = response.data['result'];
        const user_info = response.data['info']
        // console.log('get_user result:', result);
        // console.log('get_user user_info:', user_info);

        return user_info;

    } catch (error) {
        console.log('Error:', error);
        return new NextResponse(
            JSON.stringify({ status: "fail", message: "请求处理异常。" }),
            { status: 401 }
        );
    }
}