import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { QUARTIERS } from '../data/quartiers';

export const CateringView: React.FC = () => {
  const { showToast } = useCart();

  const [eventType, setEventType] = useState('Déjeuner d\'Entreprise & Séminaire');
  const [guestCount, setGuestCount] = useState(25);
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [selectedQuartier, setSelectedQuartier] = useState('Bonanjo');
  const [specialDemands, setSpecialDemands] = useState('Buffet chaud avec serveurs et boîtes hermétiques individuelles.');

  // Estimate per guest
  const packageRates: Record<string, number> = {
    'Pause-Café & Petit Déjeuner': 2500,
    'Déjeuner d\'Entreprise & Séminaire': 4500,
    'Cocktail Dînatoire Chic': 6000,
    'Mariage & Grand Buffet Familial': 7500,
  };

  const ratePerGuest = packageRates[eventType] || 4500;
  const estimatedTotal = ratePerGuest * guestCount;

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*DEMANDE DE DEVIS TRAITEUR — SAMANTHA FOOD DOUALA*\n\n` +
      `*Type d'événement :* ${eventType}\n` +
      `*Nombre de convives estimé :* ${guestCount} personnes\n` +
      `*Budget estimatif :* ${estimatedTotal.toLocaleString('fr-FR')} FCFA (${ratePerGuest.toLocaleString('fr-FR')} FCFA / pers)\n` +
      `*Date prévue :* ${eventDate}\n` +
      `*Lieu / Quartier à Douala :* ${selectedQuartier}\n` +
      `*Besoins spécifiques :* ${specialDemands}\n\n` +
      `Bonjour Cheffe Samantha, merci de me contacter avec une proposition détaillée et les options de menu disponibles.`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/237694920228?text=${encoded}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Votre demande de devis traiteur a été transmise sur WhatsApp !");
  };

  return (
    <div className="w-full flex flex-col pt-20">
      {/* Hero Header */}
      <section className="relative w-full bg-[#F6F3F2] py-14 lg:py-20 border-b border-[#E5E2E1]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5B301] text-[#654800] text-xs uppercase font-black tracking-wider mb-3">
              <span className="material-symbols-outlined text-[18px]">room_service</span>
              <span>Service Traiteur Événementiel Douala</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1C1B1B] tracking-tight leading-tight">
              L'Excellence Gastronomique pour Vos Événements & Entreprises
            </h1>
            <p className="text-sm sm:text-base text-[#504533] mt-3 leading-relaxed">
              Séminaires d'entreprises à Bonanjo ou Akwa, réunions de directoire, mariages prestigieux, anniversaires ou buffets familiaux à Makèpè : Samantha Food conçoit des prestations sur-mesure aux saveurs inoubliables.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-16">
        {/* Packages Cards */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#BC000C] uppercase tracking-wider block mb-1">
              Formules Clés en Main
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B]">
              Nos Prestations Traiteur Phares
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Pause-Café & Petit Déjeuner',
                price: '2.500 FCFA',
                sub: 'par personne',
                features: [
                  'Mini-croissants et viennoiseries',
                  'Jus de Bissap & Ananas-Gingembre frais',
                  'Café arabica de l\'Ouest & thés parfumés',
                  'Brochettes de fruits frais exotiques'
                ],
                badge: 'Corporate Matin'
              },
              {
                title: 'Déjeuner d\'Entreprise & Séminaire',
                price: '4.500 FCFA',
                sub: 'par personne',
                features: [
                  'Plat de résistance au choix (Ndolè, Poulet braisé, Entrecôte)',
                  'Accompagnements variés (Miondo, Alloco, Riz)',
                  'Salade fraîcheur d\'entrée',
                  'Bouteille de jus pressé frais'
                ],
                badge: 'Le Plus Demandé'
              },
              {
                title: 'Cocktail Dînatoire Chic',
                price: '6.000 FCFA',
                sub: 'par personne',
                features: [
                  'Pièces cocktails chaudes & froides',
                  'Mini-burgers gourmets Samantha',
                  'Brochettes de crevettes marinées',
                  'Verrines de desserts et nectars'
                ],
                badge: 'Cocktail & Afterwork'
              },
              {
                title: 'Mariage & Grand Buffet Familial',
                price: '7.500 FCFA',
                sub: 'par personne',
                features: [
                  'Grand buffet chaud terroir & international',
                  'Bar entier braisé minute au charbon',
                  'Okok salé royal & rôtisserie',
                  'Service en chafing-dish inox avec personnel'
                ],
                badge: 'Prestige Événement'
              }
            ].map((pkg, i) => (
              <div
                key={i}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[#E5E2E1] shadow-sm hover:shadow-xl transition-all"
              >
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F0EDED] text-[10px] font-bold text-[#504533] uppercase">
                    {pkg.badge}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#1C1B1B] mt-2 leading-snug">
                    {pkg.title}
                  </h3>
                  <div className="my-3 pb-3 border-b border-[#E5E2E1]">
                    <span className="font-display font-black text-2xl text-[#BC000C]">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-[#827560] block">{pkg.sub}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#504533]">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#1B6D24] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setEventType(pkg.title)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-[#F6F3F2] hover:bg-[#F5B301] hover:text-[#654800] text-[#1C1B1B] text-xs font-bold transition-all"
                >
                  Sélectionner cette formule
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Quote Calculator */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E2E1] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#BC000C]">
                Calculateur Instantané
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B] tracking-tight">
                Estimez le budget de votre événement
              </h2>
              <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
                Personnalisez les paramètres ci-contre selon vos besoins à Douala. Nous prenons en charge la cuisine, le conditionnement isotherme ou le service sur place avec vaisselle et maîtres d'hôtel.
              </p>

              <div className="p-5 rounded-2xl bg-[#F6F3F2] border border-[#E5E2E1] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#504533]">Formule retenue :</span>
                  <span className="font-bold text-[#1C1B1B]">{eventType}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#504533]">Convives :</span>
                  <span className="font-bold text-[#1C1B1B]">{guestCount} personnes</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#504533]">Tarif estimatif unitaire :</span>
                  <span className="font-bold text-[#1C1B1B]">{ratePerGuest.toLocaleString('fr-FR')} FCFA / pers</span>
                </div>
                <div className="pt-2 border-t border-[#E5E2E1] flex justify-between items-center">
                  <span className="font-display font-bold text-sm text-[#1C1B1B]">Total estimé :</span>
                  <span className="font-display font-black text-xl text-[#BC000C]">
                    {estimatedTotal.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendQuote} className="lg:col-span-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">
                  Type d'événement & Formule :
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#F6F3F2] text-[#1C1B1B] rounded-xl px-3.5 py-3 border border-[#E5E2E1] focus:outline-none"
                >
                  <option value="Pause-Café & Petit Déjeuner">Pause-Café & Petit Déjeuner (2.500 FCFA/pers)</option>
                  <option value="Déjeuner d'Entreprise & Séminaire">Déjeuner d'Entreprise & Séminaire (4.500 FCFA/pers)</option>
                  <option value="Cocktail Dînatoire Chic">Cocktail Dînatoire Chic (6.000 FCFA/pers)</option>
                  <option value="Mariage & Grand Buffet Familial">Mariage & Grand Buffet Familial (7.500 FCFA/pers)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1">
                    Nombre de convives :
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 5)}
                    className="w-full text-xs font-bold bg-[#F6F3F2] text-[#1C1B1B] rounded-xl px-3.5 py-3 border border-[#E5E2E1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1B1B] mb-1">
                    Date prévue :
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#F6F3F2] text-[#1C1B1B] rounded-xl px-3.5 py-3 border border-[#E5E2E1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">
                  Lieu / Quartier de l'événement à Douala :
                </label>
                <select
                  value={selectedQuartier}
                  onChange={(e) => setSelectedQuartier(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#F6F3F2] text-[#1C1B1B] rounded-xl px-3.5 py-3 border border-[#E5E2E1] focus:outline-none"
                >
                  {QUARTIERS.map((q) => (
                    <option key={q.id} value={q.name}>
                      {q.name} ({q.details})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1B1B] mb-1">
                  Précisions spécifiques ou contraintes :
                </label>
                <textarea
                  rows={2}
                  value={specialDemands}
                  onChange={(e) => setSpecialDemands(e.target.value)}
                  className="w-full text-xs bg-[#F6F3F2] text-[#1C1B1B] rounded-xl px-3.5 py-2 border border-[#E5E2E1] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1B6D24] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#14531b] shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Demander ce Devis par WhatsApp (+237 694-92-02-28)</span>
              </button>
            </form>
          </div>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-lg border border-[#E5E2E1]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDel_tmk5nlVZy_DPciSQZwQa2yPDeYK-ln_T5QnHOE7dD8birK1Y9XZh4F8la9c2plRU9TP8D2juWXG7bo8MeP8TuJ0z0UT3vhBhmO5D2tjL0ED8egWYXBSamNu9AwR-Ygsptgq7jGbI-ufZvUY6XzwdJhA0C2da9vmh68SB7mPMeEgjKwcnKntfQCSn7dLUKscWJF-m99M_-4UK_YPnOkDvYMG5Se1ynivgi-lU4rEGXpikDh81A__oaOK3P5PiK7Ng"
              alt="Histoire Samantha Food"
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider">
              L'Histoire Samantha Food
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1C1B1B]">
              Une Passion Culinaires Née au Cœur de Douala
            </h2>
            <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
              Fondée par la Cheffe Samantha, notre maison culinaire réunit les richesses des terroirs camerounais (Centre, Sud, Littoral, Ouest) et l'art des saveurs internationales. Nous croyons qu'un bon repas nourrit autant l'esprit que le corps.
            </p>
            <p className="text-xs sm:text-sm text-[#504533] leading-relaxed">
              Tous nos plats sont cuisinés sans additifs artificiels, avec des huiles nobles, des viandes rigoureusement sélectionnées et un assaisonnement authentique qui fait toute la différence.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
