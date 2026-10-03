import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ViewType } from '../types';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, totalItemsCount, setIsCartDrawerOpen, siteConfig } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: { view: ViewType; label: string }[] = [
    { view: 'accueil', label: 'Accueil' },
    { view: 'menu-carte', label: 'Menu & Carte du Monde' },
    { view: 'menu-du-jour', label: 'Menu du Jour' },
    { view: 'commander', label: 'Commander en Ligne' },
    { view: 'traiteur', label: 'À Propos & Traiteur' },
  ];

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FCF9F8]/95 backdrop-blur-xl border-b border-[#E5E2E1] shadow-[0_4px_20px_rgba(26,26,26,0.05)] transition-all">
        <div className="h-20 max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('accueil')}
              className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgyAaThE8lmvszdWGW-H1GEzIZurg0qnOdTLQ7CGwsU-Gnfy5yOUTG4XFFv3yXyRWQyNu_47ad-Je_DWN3sNaWY3awNEFNU4paEvpRDWci8FTxLjrhbZrZTDuXbkH6FjjKrgiUQyH96rC-hJiHsTXAdPcDBt_Hg77Ah2lTtAlHRMEXBTdJGAN2WR0Im3ppM2L6z65DJiMWKRn-p5PTMRPxFyWU0AItFwWhk0RyYLr5gGVlaCrZJgRe"
                alt="Samantha Food Logo"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xl text-[#1C1B1B] leading-tight tracking-tight">
                  {siteConfig.restaurantName}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#BC000C] font-bold tracking-wider uppercase">
                  {siteConfig.tagline}
                </span>
              </div>
            </button>

            {/* Douala Location Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5E2E1]/70 text-[#504533] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#BC000C]">location_on</span>
              <span>Livraison : Douala uniquement</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F5B301] text-[#654800] font-bold shadow-sm'
                      : 'text-[#504533] hover:bg-[#F0EDED] hover:text-[#1C1B1B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* WhatsApp Direct Hotline */}
            <a
              href={`https://wa.me/${siteConfig.whatsappPrimary.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(siteConfig.restaurantName)},%20je%20souhaite%20commander%20un%20repas.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1B6D24] text-white hover:bg-[#14531b] transition-all shadow-[0_2px_8px_rgba(27,109,36,0.25)]"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] leading-none opacity-90">WhatsApp Direct</span>
                <span className="font-bold text-[12px] leading-none mt-0.5">{siteConfig.phoneDisplay}</span>
              </div>
            </a>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#E5E2E1] active:scale-95 transition-all shadow-sm"
              title="Ouvrir le Panier"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E32320] text-white text-[11px] font-black animate-scaleIn shadow-md">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#E5E2E1] transition-colors"
              aria-label="Menu de navigation"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FCF9F8] border-b border-[#E5E2E1] px-4 py-4 shadow-xl">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0EDED] text-[#504533] text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-[16px] text-[#BC000C]">location_on</span>
                <span>Livraison : Partout à Douala (aux frais du client)</span>
              </div>

              {navLinks.map((link) => {
                const isActive = currentView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#F5B301] text-[#654800]'
                        : 'text-[#1C1B1B] hover:bg-[#F0EDED]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="material-symbols-outlined text-[18px]">check</span>}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-[#E5E2E1] mt-2">
                <a
                  href={`https://wa.me/${siteConfig.whatsappPrimary.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B6D24] text-white font-bold text-sm shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WhatsApp : {siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
