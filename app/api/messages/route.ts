import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  let login_name = ''
  const session = await getServerSession(authOptions);
  if (session) login_name = session?.user?.name as string

  const { sessionId, user } = getInfo(request, login_name)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')
  const { data }: any = await client.getConversationMessages(user, conversationId as string)
  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
