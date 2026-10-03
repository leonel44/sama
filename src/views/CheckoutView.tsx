import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { QUARTIERS } from '../data/quartiers';

export const CheckoutView: React.FC = () => {
  const {
    items,
    updateQuantity,
    subtotal,
    deliveryFee,
    grandTotal,
    selectedQuartier,
    setSelectedQuartier,
    sendWhatsAppOrder,
    showToast,
    setCurrentView,
    quartiers
  } = useCart();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [addressLandmark, setAddressLandmark] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Dès que possible (~30-45 min)');
  const [paymentMethod, setPaymentMethod] = useState('Espèces à la livraison');
  const [kitchenNotes, setKitchenNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !addressLandmark.trim()) {
      showToast("Veuillez renseigner votre nom, téléphone et repère de livraison svp.");
      return;
    }
    if (items.length === 0) {
      showToast("Votre panier est vide. Ajoutez des plats d'abord.");
      return;
    }

    sendWhatsAppOrder({
      clientName,
      phone: clientPhone,
      address: addressLandmark,
      notes: kitchenNotes,
      paymentMethod,
      timeSlot: deliverySlot
    });
  };

  return (
    <div className="w-full flex flex-col pt-20">
      {/* Top Banner Notice */}
      <div className="w-full bg-[#F6F3F2] py-8 px-4 sm:px-6 border-b border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E32320] text-white text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Expédition Express Douala</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#1C1B1B]">
              Finaliser votre Commande
            </h1>
            <p className="text-xs sm:text-sm text-[#504533]">
              Préparation instantanée, saveurs authentiques et envoi direct par coursier sécurisé.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#E5E2E1] shadow-xs self-start md:self-auto">
            <div className="w-10 h-10 rounded-full bg-[#A3F69C] text-[#005312] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-[#1C1B1B]">Cuisine Agréée & Hygiène</span>
              <span className="text-[11px] text-[#827560]">Normes sanitaires strictes garanties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form & Sticky Summary Grid */}
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3 Steps Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Coordonnées */}
            <section className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-1 border-b border-[#E5E2E1]">
                <span className="w-8 h-8 rounded-full bg-[#F5B301] text-[#654800] font-display font-bold text-sm flex items-center justify-center">
                  1
                </span>
                <div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-[#1C1B1B]">
                    Vos Coordonnées
                  </h2>
                  <p className="text-xs text-[#827560]">
                    Le coursier vous contactera sur ce numéro dès son départ de la cuisine.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-name">
                    Nom & Prénom <span className="text-[#BC000C]">*</span>
                  </label>
                  <div className="flex items-center bg-[#F6F3F2] rounded-xl px-3 py-2.5 border border-[#E5E2E1] focus-within:ring-2 focus-within:ring-[#F5B301]">
                    <span className="material-symbols-outlined text-[#827560] text-[18px] mr-2">person</span>
                    <input
                      id="checkout-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Marcelle Ngo Mbok"
                      required
                      className="w-full bg-transparent text-xs sm:text-sm text-[#1C1B1B] focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-phone">
                    Numéro WhatsApp actif <span className="text-[#BC000C]">*</span>
                  </label>
                  <div className="flex items-center bg-[#F6F3F2] rounded-xl px-3 py-2.5 border border-[#E5E2E1] focus-within:ring-2 focus-within:ring-[#F5B301]">
                    <span className="material-symbols-outlined text-[#1B6D24] text-[18px] mr-2">chat</span>
                    <span className="text-xs font-bold text-[#827560] mr-1">+237</span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="694 92 02 28"
                      required
                      className="w-full bg-transparent text-xs sm:text-sm text-[#1C1B1B] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-email">
                    Adresse Email <span className="text-[#827560] font-normal">(Optionnel - pour confirmation)</span>
                  </label>
                  <div className="flex items-center bg-[#F6F3F2] rounded-xl px-3 py-2.5 border border-[#E5E2E1] focus-within:ring-2 focus-within:ring-[#F5B301]">
                    <span className="material-symbols-outlined text-[#827560] text-[18px] mr-2">mail</span>
                    <input
                      id="checkout-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="votre-adresse@domaine.cm"
                      className="w-full bg-transparent text-xs sm:text-sm text-[#1C1B1B] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Livraison Douala */}
            <section className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-[#E5E2E1]">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#F5B301] text-[#654800] font-display font-bold text-sm flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-[#1C1B1B]">
                      Modalités de Livraison à Douala
                    </h2>
                    <p className="text-xs text-[#827560]">
                      Sélectionnez votre zone pour calculer automatiquement la course.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFDAD5] text-[#930007] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[15px]">moped</span>
                  <span>Frais à la charge du client</span>
                </div>
              </div>

              {/* Informative alert */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F6F3F2] text-xs text-[#504533] border border-[#E5E2E1]">
                <span className="material-symbols-outlined text-[#BC000C] text-[18px] shrink-0 mt-0.5">location_on</span>
                <p>
                  <strong>Exclusivement sur Douala :</strong> Expéditions prises en charge par notre réseau de coursiers moto formés et équipés de caisses isothermes.
                </p>
              </div>

              {/* District Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-district-select">
                  Quartier de Douala <span className="text-[#BC000C]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="checkout-district-select"
                    value={selectedQuartier.id}
                    onChange={(e) => {
                      const found = quartiers.find((q) => q.id === e.target.value);
                      if (found) setSelectedQuartier(found);
                    }}
                    className="w-full appearance-none bg-[#F6F3F2] text-xs sm:text-sm font-semibold text-[#1C1B1B] rounded-xl px-4 py-3 pr-10 border border-[#E5E2E1] focus:outline-none focus:ring-2 focus:ring-[#F5B301] cursor-pointer"
                  >
                    {quartiers.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name} — {q.fee.toLocaleString('fr-FR')} FCFA ({q.details})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[#827560] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Precise Landmark */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-address">
                  Adresse exacte & Repère bien connu <span className="text-[#BC000C]">*</span>
                </label>
                <div className="flex items-start bg-[#F6F3F2] rounded-xl px-3 py-2.5 border border-[#E5E2E1] focus-within:ring-2 focus-within:ring-[#F5B301]">
                  <span className="material-symbols-outlined text-[#827560] text-[18px] mr-2 mt-0.5">pin_drop</span>
                  <textarea
                    id="checkout-address"
                    rows={2}
                    value={addressLandmark}
                    onChange={(e) => setAddressLandmark(e.target.value)}
                    placeholder="Ex: Akwa, Rue Pau, Immeuble face pharmacie du Centre, 2ème étage porte 4"
                    required
                    className="w-full bg-transparent text-xs sm:text-sm text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none resize-none font-medium"
                  />
                </div>
              </div>

              {/* Time slot */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1C1B1B]">Heure de livraison souhaitée</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Dès que possible', sub: '~45 min', val: 'Dès que possible (~45 min)' },
                    { label: 'Midi Gourmand', sub: '12h - 14h', val: 'Midi Gourmand (12h - 14h)' },
                    { label: 'Dîner Douala', sub: '19h - 21h', val: 'Dîner Douala (19h - 21h)' },
                  ].map((slot) => (
                    <label
                      key={slot.val}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        deliverySlot === slot.val
                          ? 'border-[#F5B301] bg-[#FFDEA5]/25 text-[#654800] font-bold shadow-xs'
                          : 'border-[#E5E2E1] bg-[#F6F3F2] text-[#504533] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="delivery-slot"
                          checked={deliverySlot === slot.val}
                          onChange={() => setDeliverySlot(slot.val)}
                          className="accent-[#BC000C]"
                        />
                        <span>{slot.label}</span>
                      </div>
                      <span className="text-[11px] opacity-80">{slot.sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 3: Mode de Règlement */}
            <section className="p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-1 border-b border-[#E5E2E1]">
                <span className="w-8 h-8 rounded-full bg-[#F5B301] text-[#654800] font-display font-bold text-sm flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-[#1C1B1B]">
                    Mode de Règlement
                  </h2>
                  <p className="text-xs text-[#827560]">
                    Règlement direct mobile ou espèces sécurisées à la livraison.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'WhatsApp Direct',
                    title: 'WhatsApp Direct',
                    desc: 'Génération automatique du bon et dispatch direct au 694-92-02-28.',
                    icon: 'mark_chat_unread',
                    badge: 'Recommandé',
                    color: 'text-[#1B6D24]'
                  },
                  {
                    id: 'MTN MoMo',
                    title: 'MTN MoMo',
                    desc: 'Numéro marchand fourni pour validation instantanée par push USSD.',
                    icon: 'payments',
                    badge: 'MoMo',
                    color: 'text-[#F5B301]'
                  },
                  {
                    id: 'Orange Money',
                    title: 'Orange Money',
                    desc: 'Paiement direct sécurisé via code marchand OM Cameroun.',
                    icon: 'contactless',
                    badge: 'OM',
                    color: 'text-[#FF7900]'
                  },
                  {
                    id: 'Espèces à la livraison',
                    title: 'Cash au Livreur',
                    desc: 'Remise en main propre contre remise du repas chaud.',
                    icon: 'point_of_sale',
                    badge: 'Cash',
                    color: 'text-[#1C1B1B]'
                  }
                ].map((pm) => {
                  const isChecked = paymentMethod === pm.id;
                  return (
                    <label
                      key={pm.id}
                      className={`flex flex-col gap-2 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#BC000C] bg-[#FFDAD5]/30 shadow-xs'
                          : 'border-[#E5E2E1] bg-[#F6F3F2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment_choice"
                            checked={isChecked}
                            onChange={() => setPaymentMethod(pm.id)}
                            className="accent-[#BC000C]"
                          />
                          <span className="font-display font-bold text-sm text-[#1C1B1B]">
                            {pm.title}
                          </span>
                        </div>
                        <span className={`material-symbols-outlined text-[20px] ${pm.color}`}>
                          {pm.icon}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#504533] leading-relaxed">
                        {pm.desc}
                      </p>
                    </label>
                  );
                })}
              </div>

              {/* Kitchen notes */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-xs font-bold text-[#1C1B1B]" htmlFor="checkout-notes">
                  Remarques ou Instructions spéciales pour le chef
                </label>
                <textarea
                  id="checkout-notes"
                  rows={2}
                  value={kitchenNotes}
                  onChange={(e) => setKitchenNotes(e.target.value)}
                  placeholder="Ex: Piment fort servi à part svp, bâtons de manioc bien chauds, couverts jetables..."
                  className="w-full bg-[#F6F3F2] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#1C1B1B] border border-[#E5E2E1] focus:outline-none focus:ring-2 focus:ring-[#F5B301] resize-none"
                />
              </div>
            </section>
          </form>

          {/* Right Column: Sticky Cart Summary */}
          <aside className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-[#E5E2E1] shadow-lg p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E2E1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#BC000C] text-[24px]">shopping_cart</span>
                  <h2 className="font-display font-bold text-lg text-[#1C1B1B]">Votre Commande</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5B301] text-[#654800] text-xs font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)} Plats
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto divide-y divide-[#E5E2E1]">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#827560]">
                    Aucun plat dans votre commande.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.dish.image}
                        alt={item.dish.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E5E2E1]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#1C1B1B] truncate block">
                          {item.dish.name}
                        </span>
                        {item.selectedOption && (
                          <span className="text-[10px] text-[#827560] block truncate">
                            {item.selectedOption}
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-extrabold text-[#BC000C]">
                            {(item.dish.price * item.quantity).toLocaleString('fr-FR')} FCFA
                          </span>

                          <div className="flex items-center gap-1.5 bg-[#F6F3F2] px-2 py-0.5 rounded-full border border-[#E5E2E1]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-xs font-bold text-[#827560] hover:text-[#BC000C]"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-[#1C1B1B] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-xs font-bold text-[#827560] hover:text-[#1B6D24]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-2 border-t border-[#E5E2E1] flex flex-col gap-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-[#504533]">
                  <span>Sous-total repas</span>
                  <span className="font-bold text-[#1C1B1B]">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="flex justify-between items-center text-[#504533]">
                  <span>Livraison ({selectedQuartier.name})</span>
                  <span className="font-bold text-[#1C1B1B]">+{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="h-px bg-[#E5E2E1] my-1" />

                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-display font-bold text-sm text-[#1C1B1B] block">Net à Payer</span>
                    <span className="text-[10px] text-[#827560]">TTC • Paiement sécurisé</span>
                  </div>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#BC000C]">
                    {grandTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Giant Order Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 px-4 rounded-2xl bg-[#BC000C] text-white hover:bg-[#930007] active:scale-98 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-[24px]">send</span>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-sm sm:text-base leading-tight">
                    Valider & Envoyer sur WhatsApp
                  </span>
                  <span className="text-[10px] text-white/80 leading-tight">
                    Confirmation instantanée • +237 694-92-02-28
                  </span>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2 text-center text-xs text-[#504533]">
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#F6F3F2]">
                  <span className="material-symbols-outlined text-[16px] text-[#1B6D24]">lock</span>
                  <span>Ligne Directe Douala</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#F6F3F2]">
                  <span className="material-symbols-outlined text-[16px] text-[#F5B301]">timer</span>
                  <span>Départ en 30 min</span>
                </div>
              </div>
            </div>

            {/* Samantha Banner Box */}
            <div className="p-5 rounded-3xl bg-[#F5B301] text-[#654800] flex items-center gap-3.5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-white/80 text-[#7B5800] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[26px]">restaurant</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm leading-tight text-[#1C1B1B]">
                  Samantha Food Douala
                </span>
                <span className="text-xs text-[#654800] leading-snug mt-0.5">
                  « Des plats savoureux et faits avec passion. Le bon goût au rendez-vous ! »
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
