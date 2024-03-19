import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { check_user_valid } from '@/app/bind-sn/form';

export async function POST(request: NextRequest) {
  let login_name = ''
  const session = await getServerSession(authOptions);
  if (session) login_name = session?.user?.name as string
  if (session) {
    const body = await request.json()
    const {
      inputs,
      query,
      files,
      conversation_id: conversationId,
      response_mode: responseMode,
      time,
    } = body
    const chat_time = new Date(time)
    const now_local = new Date();
    // const now_utc = new Date(now_local.getTime() + now_local.getTimezoneOffset() * 60000);
    // console.log("time:", chat_time, now_local)
    let difference = Math.abs(now_local.getTime() - now_local.getTime());
    if (difference > 10 * 3600 * 1000) {
      return new NextResponse(
        JSON.stringify({ status: "fail", message: "时钟不同步。" }),
        { status: 401 }
      );
    }

    const { user } = getInfo(request, login_name)
    // console.info("user in api:", user)
    const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
    return new Response(res.data as any)
  }
  else {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "请先登录，谢谢。" }),
      { status: 401 }
    );
  }
}
