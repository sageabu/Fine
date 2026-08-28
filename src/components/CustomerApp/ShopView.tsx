import React, { useState } from 'react';
import { Product, Language } from '../../types';
import { formatTZS, generateWhatsAppLink } from '../../utils/formatters';
import { Search, Sparkles, Star, ShoppingBag, Heart, ArrowRight, MessageSquare, Check, X, AlertCircle } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  language: Language;
  onAddToCart: (product: Product, variantLength: string) => void;
  onSelectProduct: (product: Product) => void;
  selectedProduct: Product | null;
  onCloseProductModal: () => void;
  onOpenHairAdvisor: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  language,
  onAddToCart,
  onSelectProduct,
  selectedProduct,
  onCloseProductModal,
  onOpenHairAdvisor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTexture, setSelectedTexture] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [activeLengthVariant, setActiveLengthVariant] = useState<string>('');

  // Category taxonomy
  const categories = [
    { id: 'all', label: language === 'en' ? 'All Pieces (534)' : 'Zote (534)' },
    { id: 'wigs', label: language === 'en' ? 'Luxury Wigs' : 'Wigs' },
    { id: 'raw_hair', label: language === 'en' ? 'Raw Hair & Wefts' : 'Nywele Halisi & Wefts' },
    { id: 'bundles', label: language === 'en' ? 'Bundles & Nusu' : 'Bando & Nusu' },
    { id: 'hair_care', label: language === 'en' ? 'Hair Care & Elixirs' : 'Mafuta & Matunzo' },
    { id: 'installation_tools', label: language === 'en' ? 'Lace Melt & Tools' : 'Gundi & Vifaa' },
  ];

  const textures = [
    'all',
    '4C',
    '4B (AKC)',
    '4A (CAKC)',
    '4A YYE',
    '3B',
    'Bone Straight',
    'Straight',
    'Kinky Straight',
    'Relaxed Yaki',
    'Deep Wave',
    'Kinky Curly',
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'bundles' && (p.unitType === 'Full bundle' || p.unitType === 'Half bundle (Nusu)' || p.category === 'bundles'));

    const matchesTexture =
      selectedTexture === 'all' ||
      p.texture.toLowerCase().includes(selectedTexture.toLowerCase());

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.texture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTexture && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.basePrice - b.basePrice;
    if (sortBy === 'price_high') return b.basePrice - a.basePrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Modal active product helpers
  const currentModalVariant =
    selectedProduct?.variants.find((v) => v.length === activeLengthVariant) ||
    selectedProduct?.variants[0];
  const currentPrice = currentModalVariant?.price || selectedProduct?.basePrice || 0;
  const isOutOfStock = (selectedProduct?.availableQuantity ?? 0) === 0 || (currentModalVariant?.stock ?? 0) === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89758] font-semibold">
            {language === 'en' ? 'THE ATELIER BOUTIQUE' : 'DUKA LA FINE HAIR'}
          </span>
          <h1 className="editorial-title text-3xl sm:text-5xl text-[#111111] mt-1">
            {language === 'en' ? 'Raw Hair, Wefts & Custom Wigs' : 'Nywele Halisi, Wefts na Wigs'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1.5 max-w-xl">
            {language === 'en'
              ? 'Hand-selected single-donor virgin extensions, 4C/4B afro textures, ultra-thin HD closures, and clinical Tanzanian rosemary elixirs.'
              : 'Nywele asilia za donor, mikanda ya 4C na wigs za kisasa zilizotengenezwa kwa umaridadi Mikocheni B.'}
          </p>
        </div>

        {/* AI Advisor Trigger Banner */}
        <button
          onClick={onOpenHairAdvisor}
          className="self-start md:self-auto bg-[#F9F7F2] hover:bg-[#F2ECE0] text-[#111111] border border-[#E8DECC] px-4 py-2.5 rounded-full text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#B89758]" />
          <span>{language === 'en' ? 'Not sure what to choose? Ask AI Stylist' : 'Hujui cha kuchagua? Uliza AI'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills Slider */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#555555] border border-[#EAEAEA] hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Texture & Sort controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search 4C wefts, Cambodian straight, Nusu, SKU...' : 'Tafuta 4C, bando za nusu, wigs...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EAEAEA] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-black cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Texture selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedTexture}
              onChange={(e) => setSelectedTexture(e.target.value)}
              className="w-full bg-white border border-[#EAEAEA] rounded-full px-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black transition-colors cursor-pointer"
            >
              <option value="all">{language === 'en' ? 'All Textures (4C, Yaki, Straight...)' : 'Mionekano Yote ya Nywele'}</option>
              {textures.filter((t) => t !== 'all').map((tex) => (
                <option key={tex} value={tex}>
                  {tex}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-[#EAEAEA] rounded-full px-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black transition-colors cursor-pointer"
            >
              <option value="featured">{language === 'en' ? 'Featured / Best' : 'Zilizochaguliwa'}</option>
              <option value="price_low">{language === 'en' ? 'Price: Low to High' : 'Bei: Chini kwenda Juu'}</option>
              <option value="price_high">{language === 'en' ? 'Price: High to Low' : 'Bei: Juu kwenda Chini'}</option>
              <option value="rating">{language === 'en' ? 'Highest Rated' : 'Viwango vya Juu'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Results Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#EAEAEA] space-y-3">
          <p className="text-base text-[#666666]">
            {language === 'en' ? 'No hair pieces found matching your criteria.' : 'Hakuna bidhaa inayolingana na vigezo ulivyoweka.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTexture('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#B89758] font-semibold underline cursor-pointer"
          >
            {language === 'en' ? 'Reset all filters' : 'Ondoa vichungi vyote'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((product) => {
            const outOfStock = product.availableQuantity === 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div
                    onClick={() => {
                      setActiveLengthVariant(product.variants[0]?.length || '');
                      onSelectProduct(product);
                    }}
                    className="relative aspect-4/3 bg-[#F7F7F7] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {outOfStock ? (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs shadow-xs">
                        OUT OF STOCK
                      </span>
                    ) : product.isNewArrival ? (
                      <span className="absolute top-3 left-3 bg-[#111111] text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-xs">
                        NEW ARRIVAL
                      </span>
                    ) : null}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full text-[#666] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#777]">
                      <span className="bg-[#F6F6F4] px-2 py-0.5 rounded-xs font-medium text-[#444]">{product.unitType}</span>
                      <span className="font-semibold text-[#B89758]">{product.texture}</span>
                    </div>

                    <h3
                      onClick={() => {
                        setActiveLengthVariant(product.variants[0]?.length || '');
                        onSelectProduct(product);
                      }}
                      className="font-serif text-lg font-medium text-[#111111] hover:text-[#B89758] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {language === 'en' ? product.description : product.swahiliDescription}
                    </p>

                    {/* Rating & SKU */}
                    <div className="flex items-center justify-between text-xs text-[#555] pt-1">
                      <div className="flex items-center space-x-1.5">
                        <div className="flex text-[#D4AF37]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold text-black">{product.rating}</span>
                        <span className="text-[#888]">({product.reviewCount})</span>
                      </div>
                      <span className="text-[10px] text-[#999] font-mono">
                        {product.sku}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#888] block">Price</span>
                      <span className="text-base font-semibold text-[#111111]">{formatTZS(product.basePrice)}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveLengthVariant(product.variants[0]?.length || '');
                        onSelectProduct(product);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
                        outOfStock
                          ? 'bg-[#F2F2F2] text-[#888888] hover:bg-[#EAEAEA]'
                          : 'bg-[#111111] hover:bg-black text-white'
                      }`}
                    >
                      <span>{outOfStock ? 'View Stock Info' : language === 'en' ? 'Select Options' : 'Chagua'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Product Quick View / Options Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAEAEA] p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={onCloseProductModal}
              className="absolute top-4 right-4 p-2 bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-full text-[#333] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Product Gallery */}
              <div className="space-y-3">
                <div className="aspect-square bg-[#F7F7F7] rounded-xl overflow-hidden border border-[#EAEAEA] relative">
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-md shadow-lg">
                        Out of Stock (Mikocheni B)
                      </span>
                    </div>
                  )}
                </div>
                {selectedProduct.images[1] && (
                  <div className="grid grid-cols-2 gap-2">
                    <img
                      src={selectedProduct.images[1]}
                      alt="Thumbnail"
                      className="h-20 w-full object-cover rounded-lg border border-[#EAEAEA]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="h-20 bg-[#FAF9F5] border border-[#E8DECC] rounded-lg p-2 text-[10px] text-[#8A6D3B] flex flex-col justify-center text-center">
                      <span className="font-semibold uppercase tracking-wider">FINE HAIR AUTHENTIC</span>
                      <span>Mikocheni B, Ussagara St</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Configuration */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-semibold">
                      {selectedProduct.productFamily}
                    </span>
                    <span className="text-[10px] text-[#888] font-mono">({selectedProduct.sku})</span>
                  </div>
                  <h2 className="editorial-title text-2xl sm:text-3xl text-[#111111] mt-0.5">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-center space-x-2 text-xs text-[#555] mt-1">
                    <div className="flex text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span>{selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3">
                  <div className="text-xl sm:text-2xl font-semibold text-[#111111]">
                    {formatTZS(currentPrice)}
                  </div>
                  <span className="text-xs text-[#777] font-medium">({selectedProduct.unitType})</span>
                </div>

                {/* Length Variant Selector */}
                {selectedProduct.variants.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#111]">Select Specification / Variant:</span>
                      <span className={`text-[11px] font-medium ${currentModalVariant?.stock === 0 ? 'text-red-600' : 'text-[#555]'}`}>
                        {currentModalVariant?.stock === 0
                          ? '0 in stock (Restocking)'
                          : `${currentModalVariant?.stock} units available`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedProduct.variants.map((variant) => (
                        <button
                          key={variant.length}
                          onClick={() => setActiveLengthVariant(variant.length)}
                          className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            (activeLengthVariant || selectedProduct.variants?.[0]?.length) === variant.length
                              ? 'border-[#111] bg-[#111] text-white shadow-xs'
                              : variant.stock === 0
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-[#EAEAEA] bg-white text-[#333] hover:border-black'
                          }`}
                        >
                          <span className="block font-semibold">{variant.length}</span>
                          <span className="text-[10px] block opacity-80">{formatTZS(variant.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specs */}
                <div className="bg-[#FAF9F6] border border-[#EAE6DD] rounded-xl p-3.5 text-xs space-y-1.5 text-[#555]">
                  <div className="flex justify-between">
                    <span className="text-[#888]">Texture Profile:</span>
                    <span className="font-medium text-black">{selectedProduct.texture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Unit Classification:</span>
                    <span className="font-medium text-black">{selectedProduct.unitType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Atelier Stock Status:</span>
                    <span className={`font-semibold ${selectedProduct.availableQuantity === 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {selectedProduct.availableQuantity === 0
                        ? 'Out of Stock (Mikocheni B)'
                        : `${selectedProduct.availableQuantity} Units Ready for Pickup / Delivery`}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => {
                        const len = activeLengthVariant || selectedProduct.variants[0]?.length || 'Standard';
                        onAddToCart(selectedProduct, len);
                        onCloseProductModal();
                      }}
                      className={`py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                        isOutOfStock
                          ? 'bg-[#E5E5E5] text-[#999999] cursor-not-allowed'
                          : 'bg-[#111111] hover:bg-black text-white cursor-pointer'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Out of Stock' : language === 'en' ? 'Add to Bag' : 'Weka Mfukoni'}</span>
                    </button>

                    <a
                      href={generateWhatsAppLink(
                        '+255754892110',
                        `Habari Fine Hair Mikocheni B! Naulizia kuhusu "${selectedProduct.name}" (SKU: ${selectedProduct.sku}, Variant: ${activeLengthVariant || selectedProduct.variants[0]?.length || 'Default'}). ${isOutOfStock ? 'Lini itafika stoo tena?' : 'Iko tayari kwa delivery leo?'}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center space-x-1.5 transition-all text-center"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Ask</span>
                    </a>
                  </div>

                  {isOutOfStock && (
                    <div className="flex items-center space-x-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>This SKU is currently out of stock at Mikocheni B atelier. Tap WhatsApp to pre-order or reserve the next incoming shipment.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Care instructions */}
            <div className="pt-4 border-t border-[#EAEAEA] space-y-2">
              <h3 className="font-serif text-base font-medium">Care & Tanzanian Climate Maintenance</h3>
              <ul className="text-xs text-[#666] space-y-1">
                {selectedProduct.careInstructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-[#B89758] shrink-0 mt-0.5" />
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
