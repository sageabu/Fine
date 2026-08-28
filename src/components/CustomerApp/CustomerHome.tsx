import React from 'react';
import { Product, Service, Appointment, Language, CustomerHairProfile } from '../../types';
import { formatTZS } from '../../utils/formatters';
import { ArrowRight, Sparkles, Clock, Calendar, ShieldCheck, Heart, Star, Check, ShoppingBag, MapPin } from 'lucide-react';

interface CustomerHomeProps {
  products: Product[];
  services: Service[];
  upcomingAppointment?: Appointment;
  language: Language;
  userProfile: CustomerHairProfile;
  onNavigateTab: (tab: 'shop' | 'book' | 'learn' | 'profile') => void;
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: Service) => void;
  onAddToCart: (product: Product, variantLength: string) => void;
  onOpenHairAdvisor: () => void;
  onOpenHairProfile: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  products,
  services,
  upcomingAppointment,
  language,
  userProfile,
  onNavigateTab,
  onSelectProduct,
  onSelectService,
  onAddToCart,
  onOpenHairAdvisor,
  onOpenHairProfile,
}) => {
  const bestSellers = products.filter((p) => p.isBestSeller);
  const featuredWigs = products.filter((p) => p.category === 'wigs');

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Hero Showcase */}
      <section className="relative overflow-hidden bg-white border-b border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-[#F9F7F2] border border-[#E8DECC] px-3 py-1 rounded-full text-xs text-[#8A6D3B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]"></span>
              <span className="font-medium tracking-wide uppercase">
                {language === 'en' ? 'New Collection 2026' : 'Mkusanyiko Mpya 2026'}
              </span>
            </div>

            <h1 className="editorial-title text-4xl sm:text-6xl lg:text-7xl font-normal text-[#111111] leading-[1.05] tracking-tight">
              {language === 'en' ? (
                <>
                  The Crown You <br />
                  <span className="italic font-light text-[#B89758]">Never Take Off.</span>
                </>
              ) : (
                <>
                  Taji Lako la Fahari <br />
                  <span className="italic font-light text-[#B89758]">Lisiloshuka Kamwe.</span>
                </>
              )}
            </h1>

            <p className="text-[#555555] text-base sm:text-lg max-w-xl font-light leading-relaxed">
              {language === 'en'
                ? 'Discover authentic natural hair textures (4C / 4B / 3C / Raw Straight), undetectable HD Swiss lace melting, and bespoke luxury salon artistry at Mikocheni B, Ussagara Street.'
                : 'Pata nywele halisi zenye muundo wa asili wa Kiafrika (4C / 4B / 3C / Raw Straight), lace ya HD inayoyeyuka vizuri, na huduma ya kipekee Mikocheni B, Mtaa wa Ussagara.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigateTab('shop')}
                className="bg-[#111111] text-white hover:bg-black px-6 sm:px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
              >
                <span>{language === 'en' ? 'Explore Hair Collection' : 'Tazama Nywele Zote'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('book')}
                className="bg-[#FAF9F5] hover:bg-[#F0EBE0] text-[#111111] border border-[#E8DECC] px-6 sm:px-8 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#B89758]" />
                <span>{language === 'en' ? 'Book Salon Appointment' : 'Weka Nafasi ya Salon'}</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-2 border-t border-[#F0F0F0] text-[11px] sm:text-xs text-[#666666]">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#B89758]" />
                <span>African 4C/3C Natural Curls</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#B89758]" />
                <span>Mikocheni B, Ussagara St</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#B89758]" />
                <span>Lipa kwa M-Pesa / Lipa Namba</span>
              </div>
            </div>
          </div>

          {/* Hero Imagery Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-xl border border-[#EAEAEA] bg-[#111111]">
              <img
                src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000"
                alt="Fine Hair Natural 4C Coily Afro Glueless HD Lace Wig"
                className="w-full h-[420px] object-cover object-center transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E5D7C2] font-semibold">
                      AFRICAN NATURAL CROWN
                    </span>
                    <h2 className="text-base font-serif font-medium">Kinky Coily 4C Glueless HD Lace Wig</h2>
                  </div>
                  <span className="text-sm font-semibold text-[#D4AF37]">{formatTZS(590000)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-white/80">Available at Mikocheni B</span>
                  <button
                    onClick={() => onAddToCart(products[1] || products[0], '20 inch')}
                    className="text-xs bg-white text-black font-medium px-3 py-1 rounded-full hover:bg-[#E5D7C2] transition-colors cursor-pointer"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointment Status HUD if booked */}
      {upcomingAppointment && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#111111] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
                  <span>{language === 'en' ? 'Upcoming Salon Appointment' : 'Nafasi Yako ya Salon'}</span>
                </div>
                <h2 className="text-lg font-serif font-medium text-white">{upcomingAppointment.serviceName}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#AAA] mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{upcomingAppointment.date} at {upcomingAppointment.time}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{upcomingAppointment.location}</span>
                  </span>
                  <span>•</span>
                  <span>Stylist: <strong className="text-white">{upcomingAppointment.staffName}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-center">
              <button
                onClick={() => onNavigateTab('book')}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition-colors cursor-pointer"
              >
                {language === 'en' ? 'View / Reschedule' : 'Badili / Tazama'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AI Hair Stylist Consultation Interactive Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#F9F7F2] via-white to-[#F5F2EB] border border-[#E8DECC] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8A6D3B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#B89758]" />
              <span>{language === 'en' ? 'Fine Hair AI Beauty Consultant' : 'Mshauri wa AI wa Nywele'}</span>
            </div>
            <h2 className="editorial-title text-2xl sm:text-3xl text-[#111111]">
              {language === 'en'
                ? 'Unsure which wig density or lace fits your lifestyle?'
                : 'Hujui wig gani inafaa ngozi na mtindo wako wa maisha?'}
            </h2>
            <p className="text-sm text-[#666666] max-w-xl">
              {language === 'en'
                ? 'Our AI analyzes Dar es Salaam humidity, your 4C natural hairline, preferred lengths, and occasion to suggest the exact match.'
                : 'Pata ushauri wa kitaalamu kulingana na muundo wa nywele zako, hali ya hewa ya Dar es Salaam na bajeti yako.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenHairAdvisor}
              className="bg-[#111111] hover:bg-black text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'en' ? 'Start AI Consultation' : 'Anza Ushauri wa AI'}</span>
            </button>
            <button
              onClick={onOpenHairProfile}
              className="bg-white hover:bg-[#F9F9F9] text-[#111111] border border-[#DCD6C8] px-4 py-3 rounded-full text-xs font-medium transition-colors cursor-pointer"
            >
              {language === 'en' ? 'My Hair Profile' : 'Profaili Yangu'}
            </button>
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-[#EAEAEA] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89758] font-semibold">
              {language === 'en' ? 'MOST COVETED' : 'ZINAZOPENDWA ZAIDI'}
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl text-[#111111] mt-1">
              {language === 'en' ? 'Best Selling Wigs & Extensions' : 'Wigs na Bando Maarufu'}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('shop')}
            className="text-xs font-medium text-[#111111] hover:text-[#B89758] flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>{language === 'en' ? 'View All' : 'Ona Zote'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div
                onClick={() => onSelectProduct(product)}
                className="relative aspect-4/3 bg-[#F7F7F7] overflow-hidden cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.isBestSeller && (
                    <span className="bg-[#111111] text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs">
                      BEST SELLER
                    </span>
                  )}
                  {product.laceType && (
                    <span className="bg-white/90 backdrop-blur-xs text-[#8A6D3B] text-[9px] font-medium px-2 py-0.5 rounded-xs border border-[#E8DECC]">
                      {product.laceType}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full text-[#666] hover:text-red-500 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-[#777]">
                    <span className="font-medium text-[#111]">{product.hairType}</span>
                    <span>•</span>
                    <span>{product.texture}</span>
                  </div>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif text-lg font-medium text-[#111111] hover:text-[#B89758] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-[#555]">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-black">{product.rating}</span>
                    <span className="text-[#888]">({product.reviewCount})</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#888] block">Starting from</span>
                    <span className="text-base font-semibold text-[#111111]">{formatTZS(product.basePrice)}</span>
                  </div>
                  <button
                    onClick={() => onAddToCart(product, product.variants[0]?.length || 'Default')}
                    className="bg-[#F5F5F3] hover:bg-[#111111] hover:text-white text-[#111111] px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Quick Add' : 'Weka Kikapuni'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Salon Services Experience */}
      <section className="bg-[#FAF9F6] border-y border-[#EAE6DD] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89758] font-semibold">
                {language === 'en' ? 'ATELIER & SALON' : 'SALON YA MASAKI NA MLIMANI'}
              </span>
              <h2 className="editorial-title text-3xl sm:text-4xl text-[#111111] mt-1">
                {language === 'en' ? 'Signature Hair Services' : 'Huduma za Kipekee za Nywele'}
              </h2>
            </div>
            <p className="text-sm text-[#666666] max-w-md">
              {language === 'en'
                ? 'From seamless HD lace melting to custom wig restoration and knotless braids, our master stylists create flawless results.'
                : 'Huduma za kiwango cha juu za kufunga wigs, kutibu nywele na kusuka knotless kwa mafundi wenye uzoefu mkubwa.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-[#EAEAEA] p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center hover:border-[#D4AF37]/50 transition-all shadow-xs"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full sm:w-36 h-36 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8A6D3B] bg-[#FAF6EE] px-2 py-0.5 rounded-xs">
                      {service.durationMinutes} MIN
                    </span>
                    <span className="text-base font-semibold text-[#111111]">{formatTZS(service.price)}</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#111111]">{service.name}</h3>
                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {language === 'en' ? service.description : service.swahiliDescription}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#888]">Deposit: {formatTZS(service.depositRequired)}</span>
                    <button
                      onClick={() => onSelectService(service)}
                      className="bg-[#111111] text-white hover:bg-black px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors cursor-pointer"
                    >
                      {language === 'en' ? 'Book Service' : 'Weka Nafasi'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Trust & Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl border border-[#EAEAEA] bg-white space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#B89758]" />
            </div>
            <h3 className="font-serif text-base font-medium">100% Unprocessed Raw Hair</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Ethically sourced single-donor bundles with aligned cuticles for maximum longevity and natural luster.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#EAEAEA] bg-white space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#B89758]" />
            </div>
            <h3 className="font-serif text-base font-medium">Invisible HD Swiss Lace</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Ultra-thin 0.08mm real Swiss lace pre-plucked and bleached to melt into every melanin skin tone.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-[#EAEAEA] bg-white space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#B89758]" />
            </div>
            <h3 className="font-serif text-base font-medium">Tanzania-Wide VIP Delivery</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Express same-day courier in Dar es Salaam; 24hr insured transit to Arusha, Mwanza, Dodoma & Zanzibar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
