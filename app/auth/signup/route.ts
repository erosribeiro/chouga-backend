import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return NextResponse.redirect(new URL('/register?error=auth', request.url))
  }

  return NextResponse.redirect(new URL('/', request.url))
}