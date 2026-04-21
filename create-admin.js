const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ppftrkturqvkqbsxalno.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZnRya3R1cnF2a3Fic3hhbG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTI2MDksImV4cCI6MjA5MjM2ODYwOX0.1887MfrBLgvV4UsNGAdsUthjKZtl6EP3f2eQD149e9c'
)

async function createAdminUser() {
  console.log('Criando usuário admin...')

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'erosribeiroo@gmail.com',
    password: 'admin123',
    email_confirm: true,
    user_metadata: { full_name: 'Eros Ribeiro', role: 'admin' }
  })

  if (error) {
    console.error('Erro ao criar usuário:', error.message)
    return
  }

  console.log('Usuário criado:', data.user.id)
  console.log('Email:', data.user.email)

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: data.user.id,
      email: data.user.email,
      full_name: 'Eros Ribeiro',
      role: 'admin'
    })

  if (profileError) {
    console.error('Erro ao criar perfil:', profileError.message)
  } else {
    console.log('Perfil admin criado com sucesso!')
  }

  console.log('\n=== ACESSO PRONTO ===')
  console.log('Email: erosribeiroo@gmail.com')
  console.log('Senha: admin123')
  console.log('Role: admin')
}

createAdminUser()