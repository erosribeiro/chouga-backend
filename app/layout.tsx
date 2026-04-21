import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/server'
import { updateSession } from '@/lib/supabase/middleware'
import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-heading' })

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
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, oswald.variable, 'font-sans antialiased')}>
        <nav className="border-b border-border bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="font-heading text-2xl font-bold tracking-tighter uppercase">
              CHOUGA
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm uppercase tracking-wide hover:text-chouga-red transition-colors">
                Shop
              </a>
              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <a href="/admin" className="text-sm uppercase tracking-wide hover:text-chouga-red transition-colors">
                      Admin
                    </a>
                  )}
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="text-sm uppercase tracking-wide hover:text-chouga-red transition-colors">
                      Sair
                    </button>
                  </form>
                </>
              ) : (
                <a href="/login" className="text-sm uppercase tracking-wide hover:text-chouga-red transition-colors">
                  Login
                </a>
              )}
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-border bg-chouga-black text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-heading text-xl font-bold uppercase tracking-tighter mb-4">CHOUGA</h3>
                <p className="text-gray-400 text-sm">Streetwear raw. Autêntico. Sem frescuras.</p>
              </div>
              <div>
                <h4 className="font-heading text-sm uppercase tracking-wide mb-4">Navegação</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/" className="hover:text-white transition-colors">Shop</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading text-sm uppercase tracking-wide mb-4">Redes</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
              © 2026 CHOUGA. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

export const middleware = updateSession