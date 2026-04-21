import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <section className="bg-black text-white py-20 md:py-32">
        <div className="max-w-[1536px] mx-auto px-4 md:px-6">
          <h1 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
            Streetwear
            <br />
            <span className="text-chouga-red">Raw</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-lg">
            Peças feitas pra quem skata de verdade.
            <br />
            Autêntico. Sem frescuras. RAW.
          </p>
        </div>
      </section>

      <section className="max-w-[1536px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider">
            Novidades
          </h2>
        </div>
        <ProductGrid products={products || []} />
      </section>
    </div>
  )
}