import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const categories = ['shapes', 'tees', 'hoodies', 'caps', 'accesorios']

  return (
    <main>
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-20">
          <h1 className="font-heading text-6xl md:text-8xl font-bold uppercase tracking-tighter">
            STREETWEAR
            <br />
            <span className="text-chouga-red">RAW.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Peças feitas pra quem skata de verdade. Sem compromisso, sem enrolação.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex gap-4 overflow-x-auto pb-4">
          <a
            href="/"
            className="px-6 py-2 bg-chouga-black text-white uppercase text-sm tracking-wide whitespace-nowrap"
          >
            Todos
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/?category=${cat}`}
              className="px-6 py-2 border border-border uppercase text-sm tracking-wide hover:bg-chouga-black hover:text-white transition-colors whitespace-nowrap"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <a
                key={product.id}
                href={`/produto/${product.id}`}
                className="group block border border-border hover:border-chouga-red transition-colors"
              >
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {product.images && (product.images as string[]).length > 0 ? (
                    <img
                      src={(product.images as string[])[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-heading text-muted-foreground">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-heading text-lg uppercase tracking-tight group-hover:text-chouga-red transition-colors">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground uppercase">
                    {product.category}
                  </p>
                  <p className="mt-2 font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(product.price / 100)}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}