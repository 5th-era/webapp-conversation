import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

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
    } = body
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
