import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { DISHES, WEEK_MENU } from '../data/dishes';
import { QUARTIERS } from '../data/quartiers';

export const DailyMenuView: React.FC = () => {
  const {
    addToCart,
    setActiveModalDish,
    setIsCartDrawerOpen,
    showToast,
    dishes,
    weekMenu,
    todaySpecialDish,
    tomorrowSpecialDish,
    siteConfig,
    quartiers
  } = useCart();
  const [selectedDayKey, setSelectedDayKey] = useState<string>('samedi'); // Default to today: Saturday 03 Oct 2026
  const [activeDishQty, setActiveDishQty] = useState(1);

  // Pre-order form state
  const [preorderName, setPreorderName] = useState('');
  const [preorderPhone, setPreorderPhone] = useState('');
  const [preorderQuartier, setPreorderQuartier] = useState('Akwa');
  const [preorderDish, setPreorderDish] = useState('Haricots Blancs + Plantain Mûr + Poulet (1.500 FCFA)');
  const [preorderPortions, setPreorderPortions] = useState(2);
  const [preorderTime, setPreorderTime] = useState('11h45 - 12h15 (Pause de midi)');
  const [preorderNotes, setPreorderNotes] = useState('');

  // Find active day and dish
  const activeDay = weekMenu.find(m => m.key === selectedDayKey) || weekMenu[weekMenu.length - 1];
  const activeDish =
    (selectedDayKey === 'samedi' ? todaySpecialDish : selectedDayKey === 'dimanche' ? tomorrowSpecialDish : null) ||
    dishes.find(d => d.id === activeDay.flyerDishId) ||
    dishes[0];

  // Specific flyer dishes to showcase in the recurrent specials section
  const flyerDishes = dishes.filter(d =>
    ['bouillon-patte-boeuf', 'haricots-blancs-plantain-poulet', 'pomme-sautee-poulet', 'poulet-roti-plantain', 'okok-sale'].includes(d.id)
  );

  const alternativeDishes = dishes.filter(d =>
    ['ndole-royal', 'demi-poulet-braise', 'poisson-braise', 'samantha-burger', 'moelleux-chocolat', 'jus-bissap'].includes(d.id)
  );

  const handleAddActiveDishToCart = () => {
    addToCart(activeDish, activeDishQty, activeDish.options?.[0]);
    setIsCartDrawerOpen(true);
    showToast(`${activeDishQty}x ${activeDish.name} ajouté au panier !`);
  };

  const handlePreorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preorderName || !preorderPhone) {
      showToast("Veuillez remplir votre nom et numéro de téléphone");
      return;
    }

    const message =
      `*PRÉ-COMMANDE DÉJEUNER — SAMANTHA FOOD*\n\n` +
      `*Client / Entreprise :* ${preorderName}\n` +
      `*Téléphone WhatsApp :* +237 ${preorderPhone}\n` +
      `*Quartier Douala :* ${preorderQuartier}\n` +
      `*Plat réservé :* ${preorderDish}\n` +
      `*Nombre de portions :* ${preorderPortions}\n` +
      `*Créneau souhaité :* ${preorderTime}\n` +
      (preorderNotes ? `*Précisions cuisine :* ${preorderNotes}\n` : '') +
      `\nMerci de me confirmer la réservation et le calcul du montant total avec livraison.`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/237694920228?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Pré-commande transmise sur WhatsApp !");
  };

  return (
    <div className="w-full flex flex-col pt-20">
      {/* Top Notice Bar */}
      <div className="w-full bg-[#BC000C] text-white px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#F5B301] animate-ping" />
            <span className="tracking-wide uppercase font-black">{siteConfig.serviceHoursNotice}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">moped</span>
              Livraison rapide Douala
            </span>
            <a
              href={`https://wa.me/${siteConfig.whatsappPrimary.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(siteConfig.restaurantName)},%20je%20souhaite%20commander%20le%20menu%20du%20jour`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-white text-[#BC000C] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#F0EDED] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Flash WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Spotlight Section */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Dimanche Casier / Special Event Banner (Customizable by Manager) */}
        {siteConfig.specialEventBanner.enabled && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1C1B1B] via-[#2A1810] to-[#1C1B1B] text-white border-2 border-[#F5B301] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#BC000C] text-[#F5B301] flex flex-col items-center justify-center font-black shrink-0 border-2 border-[#F5B301] shadow-md">
                <span className="text-[10px] tracking-wider uppercase text-white font-extrabold">Spécial</span>
                <span className="text-sm font-extrabold">EVENT</span>
                <span className="text-[10px] text-[#F5B301]">DOUALA</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#BC000C] text-white text-[11px] font-black uppercase tracking-wider">
                    {siteConfig.specialEventBanner.badgeText || 'Événement Officiel'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5B301] text-[#654800] text-[11px] font-black uppercase">
                    {siteConfig.specialEventBanner.location}
                  </span>
                  <span className="text-xs text-[#E5E2E1] font-semibold">{siteConfig.specialEventBanner.date}</span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F5B301] tracking-tight mt-1">
                  {siteConfig.specialEventBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E5E2E1] max-w-xl mt-0.5">
                  {siteConfig.specialEventBanner.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 z-10 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedDayKey('dimanche');
                  setActiveDishQty(1);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className="flex-1 md:flex-none py-3 px-5 rounded-2xl bg-[#F5B301] text-[#654800] font-display font-black text-xs sm:text-sm hover:brightness-105 active:scale-98 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Voir Menu de Demain</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const dish = dishes.find(d => d.id === 'bouillon-patte-boeuf') || dishes[0];
                  addToCart(dish, 1, 'Formule Table Dimanche Casier (+9.500 FCFA)');
                  setIsCartDrawerOpen(true);
                }}
                className="flex-1 md:flex-none py-3 px-4 rounded-2xl bg-[#BC000C] text-white font-display font-bold text-xs sm:text-sm hover:bg-[#930007] transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>{siteConfig.specialEventBanner.buttonText || 'Réserver ma part'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Header Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFDAD5] text-[#BC000C] text-xs uppercase font-extrabold tracking-wider mb-2">
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              <span>Spécialités & Menus du Jour</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#1C1B1B] tracking-tight leading-tight">
              Le Menu du Jour — <span className="text-[#BC000C]">{activeDay.label} {activeDay.dateStr || ''} 2026</span>
            </h1>
            <p className="text-sm sm:text-base text-[#504533] mt-2">
              Chaque jour, découvrez notre plat vedette traditionnel à tarif préférentiel (1.000 FCFA & 1.500 FCFA), cuisiné frais chaque matin par la Cheffe Samantha.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F6F3F2] border border-[#E5E2E1] shadow-xs shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#F5B301] text-[#654800] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[28px]">sports_motorsports</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#BC000C] font-black">Livraison Tout Douala</span>
              <span className="font-display font-bold text-sm text-[#1C1B1B]">Frais à la charge du client</span>
              <span className="text-[11px] text-[#827560]">Akwa, Bonanjo, Bonapriso, Makèpè, Denver...</span>
            </div>
          </div>
        </div>

        {/* Quick Day Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <span className="text-xs font-black text-[#504533] uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#BC000C]">calendar_month</span>
            Choisir le Jour :
          </span>
          {WEEK_MENU.map((item) => {
            const isSelected = item.key === selectedDayKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setSelectedDayKey(item.key);
                  setActiveDishQty(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#BC000C] text-white shadow-md scale-102 ring-2 ring-[#BC000C]/20'
                    : 'bg-white text-[#504533] hover:bg-[#F0EDED] border border-[#E5E2E1]'
                }`}
              >
                <span>{item.label}</span>
                {item.dateStr && (
                  <span className={`text-[11px] font-normal ${isSelected ? 'text-white/80' : 'text-[#827560]'}`}>
                    ({item.dateStr.split(' ')[0]})
                  </span>
                )}
                {item.isToday && (
                  <span className="px-1.5 py-0.5 rounded bg-[#F5B301] text-[#654800] text-[9px] font-black uppercase">
                    Aujourd'hui
                  </span>
                )}
                <span className={`font-black ml-1 ${isSelected ? 'text-[#FFDEA5]' : 'text-[#BC000C]'}`}>
                  {item.price.toLocaleString('fr-FR')} F
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Card (Dynamic to activeDay) */}
        <div className="relative rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E2E1] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual with Price Stamp */}
            <div className="lg:col-span-7 relative group">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F0EDED] shadow-md relative">
                <img
                  src={activeDish.image}
                  alt={activeDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => setActiveModalDish(activeDish)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#1C1B1B] text-xs font-bold shadow-md">
                  <span className="material-symbols-outlined text-[#BC000C] text-[18px]">local_fire_department</span>
                  <span>{activeDish.origin || 'Terroir & Fraîcheur du Jour'}</span>
                </div>
              </div>

              {/* Bold Price Stamp */}
              <div className="absolute -top-3 -right-2 sm:top-4 sm:right-4 z-10 flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#F5B301] text-[#654800] shadow-2xl transform rotate-6 border-4 border-white hover:rotate-0 transition-transform">
                <span className="text-[10px] uppercase tracking-widest font-black">
                  {activeDay.isToday ? "Aujourd'hui" : "Menu du Jour"}
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black leading-none text-[#BC000C] mt-0.5">
                  {activeDay.price.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs font-extrabold">FCFA</span>
              </div>
            </div>

            {/* Details & Interactive Control */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#BC000C] text-white text-xs font-bold uppercase tracking-wider">
                  Plat Vedette — {activeDay.label} {activeDay.dateStr || ''}
                </span>
                <span className="px-3 py-1 rounded-md bg-[#A3F69C] text-[#005312] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">eco</span>
                  100% Cuisiné Frais
                </span>
              </div>

              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight leading-tight">
                  {activeDish.name}
                </h2>
                <p className="font-display font-bold text-sm sm:text-base text-[#7B5800] mt-1">
                  {activeDay.desc}
                </p>
              </div>

              {/* Recipe Composition */}
              <div className="rounded-2xl bg-[#F6F3F2] p-4 border border-[#E5E2E1] flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1C1B1B] flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[#7B5800] text-[18px]">soup_kitchen</span>
                  Secrets de Préparation Samantha Food :
                </span>
                <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
                  {activeDish.description}
                </p>
                {activeDish.ingredients && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeDish.ingredients.map((ing, i) => (
                      <span key={i} className="bg-white border border-[#E5E2E1] px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#504533]">
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-[#F0EDED] p-1 shadow-inner shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveDishQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-lg bg-white text-[#1C1B1B] font-bold text-base hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-base text-[#1C1B1B]">{activeDishQty}</span>
                    <button
                      type="button"
                      onClick={() => setActiveDishQty(q => q + 1)}
                      className="w-10 h-10 rounded-lg bg-white text-[#1C1B1B] font-bold text-base hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddActiveDishToCart}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#BC000C] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#930007] active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    <span>Ajouter ({(activeDishQty * activeDay.price).toLocaleString('fr-FR')} FCFA)</span>
                  </button>
                </div>

                <a
                  href={`https://wa.me/237694920228?text=${encodeURIComponent(
                    `Bonjour Samantha Food, je souhaite commander ${activeDishQty}x portion(s) de *${activeDish.name}* (${(
                      activeDishQty * activeDay.price
                    ).toLocaleString('fr-FR')} FCFA) pour livraison à Douala.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#1B6D24] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#14531b] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Commander direct WhatsApp (694-92-02-28 / 672-55-58-64)</span>
                </a>

                <div className="flex items-center justify-between text-[11px] text-[#827560] px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">check_circle</span>
                    Emballage hermétique anti-fuite
                  </span>
                  <span>Livraison express à domicile ou bureau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FLYERS OFFICIELS SAMANTHA FOOD - RECURRENT DAILY SPECIALS */}
      {/* ======================================================== */}
      <section className="w-full bg-[#F6F3F2] py-14 border-y border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#BC000C] font-black block mb-1">
                Flyers & Menus Officiels
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
                Les 4 Incontournables de Samantha Food (1.000 - 1.500 FCFA)
              </h2>
              <p className="text-xs sm:text-sm text-[#504533] mt-1 max-w-2xl">
                Ces formules publiées sur nos flyers WhatsApp régalent les professionnels et familles de Douala tous les midis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#504533] font-bold">Service garanti :</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E5E2E1] text-xs font-bold text-[#1C1B1B]">
                11h30 - 20h30
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flyerDishes.map((dish) => {
              return (
                <div
                  key={dish.id}
                  className="rounded-3xl bg-white border border-[#E5E2E1] shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0EDED]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setActiveModalDish(dish)}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1C1B1B]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                      {dish.tag || 'Menu du Jour'}
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#F5B301] text-[#654800] font-display font-black text-sm shadow-md">
                      {dish.price.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h3
                        onClick={() => setActiveModalDish(dish)}
                        className="font-display font-bold text-base text-[#1C1B1B] hover:text-[#BC000C] cursor-pointer transition-colors line-clamp-1"
                      >
                        {dish.name}
                      </h3>
                      <p className="text-xs text-[#504533] mt-1 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E2E1]">
                      <div className="flex items-center justify-between text-[11px] text-[#827560]">
                        <span>{dish.prepTime}</span>
                        <span className="font-semibold text-[#1C1B1B]">{dish.origin}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(dish, 1, dish.options?.[0]);
                            setIsCartDrawerOpen(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#BC000C] text-white text-xs font-bold hover:bg-[#930007] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          <span>Commander</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModalDish(dish)}
                          className="p-2 rounded-xl bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#E5E2E1] transition-colors"
                          title="Détails & Ingrédients"
                        >
                          <span className="material-symbols-outlined text-[18px]">info</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alternative Daily Specials */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#7B5800] font-black block mb-1">
              Variété Gourmande
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
              Nos Autres Spécialités Disponibles Aujourd'hui
            </h2>
            <p className="text-xs sm:text-sm text-[#504533] mt-1">
              Envie de grillades, d'un burger artisanal ou d'un Ndolè royal ? Tous nos plats sont préparés à la commande.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternativeDishes.map((dish) => (
            <div
              key={dish.id}
              className="rounded-2xl bg-white border border-[#E5E2E1] p-4 flex gap-4 items-center shadow-xs hover:shadow-md transition-shadow group"
            >
              <div
                className="w-24 h-24 rounded-xl overflow-hidden bg-[#F0EDED] shrink-0 cursor-pointer"
                onClick={() => setActiveModalDish(dish)}
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 h-full py-0.5">
                <div>
                  <span className="text-[10px] font-bold text-[#827560] uppercase tracking-wide">
                    {dish.categoryLabel}
                  </span>
                  <h3
                    onClick={() => setActiveModalDish(dish)}
                    className="font-display font-bold text-sm text-[#1C1B1B] line-clamp-1 hover:text-[#BC000C] cursor-pointer transition-colors"
                  >
                    {dish.name}
                  </h3>
                  <span className="font-display font-extrabold text-sm text-[#BC000C] mt-0.5 block">
                    {dish.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(dish, 1);
                      setIsCartDrawerOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#BC000C] text-white text-xs font-bold hover:bg-[#930007] transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Ajouter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalDish(dish)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F0EDED] text-[#1C1B1B] text-xs font-medium hover:bg-[#E5E2E1] transition-colors"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* PRE-ORDER FORM FOR UPCOMING DAYS          */}
      {/* ========================================= */}
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pre-order Form */}
          <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E2E1] shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7B5800]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#7B5800]">
                Pré-commandes Entreprises & Domiciles
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
              Réservez votre Déjeuner ou Repas de Groupe
            </h2>
            <p className="text-xs sm:text-sm text-[#504533] mt-1 mb-6">
              Évitez les ruptures de stock à l'heure de pointe ! Commandez vos barquettes pour votre équipe ou votre famille, livraison ponctuelle à l'heure convenue à Douala.
            </p>

            <form onSubmit={handlePreorderSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-name">
                    Nom complet ou Entreprise *
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3.5 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">badge</span>
                    <input
                      id="preorder-name"
                      type="text"
                      value={preorderName}
                      onChange={(e) => setPreorderName(e.target.value)}
                      placeholder="Ex: Cabinet Me Kamga / Sarah M."
                      required
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-phone">
                    Numéro WhatsApp ou Téléphone *
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3.5 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">call</span>
                    <input
                      id="preorder-phone"
                      type="tel"
                      value={preorderPhone}
                      onChange={(e) => setPreorderPhone(e.target.value)}
                      placeholder="Ex: 694-92-02-28"
                      required
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-quartier">
                    Quartier de Livraison (Douala) *
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">location_city</span>
                    <select
                      id="preorder-quartier"
                      value={preorderQuartier}
                      onChange={(e) => setPreorderQuartier(e.target.value)}
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] focus:outline-none cursor-pointer"
                    >
                      {QUARTIERS.map((q) => (
                        <option key={q.id} value={q.name}>
                          {q.name} ({q.fee.toLocaleString('fr-FR')} FCFA)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-dish">
                    Choix du Menu / Plat *
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">flatware</span>
                    <select
                      id="preorder-dish"
                      value={preorderDish}
                      onChange={(e) => setPreorderDish(e.target.value)}
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] focus:outline-none cursor-pointer"
                    >
                      <option value="Bouillon Patte de Bœuf — Dimanche Casier (2.500 FCFA)">Bouillon Patte de Bœuf — Dimanche Casier (2.500 FCFA) [Demain]</option>
                      <option value="Dimanche Casier : Casier complet de bières fraîches (9.500 FCFA)">Dimanche Casier : Casier complet de bières (9.500 FCFA) [PK17]</option>
                      <option value="Bière fraîche unité Dimanche Casier (800 FCFA)">Bière fraîche unité Dimanche Casier (800 FCFA)</option>
                      <option value="Haricots Blancs + Plantain Mûr + Poulet (1.500 FCFA)">Haricots Blancs + Plantain Mûr + Poulet (1.500 FCFA)</option>
                      <option value="Pomme Sautée + Poulet Doré (1.000 FCFA)">Pomme Sautée + Poulet Doré (1.000 FCFA)</option>
                      <option value="Poulet Rôti Épicé + Plantain (1.000 FCFA)">Poulet Rôti Épicé + Plantain (1.000 FCFA)</option>
                      <option value="Okok Salé & Bâtons de Manioc (1.500 FCFA)">Okok Salé & Bâtons de Manioc (1.500 FCFA)</option>
                      <option value="Ndolè Royal Crevettes & Viande (3.500 FCFA)">Ndolè Royal Crevettes & Viande (3.500 FCFA)</option>
                      <option value="Poisson Bar Braisé & Alloco (4.000 FCFA)">Poisson Bar Braisé & Alloco (4.000 FCFA)</option>
                      <option value="Pack Entreprise Déjeuner (Dès 5 plats)">Pack Entreprise Déjeuner (Dès 5 plats)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-portions">
                    Nombre de Repas / Portions
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3.5 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">group</span>
                    <input
                      id="preorder-portions"
                      type="number"
                      min={1}
                      max={50}
                      value={preorderPortions}
                      onChange={(e) => setPreorderPortions(parseInt(e.target.value) || 1)}
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-time">
                    Créneau de Livraison Souhaité
                  </label>
                  <div className="flex items-center rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3 py-2.5">
                    <span className="material-symbols-outlined text-[#827560] text-[20px] mr-2">schedule</span>
                    <select
                      id="preorder-time"
                      value={preorderTime}
                      onChange={(e) => setPreorderTime(e.target.value)}
                      className="bg-transparent w-full text-xs sm:text-sm text-[#1C1B1B] focus:outline-none cursor-pointer"
                    >
                      <option value="11h45 - 12h15 (Pause de midi)">11h45 - 12h15 (Pause de midi)</option>
                      <option value="12h30 - 13h00 (Déjeuner équipe)">12h30 - 13h00 (Déjeuner équipe)</option>
                      <option value="13h30 - 14h00 (Service décalé)">13h30 - 14h00 (Service décalé)</option>
                      <option value="18h30 - 19h30 (Dîner à domicile)">18h30 - 19h30 (Dîner à domicile)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1.5" htmlFor="preorder-notes">
                  Instructions Spéciales ou Précisions de Livraison
                </label>
                <textarea
                  id="preorder-notes"
                  rows={2}
                  value={preorderNotes}
                  onChange={(e) => setPreorderNotes(e.target.value)}
                  placeholder="Ex: Sans piment pour 2 barquettes, livrer au 3ème étage immeuble rose..."
                  className="w-full rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] px-3.5 py-2.5 text-xs sm:text-sm text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#1B6D24] text-white font-bold text-sm shadow-md hover:bg-[#14531b] active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Valider ma Pré-commande via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Advantages info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-3xl bg-[#FFDAD5] p-6 text-[#930007] border border-[#FFB4AB]">
              <div className="flex items-center gap-2 mb-2 font-display font-bold text-lg">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <span>Pourquoi Pré-commander chez Samantha Food ?</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm leading-relaxed mt-3">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#BC000C] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Priorité Cuisine :</strong> Vos barquettes sont emballées les premières dès 11h20.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#BC000C] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Ponctualité Douala :</strong> Livreurs dédiés assignés par zone pour éviter les bouchons de midi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#BC000C] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Facture Entreprise :</strong> Possibilité de facturation mensuelle pour les déjeuners de direction.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-[#E5E2E1] shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5B301] text-[#654800] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[30px]">support_agent</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#827560] uppercase">Besoin d'aide immédiate ?</span>
                <h4 className="font-display font-bold text-base text-[#1C1B1B]">Standard Téléphonique Samantha</h4>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-bold text-[#BC000C]">
                  <a href="tel:+237694920228" className="hover:underline">694 92 02 28</a>
                  <span>•</span>
                  <a href="tel:+237672555864" className="hover:underline">672 55 58 64</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
