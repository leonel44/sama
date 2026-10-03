import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { QUARTIERS } from '../data/quartiers';

export const Footer: React.FC = () => {
  const { setSelectedQuartier, showToast, setCurrentView, siteConfig, quartiers } = useCart();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSecretChefTrigger = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);

      if (next >= 3) {
        setClickCount(0);
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("🔒 Accès gérance détecté");
      }
      return next;
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    showToast("🎉 Merci pour votre inscription au Club Privilège Samantha Food !");
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#FCF9F8] text-[#1C1B1B] border-t border-[#E5E2E1] mt-16">
      {/* Top Banner Ribbon */}
      <div className="bg-[#F5B301] text-[#654800] py-3 px-4 sm:px-6 shadow-xs">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span className="tracking-wide uppercase">Qualité • Fraîcheur • Plaisir Gourmand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span>Livraison sécurisée partout à Douala à la charge du client</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Col 1: About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgyAaThE8lmvszdWGW-H1GEzIZurg0qnOdTLQ7CGwsU-Gnfy5yOUTG4XFFv3yXyRWQyNu_47ad-Je_DWN3sNaWY3awNEFNU4paEvpRDWci8FTxLjrhbZrZTDuXbkH6FjjKrgiUQyH96rC-hJiHsTXAdPcDBt_Hg77Ah2lTtAlHRMEXBTdJGAN2WR0Im3ppM2L6z65DJiMWKRn-p5PTMRPxFyWU0AItFwWhk0RyYLr5gGVlaCrZJgRe"
              alt="Samantha Food"
              className="h-9 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-lg text-[#1C1B1B]">{siteConfig.restaurantName}</span>
              <span className="text-[10px] text-[#BC000C] font-bold uppercase tracking-wider">{siteConfig.tagline}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
            Maison culinaire d'excellence à Douala. Richesse des traditions camerounaises et délices contemporains préparés chaque jour avec passion et rigueur d'hygiène.
          </p>
          <div className="space-y-1.5 text-xs text-[#504533] pt-1">
            <div className="flex items-center gap-2 text-[#1C1B1B]">
              <span className="material-symbols-outlined text-[18px] text-[#F5B301]">schedule</span>
              <span className="font-semibold">{siteConfig.openingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-[#1C1B1B]">
              <span className="material-symbols-outlined text-[18px] text-[#1B6D24]">call</span>
              <a href={`tel:+${siteConfig.whatsappPrimary.replace(/\D/g, '')}`} className="hover:underline font-semibold">+237 {siteConfig.phoneDisplay}</a>
            </div>
            <div className="flex items-center gap-2 text-[#1C1B1B]">
              <span className="material-symbols-outlined text-[18px] text-[#BC000C]">location_on</span>
              <span>Douala, Littoral, Cameroun</span>
            </div>
          </div>
        </div>

        {/* Col 2: Quartiers Desservis */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-[#1C1B1B]">Quartiers Desservis</h3>
          <p className="text-xs text-[#504533]">
            Expédition rapide par coursiers spécialisés dans tous les arrondissements de Douala :
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quartiers.slice(0, 12).map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setSelectedQuartier(q);
                  showToast(`Zone sélectionnée : ${q.name} (Frais : ${q.fee.toLocaleString('fr-FR')} FCFA)`);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#F0EDED] hover:bg-[#E5E2E1] text-[11px] font-semibold text-[#504533] hover:text-[#1C1B1B] transition-colors"
              >
                {q.name}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-[#BC000C] font-semibold">
            * Frais de transport à la charge du client (selon quartier).
          </span>
        </div>

        {/* Col 3: Moyens de Paiement */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-[#1C1B1B]">Moyens de Paiement</h3>
          <p className="text-xs text-[#504533]">
            Réglez facilement à la commande ou à la réception du repas :
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-[#FFCC00] text-black font-black text-[10px] flex items-center justify-center">
                MoMo
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1C1B1B]">MTN Mobile Money</span>
                <span className="text-[10px] text-[#827560]">Code marchand ou push direct</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-[#FF7900] text-white font-black text-[10px] flex items-center justify-center">
                OM
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1C1B1B]">Orange Money Cameroun</span>
                <span className="text-[10px] text-[#827560]">Validation instantanée</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-[#1B6D24] text-white font-black text-[10px] flex items-center justify-center">
                Cash
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#1C1B1B]">Cash à la livraison</span>
                <span className="text-[10px] text-[#827560]">Directement auprès du coursier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Club Privilège */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-[#1C1B1B]">Club Privilège Samantha</h3>
          <p className="text-xs text-[#504533]">
            Recevez nos plats du jour, offres exclusives traiteur et invitations dégustation.
          </p>
          {isSubscribed ? (
            <div className="p-3 rounded-xl bg-[#A3F69C]/30 border border-[#1B6D24]/30 text-xs text-[#005312] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Vous êtes inscrit au Club Privilège !</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex items-center rounded-xl bg-white border border-[#E5E2E1] px-3 py-2 shadow-xs">
                <span className="material-symbols-outlined text-[#827560] text-[18px] mr-2">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email..."
                  required
                  className="bg-transparent w-full text-xs text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#BC000C] text-white font-bold text-xs hover:bg-[#930007] transition-all shadow-sm"
              >
                Rejoindre le Club
              </button>
            </form>
          )}
          <span className="text-[10px] text-[#827560]">
            Aucun spam. Désabonnement à tout moment par WhatsApp.
          </span>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-[#E5E2E1]/70">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#827560]">
          <p
            onClick={handleSecretChefTrigger}
            className="cursor-default select-none hover:text-[#504533] transition-colors"
            title="Samantha Food Douala"
          >
            © 2026 Samantha Food Douala. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-[#504533]">
              Service Traiteur Événementiel & Restauration Gourmet Douala
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="text-[11px] text-[#827560]">
              Cuisine Agréée aux normes d'hygiène
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
