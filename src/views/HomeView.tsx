import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { DISHES, REVIEWS } from '../data/dishes';
import { QUARTIERS } from '../data/quartiers';

export const HomeView: React.FC = () => {
  const {
    setCurrentView,
    addToCart,
    setActiveModalDish,
    selectedQuartier,
    setSelectedQuartier,
    setIsCartDrawerOpen,
    dishes,
    todaySpecialDish,
    tomorrowSpecialDish,
    siteConfig,
    quartiers
  } = useCart();
  const [activeSpecialKey, setActiveSpecialKey] = useState<string>('samedi'); // Today is Saturday Oct 3
  const [dailySpecialQty, setDailySpecialQty] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 43, seconds: 19 });

  const okokDish = dishes.find(d => d.id === 'okok-sale') || dishes[0];

  const activeSpecialDish = useMemo(() => {
    switch (activeSpecialKey) {
      case 'dimanche':
        return tomorrowSpecialDish || dishes.find(d => d.id === 'bouillon-patte-boeuf') || dishes[0];
      case 'samedi':
        return todaySpecialDish || dishes.find(d => d.id === 'haricots-blancs-plantain-poulet') || dishes[0];
      case 'jeudi':
        return dishes.find(d => d.id === 'poulet-roti-plantain') || dishes[0];
      case 'mardi':
        return dishes.find(d => d.id === 'pomme-sautee-poulet') || dishes[0];
      case 'okok':
      case 'lundi':
      case 'mercredi':
      default:
        return dishes.find(d => d.id === 'okok-sale') || dishes[0];
    }
  }, [activeSpecialKey, todaySpecialDish, tomorrowSpecialDish, dishes]);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderSpecial = () => {
    addToCart(activeSpecialDish, dailySpecialQty, activeSpecialDish.options?.[0]);
    setIsCartDrawerOpen(true);
  };

  const handleNeighborhoodWhatsApp = () => {
    const text = encodeURIComponent(
      `Bonjour Samantha Food, je souhaite commander pour une livraison à ${selectedQuartier.name} (Frais estimés : ${selectedQuartier.fee.toLocaleString('fr-FR')} FCFA). Quel est le menu disponible ?`
    );
    const waUrl = `https://wa.me/237694920228?text=${text}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-16 pt-20">
      {/* ========================================= */}
      {/* 1. HERO SECTION                           */}
      {/* ========================================= */}
      <section className="relative w-full overflow-hidden bg-[#F6F3F2] py-12 lg:py-20 border-b border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 flex flex-col gap-5 z-10">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#FFDAD5] text-[#930007] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#BC000C]">local_fire_department</span>
                <span>Restauration Rapide & Traiteur Élite Douala</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1C1B1B] leading-tight tracking-tight">
                {siteConfig.heroTitle}{' '}
                <span className="text-[#BC000C]">{siteConfig.heroHighlight}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#504533] max-w-xl leading-relaxed">
                {siteConfig.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${siteConfig.whatsappPrimary.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(siteConfig.restaurantName)},%20je%20souhaite%20passer%20commande`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1B6D24] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#14531b] active:scale-98 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Commander via WhatsApp ({siteConfig.phoneDisplay})</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('menu-du-jour');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#1C1B1B] font-bold text-sm sm:text-base border border-[#E5E2E1] hover:bg-[#F0EDED] transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#F5B301]">restaurant_menu</span>
                  <span>Découvrir le Menu du Jour</span>
                </button>
              </div>

              {/* Proof Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 max-w-lg">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
                  <span className="material-symbols-outlined text-[#BC000C] text-[24px]">verified</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1C1B1B]">100% Frais</span>
                    <span className="text-[11px] text-[#827560] leading-tight">Produits du jour</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
                  <span className="material-symbols-outlined text-[#F5B301] text-[24px]">timer</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1C1B1B]">30-45 Min</span>
                    <span className="text-[11px] text-[#827560] leading-tight">Départ Douala</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E2E1] shadow-xs">
                  <span className="material-symbols-outlined text-[#1B6D24] text-[24px]">thumb_up</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1C1B1B]">Plaisir Garanti</span>
                    <span className="text-[11px] text-[#827560] leading-tight">Assaisonné à cœur</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual Presentation */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[420px] rounded-full p-4 bg-gradient-to-tr from-[#F5B301] via-[#F0EDED] to-[#FFDAD5] flex items-center justify-center shadow-2xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_e5J6PQ0BC5Nxd0V_N5j0YVCfQ65729P3WPp5wfZjZjD9apNN7smLrraw6nroFfpQRDl4ftShmOjU49bkwe7nXxcoyKuxYLLNls0_9wI3ebe7bg8LS3hu0UJ0xQn6LZEutRf6-v5UKKez-OdAuEHZK5sgiyoo_zPewq1fPnH8QJUatR9qJD8fM8bop5QWcg8MORkPvvF7C4mnoH9nAl_5Do2BNhcrC6IpxHVjnAdNrRSKwFp2JJZ-Rm4Du_38Tsz2_g"
                  alt="Okok salé authentique avec bâtons de manioc Samantha Food Douala"
                  className="w-full h-full object-cover rounded-full shadow-inner hover:scale-102 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveModalDish(okokDish)}
                />

                {/* Graphic Price Stamp */}
                <div className="absolute -top-3 -right-3 w-28 h-28 rounded-full bg-[#F5B301] text-[#654800] flex flex-col items-center justify-center shadow-xl transform rotate-6 border-4 border-white">
                  <span className="font-display text-2xl font-black text-[#BC000C] leading-none">1.500</span>
                  <span className="text-xs font-black uppercase tracking-widest">FCFA</span>
                  <span className="text-[9px] uppercase font-bold text-[#1C1B1B] mt-0.5">Plat du Jour</span>
                </div>

                {/* Floater Badge */}
                <div className="absolute -bottom-2 sm:bottom-4 left-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1C1B1B] text-white shadow-xl border border-white/10">
                  <span className="material-symbols-outlined text-[20px] text-[#F5B301]">moped</span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight">Livraison Express Douala</span>
                    <span className="text-[10px] text-[#E5E2E1] leading-tight">Frais à la charge du client</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 2. PLAT DU JOUR SPOTLIGHT (DYNAMIQUE)     */}
      {/* ========================================= */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6" id="menu-du-jour">
        {/* Quick Day Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          <span className="text-xs font-black text-[#504533] uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#BC000C]">restaurant_menu</span>
            Menus du Jour :
          </span>
          {[
            { key: 'samedi', label: "Aujourd'hui (Samedi)", dish: 'Haricots Blancs + Plantain + Poulet', price: '1.500 F', isToday: true },
            { key: 'dimanche', label: '🔥 Demain (Dimanche Casier)', dish: 'Bouillon Patte de Bœuf', price: '2.500 F', isTomorrow: true },
            { key: 'jeudi', label: 'Jeudi', dish: 'Poulet Rôti + Plantain', price: '1.000 F' },
            { key: 'mardi', label: 'Mardi', dish: 'Pomme Sautée + Poulet', price: '1.000 F' },
            { key: 'okok', label: 'Lundi / Mercredi', dish: 'Okok Salé & Bâtons', price: '1.500 F' },
          ].map((item) => {
            const isSelected = activeSpecialKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveSpecialKey(item.key);
                  setDailySpecialQty(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#BC000C] text-white shadow-md ring-2 ring-[#BC000C]/20 scale-102'
                    : item.isTomorrow
                    ? 'bg-[#FFF3D6] text-[#7B5800] border border-[#F5B301] hover:bg-[#FFE8B3]'
                    : 'bg-white text-[#504533] hover:bg-[#F0EDED] border border-[#E5E2E1]'
                }`}
              >
                <span>{item.label}</span>
                {item.isToday && (
                  <span className="px-1 py-0.2 rounded bg-[#F5B301] text-[#654800] text-[8px] font-black uppercase">
                    Direct
                  </span>
                )}
                {item.isTomorrow && (
                  <span className="px-1 py-0.2 rounded bg-[#BC000C] text-white text-[8px] font-black uppercase">
                    Spécial
                  </span>
                )}
                <span className={`font-black ml-1 ${isSelected ? 'text-[#FFDEA5]' : 'text-[#BC000C]'}`}>
                  {item.price}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6 md:p-10 rounded-3xl bg-white border border-[#E5E2E1] shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] group">
                <img
                  src={activeSpecialDish.image}
                  alt={activeSpecialDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveModalDish(activeSpecialDish)}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#BC000C] text-white text-xs tracking-wider uppercase font-bold shadow-md">
                  {activeSpecialDish.tag || 'Menu du Jour'}
                </div>
                <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-xl bg-[#F5B301] text-[#654800] font-display font-black text-base shadow-md">
                  {activeSpecialDish.price.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
            </div>

            {/* Information & Action */}
            <div className="lg:col-span-7 flex flex-col gap-3 order-1 lg:order-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#FFDAD5] text-[#930007] text-xs uppercase font-extrabold">
                  Plat du Jour Officiel
                </span>
                <span className="text-[#504533] text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">alarm</span>
                  Service chaud : dès 11h30
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
                {activeSpecialDish.name}
              </h2>

              <p className="text-sm sm:text-base text-[#504533] leading-relaxed">
                {activeSpecialDish.description}
              </p>

              {/* Countdown Timer */}
              <div className="p-3.5 rounded-2xl bg-[#F6F3F2] flex items-center justify-between flex-wrap gap-2 my-1 border border-[#E5E2E1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#BC000C] text-[22px]">hourglass_bottom</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1C1B1B]">Commandes chaudes midi :</span>
                </div>
                <div className="flex items-center gap-1.5 font-display text-base font-black text-[#BC000C]">
                  <span className="px-2 py-0.5 rounded-md bg-white text-[#1C1B1B] shadow-xs">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span>h</span>
                  <span className="px-2 py-0.5 rounded-md bg-white text-[#1C1B1B] shadow-xs">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span>m</span>
                  <span className="px-2 py-0.5 rounded-md bg-white text-[#1C1B1B] shadow-xs">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span>s</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F0EDED] rounded-full p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setDailySpecialQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-[#1C1B1B] hover:bg-[#E5E2E1] transition-colors shadow-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{dailySpecialQty}</span>
                    <button
                      type="button"
                      onClick={() => setDailySpecialQty(q => q + 1)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-[#1C1B1B] hover:bg-[#E5E2E1] transition-colors shadow-xs"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#504533] font-medium">Portion copieuse</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOrderSpecial}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#BC000C] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#930007] active:scale-98 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    <span>Ajouter ({(dailySpecialQty * activeSpecialDish.price).toLocaleString('fr-FR')} FCFA)</span>
                  </button>
                  <a
                    href={`https://wa.me/237694920228?text=${encodeURIComponent(
                      `Bonjour Samantha Food, je souhaite commander ${dailySpecialQty}x portion(s) de *${activeSpecialDish.name}* (${(
                        dailySpecialQty * activeSpecialDish.price
                      ).toLocaleString('fr-FR')} FCFA) pour livraison à Douala.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#1B6D24] text-white hover:bg-[#14531b] transition-all shadow-md flex items-center justify-center"
                    title="Commander directement sur WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#504533] text-xs pt-1">
                <span className="material-symbols-outlined text-[16px] text-[#BC000C]">location_on</span>
                <span>Disponible uniquement sur livraison — Tout Douala (Frais à la charge du client)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2B. LES 4 FORMULES DES FLYERS SAMANTHA FOOD              */}
      {/* ======================================================== */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#BC000C] font-black block mb-1">
              Flyers WhatsApp Officiels
            </span>
            <h3 className="font-display font-black text-2xl text-[#1C1B1B] tracking-tight">
              Nos Formules du Jour Récurrentes (1.000 - 1.500 FCFA)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrentView('menu-du-jour');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#BC000C] hover:underline flex items-center gap-1"
          >
            <span>Voir le planning hebdomadaire complet</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {DISHES.filter(d =>
            ['bouillon-patte-boeuf', 'haricots-blancs-plantain-poulet', 'pomme-sautee-poulet', 'poulet-roti-plantain', 'okok-sale'].includes(d.id)
          ).map((dish) => (
            <div
              key={dish.id}
              className="rounded-2xl bg-white border border-[#E5E2E1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0EDED]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveModalDish(dish)}
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#1C1B1B]/80 text-white text-[9px] font-bold uppercase">
                  {dish.tag}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-[#F5B301] text-[#654800] font-display font-black text-xs shadow-xs">
                  {dish.price.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h4
                    onClick={() => setActiveModalDish(dish)}
                    className="font-display font-bold text-sm text-[#1C1B1B] hover:text-[#BC000C] cursor-pointer line-clamp-1"
                  >
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-[#504533] mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E2E1]">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(dish, 1, dish.options?.[0]);
                      setIsCartDrawerOpen(true);
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#BC000C] text-white text-xs font-bold hover:bg-[#930007] transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span>
                    <span>Commander</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalDish(dish)}
                    className="p-1.5 rounded-lg bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#E5E2E1]"
                    title="Voir recette"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* 3. LES 4 UNIVERS CULINAIRES              */}
      {/* ========================================= */}
      <section className="w-full bg-[#F6F3F2] py-16 border-y border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-[#BC000C] uppercase tracking-wider block mb-1">
                Carte Gastronomique Complète
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
                Explorez nos 4 Univers Culinaires
              </h2>
              <p className="text-sm text-[#504533] mt-1">
                De la richesse réconfortante de nos villages aux recettes cosmopolites les plus savoureuses, chaque création est une célébration gustative.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('menu-carte');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-full bg-[#F5B301] text-[#654800] text-xs font-bold shadow-sm hover:brightness-95 transition-all"
              >
                Voir toute la carte
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Saveurs d'Afrique */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E2E1] shadow-sm hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden bg-[#F0EDED]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmEc4UHckfTBDILrrStfBBRDki1Fc_BC4m_PUy2e2SM59RLIHoaResYdgTaHBBeCSy_fR_ngnQiXwOhGmtopeIpaLNKi_3EgNm1597Tl69Wsgg-Q68gl40QzWbDhFFcSGZ-QBJ-XzV-DPVzZuhHEbP7BsbuAzjpOGPgr4tFNvtM99qKebF4hDu2lyP9gPrBEpVyDu_1hRm_esOMzdzREYkXjfszc-Zp8j_WCCEn4vdGBNrev8RgeZj"
                  alt="Saveurs d'Afrique et Terroir Camerounais"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#BC000C] text-white text-[10px] font-bold uppercase tracking-wider">
                  Terroir Douala
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B]">Saveurs d'Afrique & Terroir</h3>
                  <p className="text-xs text-[#504533] mt-1 leading-relaxed">
                    Les grands classiques qui font la fierté du Cameroun, cuisinés avec amour et respect des recettes de nos grands-mères.
                  </p>
                  <ul className="space-y-1.5 pt-3 text-xs text-[#1C1B1B]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Okok salé aux arachides & bâtons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Ndolè royal aux crevettes fraîches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Koki de maïs & huile rouge douce</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Poisson braisé & Miondo</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('menu-carte');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#F5B301] hover:text-[#654800] text-[#1C1B1B] text-xs font-bold transition-all text-center"
                >
                  Commander Terroir
                </button>
              </div>
            </div>

            {/* Pillar 2: Cuisine Internationale */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E2E1] shadow-sm hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden bg-[#F0EDED]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5oNoF5SFX-SbhoVdMgQRPeWGFYDyUXkozWfX_1jQei7tdZpVKzFby7MMi_N9BpHrdRtaO6PSkl6nc26xgV5EyagCr-_sLLhaXMWEIbkqs9EJfpe7Shzc7Ww4kuq_HuXkGKtNIcFBpuTblwqJ5ymBE0S-IWXN6tBOxeBzFxz5HdKoM-jjYNzGfwA42sLLCPOQi4BUeS6J18HchUWaF3A4DwurMvmmMoBcObfEC6V0pUnihQjkPMjEj"
                  alt="Cuisine Internationale et Européenne"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#F5B301] text-[#654800] text-[10px] font-bold uppercase tracking-wider">
                  Carte Bistrot
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B]">Cuisine Internationale & Euro</h3>
                  <p className="text-xs text-[#504533] mt-1 leading-relaxed">
                    Le raffinement de la gastronomie internationale avec viandes tendres, sauces onctueuses et gratins réconfortants.
                  </p>
                  <ul className="space-y-1.5 pt-3 text-xs text-[#1C1B1B]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#F5B301]">check_circle</span>
                      <span>Poulet rôti aux herbes de Provence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#F5B301]">check_circle</span>
                      <span>Filet de bœuf tendre sauce poivre vert</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#F5B301]">check_circle</span>
                      <span>Gratin dauphinois fondant à la crème</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#F5B301]">check_circle</span>
                      <span>Tagliatelles fraîches aux fruits de mer</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('menu-carte');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#F5B301] hover:text-[#654800] text-[#1C1B1B] text-xs font-bold transition-all text-center"
                >
                  Commander Bistrot
                </button>
              </div>
            </div>

            {/* Pillar 3: Fast Gourmet */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E2E1] shadow-sm hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden bg-[#F0EDED]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEMq2O0_bL_d8XIEPZtPmHXCJTQKOb7JeyrYmRBAlAVhfLbzrV10JhVikmQTn4mgdkGT-b6fYlOoaZqilO5JcGV6gLYqRwVGAbermezfAeQp7XezEkU9iX9nknO84NCut9m-PQmDH9V7Vt0LDEw9tZHxcqTeaMHmfaWwf8cRWWVQVuZLRTeXuzp2DOuAoxKTUeqfMu0labrni7fPHLHYTfor2ttoTgNSHMzGh_Fk0Ohrs9_5MxHQQS"
                  alt="Fast Gourmet et Street Food"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#E32320] text-white text-[10px] font-bold uppercase tracking-wider">
                  Fast Gourmand
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B]">Fast Gourmet & Street Chic</h3>
                  <p className="text-xs text-[#504533] mt-1 leading-relaxed">
                    Le meilleur du fast-food revisité en version artisanale : viandes fraîches marinées et pains boulangers dorés.
                  </p>
                  <ul className="space-y-1.5 pt-3 text-xs text-[#1C1B1B]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#BC000C]">check_circle</span>
                      <span>Burgers artisanaux bœuf haché frais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#BC000C]">check_circle</span>
                      <span>Shawarma libanais poulet grillé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#BC000C]">check_circle</span>
                      <span>Tacos français gratinés sauce fromagère</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#BC000C]">check_circle</span>
                      <span>Frites de plantains mûrs (Alloco) crousti</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('menu-carte');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#F5B301] hover:text-[#654800] text-[#1C1B1B] text-xs font-bold transition-all text-center"
                >
                  Commander Fast Food
                </button>
              </div>
            </div>

            {/* Pillar 4: Douceurs & Nectars */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E5E2E1] shadow-sm hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden bg-[#F0EDED]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpTWpilmRjdjABUGrJWGDfM5rxZSvSOIvmrNt3q1TCaPiaZMzl6xPj2eUlzZ4BUZGq5YbMzYB66pgWeB-uf7OjCzAY0TzOrggGHP-BL_1aT1fyoaqS7qVdQU1J1Ui5bkq6QlZ4z6mA0F3XAuyxSJM25mAA8eBfuLciQG638nKhak94ZQo1RRldudu4OqvXjOQCb9iJKH_EYg-DlZZmo1EJZ30BEZbOu__b_IuYaYGwwYI9NiiNWnEJ"
                  alt="Douceurs et Nectars Locaux"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#1B6D24] text-white text-[10px] font-bold uppercase tracking-wider">
                  100% Naturel
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B]">Douceurs & Nectars Locaux</h3>
                  <p className="text-xs text-[#504533] mt-1 leading-relaxed">
                    Jus de fruits frais pressés sans additifs et pâtisseries moelleuses pour couronner vos déjeuners et dîners.
                  </p>
                  <ul className="space-y-1.5 pt-3 text-xs text-[#1C1B1B]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Jus de Bissap (Foléré) à la menthe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Élixir Gingembre & Ananas pressé</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Gaufres liégeoises caramélisées</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                      <span>Fondant cœur coulant chocolat noir</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('menu-carte');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F0EDED] hover:bg-[#F5B301] hover:text-[#654800] text-[#1C1B1B] text-xs font-bold transition-all text-center"
                >
                  Commander Douceurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. L'ENGAGEMENT SAMANTHA FOOD            */}
      {/* ========================================= */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2 mb-10">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider">
            L'Engagement Samantha Food
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B]">
            Qualité • Fraîcheur • Plaisir
          </h2>
          <p className="text-sm text-[#504533]">
            Nous mettons un point d'honneur à offrir aux familles, cadres d'entreprises et gourmets de Douala une expérience irréprochable du premier contact jusqu'à la dernière bouchée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E5E2E1] shadow-xs flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFDAD5] text-[#930007] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">restaurant</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1C1B1B]">1. Qualité Gastronomique</h3>
            <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
              Ingrédients nobles rigoureusement sélectionnés auprès des meilleurs producteurs de la région du Littoral et de l'Ouest. Huile rouge épurée, viandes fraîches certifiées et épices moulues à la main.
            </p>
            <span className="mt-auto px-3 py-1 rounded-full bg-[#F0EDED] text-[11px] font-semibold text-[#1C1B1B]">
              Normes Sanitaires Strictes
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E5E2E1] shadow-xs flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FFDEA5] text-[#654800] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1C1B1B]">2. Fraîcheur Minute</h3>
            <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
              Aucun plat n'est pré-conditionné la veille. Nos marmites s'activent dès les premières lueurs du jour. Vos repas quittent notre cuisine scellés dans des conditionnements isothermes étanches.
            </p>
            <span className="mt-auto px-3 py-1 rounded-full bg-[#F0EDED] text-[11px] font-semibold text-[#1C1B1B]">
              Chaîne du Chaud Maîtrisée
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E5E2E1] shadow-xs flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#A3F69C] text-[#005312] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">sentiment_satisfied</span>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1C1B1B]">3. Plaisir Généreux</h3>
            <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
              Chez nous, la gourmandise est un art de vivre. Les portions sont toujours copieuses, assaisonnées avec finesse pour régaler les papilles sans excès d'huile ni artifice. Le vrai goût de chez nous.
            </p>
            <span className="mt-auto px-3 py-1 rounded-full bg-[#F0EDED] text-[11px] font-semibold text-[#1C1B1B]">
              Garantie Sourire
            </span>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. CALCULATEUR LIVRAISON DOUALA          */}
      {/* ========================================= */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F0EDED]/60 rounded-3xl p-6 sm:p-10 border border-[#E5E2E1]">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B301] text-[#654800] text-xs font-bold w-fit">
              <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
              <span>Réseau Coursiers Douala</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
              Livraison Rapide dans Tous les Quartiers de Douala
            </h2>

            <p className="text-sm text-[#504533] leading-relaxed">
              Pour assurer l'arrivée de vos plats fumants et en parfait état, nous travaillons avec des motards indépendants formés au transport de repas gastronomiques. Sélectionnez votre quartier pour estimer le délai et les frais de coursier.
            </p>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E2E1] flex flex-col gap-1.5">
              <span className="text-xs uppercase font-bold text-[#BC000C]">Règle de service :</span>
              <p className="text-xs text-[#1C1B1B] leading-relaxed">
                Tous nos plats sont vendus hors livraison. <strong>Les frais de transport sont entièrement à la charge du client</strong> et versés directement au livreur à la réception ou prépayés par MoMo/OM.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4 p-6 rounded-2xl bg-white border border-[#E5E2E1] shadow-md">
            <h3 className="font-display font-bold text-base text-[#1C1B1B] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F5B301]">distance</span>
              <span>Simulateur Frais & Temps de Livraison</span>
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#504533]" htmlFor="home-district-select">
                Choisissez votre quartier de livraison :
              </label>
              <div className="relative">
                <select
                  id="home-district-select"
                  value={selectedQuartier.id}
                  onChange={(e) => {
                    const q = quartiers.find(item => item.id === e.target.value);
                    if (q) setSelectedQuartier(q);
                  }}
                  className="w-full p-3.5 rounded-xl bg-[#F0EDED] text-[#1C1B1B] text-sm font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-[#F5B301] cursor-pointer appearance-none"
                >
                  {quartiers.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.name} ({q.details})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[#827560] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#F6F3F2] border border-[#E5E2E1]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#827560] uppercase font-bold">Estimation Frais :</span>
                <span className="font-display font-black text-xl text-[#BC000C] mt-0.5">
                  {selectedQuartier.fee.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#827560] uppercase font-bold">Délai estimé :</span>
                <span className="font-display font-black text-xl text-[#1C1B1B] mt-0.5">
                  {selectedQuartier.time}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNeighborhoodWhatsApp}
              className="w-full py-3.5 rounded-xl bg-[#1B6D24] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#14531b] active:scale-98 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Commander pour {selectedQuartier.name} sur WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 6. AVIS CLIENTS & TÉMOIGNAGES DOUALA     */}
      {/* ========================================= */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-2 max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#BC000C] uppercase tracking-wider">
            Avis de nos fidèles clients
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B]">
            Ils adorent Samantha Food à Douala
          </h2>
          <p className="text-sm text-[#504533]">
            Particuliers au bureau, familles le week-end et entreprises pour leurs pauses déjeuners témoignent de notre régularité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex text-[#F5B301]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px] text-[#F5B301]">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#1C1B1B] italic leading-relaxed">
                  « {rev.quote} »
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#E5E2E1]">
                <div className={`w-10 h-10 rounded-full font-display font-black text-sm flex items-center justify-center ${rev.initialsColor}`}>
                  {rev.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1C1B1B]">{rev.author}</span>
                  <span className="text-[11px] text-[#827560]">{rev.role} • {rev.quartier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* 7. WHATSAPP DIRECT CTA BANNER            */}
      {/* ========================================= */}
      <section className="w-full bg-gradient-to-r from-[#BC000C] to-[#E32320] text-white py-12 px-4 sm:px-6">
        <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B301] text-[#654800] text-xs font-black uppercase w-fit mx-auto lg:mx-0 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Réponse instantanée garantie</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Une faim urgente ou un événement à organiser ?
            </h2>
            <p className="text-sm sm:text-base text-white/90">
              Contactez notre standard WhatsApp au <strong>694-92-02-28</strong>. Envoyez votre quartier, le plat désiré et recevez confirmation immédiate avec votre heure de livraison.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/237694920228?text=Bonjour%20Samantha%20Food,%20je%20veux%20passer%20commande%20immédiate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white text-[#1C1B1B] font-display font-black text-sm sm:text-base shadow-xl hover:bg-[#F0EDED] active:scale-98 transition-all flex items-center gap-2.5"
            >
              <span className="material-symbols-outlined text-[24px] text-[#1B6D24]">chat</span>
              <span>Écrire au 694-92-02-28</span>
            </a>

            <a
              href="tel:+237694920228"
              className="px-6 py-4 rounded-full bg-black/20 text-white font-bold text-sm hover:bg-black/30 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span>Appel direct</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
