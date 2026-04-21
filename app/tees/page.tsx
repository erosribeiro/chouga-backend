import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/product/product-grid'
import { Suspense } from 'react'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  const categoryNames: Record<string, string> = {
    tees: 'Camisetas',
    regatas: 'Regatas',
    hoodies: 'Moletons',
    accesorios: 'Acessórios',
    tenis: 'Tênis',
    barras: 'Barras',
    shapes: 'Shapes',
    caps: 'Bonés',
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tighter">
          {categoryNames[category] || category}
        </h1>
        <p className="text-muted-foreground mt-2">
          {products?.length || 0} produtos
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
              Filtros
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Tamanho</h4>
                <div className="flex flex-wrap gap-2">
                  {['P', 'M', 'G', 'GG'].map((size) => (
                    <button
                      key={size}
                      className="w-10 h-10 border border-border text-sm hover:border-black hover:bg-black hover:text-white transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Ordenar</h4>
                <select className="input-field">
                  <option value="newest">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <Suspense fallback={<div>Carregando...</div>}>
            <ProductGrid products={products || []} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}