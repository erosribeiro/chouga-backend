import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function RegisterPage() {
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
            Criar Conta
          </h1>
          <p className="text-muted-foreground">
            Junte-se à tribo Chouga
          </p>
        </div>

        <form action="/auth/signup" method="post" className="space-y-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium uppercase tracking-wide mb-2">
              Nome Completo
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="input-field"
              placeholder="Seu nome"
            />
          </div>

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
              minLength={6}
              autoComplete="new-password"
              className="input-field"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Criar Conta
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Já tem conta?{' '}
            <Link href="/login" className="font-medium uppercase tracking-wide hover:text-foreground transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}