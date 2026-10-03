import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Dish, Quartier, DayMenu } from '../types';

export const AdminView: React.FC = () => {
  const {
    dishes,
    todaySpecialId,
    tomorrowSpecialId,
    setTodaySpecialId,
    setTomorrowSpecialId,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    weekMenu,
    updateWeekDayMenu,
    quartiers,
    updateQuartier,
    addQuartier,
    deleteQuartier,
    siteConfig,
    updateSiteConfig,
    resetSiteConfig,
    resetMenuToDefaults,
    setCurrentView,
    showToast,
    isAdminAuthenticated,
    verifyAdminPin,
    setAdminPin,
    logoutAdmin
  } = useCart();

  // Authentication State
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Tabs: 'today-tomorrow' | 'add-dish' | 'manage-dishes' | 'site-settings' | 'quartiers' | 'broadcast'
  const [activeTab, setActiveTab] = useState<
    'today-tomorrow' | 'add-dish' | 'manage-dishes' | 'site-settings' | 'quartiers' | 'broadcast'
  >('today-tomorrow');

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('1500');
  const [newDishCategory, setNewDishCategory] = useState<'terroir' | 'grillades' | 'occidentale' | 'dessert'>('terroir');
  const [newDishTag, setNewDishTag] = useState('Menu du Jour');
  const [newDishSide, setNewDishSide] = useState('Bâtons de manioc / Plantain mûr');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('');
  const [setAsTodaySpecial, setSetAsTodaySpecial] = useState(true);
  const [setAsTomorrowSpecial, setSetAsTomorrowSpecial] = useState(false);

  // Editing Dish Modal State
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishPrice, setEditDishPrice] = useState('');
  const [editDishDesc, setEditDishDesc] = useState('');
  const [editDishSide, setEditDishSide] = useState('');
  const [editDishCategory, setEditDishCategory] = useState<'terroir' | 'occidentale' | 'grillades' | 'accompagnements' | 'dessert'>('terroir');
  const [editDishTag, setEditDishTag] = useState('');
  const [editDishImage, setEditDishImage] = useState('');
  const [editDishPrepTime, setEditDishPrepTime] = useState('');

  // Editing Day Menu Modal State
  const [editingDay, setEditingDay] = useState<DayMenu | null>(null);
  const [editDayDishName, setEditDayDishName] = useState('');
  const [editDaySubtitle, setEditDaySubtitle] = useState('');
  const [editDaySide, setEditDaySide] = useState('');
  const [editDayPrice, setEditDayPrice] = useState('');
  const [editDayDesc, setEditDayDesc] = useState('');
  const [editDayTime, setEditDayTime] = useState('');

  // Site Settings Form State
  const [siteForm, setSiteForm] = useState(siteConfig);

  // Quartiers Management State
  const [newQuartierName, setNewQuartierName] = useState('');
  const [newQuartierDetails, setNewQuartierDetails] = useState('');
  const [newQuartierFee, setNewQuartierFee] = useState('1500');
  const [newQuartierTime, setNewQuartierTime] = useState('30-45 min');
  const [editingQuartier, setEditingQuartier] = useState<Quartier | null>(null);

  // Change PIN State
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');

  // Search filter for all dishes
  const [dishSearch, setDishSearch] = useState('');

  // Preset image suggestions for fast creation
  const presetImages = [
    { label: 'Haricots Blancs & Poulet', url: dishes.find(d => d.id === 'haricots-blancs-plantain-poulet')?.image || '' },
    { label: 'Bouillon Patte de Bœuf', url: dishes.find(d => d.id === 'bouillon-patte-boeuf')?.image || '' },
    { label: 'Pommes Sautées & Poulet', url: dishes.find(d => d.id === 'pomme-sautee-poulet')?.image || '' },
    { label: 'Poulet Rôti & Dodo', url: dishes.find(d => d.id === 'poulet-roti-plantain')?.image || '' },
    { label: 'Okok Salé Terroir', url: dishes.find(d => d.id === 'okok-sale')?.image || '' },
    { label: 'Ndolè Crevettes', url: dishes.find(d => d.id === 'ndole-royal')?.image || '' },
    { label: 'Poisson Braisé Bar', url: dishes.find(d => d.id === 'poisson-braise')?.image || '' },
    { label: 'Burger Gourmet', url: dishes.find(d => d.id === 'samantha-burger')?.image || '' },
  ];

  // 1. PIN Submit
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPin(enteredPin);
    if (success) {
      setPinError(false);
      setFailedAttempts(0);
      showToast("✅ Bienvenue Cheffe Samantha ! Mode gestionnaire activé.");
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      setPinError(true);
      if (nextFail >= 3) {
        showToast("⛔ Trop de tentatives. Redirection vers l'accueil...");
        if (window.location.hash === '#admin') {
          window.history.replaceState(null, '', window.location.pathname);
        }
        setCurrentView('accueil');
      } else {
        showToast(`❌ Code PIN incorrect (${3 - nextFail} essai restant).`);
      }
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setEnteredPin('');
    showToast("Session gestionnaire verrouillée.");
    setCurrentView('accueil');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinValue || newPinValue.length < 4) {
      showToast("Le code PIN doit comporter au moins 4 chiffres");
      return;
    }
    setAdminPin(newPinValue);
    setShowChangePinModal(false);
    setNewPinValue('');
    showToast(`✅ Nouveau code PIN enregistré avec succès !`);
  };

  // Image Upload handler for new dish
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewDishImage(reader.result);
          showToast("Photo du plat chargée avec succès !");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Upload handler for editing dish
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditDishImage(reader.result);
          showToast("Nouvelle photo chargée !");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create dish
  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      showToast("Veuillez entrer le nom du plat");
      return;
    }

    const priceNum = parseInt(newDishPrice.replace(/\D/g, '')) || 1500;
    const dishId = `custom-${Date.now()}`;
    const selectedImg = newDishImage || presetImages[0].url || dishes[0].image;

    const dishToAdd: Dish = {
      id: dishId,
      name: newDishName.trim(),
      price: priceNum,
      category: newDishCategory,
      categoryLabel:
        newDishCategory === 'terroir'
          ? 'Spécialités Africaines'
          : newDishCategory === 'grillades'
          ? 'Grillades & Rôtisserie'
          : newDishCategory === 'dessert'
          ? 'Boissons & Douceurs'
          : 'Cuisine Internationale',
      tag: newDishTag.trim() || 'Menu du Jour',
      tagColor: 'yellow',
      image: selectedImg,
      prepTime: 'Disponible dès 11h30',
      origin: 'Douala Fraîcheur',
      diet: [newDishCategory, 'halal'],
      portionInfo: 'Portion généreuse (Plat du Jour)',
      description: newDishDesc.trim() || `Plat du jour préparé avec amour par Cheffe Samantha. Servi avec ${newDishSide}.`,
      options: [
        newDishSide ? `${newDishSide} (Inclus)` : 'Accompagnement du jour (Inclus)',
        'Supplément Piment de Mbanga',
        'Option grande portion (+500 FCFA)'
      ],
      ingredients: ["Ingrédients frais du marché de Douala", "Épices locales douces"],
      isAvailable: true
    };

    addDish(dishToAdd, setAsTodaySpecial, setAsTomorrowSpecial);
    showToast(`✅ "${newDishName}" ajouté au menu avec succès !`);

    // Reset fields
    setNewDishName('');
    setNewDishDesc('');
    setNewDishImage('');
    setActiveTab('today-tomorrow');
  };

  // Open Edit Dish Modal
  const openEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setEditDishName(dish.name);
    setEditDishPrice(dish.price.toString());
    setEditDishDesc(dish.description);
    setEditDishCategory(dish.category);
    setEditDishTag(dish.tag || '');
    setEditDishImage(dish.image);
    setEditDishPrepTime(dish.prepTime || 'Disponible dès 11h30');
    setEditDishSide((dish.options && dish.options[0]) || '');
  };

  // Save Dish Edit
  const handleSaveDishEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    const priceNum = parseInt(editDishPrice.replace(/\D/g, '')) || editingDish.price;

    const updatedOptions = [...(editingDish.options || [])];
    if (editDishSide) {
      updatedOptions[0] = editDishSide.includes('(') ? editDishSide : `${editDishSide} (Inclus)`;
    }

    updateDish(editingDish.id, {
      name: editDishName.trim(),
      price: priceNum,
      description: editDishDesc.trim(),
      category: editDishCategory,
      tag: editDishTag.trim() || undefined,
      image: editDishImage,
      prepTime: editDishPrepTime.trim(),
      options: updatedOptions
    });

    setEditingDish(null);
    showToast(`✅ "${editDishName}" mis à jour avec succès !`);
  };

  // Open Edit Week Day Menu
  const openEditDay = (day: DayMenu) => {
    setEditingDay(day);
    setEditDayDishName(day.dishName);
    setEditDaySubtitle(day.subtitle);
    setEditDaySide(day.side);
    setEditDayPrice(day.price.toString());
    setEditDayDesc(day.desc);
    setEditDayTime(day.availableTime);
  };

  const handleSaveDayEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDay) return;

    updateWeekDayMenu(editingDay.key, {
      dishName: editDayDishName.trim(),
      subtitle: editDaySubtitle.trim(),
      side: editDaySide.trim(),
      price: parseInt(editDayPrice.replace(/\D/g, '')) || editingDay.price,
      desc: editDayDesc.trim(),
      availableTime: editDayTime.trim()
    });

    setEditingDay(null);
    showToast(`✅ Menu du ${editingDay.label} mis à jour !`);
  };

  // Save Site Settings
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteConfig(siteForm);
    showToast("✅ Paramètres du restaurant enregistrés sur tout le site !");
  };

  // Add Quartier
  const handleAddQuartier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuartierName.trim()) return;

    const newQ: Quartier = {
      id: `q-${Date.now()}`,
      name: newQuartierName.trim(),
      details: newQuartierDetails.trim() || 'Livraison Douala',
      fee: parseInt(newQuartierFee.replace(/\D/g, '')) || 1500,
      time: newQuartierTime.trim() || '35-50 min'
    };

    addQuartier(newQ);
    setNewQuartierName('');
    setNewQuartierDetails('');
    setNewQuartierFee('1500');
    showToast(`✅ Quartier "${newQ.name}" ajouté avec succès !`);
  };

  // Today & Tomorrow items
  const todayDish = dishes.find(d => d.id === todaySpecialId) || dishes[0];
  const tomorrowDish = dishes.find(d => d.id === tomorrowSpecialId) || dishes[1];

  // WhatsApp Broadcast generator
  const handleGenerateWhatsAppAnnouncement = (isTomorrow = false) => {
    const dish = isTomorrow ? tomorrowDish : todayDish;
    const dayLabel = isTomorrow ? "DEMAIN" : "AUJOURD'HUI";

    const announcement =
      `📢 *MENU DU JOUR — ${siteConfig.restaurantName.toUpperCase()}* (${dayLabel})\n` +
      `─────────────────────────\n` +
      `🍲 *Plat Vedette :* *${dish.name.toUpperCase()}*\n` +
      `💰 *Tarif Spécial :* *${dish.price.toLocaleString('fr-FR')} FCFA*\n` +
      (dish.options?.[0] ? `🍚 *Accompagnement :* ${dish.options[0]}\n` : '') +
      `⏱️ *Disponibilité :* Chaud dès 11h30\n` +
      `🛵 *Livraison express :* Partout à Douala (Akwa, Bonanjo, Bonapriso, Makèpè, Deido...)\n` +
      `─────────────────────────\n` +
      `📞 *Commandes & Réservations WhatsApp :*\n` +
      `📲 +${siteConfig.whatsappPrimary} / +${siteConfig.whatsappSecondary}\n\n` +
      `👉 _Commandez vite pour être livré à temps à votre pause déjeuner !_`;

    navigator.clipboard?.writeText(announcement);
    showToast("Texte d'annonce WhatsApp copié dans votre presse-papiers !");

    const encoded = encodeURIComponent(announcement);
    const waUrl = `https://wa.me/?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // 1. LOCKED / PIN AUTHENTICATION GATE
  // ========================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="w-full min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#F6F3F2]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#E5E2E1] flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFDAD5] text-[#BC000C] flex items-center justify-center mb-4 shadow-xs">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-[#BC000C] bg-[#FFDAD5] px-3 py-1 rounded-full mb-2">
            Accès Réservé à la Direction
          </span>

          <h2 className="font-display font-black text-2xl text-[#1C1B1B] tracking-tight">
            Espace Direction
          </h2>

          <p className="text-xs text-[#504533] mt-2 mb-6">
            Cette section est strictement réservée à l'équipe de Samantha Food. Veuillez saisir le code PIN secret pour continuer.
          </p>

          <form onSubmit={handlePinSubmit} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                autoComplete="current-password"
                autoFocus
                className={`w-full text-center tracking-widest text-xl font-black rounded-2xl bg-[#F6F3F2] border py-3.5 px-4 text-[#1C1B1B] focus:outline-none transition-colors ${
                  pinError
                    ? 'border-[#BC000C] bg-[#FFDAD5]/30 text-[#BC000C]'
                    : 'border-[#E5E2E1] focus:border-[#BC000C]'
                }`}
              />
            </div>

            {pinError && (
              <span className="text-xs font-bold text-[#BC000C] flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>Code PIN incorrect. Accès refusé.</span>
              </span>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#BC000C] text-white font-bold text-sm shadow-md hover:bg-[#930007] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Déverrouiller l'Espace Menu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.location.hash === '#admin') {
                  window.history.replaceState(null, '', window.location.pathname);
                }
                setCurrentView('accueil');
              }}
              className="w-full py-2.5 text-xs text-[#827560] hover:text-[#1C1B1B] font-semibold transition-colors"
            >
              ← Retourner au site public
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E5E2E1] text-[11px] text-[#827560]">
            <span>Authentification sécurisée • Session chiffrée</span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered dishes for Tab 3
  const filteredDishesList = dishes.filter(d =>
    d.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
    d.categoryLabel.toLowerCase().includes(dishSearch.toLowerCase()) ||
    (d.tag && d.tag.toLowerCase().includes(dishSearch.toLowerCase()))
  );

  // ========================================================
  // 2. AUTHENTICATED DASHBOARD (VISIBLE ONLY WITH PIN)
  // ========================================================
  return (
    <div className="w-full flex flex-col pt-20 pb-20 bg-[#F6F3F2] min-h-screen">
      {/* Top Header Bar */}
      <div className="w-full bg-[#1C1B1B] text-white py-4 px-4 sm:px-6 shadow-md border-b-2 border-[#F5B301]">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5B301] text-[#654800] flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                  Panneau de Contrôle Général — {siteConfig.restaurantName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#1B6D24] text-white text-[10px] font-bold">
                  Connecté
                </span>
              </div>
              <p className="text-xs text-[#E5E2E1]">
                Modifiez en temps réel vos menus, vos prix, vos coordonnées et tout le site web.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('accueil');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden sm:inline">Voir le Site Client</span>
            </button>

            <button
              type="button"
              onClick={() => setShowChangePinModal(true)}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Modifier le code secret"
            >
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              <span className="hidden sm:inline">Changer Code</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="py-2 px-4 rounded-xl bg-[#BC000C] hover:bg-[#930007] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Verrouiller la session"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Verrouiller</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-6 w-full flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E2E1] no-scrollbar">
          {[
            { id: 'today-tomorrow', label: '1. Plats du Jour & Planning', icon: 'today' },
            { id: 'add-dish', label: '2. Ajouter un Plat', icon: 'add_circle' },
            { id: 'manage-dishes', label: `3. Modifier les Plats (${dishes.length})`, icon: 'edit_note' },
            { id: 'site-settings', label: '4. Modifier le Site & Contacts', icon: 'tune' },
            { id: 'quartiers', label: `5. Tarifs Livraison Douala (${quartiers.length})`, icon: 'local_shipping' },
            { id: 'broadcast', label: '6. Annonce WhatsApp', icon: 'chat' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? 'bg-[#BC000C] text-white shadow-md'
                    : 'bg-white text-[#504533] hover:bg-[#F0EDED] border border-[#E5E2E1]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Change PIN Modal */}
        {showChangePinModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#E5E2E1] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#1C1B1B]">
                  Modifier le Code Secret
                </h3>
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="p-1 rounded-full text-[#827560] hover:bg-[#F0EDED]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <p className="text-xs text-[#504533]">
                Entrez votre nouveau code secret personnel (minimum 4 caractères) :
              </p>

              <form onSubmit={handleChangePinSubmit} className="flex flex-col gap-3">
                <input
                  type="password"
                  required
                  minLength={4}
                  maxLength={10}
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  placeholder="••••"
                  autoComplete="new-password"
                  className="w-full text-center text-xl font-black tracking-widest rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2.5 px-3 focus:outline-none focus:border-[#BC000C]"
                />

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#BC000C] text-white text-xs font-bold hover:bg-[#930007]"
                  >
                    Enregistrer le Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePinModal(false)}
                    className="py-3 px-4 rounded-xl bg-[#F0EDED] text-[#1C1B1B] text-xs font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: DEFINE TODAY & TOMORROW SPECIAL + WEEK PLANNER    */}
        {/* ======================================================== */}
        {activeTab === 'today-tomorrow' && (
          <div className="flex flex-col gap-8">
            {/* Current Active Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Today */}
              <div className="p-6 rounded-3xl bg-white border-2 border-[#1B6D24] shadow-md flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#A3F69C] text-[#005312] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1B6D24] animate-ping" />
                    Plat du Jour Actif (Aujourd'hui)
                  </span>
                  <span className="font-display font-black text-lg text-[#BC000C]">
                    {todayDish.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={todayDish.image}
                    alt={todayDish.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0 border border-[#E5E2E1]"
                  />
                  <div>
                    <h3 className="font-display font-black text-lg text-[#1C1B1B] leading-tight">
                      {todayDish.name}
                    </h3>
                    <p className="text-xs text-[#504533] mt-1 line-clamp-2">
                      {todayDish.description}
                    </p>
                    <span className="text-[11px] text-[#1B6D24] font-semibold block mt-1">
                      {todayDish.options?.[0] || 'Accompagnement inclus'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateWhatsAppAnnouncement(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#1B6D24] text-white text-xs font-bold hover:bg-[#14531b] transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Diffuser sur WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditDish(todayDish)}
                    className="py-2.5 px-3 rounded-xl bg-[#F0EDED] text-[#1C1B1B] text-xs font-bold hover:bg-[#E5E2E1] transition-all"
                    title="Modifier ce plat"
                  >
                    Modifier
                  </button>
                </div>
              </div>

              {/* Card Tomorrow */}
              <div className="p-6 rounded-3xl bg-white border-2 border-[#F5B301] shadow-md flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#FFF3D6] text-[#7B5800] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#F5B301]">event</span>
                    Menu Prévu pour Demain
                  </span>
                  <span className="font-display font-black text-lg text-[#BC000C]">
                    {tomorrowDish.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={tomorrowDish.image}
                    alt={tomorrowDish.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0 border border-[#E5E2E1]"
                  />
                  <div>
                    <h3 className="font-display font-black text-lg text-[#1C1B1B] leading-tight">
                      {tomorrowDish.name}
                    </h3>
                    <p className="text-xs text-[#504533] mt-1 line-clamp-2">
                      {tomorrowDish.description}
                    </p>
                    <span className="text-[11px] text-[#7B5800] font-semibold block mt-1">
                      {tomorrowDish.options?.[0] || 'Accompagnement inclus'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateWhatsAppAnnouncement(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#7B5800] text-white text-xs font-bold hover:bg-[#604400] transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Diffuser Menu de Demain</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditDish(tomorrowDish)}
                    className="py-2.5 px-3 rounded-xl bg-[#F0EDED] text-[#1C1B1B] text-xs font-bold hover:bg-[#E5E2E1] transition-all"
                    title="Modifier ce plat"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Switcher Grid */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-[#1C1B1B]">
                  Changer le Plat Vedette en 1 Clic
                </h3>
                <p className="text-xs sm:text-sm text-[#504533] mt-0.5">
                  Cliquez ci-dessous pour choisir immédiatement quel plat afficher aujourd'hui ou demain :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dishes.slice(0, 15).map((dish) => {
                  const isCurrentToday = dish.id === todaySpecialId;
                  const isCurrentTomorrow = dish.id === tomorrowSpecialId;

                  return (
                    <div
                      key={dish.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrentToday
                          ? 'border-[#1B6D24] bg-[#F4FBF4] ring-2 ring-[#1B6D24]/20'
                          : isCurrentTomorrow
                          ? 'border-[#F5B301] bg-[#FFFDF7] ring-2 ring-[#F5B301]/20'
                          : 'border-[#E5E2E1] bg-white hover:border-[#BC000C]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-xs text-[#1C1B1B] truncate">
                            {dish.name}
                          </h4>
                          <span className="text-[11px] font-bold text-[#BC000C]">
                            {dish.price.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setTodaySpecialId(dish.id);
                            showToast(`"${dish.name}" est le Plat du Jour d'Aujourd'hui !`);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isCurrentToday
                              ? 'bg-[#1B6D24] text-white shadow-xs'
                              : 'bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#1B6D24] hover:text-white'
                          }`}
                        >
                          {isCurrentToday ? '✓ Aujourd’hui' : 'Mettre Aujourd’hui'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTomorrowSpecialId(dish.id);
                            showToast(`"${dish.name}" est le Menu de Demain !`);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isCurrentTomorrow
                              ? 'bg-[#F5B301] text-[#654800] shadow-xs'
                              : 'bg-[#F0EDED] text-[#1C1B1B] hover:bg-[#F5B301] hover:text-[#654800]'
                          }`}
                        >
                          {isCurrentTomorrow ? '✓ Demain' : 'Mettre Demain'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Schedule Editor */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-black text-xl text-[#1C1B1B]">
                    Planning des Menus de la Semaine (Lundi au Dimanche)
                  </h3>
                  <p className="text-xs text-[#504533]">
                    Ces menus sont affichés dans l'onglet « Menu du Jour » pour informer vos clients de toute la semaine.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {weekMenu.map((day) => (
                  <div
                    key={day.key}
                    className="p-4 rounded-2xl border border-[#E5E2E1] bg-[#FCF9F8] flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-[#BC000C] uppercase tracking-wider">
                          {day.label}
                        </span>
                        <span className="font-display font-black text-sm text-[#1C1B1B]">
                          {day.price.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C1B1B] mt-1">
                        {day.dishName}
                      </h4>
                      <p className="text-[11px] text-[#504533] mt-0.5">
                        {day.side}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditDay(day)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-[#F5B301] hover:text-[#654800] border border-[#E5E2E1] text-[#1C1B1B] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Modifier le menu du {day.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ADD A NEW DISH OR DRINK                          */}
        {/* ======================================================== */}
        {activeTab === 'add-dish' && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E2E1] shadow-sm max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-[#BC000C]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#BC000C]">
                Nouveau Plat ou Boisson
              </span>
            </div>
            <h2 className="font-display font-black text-2xl text-[#1C1B1B]">
              Ajouter un Nouveau Menu à la Carte
            </h2>
            <p className="text-xs text-[#504533] mb-6">
              Remplissez les détails ci-dessous. Le plat sera disponible immédiatement pour la commande en ligne et sur WhatsApp.
            </p>

            <form onSubmit={handleCreateDish} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1C1B1B]">
                    Nom du Plat <span className="text-[#BC000C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Ex: Ndolè Royal Crevettes & Viande"
                    className="w-full text-sm rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2.5 px-3 text-[#1C1B1B] font-semibold focus:outline-none focus:border-[#BC000C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1B1B]">
                    Prix de vente (en FCFA) <span className="text-[#BC000C]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full text-sm rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2.5 px-3 text-[#1C1B1B] font-black focus:outline-none focus:border-[#BC000C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1B1B]">
                    Catégorie
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as any)}
                    className="w-full text-sm rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2.5 px-3 text-[#1C1B1B] font-semibold focus:outline-none focus:border-[#BC000C]"
                  >
                    <option value="terroir">Spécialité Africaine / Terroir</option>
                    <option value="grillades">Grillades & Rôtisserie</option>
                    <option value="occidentale">Cuisine Internationale / Pâtes</option>
                    <option value="dessert">Boisson / Douceur / Pâtisserie</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1C1B1B]">
                    Garniture / Accompagnement Inclus
                  </label>
                  <input
                    type="text"
                    value={newDishSide}
                    onChange={(e) => setNewDishSide(e.target.value)}
                    placeholder="Ex: Bâtons de manioc doux, Plantain mûr frites, Riz parfumé..."
                    className="w-full text-sm rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2.5 px-3 text-[#1C1B1B] focus:outline-none focus:border-[#BC000C]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1C1B1B]">
                    Description appétissante
                  </label>
                  <textarea
                    rows={2}
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    placeholder="Description savoureuse pour donner envie aux clients de commander..."
                    className="w-full text-sm rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] py-2 px-3 text-[#1C1B1B] focus:outline-none focus:border-[#BC000C]"
                  />
                </div>
              </div>

              {/* Photo du plat */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E2E1]">
                <label className="text-xs font-bold text-[#1C1B1B]">
                  Photo du Plat
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1B1B] text-white text-xs font-bold hover:bg-[#333] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    <span>Téléverser depuis mon téléphone / PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {newDishImage && (
                    <div className="flex items-center gap-2">
                      <img src={newDishImage} alt="Aperçu" className="w-10 h-10 rounded-lg object-cover border" />
                      <span className="text-xs text-[#1B6D24] font-bold">Photo chargée !</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-[#827560] block mb-1.5">
                    Ou choisissez une photo prédéfinie de notre galerie :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presetImages.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewDishImage(p.url);
                          showToast(`Photo "${p.label}" sélectionnée !`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F0EDED] text-[11px] font-semibold text-[#504533] hover:bg-[#F5B301] hover:text-[#654800] transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activation Switches */}
              <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F5B301]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1C1B1B]">
                  <input
                    type="checkbox"
                    checked={setAsTodaySpecial}
                    onChange={(e) => setSetAsTodaySpecial(e.target.checked)}
                    className="w-4 h-4 accent-[#BC000C]"
                  />
                  <span>Définir immédiatement comme <strong>Plat du Jour d'Aujourd'hui</strong></span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1C1B1B]">
                  <input
                    type="checkbox"
                    checked={setAsTomorrowSpecial}
                    onChange={(e) => setSetAsTomorrowSpecial(e.target.checked)}
                    className="w-4 h-4 accent-[#BC000C]"
                  />
                  <span>Définir comme <strong>Menu de Demain</strong></span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#BC000C] text-white font-bold text-sm shadow-md hover:bg-[#930007] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>Publier et Ajouter ce Plat au Menu</span>
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MANAGE & EDIT ALL EXISTING DISHES                */}
        {/* ======================================================== */}
        {activeTab === 'manage-dishes' && (
          <div className="flex flex-col gap-6">
            {/* Header and Search */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-[#1C1B1B]">
                  Tous les Plats de la Carte ({dishes.length})
                </h3>
                <p className="text-xs text-[#504533]">
                  Cliquez sur <strong>« Modifier »</strong> pour changer le prix, le nom, les garnitures ou la photo d'un plat.
                </p>
              </div>

              <div className="relative min-w-[260px]">
                <span className="material-symbols-outlined text-[#827560] absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Rechercher un plat..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] focus:outline-none focus:border-[#BC000C]"
                />
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDishesList.map((dish) => {
                const isAvailable = dish.isAvailable !== false;
                return (
                  <div
                    key={dish.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-white shadow-xs ${
                      !isAvailable ? 'opacity-60 border-dashed border-red-300' : 'border-[#E5E2E1]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E5E2E1]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase text-[#827560] truncate">
                            {dish.categoryLabel}
                          </span>
                          <span className="font-display font-black text-xs text-[#BC000C]">
                            {dish.price.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#1C1B1B] leading-tight truncate">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] text-[#504533] mt-1 line-clamp-2">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E5E2E1]">
                      <button
                        type="button"
                        onClick={() => openEditDish(dish)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#F0EDED] hover:bg-[#BC000C] hover:text-white text-[#1C1B1B] text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Modifier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          toggleDishAvailability(dish.id);
                          showToast(
                            isAvailable
                              ? `"${dish.name}" marqué en Rupture de stock.`
                              : `"${dish.name}" remis en stock Disponible !`
                          );
                        }}
                        className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-[#A3F69C]/40 text-[#005312] hover:bg-red-100 hover:text-red-700'
                            : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
                        }`}
                        title={isAvailable ? 'Marquer comme épuisé' : 'Remettre disponible'}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isAvailable ? 'check_circle' : 'block'}
                        </span>
                        <span>{isAvailable ? 'En stock' : 'Épuisé'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Voulez-vous vraiment supprimer "${dish.name}" du menu ?`)) {
                            deleteDish(dish.id);
                            showToast(`"${dish.name}" supprimé.`);
                          }
                        }}
                        className="p-1.5 rounded-xl text-[#827560] hover:text-[#BC000C] hover:bg-[#FFDAD5]/30 transition-colors"
                        title="Supprimer définitivement"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SITE CUSTOMIZATION & RESTAURANT SETTINGS          */}
        {/* ======================================================== */}
        {activeTab === 'site-settings' && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E2E1] shadow-sm max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-[#F5B301]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#654800]">
                Configuration Complète du Site
              </span>
            </div>
            <h2 className="font-display font-black text-2xl text-[#1C1B1B]">
              Coordonnées, Horaires & Textes du Site
            </h2>
            <p className="text-xs text-[#504533] mb-6">
              Toutes les modifications enregistrées ici s'appliquent immédiatement sur l'Accueil, le Panier et les boutons WhatsApp.
            </p>

            <form onSubmit={handleSaveSiteSettings} className="flex flex-col gap-6">
              {/* Contacts WhatsApp & Téléphone */}
              <div className="p-4 rounded-2xl bg-[#FCF9F8] border border-[#E5E2E1] flex flex-col gap-3">
                <span className="text-xs font-black text-[#1B6D24] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  Numéros WhatsApp & Téléphone Récepteur des Commandes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Numéro WhatsApp Principal (Format international sans +)
                    </label>
                    <input
                      type="text"
                      value={siteForm.whatsappPrimary}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsappPrimary: e.target.value })}
                      placeholder="237694920228"
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Numéro WhatsApp Secondaire
                    </label>
                    <input
                      type="text"
                      value={siteForm.whatsappSecondary}
                      onChange={(e) => setSiteForm({ ...siteForm, whatsappSecondary: e.target.value })}
                      placeholder="237672555864"
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Affichage Téléphone 1
                    </label>
                    <input
                      type="text"
                      value={siteForm.phoneDisplay}
                      onChange={(e) => setSiteForm({ ...siteForm, phoneDisplay: e.target.value })}
                      placeholder="694-92-02-28"
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Affichage Téléphone 2
                    </label>
                    <input
                      type="text"
                      value={siteForm.phoneSecondaryDisplay}
                      onChange={(e) => setSiteForm({ ...siteForm, phoneSecondaryDisplay: e.target.value })}
                      placeholder="672-55-58-64"
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>
                </div>
              </div>

              {/* Horaires et Statut de la Cuisine */}
              <div className="p-4 rounded-2xl bg-[#FCF9F8] border border-[#E5E2E1] flex flex-col gap-3">
                <span className="text-xs font-black text-[#1C1B1B] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Statut & Horaires de Service
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Plage horaire d'ouverture
                    </label>
                    <input
                      type="text"
                      value={siteForm.openingHours}
                      onChange={(e) => setSiteForm({ ...siteForm, openingHours: e.target.value })}
                      placeholder="08h00 - 21h30"
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Bandeau rouge d'alerte en haut du site
                    </label>
                    <input
                      type="text"
                      value={siteForm.serviceHoursNotice}
                      onChange={(e) => setSiteForm({ ...siteForm, serviceHoursNotice: e.target.value })}
                      placeholder="Cuisine Ouverte • Service Midi & Soir..."
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>
                </div>
              </div>

              {/* Textes de la Page d'Accueil */}
              <div className="p-4 rounded-2xl bg-[#FCF9F8] border border-[#E5E2E1] flex flex-col gap-3">
                <span className="text-xs font-black text-[#BC000C] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">title</span>
                  Textes Principaux de la Page d'Accueil
                </span>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Titre Principal
                    </label>
                    <input
                      type="text"
                      value={siteForm.heroTitle}
                      onChange={(e) => setSiteForm({ ...siteForm, heroTitle: e.target.value })}
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Phrase mise en valeur en rouge
                    </label>
                    <input
                      type="text"
                      value={siteForm.heroHighlight}
                      onChange={(e) => setSiteForm({ ...siteForm, heroHighlight: e.target.value })}
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">
                      Sous-titre descriptif
                    </label>
                    <textarea
                      rows={2}
                      value={siteForm.heroSubtitle}
                      onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                      className="text-xs rounded-xl bg-white border border-[#E5E2E1] p-2.5 focus:outline-none focus:border-[#BC000C]"
                    />
                  </div>
                </div>
              </div>

              {/* Bannière Événement Spécial (Dimanche Casier) */}
              <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#F5B301] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#7B5800] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">celebration</span>
                    Bannière Événement Spécial (ex: Dimanche Casier)
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1C1B1B]">
                    <input
                      type="checkbox"
                      checked={siteForm.specialEventBanner.enabled}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          specialEventBanner: { ...siteForm.specialEventBanner, enabled: e.target.checked }
                        })
                      }
                      className="w-4 h-4 accent-[#BC000C]"
                    />
                    <span>Activer sur le site</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-bold text-[#1C1B1B]">Titre Événement</label>
                    <input
                      type="text"
                      value={siteForm.specialEventBanner.title}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          specialEventBanner: { ...siteForm.specialEventBanner, title: e.target.value }
                        })
                      }
                      className="text-xs font-bold rounded-xl bg-white border border-[#E5E2E1] p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">Date</label>
                    <input
                      type="text"
                      value={siteForm.specialEventBanner.date}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          specialEventBanner: { ...siteForm.specialEventBanner, date: e.target.value }
                        })
                      }
                      className="text-xs rounded-xl bg-white border border-[#E5E2E1] p-2"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#1C1B1B]">Lieu à Douala</label>
                    <input
                      type="text"
                      value={siteForm.specialEventBanner.location}
                      onChange={(e) =>
                        setSiteForm({
                          ...siteForm,
                          specialEventBanner: { ...siteForm.specialEventBanner, location: e.target.value }
                        })
                      }
                      className="text-xs rounded-xl bg-white border border-[#E5E2E1] p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#BC000C] text-white font-bold text-sm shadow-md hover:bg-[#930007] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>Enregistrer les Paramètres du Site</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Réinitialiser les paramètres par défaut du site ?")) {
                      resetSiteConfig();
                      setSiteForm(siteConfig);
                      showToast("Paramètres réinitialisés aux valeurs d'origine.");
                    }
                  }}
                  className="py-3 px-4 rounded-2xl bg-[#F0EDED] text-[#1C1B1B] text-xs font-bold hover:bg-[#E5E2E1]"
                >
                  Rétablir défaut
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DOUALA DISTRICTS & DELIVERY FEES                 */}
        {/* ======================================================== */}
        {activeTab === 'quartiers' && (
          <div className="flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-xl text-[#1C1B1B]">
                  Frais de Livraison Douala par Quartier ({quartiers.length})
                </h3>
                <p className="text-xs text-[#504533]">
                  Ces tarifs sont appliqués automatiquement dans le panier et transmis sur WhatsApp avec chaque commande.
                </p>
              </div>
            </div>

            {/* Add Quartier Form */}
            <form onSubmit={handleAddQuartier} className="p-5 rounded-3xl bg-white border border-[#E5E2E1] shadow-xs flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1 min-w-[160px] flex-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Nom du Quartier</label>
                <input
                  type="text"
                  required
                  value={newQuartierName}
                  onChange={(e) => setNewQuartierName(e.target.value)}
                  placeholder="Ex: Ndokoti / Cité des Palmiers"
                  className="text-xs rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] p-2.5 font-bold"
                />
              </div>

              <div className="flex flex-col gap-1 min-w-[180px] flex-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Repères / Secteur</label>
                <input
                  type="text"
                  value={newQuartierDetails}
                  onChange={(e) => setNewQuartierDetails(e.target.value)}
                  placeholder="Carrefour Ndokoti, Église..."
                  className="text-xs rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] p-2.5"
                />
              </div>

              <div className="flex flex-col gap-1 w-28">
                <label className="text-xs font-bold text-[#1C1B1B]">Frais (FCFA)</label>
                <input
                  type="number"
                  required
                  value={newQuartierFee}
                  onChange={(e) => setNewQuartierFee(e.target.value)}
                  placeholder="1500"
                  className="text-xs rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] p-2.5 font-black text-[#BC000C]"
                />
              </div>

              <div className="flex flex-col gap-1 w-28">
                <label className="text-xs font-bold text-[#1C1B1B]">Délai estimé</label>
                <input
                  type="text"
                  value={newQuartierTime}
                  onChange={(e) => setNewQuartierTime(e.target.value)}
                  placeholder="30-45 min"
                  className="text-xs rounded-xl bg-[#F6F3F2] border border-[#E5E2E1] p-2.5"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[#1B6D24] text-white font-bold text-xs hover:bg-[#14531b] transition-all flex items-center gap-1.5 h-[38px]"
              >
                <span className="material-symbols-outlined text-[16px]">add_location</span>
                <span>Ajouter</span>
              </button>
            </form>

            {/* Quartiers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quartiers.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-white border border-[#E5E2E1] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#BC000C] text-[18px]">location_on</span>
                      <h4 className="font-bold text-xs text-[#1C1B1B] truncate">{q.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#827560] truncate">{q.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-[#BC000C]">{q.fee.toLocaleString('fr-FR')} FCFA</span>
                      <span className="text-[10px] text-[#504533]">({q.time})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingQuartier(q)}
                      className="p-1.5 rounded-lg text-[#504533] hover:bg-[#F0EDED]"
                      title="Modifier le prix"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    {quartiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer le quartier "${q.name}" ?`)) {
                            deleteQuartier(q.id);
                            showToast(`Quartier "${q.name}" supprimé.`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#827560] hover:text-[#BC000C] hover:bg-[#FFDAD5]/30"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Quartier Modal */}
            {editingQuartier && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E5E2E1] flex flex-col gap-4">
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B]">
                    Modifier le Tarif de {editingQuartier.name}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#1C1B1B]">Frais de coursier (FCFA)</label>
                      <input
                        type="number"
                        value={editingQuartier.fee}
                        onChange={(e) =>
                          setEditingQuartier({ ...editingQuartier, fee: parseInt(e.target.value) || 0 })
                        }
                        className="text-sm font-black text-[#BC000C] rounded-xl bg-[#F6F3F2] border p-2"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#1C1B1B]">Délai estimé</label>
                      <input
                        type="text"
                        value={editingQuartier.time}
                        onChange={(e) =>
                          setEditingQuartier({ ...editingQuartier, time: e.target.value })
                        }
                        className="text-xs rounded-xl bg-[#F6F3F2] border p-2"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateQuartier(editingQuartier.id, { fee: editingQuartier.fee, time: editingQuartier.time });
                        setEditingQuartier(null);
                        showToast(`Tarif de ${editingQuartier.name} mis à jour !`);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#BC000C] text-white text-xs font-bold"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingQuartier(null)}
                      className="py-2.5 px-4 rounded-xl bg-[#F0EDED] text-xs font-semibold"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: BROADCAST TO WHATSAPP & BACKUP                   */}
        {/* ======================================================== */}
        {activeTab === 'broadcast' && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E5E2E1] shadow-sm max-w-2xl mx-auto w-full flex flex-col gap-6">
            <div>
              <span className="text-xs font-black uppercase text-[#1B6D24]">Diffusion WhatsApp</span>
              <h2 className="font-display font-black text-2xl text-[#1C1B1B] mt-1">
                Publier le Menu sur votre Statut & Groupes
              </h2>
              <p className="text-xs text-[#504533] mt-1">
                Générez le message parfait avec le plat du jour, le prix et les liens de commande pour l'envoyer directement à vos clients.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleGenerateWhatsAppAnnouncement(false)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1B6D24] text-white font-bold text-sm shadow-md hover:bg-[#14531b] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Diffuser le Menu d'AUJOURD'HUI ({todayDish.name})</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateWhatsAppAnnouncement(true)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#7B5800] text-white font-bold text-sm shadow-md hover:bg-[#604400] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">event</span>
                <span>Diffuser le Menu de DEMAIN ({tomorrowDish.name})</span>
              </button>
            </div>

            {/* Factory Reset button */}
            <div className="pt-6 border-t border-[#E5E2E1] flex flex-col gap-2">
              <span className="text-xs font-bold text-[#827560]">Zone de Réinitialisation</span>
              <p className="text-[11px] text-[#827560]">
                Rétablir tous les menus et tarifs aux valeurs officielles d'origine.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Attention : Voulez-vous vraiment réinitialiser les menus et le site à leurs valeurs par défaut ?")) {
                    resetMenuToDefaults();
                    resetSiteConfig();
                    showToast("Menus réinitialisés aux valeurs d'origine.");
                  }
                }}
                className="self-start py-2 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Réinitialiser les Menus par Défaut
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* EDIT DISH MODAL (Full Modification by Manager)           */}
      {/* ======================================================== */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E2E1] flex flex-col gap-4 my-8 animate-scaleIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#BC000C]">Édition Complète</span>
                <h3 className="font-display font-black text-xl text-[#1C1B1B]">
                  Modifier « {editingDish.name} »
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="p-1 rounded-full text-[#827560] hover:bg-[#F0EDED]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveDishEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Nom du Plat</label>
                <input
                  type="text"
                  required
                  value={editDishName}
                  onChange={(e) => setEditDishName(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl bg-[#F6F3F2] border p-2.5 focus:outline-none focus:border-[#BC000C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1C1B1B]">Prix (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={editDishPrice}
                    onChange={(e) => setEditDishPrice(e.target.value)}
                    className="w-full text-xs font-black text-[#BC000C] rounded-xl bg-[#F6F3F2] border p-2.5"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1C1B1B]">Catégorie</label>
                  <select
                    value={editDishCategory}
                    onChange={(e) => setEditDishCategory(e.target.value as any)}
                    className="w-full text-xs font-semibold rounded-xl bg-[#F6F3F2] border p-2.5"
                  >
                    <option value="terroir">Terroir Africain</option>
                    <option value="grillades">Grillades</option>
                    <option value="occidentale">Internationale</option>
                    <option value="dessert">Boissons / Desserts</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Accompagnement Inclus</label>
                <input
                  type="text"
                  value={editDishSide}
                  onChange={(e) => setEditDishSide(e.target.value)}
                  placeholder="Ex: Bâtons de manioc / Plantains mûrs"
                  className="w-full text-xs rounded-xl bg-[#F6F3F2] border p-2.5"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Description</label>
                <textarea
                  rows={2}
                  value={editDishDesc}
                  onChange={(e) => setEditDishDesc(e.target.value)}
                  className="w-full text-xs rounded-xl bg-[#F6F3F2] border p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1C1B1B]">Changer la Photo</label>
                <div className="flex items-center gap-3">
                  <img src={editDishImage} alt="Plat" className="w-12 h-12 rounded-xl object-cover border" />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1C1B1B] text-white text-xs font-bold hover:bg-[#333]">
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>Choisir une photo</span>
                    <input type="file" accept="image/*" onChange={handleEditFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#BC000C] text-white text-xs font-bold shadow-md hover:bg-[#930007]"
                >
                  Enregistrer les Modifications
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="py-3 px-4 rounded-xl bg-[#F0EDED] text-xs font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT WEEK DAY MODAL                                      */}
      {/* ======================================================== */}
      {editingDay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5E2E1] flex flex-col gap-4 animate-scaleIn">
            <h3 className="font-display font-black text-xl text-[#1C1B1B]">
              Modifier le Menu du {editingDay.label}
            </h3>

            <form onSubmit={handleSaveDayEdit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Nom du Plat Vedette</label>
                <input
                  type="text"
                  required
                  value={editDayDishName}
                  onChange={(e) => setEditDayDishName(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl bg-[#F6F3F2] border p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1C1B1B]">Prix (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={editDayPrice}
                    onChange={(e) => setEditDayPrice(e.target.value)}
                    className="w-full text-xs font-black text-[#BC000C] rounded-xl bg-[#F6F3F2] border p-2.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#1C1B1B]">Heure de service</label>
                  <input
                    type="text"
                    value={editDayTime}
                    onChange={(e) => setEditDayTime(e.target.value)}
                    placeholder="Dès 11h30"
                    className="w-full text-xs rounded-xl bg-[#F6F3F2] border p-2.5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Garniture / Accompagnement</label>
                <input
                  type="text"
                  value={editDaySide}
                  onChange={(e) => setEditDaySide(e.target.value)}
                  className="w-full text-xs rounded-xl bg-[#F6F3F2] border p-2.5"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#1C1B1B]">Description courte</label>
                <textarea
                  rows={2}
                  value={editDayDesc}
                  onChange={(e) => setEditDayDesc(e.target.value)}
                  className="w-full text-xs rounded-xl bg-[#F6F3F2] border p-2"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#BC000C] text-white text-xs font-bold"
                >
                  Sauvegarder pour {editingDay.label}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDay(null)}
                  className="py-3 px-4 rounded-xl bg-[#F0EDED] text-xs font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
