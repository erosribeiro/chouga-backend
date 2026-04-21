import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase">
          Produtos
        </h1>
        <Link
          href="/admin/produtos/novo"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Produto
        </Link>
      </div>

      <div className="bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">Produto</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Preço</th>
                <th className="px-6 py-3">Estoque</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price / 100)}
                    </td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 uppercase">
                          Esgotado
                        </span>
                      ) : product.stock < 5 ? (
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 uppercase">
                          Baixo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 uppercase">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}