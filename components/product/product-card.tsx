import Link from 'next/link'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  images: string[] | null
  stock: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100)
  }

  return (
    <Link href={`/produto/${product.id}`} className="card-product group">
      <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full" />
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase px-3 py-1">
            Esgotado
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-heading text-base font-bold uppercase tracking-tight group-hover:text-chouga-red transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 font-semibold text-lg">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}