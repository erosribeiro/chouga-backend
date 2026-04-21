import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tighter mb-2">
            Login
          </h1>
          <p className="text-muted-foreground">
            Acesse sua conta Chouga
          </p>
        </div>

        <form action="/auth/signin" method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium uppercase tracking-wide mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input-field"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium uppercase tracking-wide mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Não tem conta?{' '}
            <Link href="/register" className="font-medium uppercase tracking-wide hover:text-foreground transition-colors">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}