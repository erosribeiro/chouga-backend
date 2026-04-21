import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter text-center mb-12">
          Login
        </h1>
        
        <form action="/auth/signin" method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm uppercase tracking-wide mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-chouga-black text-white font-heading uppercase tracking-wide hover:bg-chouga-red transition-colors"
          >
            Entrar
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <a href="/register" className="uppercase tracking-wide hover:text-chouga-red transition-colors">
            Criar conta
          </a>
        </p>
      </div>
    </main>
  )
}