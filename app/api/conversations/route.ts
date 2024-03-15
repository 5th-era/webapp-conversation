export const dynamic = 'force-dynamic'

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
  try {
    const { data }: any = await client.getConversations(user)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  } catch (error) {
    return NextResponse.json([]);
  }
}
