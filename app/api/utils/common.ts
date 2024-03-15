import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest, login_name: string = '') => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  var user = userPrefix + sessionId
  if (login_name) {
    // user = user + ":" + login_name
    user = login_name
  }

  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
