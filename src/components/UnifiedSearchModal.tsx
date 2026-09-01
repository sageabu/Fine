import React, { useState, useMemo } from 'react';
import { Product, Service, AcademyTutorial, Language } from '../types';
import { formatTZS } from '../utils/formatters';
import { Search, X, ShoppingBag, Sparkles, BookOpen, Scissors, ArrowRight, Tag } from 'lucide-react';

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  services: Service[];
  tutorials: AcademyTutorial[];
  language: Language;
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: Service) => void;
  onSelectTutorial?: (tutorial: AcademyTutorial) => void;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  services,
  tutorials,
  language,
  onSelectProduct,
  onSelectService,
  onSelectTutorial,
}) => {
  const [query, setQuery] = useState('');

  const quickTags = [
    '4C',
    'No Leave Out',
    'Wig Revamp',
    'Boho Braids',
    'Bone Straight',
    'Nusu (Half Bundle)',
    'Silk Press',
    'HD Lace',
    'Brazilian Knots',
    'Kinky Straight',
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        products: products.slice(0, 4),
        services: services.slice(0, 4),
        tutorials: tutorials.slice(0, 2),
        totalCount: 0,
      };
    }

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.texture.toLowerCase().includes(q) ||
        p.productFamily.toLowerCase().includes(q) ||
        p.unitType.toLowerCase().includes(q) ||
        (p.style && p.style.toLowerCase().includes(q)) ||
        (p.swahiliDescription && p.swahiliDescription.toLowerCase().includes(q))
    );

    const matchedServices = services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.swahiliName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );

    const matchedTutorials = tutorials.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.swahiliTitle.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q)
    );

    return {
      products: matchedProducts,
      services: matchedServices,
      tutorials: matchedTutorials,
      totalCount: matchedProducts.length + matchedServices.length + matchedTutorials.length,
    };
  }, [query, products, services, tutorials]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#EAEAEA] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAEAEA] flex items-center space-x-3 bg-[#FAFAF8]">
          <Search className="w-5 h-5 text-[#B89758] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search products, textures (4C, Yaki, Straight), services, tutorials...'
                : 'Tafuta mawig, nywele, huduma za saluni, masomo...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-[#111111] placeholder-[#888888] focus:outline-hidden font-medium"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#888888] hover:text-[#111111] rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 bg-[#EEEEEE] hover:bg-[#E0E0E0] rounded-full text-[#444444] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-4 py-2.5 bg-[#F5F5F3] border-b border-[#EAEAEA] flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] uppercase font-bold text-[#888888] tracking-widest shrink-0 flex items-center space-x-1">
            <Tag className="w-3 h-3 text-[#B89758]" />
            <span>Trending:</span>
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white hover:bg-[#111111] hover:text-white rounded-full text-[#444444] border border-[#E0E0E0] text-[11px] whitespace-nowrap transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {query && results.totalCount === 0 ? (
            <div className="text-center py-12 text-[#888888]">
              <p className="text-sm">
                {language === 'en'
                  ? `No matching items found for "${query}".`
                  : `Hakuna matokeo yaliyopatikana kwa "${query}".`}
              </p>
              <p className="text-xs mt-1 text-[#AAAAAA]">
                {language === 'en'
                  ? 'Try searching for "4C", "No Leave Out", "Closure", or "Revamp".'
                  : 'Jaribu kutafuta "4C", "Frontal", "Wig", au "Kusuka".'}
              </p>
            </div>
          ) : (
            <>
              {/* MATCHED PRODUCTS */}
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center space-x-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{language === 'en' ? 'Fine Hair Products & Wigs' : 'Bidhaa za Nywele & Mawig'}</span>
                    </h3>
                    <span className="text-[11px] text-[#888888]">{results.products.length} items</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.products.slice(0, 6).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="p-3 bg-[#FAF9F6] hover:bg-[#F5F2EB] rounded-xl border border-[#EAEAEA] flex space-x-3 cursor-pointer transition-all hover:border-[#D4AF37]"
                      >
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000'}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] uppercase font-bold text-[#B89758] bg-white px-1.5 py-0.5 rounded-xs border border-[#EAEAEA]">
                              {product.texture}
                            </span>
                            <span className="text-[9px] text-[#888888]">{product.unitType}</span>
                            {product.availableQuantity === 0 && (
                              <span className="text-[9px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded-xs">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-[#111111] truncate mt-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1 text-xs font-bold text-[#111111]">
                            <span>{formatTZS(product.basePrice)}</span>
                            <span className="text-[10px] font-normal text-[#666666]">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHED SERVICES */}
              {results.services.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center space-x-1.5">
                      <Scissors className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{language === 'en' ? 'FineTouch Salon Services' : 'Huduma za Saluni FineTouch'}</span>
                    </h3>
                    <span className="text-[11px] text-[#888888]">{results.services.length} services</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.services.slice(0, 6).map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          onSelectService(service);
                          onClose();
                        }}
                        className="p-3 bg-[#FAF9F6] hover:bg-[#F5F2EB] rounded-xl border border-[#EAEAEA] flex space-x-3 cursor-pointer transition-all hover:border-[#D4AF37]"
                      >
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-[#111111] truncate">
                            {language === 'en' ? service.name : service.swahiliName}
                          </h4>
                          <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                            {language === 'en' ? service.description : service.swahiliDescription}
                          </p>
                          <div className="flex items-center justify-between mt-1.5 text-xs">
                            <span className="font-bold text-[#111111]">
                              {formatTZS(service.price)}
                            </span>
                            <span className="text-[10px] text-[#888888]">
                              {service.durationMinutes} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHED TUTORIALS & EDUCATION */}
              {results.tutorials.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#111111] flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{language === 'en' ? 'Academy & Care Guides' : 'Mafunzo ya Nywele & Matunzo'}</span>
                    </h3>
                    <span className="text-[11px] text-[#888888]">{results.tutorials.length} guides</span>
                  </div>
                  <div className="space-y-2">
                    {results.tutorials.map((tutorial) => (
                      <div
                        key={tutorial.id}
                        onClick={() => {
                          if (onSelectTutorial) onSelectTutorial(tutorial);
                          onClose();
                        }}
                        className="p-3 bg-[#FAF9F6] hover:bg-[#F5F2EB] rounded-xl border border-[#EAEAEA] flex items-center justify-between cursor-pointer transition-all hover:border-[#D4AF37]"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={tutorial.thumbnail}
                            alt={tutorial.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#111111] truncate">
                              {language === 'en' ? tutorial.title : tutorial.swahiliTitle}
                            </h4>
                            <p className="text-[11px] text-[#666666] truncate mt-0.5">
                              {tutorial.summary}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#888888] shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
