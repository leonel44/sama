import React from 'react';
import { useCart } from '../context/CartContext';
import { QUARTIERS } from '../data/quartiers';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    grandTotal,
    selectedQuartier,
    setSelectedQuartier,
    sendWhatsAppOrder,
    setCurrentView,
    quartiers
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('commander');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCF9F8] shadow-2xl flex flex-col justify-between border-l border-[#E5E2E1]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#1C1B1B] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#F5B301] text-[24px]">shopping_basket</span>
              <h2 className="font-display font-bold text-lg">Panier Samantha Food</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#F5B301] text-[#654800] text-xs font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto divide-y divide-[#E5E2E1]">
            {items.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-3 text-[#504533]">
                <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center text-[#BC000C]">
                  <span className="material-symbols-outlined text-[36px]">receipt_long</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#1C1B1B]">Votre panier est vide</h3>
                <p className="text-sm max-w-xs text-[#504533]">
                  Explorez nos spécialités africaines et délices du monde pour commencer votre commande.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('menu-carte');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-full bg-[#F5B301] text-[#654800] font-bold text-sm shadow-sm hover:brightness-95 transition-all"
                >
                  Découvrir la carte
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E5E2E1] shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-sm text-[#1C1B1B] leading-tight truncate">
                          {item.dish.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#827560] hover:text-[#BC000C] p-0.5"
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>

                      {item.selectedOption && (
                        <p className="text-[11px] text-[#504533] mt-0.5 font-medium">
                          Option : {item.selectedOption}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display font-extrabold text-sm text-[#BC000C]">
                          {(item.dish.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 bg-[#F0EDED] rounded-lg p-0.5 shadow-inner">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded bg-white text-[#1C1B1B] font-bold text-xs hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#1C1B1B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded bg-white text-[#1C1B1B] font-bold text-xs hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery & Checkout Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E5E2E1] shadow-[0_-8px_20px_rgba(0,0,0,0.04)] flex flex-col gap-3">
              {/* Delivery District Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#504533] flex items-center gap-1" htmlFor="drawer-district-select">
                  <span className="material-symbols-outlined text-[16px] text-[#BC000C]">location_on</span>
                  <span>Quartier de livraison (Douala) :</span>
                </label>
                <div className="relative">
                  <select
                    id="drawer-district-select"
                    value={selectedQuartier.id}
                    onChange={(e) => {
                      const found = quartiers.find((q) => q.id === e.target.value);
                      if (found) setSelectedQuartier(found);
                    }}
                    className="w-full text-xs font-semibold bg-[#F0EDED] text-[#1C1B1B] rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#F5B301] cursor-pointer"
                  >
                    {quartiers.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name} — {q.fee.toLocaleString('fr-FR')} FCFA ({q.time})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[#827560] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-[#504533] pt-1">
                <div className="flex justify-between items-center">
                  <span>Sous-total repas :</span>
                  <span className="font-bold text-[#1C1B1B]">
                    {subtotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Frais coursier ({selectedQuartier.name}) :</span>
                  <span className="font-bold text-[#1C1B1B]">
                    +{deliveryFee.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="h-px bg-[#E5E2E1] my-1" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#1C1B1B]">Total net à payer :</span>
                  <span className="font-display font-black text-base sm:text-lg text-[#BC000C]">
                    {grandTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => sendWhatsAppOrder()}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1B6D24] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#14531b] active:scale-98 shadow-md transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Commander via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F0EDED] hover:bg-[#E5E2E1] text-[#1C1B1B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>Formulaire de commande complet</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-[#827560] leading-tight">
                Paiement direct sécurisé : MTN MoMo, Orange Money ou Espèces à la livraison.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
