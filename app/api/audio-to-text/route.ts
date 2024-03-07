import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const { user } = getInfo(request)
        formData.append('user', user)
        console.log("user: ", user)
        const res = await client.audio2Text(formData)
        console.log("text: ", res.data.text)
        return new Response(res.data.text as any)
    }
    catch (e: any) {
        return new Response(e.message)
    }
}
