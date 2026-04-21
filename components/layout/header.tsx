'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  { name: 'Camisetas', slug: 'tees' },
  { name: 'Regatas', slug: 'regatas' },
  { name: 'Moletons', slug: 'hoodies' },
  { name: 'Acessórios', slug: 'accesorios' },
  { name: 'Tênis', slug: 'tenis' },
  { name: 'Barras', slug: 'barras' },
]

interface HeaderProps {
  user?: { id: string } | null
  isAdmin?: boolean
}

export function Header({ user, isAdmin }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-[1536px] mx-auto px-4 md:px-6">
        <div className="h-[4.5rem] flex items-center justify-between">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="font-heading text-2xl md:text-3xl font-bold tracking-tighter uppercase">
            Chouga
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-sm font-medium uppercase tracking-wide hover:text-chouga-red transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:text-chouga-red transition-colors" aria-label="Buscar">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href={user ? '/conta' : '/login'} className="p-2 hover:text-chouga-red transition-colors hidden md:block" aria-label="Conta">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button className="p-2 hover:text-chouga-red transition-colors relative" aria-label="Carrinho">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-chouga-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        <div className="hidden lg:flex h-12 items-center gap-6 border-t border-border">
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide"
            >
              Categorias <ChevronDown size={14} />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-border shadow-lg z-50">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="block px-4 py-3 text-sm hover:bg-secondary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
           frete grátis acima de R$ 299
          </span>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="max-w-[1536px] mx-auto px-4 py-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="block py-3 text-sm font-medium uppercase tracking-wide border-b border-border last:border-b-0"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}