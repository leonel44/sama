import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const DishModal: React.FC = () => {
  const { activeModalDish, setActiveModalDish, addToCart, setIsCartDrawerOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!activeModalDish) return null;

  // Initialize selected option if available
  const defaultOption = selectedOption || (activeModalDish.options && activeModalDish.options[0]) || '';

  const handleAdd = () => {
    addToCart(activeModalDish, quantity, defaultOption, notes.trim() || undefined);
    setActiveModalDish(null);
    setQuantity(1);
    setNotes('');
  };

  const handleAddAndOpenCart = () => {
    handleAdd();
    setIsCartDrawerOpen(true);
  };

  const totalPrice = activeModalDish.price * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setActiveModalDish(null)}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#FCF9F8] rounded-2xl shadow-2xl overflow-hidden border border-[#E5E2E1] my-8 animate-scaleIn">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModalDish(null)}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* Dish Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0EDED]">
            <img
              src={activeModalDish.image}
              alt={activeModalDish.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {activeModalDish.tag && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#BC000C] text-white text-xs font-bold shadow-md uppercase tracking-wider">
                {activeModalDish.tag}
              </span>
            )}
            <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-xl bg-[#F5B301] text-[#654800] font-display font-black text-lg shadow-md">
              {activeModalDish.price.toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#827560] mb-1">
                <span>{activeModalDish.categoryLabel}</span>
                {activeModalDish.origin && (
                  <>
                    <span>•</span>
                    <span className="text-[#BC000C]">{activeModalDish.origin}</span>
                  </>
                )}
                {activeModalDish.prepTime && (
                  <>
                    <span>•</span>
                    <span className="text-[#1B6D24] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {activeModalDish.prepTime}
                    </span>
                  </>
                )}
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#1C1B1B] leading-tight">
                {activeModalDish.name}
              </h3>
              <p className="text-sm text-[#504533] mt-2 leading-relaxed">
                {activeModalDish.description}
              </p>
            </div>

            {/* Ingredients list if present */}
            {activeModalDish.ingredients && activeModalDish.ingredients.length > 0 && (
              <div className="p-3 rounded-xl bg-[#F0EDED]/60">
                <span className="text-xs font-bold text-[#1C1B1B] uppercase tracking-wider block mb-1.5">
                  Ingrédients & Saveurs :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalDish.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white text-[11px] font-medium text-[#504533] border border-[#E5E2E1]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Options selector (Sides / Cuts / Recipes) */}
            {activeModalDish.options && activeModalDish.options.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C1B1B] block">
                  Choix de l'accompagnement / variante :
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {activeModalDish.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        (selectedOption || defaultOption) === opt
                          ? 'border-[#F5B301] bg-[#FFDEA5]/20 text-[#654800]'
                          : 'border-[#E5E2E1] bg-white text-[#504533] hover:bg-[#F0EDED]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="dish-option"
                        value={opt}
                        checked={(selectedOption || defaultOption) === opt}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="accent-[#BC000C]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1">
              <label htmlFor="dish-notes" className="text-xs font-bold text-[#504533]">
                Instructions particulières (sans piment, sauce à part...) :
              </label>
              <input
                id="dish-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Piment très doux, bien chaud..."
                className="w-full text-xs bg-white border border-[#E5E2E1] rounded-xl px-3 py-2 text-[#1C1B1B] placeholder:text-[#827560] focus:outline-none focus:border-[#F5B301]"
              />
            </div>

            {/* Quantity Stepper & Add Action */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center bg-[#F0EDED] rounded-xl p-1 shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-lg bg-white text-[#1C1B1B] font-bold text-base hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#1C1B1B]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-lg bg-white text-[#1C1B1B] font-bold text-base hover:bg-[#E5E2E1] flex items-center justify-center transition-colors shadow-xs"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddAndOpenCart}
                className="flex-1 py-3 px-4 rounded-xl bg-[#BC000C] text-white font-bold text-sm shadow-md hover:bg-[#930007] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>Ajouter ({totalPrice.toLocaleString('fr-FR')} FCFA)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
