import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const totalRevenue = orders?.reduce((acc, o) => acc + (o.total_amount || 0), 0) || 0

  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl font-bold uppercase mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Pedidos
          </p>
          <p className="text-3xl font-bold">{orders?.length || 0}</p>
        </div>
        <div className="bg-white border border-border p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Produtos
          </p>
          <p className="text-3xl font-bold">{products?.length || 0}</p>
        </div>
        <div className="bg-white border border-border p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Receita
          </p>
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalRevenue / 100)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold uppercase">
            Pedidos Recentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-6 py-4 text-xs font-mono">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.customer_email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs uppercase ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.total_amount / 100)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum pedido ainda.
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