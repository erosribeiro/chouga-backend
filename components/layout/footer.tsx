import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black text-white py-16 mt-20">
      <div className="max-w-[1536px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-tighter mb-4">
              Chouga
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Streetwear raw. Autêntico. Sem frescuras.
              <br />
              Feito pra quem skata de verdade.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-gray-400 hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
              Redes Sociais
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Receba ofertas exclusivas.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="SEU E-MAIL"
                className="flex-1 bg-gray-900 border border-gray-800 px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 Chouga. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}