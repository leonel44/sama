import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { DISHES } from '../data/dishes';
import { QUARTIERS } from '../data/quartiers';
import { Dish } from '../types';

export const FullMenuView: React.FC = () => {
  const {
    items,
    addToCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    grandTotal,
    selectedQuartier,
    setSelectedQuartier,
    sendWhatsAppOrder,
    setActiveModalDish,
    setIsCartDrawerOpen,
    setCurrentView,
    showToast,
    dishes
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filters definition
  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'menudujour', label: '🔥 Menus du Jour (1.000 - 1.500 F)' },
    { key: 'terroir', label: 'Plats du terroir' },
    { key: 'occidentale', label: 'Cuisine occidentale' },
    { key: 'grillades', label: 'Grillades' },
    { key: 'halal', label: 'Halal friendly' },
    { key: 'vege', label: 'Végétarien' },
    { key: 'dessert', label: 'Boissons & Pâtisseries' },
  ];

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch =
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dish.origin && dish.origin.toLowerCase().includes(searchTerm.toLowerCase()));

      const isFlyerDish = [
        'bouillon-patte-boeuf',
        'casier-bieres',
        'biere-fraiche',
        'haricots-blancs-plantain-poulet',
        'pomme-sautee-poulet',
        'poulet-roti-plantain',
        'okok-sale'
      ].includes(dish.id);

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'menudujour' && isFlyerDish) ||
        (dish.diet && dish.diet.includes(activeFilter as any)) ||
        dish.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  // Group filtered dishes into categories
  const categories = [
    {
      id: 'menus-du-jour-officiels',
      title: '⭐ Menus du Jour & Formules Flyers (Dès 800 FCFA)',
      subtitle: 'Les Incontournables de la Semaine & Dimanche Casier',
      desc: 'Nos spécialités quotidiennes publiées sur WhatsApp : Dimanche Casier (Bouillon Patte de Bœuf & Casier de bières à PK17), Haricots Blancs + Plantain + Poulet, Poulet Rôti + Plantain, Pomme Sautée + Poulet et Okok Salé.',
      items: filteredDishes.filter((d) =>
        ['bouillon-patte-boeuf', 'casier-bieres', 'biere-fraiche', 'haricots-blancs-plantain-poulet', 'pomme-sautee-poulet', 'poulet-roti-plantain', 'okok-sale'].includes(d.id)
      ),
    },
    {
      id: 'specialites-africaines',
      title: '1. Spécialités Africaines & Camerounaises',
      subtitle: 'Trésors du Terroir',
      desc: 'Nos recettes ancestrales mijotées lentement selon les secrets des mamans de Douala.',
      items: filteredDishes.filter((d) => d.category === 'terroir' && !['bouillon-patte-boeuf', 'haricots-blancs-plantain-poulet', 'pomme-sautee-poulet', 'okok-sale'].includes(d.id)),
    },
    {
      id: 'cuisine-internationale',
      title: '2. Cuisine Internationale & Européenne',
      subtitle: 'Inspirations du Globe',
      desc: 'Délices raffinés de bistrots parisiens, trattorias italiennes et woks asiatiques.',
      items: filteredDishes.filter((d) => d.category === 'occidentale'),
    },
    {
      id: 'fast-gourmet',
      title: '3. Fast Gourmet & Street Food',
      subtitle: 'Plaisirs Minute',
      desc: 'Burgers moelleux faits maison, club sandwiches généreux et pizzas croustillantes au feu de bois.',
      items: filteredDishes.filter((d) => d.category === 'grillades'),
    },
    {
      id: 'accompagnements',
      title: '4. Accompagnements au Choix',
      subtitle: 'Compléments Essentiels',
      desc: 'Personnalisez votre assiette avec vos féculents favoris frais du jour.',
      items: filteredDishes.filter((d) => d.category === 'accompagnements'),
    },
    {
      id: 'boissons-patisseries',
      title: '5. Boissons Locales Fraîches & Pâtisseries',
      subtitle: 'Douceurs & Rafraîchissements',
      desc: 'Jus 100% naturels pressés sans conservateur et douceurs sucrées de fin de repas.',
      items: filteredDishes.filter((d) => d.category === 'dessert'),
    },
  ];

  const handleMomoPrompt = (provider: string) => {
    if (items.length === 0) {
      showToast("Veuillez sélectionner au moins un plat d'abord.");
      return;
    }
    showToast(`Numéro récepteur ${provider} : +237 694-92-02-28. Envoi de la commande sur WhatsApp...`);
    sendWhatsAppOrder({ paymentMethod: provider });
  };

  return (
    <div className="w-full flex flex-col pt-20">
      {/* Top Banner Notice */}
      <div className="w-full bg-[#BC000C] text-white px-4 sm:px-6 py-2.5">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">moped</span>
            <span className="font-bold uppercase tracking-wider">Livraison Douala Express</span>
            <span className="opacity-80 hidden md:inline">
              — Akwa, Bonanjo, Bonapriso, Makèpè, Denver, Deido (Frais à la charge du client)
            </span>
          </div>
          <a
            href="https://wa.me/237694920228"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1B6D24] text-white font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[14px]">call</span>
            <span>WhatsApp Hotline : 694-92-02-28</span>
          </a>
        </div>
      </div>

      {/* Header & Live Search */}
      <section className="w-full bg-[#F6F3F2] px-4 sm:px-6 py-10 lg:py-14 border-b border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5B301] text-[#654800] text-xs uppercase tracking-wider font-black w-fit shadow-xs">
                <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
                <span>Restauration Gourmande & Traiteur d'Élite</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1C1B1B] tracking-tight leading-tight">
                Notre Carte Gourmande : <span className="text-[#BC000C]">Saveurs Locales</span> & Plats du Monde
              </h1>
              <p className="text-sm sm:text-base text-[#504533]">
                Cuisine camerounaise authentique préparée à la commande, grillades braisées fumantes, burgers généreux et assiettes internationales raffinées pour vos déjeuners et dîners à Douala.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E2E1] shadow-xs flex items-center gap-3.5 shrink-0 self-start md:self-auto">
              <div className="w-12 h-12 rounded-full bg-[#F5B301] flex items-center justify-center text-[#654800]">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-[#1C1B1B]">100% Frais du Marché</span>
                <span className="text-[11px] text-[#827560]">Cuisiné le matin même avec passion</span>
              </div>
            </div>
          </div>

          {/* Search & Dietary Chips */}
          <div className="flex flex-col gap-3.5 bg-white p-4 sm:p-6 rounded-2xl border border-[#E5E2E1] shadow-md">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-4 text-[#827560] text-[22px]">
                search
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un plat (ex: Okok, Burger, Pâtes, Ndolè, Poulet braisé, Saumon...)"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#F6F3F2] text-sm text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none focus:ring-2 focus:ring-[#F5B301] transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 text-[#827560] hover:text-[#1C1B1B]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-[#827560] uppercase tracking-wider mr-1">
                Filtres rapides :
              </span>
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeFilter === f.key
                      ? 'bg-[#1C1B1B] text-white shadow-sm'
                      : 'bg-[#F0EDED] text-[#504533] hover:bg-[#E5E2E1]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation Sub-categories */}
      <nav className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2E1] px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="px-3.5 py-1.5 rounded-full bg-[#F0EDED] hover:bg-[#BC000C] hover:text-white text-[#504533] text-xs font-bold whitespace-nowrap transition-colors"
              >
                {c.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5B301] text-[#654800] text-xs font-extrabold shadow-xs hover:brightness-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>Voir panier ({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </nav>

      {/* Layout Content: Dishes & Sticky Desktop Cart Panel */}
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-10 flex flex-col xl:flex-row gap-8 items-start relative">
        {/* Main Dishes Column */}
        <div className="flex-1 w-full flex flex-col gap-14 min-w-0">
          {categories.map((cat) => {
            if (cat.items.length === 0) return null;
            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-36 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 pb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-5 rounded-full bg-[#BC000C]" />
                      <span className="text-[11px] text-[#BC000C] uppercase font-bold tracking-widest">
                        {cat.subtitle}
                      </span>
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl text-[#1C1B1B] mt-1">
                      {cat.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#504533]">{cat.desc}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#F0EDED] font-bold text-[#504533] w-fit">
                    {cat.items.length} {cat.items.length > 1 ? 'Créations' : 'Création'}
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cat.items.map((dish) => (
                    <div
                      key={dish.id}
                      className={`relative flex flex-col bg-white rounded-2xl border border-[#E5E2E1] shadow-xs hover:shadow-lg transition-all group overflow-hidden ${
                        dish.id === 'poisson-braise' ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div
                        className={`relative w-full overflow-hidden bg-[#F0EDED] ${
                          dish.id === 'poisson-braise' ? 'h-64' : 'h-52'
                        }`}
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => setActiveModalDish(dish)}
                          referrerPolicy="no-referrer"
                        />
                        {dish.tag && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#BC000C] text-white text-[11px] font-bold shadow-md">
                            {dish.tag}
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-xl bg-[#F5B301] text-[#654800] font-display font-black text-base shadow-lg">
                          {dish.price.toLocaleString('fr-FR')}{' '}
                          <span className="text-xs font-bold">FCFA</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          {dish.origin && (
                            <span className="text-[10px] font-bold text-[#BC000C] uppercase tracking-wider block mb-1">
                              {dish.origin}
                            </span>
                          )}
                          <h3
                            onClick={() => setActiveModalDish(dish)}
                            className="font-display font-bold text-base sm:text-lg text-[#1C1B1B] hover:text-[#BC000C] cursor-pointer transition-colors leading-snug"
                          >
                            {dish.name}
                          </h3>
                          <p className="text-xs text-[#504533] mt-1.5 leading-relaxed line-clamp-3">
                            {dish.description}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E5E2E1]">
                          <span className="text-[11px] text-[#827560] font-medium">
                            {dish.portionInfo || 'Portion 1 pers.'}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(dish, 1)}
                            className="px-4 py-2 rounded-full bg-[#BC000C] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#930007] active:scale-95 shadow-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                            <span>Ajouter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {filteredDishes.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-[#827560]">search_off</span>
              <h3 className="font-display font-bold text-xl text-[#1C1B1B]">Aucun plat trouvé</h3>
              <p className="text-sm text-[#504533]">
                Essayez d'autres mots-clés ou réinitialisez vos filtres rapides.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#F5B301] text-[#654800] text-xs font-bold"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>

        {/* Desktop Sticky Order Summary Panel */}
        <aside className="hidden xl:flex flex-col w-[360px] shrink-0 sticky top-36 bg-white rounded-3xl border border-[#E5E2E1] shadow-xl overflow-hidden self-start">
          <div className="p-4 bg-[#1C1B1B] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F5B301] text-[22px]">shopping_basket</span>
              <span className="font-display font-bold text-base">Votre Commande</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5B301] text-[#654800] text-xs font-black">
              {items.reduce((s, i) => s + i.quantity, 0)} plats
            </span>
          </div>

          <div className="p-4 flex flex-col gap-2 max-h-[300px] overflow-y-auto divide-y divide-[#E5E2E1]">
            {items.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center gap-2 text-[#504533]">
                <span className="material-symbols-outlined text-[36px] opacity-40">receipt_long</span>
                <p className="font-display font-bold text-sm text-[#1C1B1B]">Panier vide</p>
                <p className="text-xs text-[#827560] max-w-[200px]">
                  Sélectionnez vos plats ci-contre pour débuter votre commande.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-[#1C1B1B] truncate">{item.dish.name}</span>
                    <span className="text-[11px] text-[#BC000C] font-extrabold">
                      {(item.dish.price * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded bg-[#F0EDED] text-[#1C1B1B] font-bold text-xs flex items-center justify-center hover:bg-[#BC000C] hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 rounded bg-[#F0EDED] text-[#1C1B1B] font-bold text-xs flex items-center justify-center hover:bg-[#F5B301] hover:text-[#654800]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* District selector */}
          <div className="px-4 py-2.5 bg-[#F6F3F2] border-t border-[#E5E2E1] flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#1C1B1B] flex items-center gap-1" htmlFor="aside-district-select">
              <span className="material-symbols-outlined text-[15px] text-[#BC000C]">location_on</span>
              <span>Lieu de livraison à Douala :</span>
            </label>
            <div className="relative">
              <select
                id="aside-district-select"
                value={selectedQuartier.id}
                onChange={(e) => {
                  const found = QUARTIERS.find((q) => q.id === e.target.value);
                  if (found) setSelectedQuartier(found);
                }}
                className="w-full text-xs font-semibold bg-white text-[#1C1B1B] rounded-lg px-2.5 py-1.5 pr-6 border border-[#E5E2E1] appearance-none focus:outline-none cursor-pointer"
              >
                {QUARTIERS.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.fee.toLocaleString('fr-FR')} FCFA)
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[#827560] pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[16px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="p-4 bg-white border-t border-[#E5E2E1] flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-[#504533]">
              <span>Sous-total repas :</span>
              <span className="font-bold text-[#1C1B1B]">{subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#504533]">
              <span>Livraison coursier :</span>
              <span className="font-bold text-[#1C1B1B]">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="pt-2 border-t border-[#E5E2E1] flex justify-between items-center text-sm font-bold">
              <span>Total à régler :</span>
              <span className="font-display font-black text-base text-[#BC000C]">
                {grandTotal.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => sendWhatsAppOrder()}
                className="w-full py-3 rounded-xl bg-[#1B6D24] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-[#14531b] shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Commander via WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleMomoPrompt('MTN MoMo')}
                  className="py-1.5 rounded-lg bg-[#FFCC00] text-black font-extrabold text-[11px] hover:brightness-95"
                >
                  MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => handleMomoPrompt('Orange Money')}
                  className="py-1.5 rounded-lg bg-[#FF7900] text-white font-extrabold text-[11px] hover:brightness-95"
                >
                  Orange Money
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('commander');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] text-[#504533] hover:text-[#1C1B1B] font-semibold text-center py-1 underline"
              >
                Accéder au formulaire de finalisation détaillé
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Floating Order Bar */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="p-3 rounded-2xl bg-[#1C1B1B] text-white shadow-2xl flex items-center justify-between gap-3 border border-white/10">
          <div
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#F5B301] text-[#654800] shrink-0 font-bold">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-[#BC000C] text-white text-[10px] font-black">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-sm text-white leading-tight">
                {grandTotal.toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-[10px] text-white/70">Douala • Livraison directe</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/15 text-white hover:bg-white/25 text-xs font-bold"
            >
              Panier
            </button>
            <button
              type="button"
              onClick={() => sendWhatsAppOrder()}
              className="px-4 py-2 rounded-xl bg-[#BC000C] text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Commander</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
