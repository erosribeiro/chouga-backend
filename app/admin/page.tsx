import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const totalRevenue = orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold uppercase tracking-tighter mb-12">
        Painel Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border border-border p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Pedidos</p>
          <p className="text-3xl font-bold mt-2">{orders?.length || 0}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Produtos</p>
          <p className="text-3xl font-bold mt-2">{products?.length || 0}</p>
        </div>
        <div className="border border-border p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Receita Total</p>
          <p className="text-3xl font-bold mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue / 100)}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Pedidos Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">ID</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Cliente</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Email</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Status</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Total</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-border px-4 py-2 text-xs font-mono">{order.id.slice(0, 8)}</td>
                    <td className="border border-border px-4 py-2 text-sm">{(order as any).profiles?.full_name || '-'}</td>
                    <td className="border border-border px-4 py-2 text-sm">{order.customer_email}</td>
                    <td className="border border-border px-4 py-2">
                      <span className={`px-2 py-1 text-xs uppercase tracking-wide ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'paid' || order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="border border-border px-4 py-2 text-sm font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount / 100)}
                    </td>
                    <td className="border border-border px-4 py-2 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-border px-4 py-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Produtos</h2>
          <a href="/admin/produtos/novo" className="px-4 py-2 bg-chouga-black text-white text-sm uppercase tracking-wide hover:bg-chouga-red transition-colors">
            + Novo Produto
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Nome</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Categoria</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Preço</th>
                <th className="border border-border px-4 py-2 text-left text-xs uppercase tracking-wide">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="border border-border px-4 py-2 text-sm">{product.name}</td>
                    <td className="border border-border px-4 py-2 text-xs uppercase">{product.category}</td>
                    <td className="border border-border px-4 py-2 text-sm font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
                    </td>
                    <td className="border border-border px-4 py-2 text-sm">{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border border-border px-4 py-8 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}