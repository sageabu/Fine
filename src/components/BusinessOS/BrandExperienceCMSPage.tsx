import React, { useState, useEffect } from 'react';
import {
  api,
  HomepageHeroCampaign,
  HomepageSectionConfig,
  MediaAssetRecord,
  CustomerRecord,
} from '../../utils/apiClient';
import {
  LayoutTemplate,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Calendar,
  Layers,
  Save,
  ShieldCheck,
  Smartphone,
  Monitor,
  Search,
  Check,
  X,
  ExternalLink,
  Edit3,
  History,
  Tag,
} from 'lucide-react';

interface BrandExperienceCMSPageProps {
  onOpenStorefront?: () => void;
}

export const BrandExperienceCMSPage: React.FC<BrandExperienceCMSPageProps> = ({ onOpenStorefront }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'media' | 'simulator'>('hero');

  // Hero Campaign State
  const [campaigns, setCampaigns] = useState<HomepageHeroCampaign[]>([]);
  const [activeHero, setActiveHero] = useState<HomepageHeroCampaign | null>(null);
  const [editingHero, setEditingHero] = useState<HomepageHeroCampaign | null>(null);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroSuccessMessage, setHeroSuccessMessage] = useState('');

  // Modular Sections State
  const [sections, setSections] = useState<HomepageSectionConfig[]>([]);
  const [isSavingSections, setIsSavingSections] = useState(false);
  const [sectionsSuccessMessage, setSectionsSuccessMessage] = useState('');

  // Media Library State
  const [mediaAssets, setMediaAssets] = useState<MediaAssetRecord[]>([]);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('All');
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    title: '',
    category: 'Hero Banners' as MediaAssetRecord['category'],
    campaign: 'Editorial Campaign 2026',
    source: 'Fine Hair Studio Shoot' as MediaAssetRecord['source'],
    hairTexture: '4C Natural Coils',
    url: '',
    usageRightsVerified: true,
    representationVerified: true,
  });

  // Personalization Simulator State
  const [simulatorAudience, setSimulatorAudience] = useState<'new' | 'returning' | 'overdue' | 'upcoming'>('new');
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [simulatedResult, setSimulatedResult] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Fetch initial CMS data
  const loadCMSData = async () => {
    try {
      const [heroRes, secRes, mediaRes, custRes] = await Promise.allSettled([
        api.getHeroCampaigns(),
        api.getHomepageSections(),
        api.getMediaAssets(),
        api.getCustomers(),
      ]);

      if (heroRes.status === 'fulfilled') {
        setCampaigns(heroRes.value.campaigns || []);
        setActiveHero(heroRes.value.activeHero || heroRes.value.campaigns?.[0] || null);
        setEditingHero(heroRes.value.activeHero || heroRes.value.campaigns?.[0] || null);
      }

      if (secRes.status === 'fulfilled') {
        setSections(secRes.value || []);
      }

      if (mediaRes.status === 'fulfilled') {
        setMediaAssets(mediaRes.value || []);
      }

      if (custRes.status === 'fulfilled') {
        setCustomers(custRes.value || []);
        if (custRes.value.length > 0) {
          setSelectedCustomerId(custRes.value[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load CMS data', err);
    }
  };

  useEffect(() => {
    loadCMSData();
  }, []);

  // Run Simulator when parameters change
  useEffect(() => {
    const runSimulation = async () => {
      try {
        let criteria: any = {};
        if (simulatorAudience === 'new') {
          criteria = { customerId: undefined, phone: '+255 799 000 111' };
        } else if (simulatorAudience === 'returning') {
          criteria = { customerId: 'cust-1' }; // Sarah M.
        } else if (simulatorAudience === 'overdue') {
          criteria = { customerId: 'cust-3' }; // Fatma K.
        } else if (simulatorAudience === 'upcoming') {
          criteria = { customerId: 'cust-2' }; // Amina J.
        }

        const res = await api.getPersonalizedHome(criteria);
        setSimulatedResult(res);
      } catch (err) {
        console.error('Failed to run simulation', err);
      }
    };

    if (activeTab === 'simulator') {
      runSimulation();
    }
  }, [activeTab, simulatorAudience]);

  // Save Hero Campaign
  const handleSaveHero = async () => {
    if (!editingHero) return;
    setIsSavingHero(true);
    try {
      const res = await api.updateHeroCampaign(editingHero.id, editingHero);
      setActiveHero(res.campaign);
      setHeroSuccessMessage('Hero banner updated and published instantly to customer homepage!');
      await loadCMSData();
      setTimeout(() => setHeroSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save hero banner');
    } finally {
      setIsSavingHero(false);
    }
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update sortOrder
    const updated = newSections.map((sec, idx) => ({ ...sec, sortOrder: idx + 1 }));
    setSections(updated);
  };

  // Toggle Section Enabled
  const handleToggleSection = (index: number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    setSections(updated);
  };

  // Save Sections Order and Config
  const handleSaveSections = async () => {
    setIsSavingSections(true);
    try {
      const res = await api.updateHomepageSections(sections);
      setSections(res.sections);
      setSectionsSuccessMessage('Homepage modular layout order and visibility updated!');
      setTimeout(() => setSectionsSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save sections');
    } finally {
      setIsSavingSections(false);
    }
  };

  // Handle Add Media Asset
  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetData.title || !newAssetData.url) {
      alert('Title and Image URL are required.');
      return;
    }

    try {
      await api.addMediaAsset(newAssetData);
      setIsUploadModalOpen(false);
      setNewAssetData({
        title: '',
        category: 'Hero Banners',
        campaign: 'Editorial Campaign 2026',
        source: 'Fine Hair Studio Shoot',
        hairTexture: '4C Natural Coils',
        url: '',
        usageRightsVerified: true,
        representationVerified: true,
      });
      await loadCMSData();
    } catch (err: any) {
      alert(err.message || 'Failed to add media asset');
    }
  };

  const filteredMedia = mediaAssets.filter((asset) => {
    const matchesCategory = selectedMediaCategory === 'All' || asset.category === selectedMediaCategory;
    const matchesSearch =
      asset.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      asset.campaign.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      asset.hairTexture.toLowerCase().includes(mediaSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302830] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ad8d58]">
            <LayoutTemplate className="w-4 h-4" />
            <span>Brand & Experience Governance</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Customer Home Content Manager</h1>
          <p className="text-xs text-[#a89fa6] mt-0.5">
            Single Source of Truth for homepage hero messaging, modular section ordering, approved media, and AI lifecycle personalization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenStorefront && (
            <button
              onClick={onOpenStorefront}
              className="bg-[#241f23] hover:bg-[#302830] text-white border border-[#443842] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#ad8d58]" />
              <span>Preview Live Storefront</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#302830] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#241f23] text-[#ad8d58] border-t-2 border-[#ad8d58]'
              : 'text-[#8c828b] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Hero Banner Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-[#241f23] text-[#ad8d58] border-t-2 border-[#ad8d58]'
              : 'text-[#8c828b] hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Modular Sections & Order</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'media'
              ? 'bg-[#241f23] text-[#ad8d58] border-t-2 border-[#ad8d58]'
              : 'text-[#8c828b] hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Brand Media Library ({mediaAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-[#241f23] text-[#ad8d58] border-t-2 border-[#ad8d58]'
              : 'text-[#8c828b] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Personalization Simulator</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: HERO BANNER MANAGER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'hero' && editingHero && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Edit Column */}
          <div className="lg:col-span-7 space-y-5 bg-[#1e191d] border border-[#302830] rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-[#302830] pb-3">
              <div>
                <h2 className="text-base font-semibold text-white">Edit Active Hero Campaign</h2>
                <p className="text-xs text-[#8c828b]">Controls the primary greeting headline, imagery, and CTAs across all web and mobile views.</p>
              </div>

              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                  editingHero.status === 'Published'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                }`}
              >
                ● {editingHero.status}
              </span>
            </div>

            {heroSuccessMessage && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{heroSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a89fa6] font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={editingHero.campaignName}
                  onChange={(e) => setEditingHero({ ...editingHero, campaignName: e.target.value })}
                  className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2.5 focus:border-[#ad8d58] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Eyebrow / Badge Label</label>
                  <input
                    type="text"
                    value={editingHero.eyebrow}
                    onChange={(e) => setEditingHero({ ...editingHero, eyebrow: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2.5 focus:border-[#ad8d58] outline-none"
                    placeholder="e.g. New Collection 2026"
                  />
                </div>

                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Target Audience</label>
                  <select
                    value={editingHero.targetAudience}
                    onChange={(e) => setEditingHero({ ...editingHero, targetAudience: e.target.value as any })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2.5 focus:border-[#ad8d58] outline-none"
                  >
                    <option value="all">All Visitors</option>
                    <option value="new_clients">First-time / New Visitors</option>
                    <option value="returning_clients">Returning VIP Clients</option>
                    <option value="overdue_clients">Rebooking Due / Inactive Clients</option>
                    <option value="has_upcoming_appointment">Clients with Upcoming Appointment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#a89fa6] font-medium mb-1">Main Headline</label>
                <input
                  type="text"
                  value={editingHero.headline}
                  onChange={(e) => setEditingHero({ ...editingHero, headline: e.target.value })}
                  className="w-full bg-[#141214] border border-[#3d333b] text-white font-serif text-base rounded-xl px-3 py-2.5 focus:border-[#ad8d58] outline-none"
                  placeholder="e.g. The Crown You Never Take Off."
                />
              </div>

              <div>
                <label className="block text-[#a89fa6] font-medium mb-1">Subheadline / Supporting Copy</label>
                <textarea
                  rows={3}
                  value={editingHero.subheadline}
                  onChange={(e) => setEditingHero({ ...editingHero, subheadline: e.target.value })}
                  className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2.5 focus:border-[#ad8d58] outline-none"
                />
              </div>

              {/* Hero Image Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[#a89fa6] font-medium">Hero Image (Approved Brand Library)</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('media')}
                    className="text-[#ad8d58] hover:underline text-[11px]"
                  >
                    Browse Full Library →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  {mediaAssets.slice(0, 3).map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() =>
                        setEditingHero({
                          ...editingHero,
                          heroImageId: asset.id,
                          heroImageUrl: asset.url,
                          mobileHeroImageUrl: asset.url,
                        })
                      }
                      className={`relative aspect-4/3 rounded-lg overflow-hidden border cursor-pointer group ${
                        editingHero.heroImageUrl === asset.url
                          ? 'border-[#ad8d58] ring-2 ring-[#ad8d58]'
                          : 'border-[#3d333b] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                      {editingHero.heroImageUrl === asset.url && (
                        <div className="absolute top-1 right-1 bg-[#ad8d58] text-black rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-white truncate">
                        {asset.title}
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={editingHero.heroImageUrl}
                  onChange={(e) => setEditingHero({ ...editingHero, heroImageUrl: e.target.value })}
                  className="w-full bg-[#141214] border border-[#3d333b] text-[#c9bfcc] rounded-xl px-3 py-2 text-[11px] focus:border-[#ad8d58] outline-none"
                  placeholder="Or enter custom verified image URL..."
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#302830]">
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Primary CTA Label</label>
                  <input
                    type="text"
                    value={editingHero.primaryCtaLabel}
                    onChange={(e) => setEditingHero({ ...editingHero, primaryCtaLabel: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Primary Action Target</label>
                  <select
                    value={editingHero.primaryCtaAction}
                    onChange={(e) => setEditingHero({ ...editingHero, primaryCtaAction: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  >
                    <option value="shop">Shop All Wigs & Extensions</option>
                    <option value="book">Book Salon Appointment</option>
                    <option value="advisor">Launch AI Hair Consultant</option>
                    <option value="learn">Hair Care & Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Secondary CTA Label</label>
                  <input
                    type="text"
                    value={editingHero.secondaryCtaLabel}
                    onChange={(e) => setEditingHero({ ...editingHero, secondaryCtaLabel: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Secondary Action Target</label>
                  <select
                    value={editingHero.secondaryCtaAction}
                    onChange={(e) => setEditingHero({ ...editingHero, secondaryCtaAction: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  >
                    <option value="book">Book Salon Appointment</option>
                    <option value="shop">Shop Wigs & Extensions</option>
                    <option value="advisor">Launch AI Hair Consultant</option>
                    <option value="learn">Hair Care & Academy</option>
                  </select>
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#302830]">
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingHero.startDate}
                    onChange={(e) => setEditingHero({ ...editingHero, startDate: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingHero.endDate}
                    onChange={(e) => setEditingHero({ ...editingHero, endDate: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div className="text-[11px] text-[#8c828b]">
                  Last Approved By: <strong className="text-white">{editingHero.approvedBy || 'CFO / Management'}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleSaveHero}
                  disabled={isSavingHero}
                  className="bg-[#ad8d58] hover:bg-[#c4a166] text-black font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingHero ? 'Publishing...' : 'Save & Publish Live'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Preview Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Live Preview</span>
              <div className="flex items-center gap-1 bg-[#141214] p-1 rounded-lg border border-[#302830]">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-[#241f23] text-white' : 'text-[#8c828b]'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-[#241f23] text-white' : 'text-[#8c828b]'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mocked Customer Home Hero Banner in Miniature */}
            <div
              className={`bg-white rounded-2xl border border-[#dcd6c8] overflow-hidden shadow-2xl transition-all ${
                previewDevice === 'mobile' ? 'max-w-xs mx-auto text-center' : 'w-full'
              }`}
            >
              <div className="bg-[#FAF9F5] border-b border-[#E8DECC] p-3 text-[10px] flex items-center justify-between text-[#8A6D3B]">
                <span className="font-semibold uppercase tracking-wider">FINE HAIR DAR ES SALAAM</span>
                <span>Mikocheni B</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="inline-flex items-center space-x-1.5 bg-[#F9F7F2] border border-[#E8DECC] px-2.5 py-0.5 rounded-full text-[10px] text-[#8A6D3B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89758]"></span>
                  <span className="font-medium uppercase">{editingHero.eyebrow}</span>
                </div>

                <h3 className="font-serif text-2xl font-normal text-[#111111] leading-tight">
                  {editingHero.headline}
                </h3>

                <p className="text-xs text-[#555] font-light leading-relaxed line-clamp-3">
                  {editingHero.subheadline}
                </p>

                <div className="rounded-xl overflow-hidden border border-[#eaeaea] relative aspect-16/10">
                  <img
                    src={editingHero.heroImageUrl}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded">
                    African Natural Texture (4C / 3C)
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button className="bg-[#111111] text-white px-4 py-2 rounded-full text-[11px] font-medium">
                    {editingHero.primaryCtaLabel}
                  </button>
                  <button className="bg-[#FAF9F5] text-[#111111] border border-[#E8DECC] px-4 py-2 rounded-full text-[11px]">
                    {editingHero.secondaryCtaLabel}
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Library Switcher */}
            <div className="bg-[#1e191d] border border-[#302830] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Scheduled Campaigns</h4>
                <button
                  onClick={async () => {
                    const newCamp = await api.createHeroCampaign({
                      campaignName: 'New Mid-Season Drop 2026',
                      headline: 'Lace Melted Beyond Perfection.',
                      subheadline: 'Ultra-thin 0.08mm Swiss lace curated for Dar es Salaam climate.',
                      eyebrow: 'Exclusive Atelier Drop',
                      heroImageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1000',
                      status: 'Draft',
                      primaryCtaLabel: 'Explore Drops',
                      primaryCtaAction: 'shop',
                      secondaryCtaLabel: 'Book Atelier',
                      secondaryCtaAction: 'book',
                      targetAudience: 'all',
                    });
                    await loadCMSData();
                    setEditingHero(newCamp.campaign);
                  }}
                  className="text-[11px] text-[#ad8d58] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Campaign</span>
                </button>
              </div>

              <div className="space-y-2">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    onClick={() => setEditingHero(camp)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      editingHero.id === camp.id
                        ? 'bg-[#2a2228] border-[#ad8d58]'
                        : 'bg-[#141214] border-[#302830] hover:border-[#443842]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{camp.campaignName}</div>
                      <div className="text-[10px] text-[#8c828b]">{camp.eyebrow} • {camp.startDate} to {camp.endDate}</div>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                        camp.status === 'Published'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: MODULAR SECTIONS & ORDER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'sections' && (
        <div className="bg-[#1e191d] border border-[#302830] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#302830] pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Modular Homepage Sections Control</h2>
              <p className="text-xs text-[#8c828b]">
                Drag or use arrows to rearrange the order of sections on the customer homepage, or toggle visibility on and off.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSections}
              disabled={isSavingSections}
              className="bg-[#ad8d58] hover:bg-[#c4a166] text-black font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSections ? 'Updating Layout...' : 'Save Section Order & Settings'}</span>
            </button>
          </div>

          {sectionsSuccessMessage && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{sectionsSuccessMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  section.enabled
                    ? 'bg-[#181517] border-[#3d333b]'
                    : 'bg-[#121012] border-[#252024] opacity-60'
                }`}
              >
                {/* Drag / Index */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded bg-[#241f23] text-white hover:bg-[#302830] disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded bg-[#241f23] text-white hover:bg-[#302830] disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-[#2a2429] flex items-center justify-center font-semibold text-xs text-[#ad8d58]">
                    #{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{section.title}</span>
                      <span className="text-[10px] text-[#ad8d58] bg-[#2a2429] px-2 py-0.5 rounded font-mono">
                        {section.sectionKey}
                      </span>
                    </div>
                    <div className="text-xs text-[#8c828b]">{section.subtitle}</div>
                  </div>
                </div>

                {/* Audience & Settings */}
                <div className="flex items-center flex-wrap gap-3">
                  <div className="text-[11px] text-[#a89fa6]">
                    Audience:{' '}
                    <span className="text-white font-medium capitalize">
                      {section.targetAudience.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleSection(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      section.enabled
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {section.enabled ? (
                      <>
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4 text-zinc-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: BRAND MEDIA LIBRARY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-[#1e191d] border border-[#302830] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Brand-Compliant Media Library</h2>
                <p className="text-xs text-[#8c828b]">
                  Only verified assets depicting authentic African 4C/3C textures with confirmed model rights can be published to the customer home.
                </p>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[#ad8d58] hover:bg-[#c4a166] text-black font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Verified Asset</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#8c828b]" />
                <input
                  type="text"
                  placeholder="Search by asset title, campaign, texture..."
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#ad8d58] outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Hero Banners', 'Service Catalogue', 'Shop Products', 'Journal & Editorial', 'Transformations'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedMediaCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        selectedMediaCategory === cat
                          ? 'bg-[#ad8d58] text-black font-semibold'
                          : 'bg-[#141214] text-[#8c828b] hover:text-white border border-[#302830]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMedia.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#1e191d] border border-[#302830] rounded-2xl overflow-hidden group hover:border-[#ad8d58] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#141214]">
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-black/70 backdrop-blur-xs text-[10px] text-[#ad8d58] px-2 py-0.5 rounded font-semibold">
                      {asset.category}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        asset.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white line-clamp-1">{asset.title}</h3>
                    <div className="text-xs text-[#ad8d58] mt-0.5">{asset.hairTexture}</div>
                    <div className="text-[11px] text-[#8c828b]">{asset.campaign}</div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#302830] text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>4C Melanin Verified</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Usage Rights Approved</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#302830]">
                    <button
                      onClick={() => {
                        if (editingHero) {
                          setEditingHero({
                            ...editingHero,
                            heroImageId: asset.id,
                            heroImageUrl: asset.url,
                            mobileHeroImageUrl: asset.url,
                          });
                          setActiveTab('hero');
                        }
                      }}
                      className="text-xs bg-[#241f23] hover:bg-[#ad8d58] hover:text-black text-white px-3 py-1.5 rounded-lg font-medium transition-colors w-full cursor-pointer text-center"
                    >
                      Set As Hero Banner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: AI PERSONALIZATION SIMULATOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'simulator' && (
        <div className="bg-[#1e191d] border border-[#302830] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#302830] pb-4">
            <h2 className="text-base font-semibold text-white">Customer Homepage Personalization Simulator</h2>
            <p className="text-xs text-[#8c828b]">
              Test how the homepage dynamically tailors its greeting, hero copy, and recommended service modules depending on whether the customer is first-time, returning VIP, overdue, or has an appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a89fa6] mb-2">Simulate Customer Lifecycle</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'new', label: 'New / First Visit' },
                    { id: 'returning', label: 'Returning VIP (Sarah M.)' },
                    { id: 'overdue', label: 'Overdue (Fatma K.)' },
                    { id: 'upcoming', label: 'Upcoming Appt (Amina J.)' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      onClick={() => setSimulatorAudience(aud.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        simulatorAudience === aud.id
                          ? 'bg-[#ad8d58] text-black border-[#ad8d58]'
                          : 'bg-[#141214] text-white border-[#302830] hover:border-[#443842]'
                      }`}
                    >
                      {aud.label}
                    </button>
                  ))}
                </div>
              </div>

              {simulatedResult?.clientProfile && (
                <div className="p-4 rounded-xl bg-[#141214] border border-[#302830] space-y-2 text-xs">
                  <div className="font-semibold text-white">Client Profile: {simulatedResult.clientProfile.name}</div>
                  <div className="text-[#8c828b]">Phone: {simulatedResult.clientProfile.phone}</div>
                  <div className="text-[#ad8d58]">Texture: {simulatedResult.clientProfile.hairTexture}</div>
                  <div className="text-emerald-400">Total Visits: {simulatedResult.clientProfile.visitCount}</div>
                </div>
              )}
            </div>

            {/* Simulation Preview Output */}
            <div className="lg:col-span-8 bg-[#141214] border border-[#302830] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#302830] pb-2">
                <span className="text-xs font-semibold text-[#ad8d58] uppercase">Dynamic Output Engine</span>
                <span className="text-[10px] bg-[#241f23] text-white px-2 py-0.5 rounded">
                  Lifecycle: {simulatedResult?.clientLifecycle || 'new'}
                </span>
              </div>

              {simulatedResult?.hero && (
                <div className="p-4 rounded-xl bg-[#1e191d] border border-[#3d333b] space-y-2">
                  <div className="text-[10px] text-[#ad8d58] font-semibold uppercase">{simulatedResult.hero.dynamicEyebrow}</div>
                  <h3 className="font-serif text-xl font-bold text-white">{simulatedResult.hero.dynamicHeadline}</h3>
                  <p className="text-xs text-[#c9bfcc]">{simulatedResult.hero.dynamicSubheadline}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Composed Sections Shown to User</h4>
                <div className="space-y-1.5">
                  {simulatedResult?.sections?.map((sec: any, idx: number) => (
                    <div key={sec.id} className="p-2.5 rounded-lg bg-[#1e191d] border border-[#302830] text-xs flex items-center justify-between">
                      <span className="text-white font-medium">{idx + 1}. {sec.title}</span>
                      <span className="text-[10px] text-[#ad8d58] font-mono">{sec.sectionKey}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Upload Media Modal */}
      {/* ------------------------------------------------------------- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e191d] border border-[#3d333b] rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#302830] pb-3">
              <h3 className="text-base font-semibold text-white">Add Verified Brand Asset</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-[#8c828b] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMedia} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a89fa6] font-medium mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={newAssetData.title}
                  onChange={(e) => setNewAssetData({ ...newAssetData, title: e.target.value })}
                  placeholder="e.g. Editorial 4C Raw Curly Bundle Crown"
                  className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Category</label>
                  <select
                    value={newAssetData.category}
                    onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value as any })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  >
                    <option value="Hero Banners">Hero Banners</option>
                    <option value="Service Catalogue">Service Catalogue</option>
                    <option value="Shop Products">Shop Products</option>
                    <option value="Journal & Editorial">Journal & Editorial</option>
                    <option value="Transformations">Transformations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a89fa6] font-medium mb-1">Hair Texture Tag</label>
                  <input
                    type="text"
                    value={newAssetData.hairTexture}
                    onChange={(e) => setNewAssetData({ ...newAssetData, hairTexture: e.target.value })}
                    className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89fa6] font-medium mb-1">Direct Image URL</label>
                <input
                  type="url"
                  required
                  value={newAssetData.url}
                  onChange={(e) => setNewAssetData({ ...newAssetData, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#141214] border border-[#3d333b] text-white rounded-xl px-3 py-2 focus:border-[#ad8d58] outline-none"
                />
              </div>

              <div className="p-3 bg-[#141214] rounded-xl border border-[#302830] space-y-2">
                <div className="text-[11px] font-semibold text-[#ad8d58]">Brand Compliance Verification Checklist</div>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetData.representationVerified}
                    onChange={(e) => setNewAssetData({ ...newAssetData, representationVerified: e.target.checked })}
                    className="rounded text-[#ad8d58] focus:ring-0"
                  />
                  <span>Verified authentic African melanin / 4C natural texture model</span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetData.usageRightsVerified}
                    onChange={(e) => setNewAssetData({ ...newAssetData, usageRightsVerified: e.target.checked })}
                    className="rounded text-[#ad8d58] focus:ring-0"
                  />
                  <span>Verified licensing rights / studio release on file</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#302830]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-white hover:bg-[#241f23] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ad8d58] hover:bg-[#c4a166] text-black font-semibold px-5 py-2 rounded-xl cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
