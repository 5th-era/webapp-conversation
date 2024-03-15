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
    try {
      const formData = await request.formData()
      const { user } = getInfo(request)
      formData.append('user', user)
      const res = await client.fileUpload(formData)
      return new Response(res.data.id as any)
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
