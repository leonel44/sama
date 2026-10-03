import React, { useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { DishModal } from './components/DishModal';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { FullMenuView } from './views/FullMenuView';
import { DailyMenuView } from './views/DailyMenuView';
import { CheckoutView } from './views/CheckoutView';
import { CateringView } from './views/CateringView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, isAdminAuthenticated, logoutAdmin, showToast } = useCart();

  // Listen for #admin URL hash or keyboard shortcut Alt+S for Cheffe Samantha
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Alt + S (for Samantha)
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("🔒 Espace Gérance activé");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCurrentView, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F8] text-[#1C1B1B] relative">
      <Navbar />

      <main className="flex-1 w-full">
        {currentView === 'accueil' && <HomeView />}
        {currentView === 'menu-carte' && <FullMenuView />}
        {currentView === 'menu-du-jour' && <DailyMenuView />}
        {currentView === 'commander' && <CheckoutView />}
        {currentView === 'traiteur' && <CateringView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      <Footer />
      <CartDrawer />
      <DishModal />
      <Toast />

      {/* Floating Customer WhatsApp Support Button */}
      <aside aria-label="Support WhatsApp" className="fixed bottom-6 right-5 z-40 flex items-center group">
        <a
          href="https://wa.me/237694920228?text=Bonjour%20Samantha%20Food,%20je%20souhaite%20commander%20ou%20poser%20une%20question."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1B6D24] text-white shadow-xl hover:bg-[#14531b] hover:shadow-2xl active:scale-95 transition-all"
          title="Commander directement par WhatsApp (+237 694-92-02-28)"
        >
          <span className="material-symbols-outlined text-[24px]">chat</span>
          <span className="text-xs font-bold hidden sm:inline">WhatsApp Direct</span>
        </a>
      </aside>

      {/* PRIVATE MANAGER BAR: Rendered ONLY when Cheffe is logged in */}
      {isAdminAuthenticated && (
        <aside aria-label="Espace Gérance" className="fixed bottom-6 left-5 z-40 flex items-center gap-2 p-2 rounded-2xl bg-[#1C1B1B]/95 text-white backdrop-blur-md shadow-2xl border border-[#F5B301]/40 text-xs">
          <div className="flex items-center gap-1.5 px-2 font-bold text-[#F5B301]">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="hidden md:inline">Mode Gérance Actif</span>
          </div>

          {currentView !== 'admin' ? (
            <button
              type="button"
              onClick={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F5B301] text-[#654800] font-black hover:bg-[#e0a200] transition-colors"
            >
              Gérer Menu
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentView('accueil');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              Voir le Site
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              setCurrentView('accueil');
              showToast("Session gestionnaire verrouillée.");
            }}
            className="px-2.5 py-1.5 rounded-xl text-[#FF857D] hover:bg-[#FF857D]/10 font-bold transition-colors"
            title="Verrouiller et masquer la barre d'administration"
          >
            Verrouiller
          </button>
        </aside>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
