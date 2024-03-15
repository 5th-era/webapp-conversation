import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'
import { NextAuthProvider } from "./providers"

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            <NextAuthProvider>{children}</NextAuthProvider>
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
