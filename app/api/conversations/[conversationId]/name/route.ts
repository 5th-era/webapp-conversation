import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: {
  params: { conversationId: string }
}) {
  let login_name = ''
  const session = await getServerSession(authOptions);
  if (session) login_name = session?.user?.name as string

  const body = await request.json()
  const {
    auto_generate,
    name,
  } = body
  const { conversationId } = params
  const { user } = getInfo(request, login_name)

  // auto generate name
  const { data } = await client.renameConversation(conversationId, name, user, auto_generate)
  return NextResponse.json(data)
}
