import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Comparas.pt — Comparador de credito automovel
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link
            to="/"
            className="text-slate-400 hover:text-primary-light transition-colors no-underline"
          >
            Inicio
          </Link>
          <Link
            to="/privacidade"
            className="text-slate-400 hover:text-primary-light transition-colors no-underline"
          >
            Privacidade
          </Link>
          <Link
            to="/termos"
            className="text-slate-400 hover:text-primary-light transition-colors no-underline"
          >
            Termos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
