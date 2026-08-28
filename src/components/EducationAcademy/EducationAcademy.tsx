import React, { useState } from 'react';
import { EducationalArticle, Language } from '../../types';
import { BookOpen, Sparkles, Clock, Check, ChevronRight, X, Heart, Share2, Calculator } from 'lucide-react';

interface EducationAcademyProps {
  articles: EducationalArticle[];
  language: Language;
  onNavigateToShop: () => void;
  onNavigateToBook: () => void;
}

export const EducationAcademy: React.FC<EducationAcademyProps> = ({
  articles,
  language,
  onNavigateToShop,
  onNavigateToBook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  // Interactive Wig Care Calculator state
  const [calcTexture, setCalcTexture] = useState<string>('Bone Straight');
  const [calcFrequency, setCalcFrequency] = useState<string>('Daily Wear');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: language === 'en' ? 'All Masterclasses' : 'Makala Yote' },
    { id: 'wig_care', label: language === 'en' ? 'Wig Longevity & Spa' : 'Utunzaji wa Wigs' },
    { id: 'lace_techniques', label: language === 'en' ? 'HD Lace Melting' : 'Ufundi wa Lace' },
    { id: 'hair_textures', label: language === 'en' ? 'Raw Donor Textures' : 'Aina za Nywele' },
    { id: 'natural_hair_care', label: language === 'en' ? '4C Scalp Protection' : 'Afya ya Nywele Asilia' },
  ];

  const filteredArticles = articles.filter(
    (art) => selectedCategory === 'all' || art.category === selectedCategory
  );

  const calculateCareRoutine = () => {
    let washInterval = calcFrequency === 'Daily Wear' ? 'Every 10-14 days' : 'Every 3-4 weeks';
    let oilRecommendation =
      calcTexture === 'Bone Straight'
        ? '1-2 drops of lightweight Rosemary Argan Silk Serum on ends only.'
        : 'Leave-in moisture mist + curl defining mousse with air-dry.';
    let heatLimit = 'Max 180°C with thermal heat shield spray.';

    setCalcResult(
      `Recommended Protocol for ${calcTexture} (${calcFrequency}): Wash interval: ${washInterval}. Hydration: ${oilRecommendation} Styling: ${heatLimit}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Editorial Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 border-b border-[#EAEAEA] pb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B89758] font-bold">
          FINE HAIR ACADEMY & EDITORIAL
        </span>
        <h1 className="editorial-title text-4xl sm:text-6xl text-[#111111] leading-tight">
          The Art & Science of Raw Hair
        </h1>
        <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
          Master the preservation of virgin donor strands, scalp protection in East African coastal humidity, and flawless invisible lace blending.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-white text-[#555] border border-[#EAEAEA] hover:border-black'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Masterclass Banner */}
      {articles[0] && selectedCategory === 'all' && (
        <div
          onClick={() => setActiveArticle(articles[0])}
          className="group relative bg-[#111111] rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6 text-white z-10">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  FEATURED MASTERCLASS
                </span>
                <h2 className="editorial-title text-3xl sm:text-4xl text-white group-hover:text-[#D4AF37] transition-colors">
                  {articles[0].title}
                </h2>
                <p className="text-xs text-[#AAA] leading-relaxed">
                  {articles[0].summary}
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs text-[#888]">
                <span>By {articles[0].author}</span>
                <span>•</span>
                <span>{articles[0].readTimeMinutes} min read</span>
                <span>•</span>
                <span className="text-[#D4AF37] font-semibold flex items-center space-x-1">
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="relative aspect-4/3 md:aspect-auto overflow-hidden">
              <img
                src={articles[0].coverImage}
                alt={articles[0].title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/10 bg-[#F5F5F5] overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#888] uppercase tracking-wider">
                  <span className="font-semibold text-[#8A6D3B]">{article.category.replace('_', ' ')}</span>
                  <span>{article.readTimeMinutes} MIN</span>
                </div>

                <h3 className="editorial-title text-xl font-medium text-[#111] group-hover:text-[#B89758] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-[#666] line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between text-xs text-[#888]">
                <span>Fine Hair Atelier</span>
                <span className="text-black font-medium group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Hair Longevity & Climate Protocol Calculator */}
      <div className="bg-[#FAF9F5] border border-[#E8DECC] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="editorial-title text-2xl text-[#111]">
              Dar es Salaam Climate & Wig Longevity Protocol
            </h2>
            <p className="text-xs text-[#666]">
              Calculate the optimal washing and hydration frequency for your specific texture.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777]">Texture Type</label>
            <select
              value={calcTexture}
              onChange={(e) => setCalcTexture(e.target.value)}
              className="w-full bg-white border border-[#E8DECC] rounded-xl p-2.5 text-xs text-[#111] cursor-pointer"
            >
              <option value="Bone Straight">Bone Straight Raw Hair</option>
              <option value="Deep Wave">Deep Wave / Water Wave</option>
              <option value="Kinky Curly">Kinky Curly / Afro Coils</option>
              <option value="Body Wave">Body Wave</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#777]">Wearing Frequency</label>
            <select
              value={calcFrequency}
              onChange={(e) => setCalcFrequency(e.target.value)}
              className="w-full bg-white border border-[#E8DECC] rounded-xl p-2.5 text-xs text-[#111] cursor-pointer"
            >
              <option value="Daily Wear">Daily Wear (Everyday)</option>
              <option value="Weekend / Occasion">Occasions / 2-3 Days a Week</option>
              <option value="Glueless Switch">Rotated with other wigs</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateCareRoutine}
              className="w-full bg-[#111] hover:bg-black text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Calculate Routine
            </button>
          </div>
        </div>

        {calcResult && (
          <div className="p-4 bg-white border border-[#E8DECC] rounded-xl text-xs space-y-2 text-[#333]">
            <span className="text-[10px] uppercase font-bold text-[#8A6D3B] tracking-wider block">
              ATELIER CARE DIRECTIVE:
            </span>
            <p className="leading-relaxed font-medium">{calcResult}</p>
          </div>
        )}
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAEAEA] p-6 sm:p-10 space-y-6 relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 bg-[#F5F5F5] hover:bg-[#EAEAEA] rounded-full text-[#333] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold">
                {activeArticle.category.replace('_', ' ')} • {activeArticle.readTimeMinutes} MIN READ
              </span>
              <h1 className="editorial-title text-3xl sm:text-4xl text-[#111111]">
                {activeArticle.title}
              </h1>
              <p className="text-xs text-[#777]">
                Authored by {activeArticle.author} • Master Stylist at Fine Hair Atelier
              </p>
            </div>

            <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#F5F5F5]">
              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-[#333] leading-relaxed space-y-4 whitespace-pre-line">
              {activeArticle.content}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#888]">Experience our master services in person:</span>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onNavigateToShop();
                  }}
                  className="flex-1 sm:flex-none bg-white border border-black text-black px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-[#F5F5F5]"
                >
                  Shop Wigs
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onNavigateToBook();
                  }}
                  className="flex-1 sm:flex-none bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-black/90"
                >
                  Book Stylist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
