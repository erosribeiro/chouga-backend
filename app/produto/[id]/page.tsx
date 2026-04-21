import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    redirect('/')
  }

  const images = (product.images as string[]) || []

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={i} className="aspect-square bg-muted border border-border">
                <img src={img} alt={`${product.name} - ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="aspect-square bg-muted border border-border flex items-center justify-center">
              <span className="text-6xl font-heading text-muted-foreground">{product.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{product.category}</span>
          <h1 className="mt-2 font-heading text-4xl font-bold uppercase tracking-tight">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
          </p>
          <div className="mt-8 prose prose-sm max-w-none">
            <p>{product.description || 'Sem descrição disponível.'}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </p>
            {product.stock > 0 && (
              <button className="mt-4 w-full py-4 bg-chouga-black text-white font-heading uppercase tracking-wide hover:bg-chouga-red transition-colors">
                Comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}