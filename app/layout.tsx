import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/server'
import { updateSession } from '@/lib/supabase/middleware'
import { Archivo, Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const archivo = Archivo({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, archivo.variable, 'font-sans antialiased min-h-screen flex flex-col')}>
        <Header user={user} isAdmin={profile?.role === 'admin'} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

export const middleware = updateSession