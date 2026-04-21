'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['shapes', 'tees', 'hoodies', 'caps', 'accesorios', 'tenis', 'barras']

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Math.round(Number(formData.get('price')) * 100),
      stock: Number(formData.get('stock')),
      category: formData.get('category'),
      images: (formData.get('images') as string)?.split('\n').filter(Boolean) || [],
      metadata: {},
    }

    const { error: err } = await supabase.from('products').insert(data)

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin" className="text-sm uppercase tracking-wide text-muted-foreground hover:text-foreground">
          ← Voltar
        </a>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tighter">
          Novo Produto
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm uppercase tracking-wide mb-2">
            Nome do Produto *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm uppercase tracking-wide mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm uppercase tracking-wide mb-2">
              Preço (R$) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm uppercase tracking-wide mb-2">
              Estoque *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              defaultValue={0}
              className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm uppercase tracking-wide mb-2">
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors"
          >
            <option value="">Selecione...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm uppercase tracking-wide mb-2">
            URLs das Imagens (uma por linha)
          </label>
          <textarea
            id="images"
            name="images"
            rows={4}
            placeholder="https://exemplo.com/imagem1.jpg"
            className="w-full px-4 py-3 border border-border bg-transparent focus:border-chouga-red focus:outline-none transition-colors resize-none font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-chouga-black text-white font-heading uppercase tracking-wide hover:bg-chouga-red transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Produto'}
        </button>
      </form>
    </main>
  )
}