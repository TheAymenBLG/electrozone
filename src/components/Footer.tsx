import { Link } from "react-router-dom";
import { LOGO_URL, PHONE, SOCIALS, BRANDS } from "../data/brand";

export default function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-edge mt-24">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-5">
          <img src={LOGO_URL} alt="ElectroZone" className="h-10 object-contain" />
          <p className="text-cloud-muted text-sm max-w-xs">
            Electro Zone est un site de vente en ligne spécialisé dans l'électroménager et le
            multimédia. Une large gamme de produits de qualité à des prix compétitifs.
          </p>
          <p className="text-cloud-muted font-mono text-xs pt-4">© {new Date().getFullYear()} ElectroZone Algeria. Engineering Excellence.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-head font-bold text-cloud mb-4">Informations</h4>
          <Link to="/cart" className="block text-cloud-muted hover:text-gold transition-colors text-sm">Mon panier</Link>
          <Link to="/" className="block text-cloud-muted hover:text-gold transition-colors text-sm">Boutique</Link>
          <Link to="/admin" className="block text-cloud-muted hover:text-gold transition-colors text-sm">Tableau de bord</Link>
          <span className="block text-cloud-muted text-sm">Tél : {PHONE}</span>
        </div>
        <div className="space-y-3">
          <h4 className="font-head font-bold text-cloud mb-4">Suivez-nous</h4>
          <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="block text-cloud-muted hover:text-gold transition-colors text-sm">Facebook</a>
          <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="block text-cloud-muted hover:text-gold transition-colors text-sm">Instagram</a>
          <a href={SOCIALS.tiktok} target="_blank" rel="noreferrer" className="block text-cloud-muted hover:text-gold transition-colors text-sm">TikTok</a>
        </div>
        <div className="space-y-3">
          <h4 className="font-head font-bold text-cloud mb-4">Nos marques</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-cloud-muted font-mono text-xs">
            {BRANDS.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
