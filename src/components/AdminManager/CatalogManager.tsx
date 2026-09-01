import React, { useState } from 'react';
import { Product, Service, Language } from '../../types';
import { formatTZS } from '../../utils/formatters';
import { Edit3, Plus, Image as ImageIcon, DollarSign, Check, X, Sparkles, Trash2, Eye, ShieldAlert, Package, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface CatalogManagerProps {
  products: Product[];
  services: Service[];
  language: Language;
  onUpdateProduct: (updated: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateService: (updated: Service) => void;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({
  products,
  services,
  language,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateService,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'new_product'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // New Product Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Product['category']>('wigs');
  const [newTexture, setNewTexture] = useState<Product['texture']>('Kinky Coily (4C)');
  const [newPrice, setNewPrice] = useState<number>(550000);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000');
  const [newDescription, setNewDescription] = useState('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    showNotification(`Updated "${editingProduct.name}" price & details successfully!`);
    setEditingProduct(null);
  };

  const handleSaveServiceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateService(editingService);
    showNotification(`Updated "${editingService.name}" price successfully!`);
    setEditingService(null);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sku: `FH-NEW-${Date.now().toString().slice(-4)}`,
      productFamily: newCategory === 'wigs' ? 'Wigs Collection' : 'Afro & Coily Family',
      name: newName.trim(),
      category: newCategory,
      hairType: newTexture.includes('4C') ? 'Natural Afro 4C/4B' : '100% Raw Virgin',
      texture: newTexture,
      unitType: newCategory === 'wigs' ? 'Wig' : 'Full bundle',
      color: 'Natural Black 1B',
      basePrice: Number(newPrice) || 500000,
      availableQuantity: 5,
      reservedQuantity: 0,
      availableToSellQuantity: 5,
      soldQuantity: 0,
      stockStatus: 'NORMAL',
      lowStockThreshold: 2,
      isActive: true,
      variants: [
        { length: '20 inch', price: Number(newPrice) || 500000, stock: 5 },
        { length: '24 inch', price: (Number(newPrice) || 500000) + 60000, stock: 3 },
      ],
      images: [newImageUrl.trim() || 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000'],
      description: newDescription.trim() || 'Authentic donor hair customized for Fine Hair Mikocheni B boutique.',
      careInstructions: ['Wash with sulfate-free shampoo', 'Store in satin bag'],
      isBestSeller: false,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 1,
      deliveryTime: 'Available at Mikocheni B Boutique',
    };

    onAddProduct(newProd);
    showNotification(`Added new product "${newProd.name}" to catalog!`);
    setNewName('');
    setNewDescription('');
    setActiveTab('products');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.texture.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 bg-[#111] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#D4AF37] flex items-center space-x-2 text-xs animate-in slide-in-from-top duration-300">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner with Explanations */}
      <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salon Owner & Manager Mode</span>
            </div>
            <h1 className="editorial-title text-2xl sm:text-3xl text-white">
              Catalog, Prices & Images Manager
            </h1>
            <p className="text-xs text-[#AAA] max-w-xl">
              Easily update prices in Tanzanian Shillings (TZS), toggle stock availability, change product photos, add new wigs, and modify salon services in real time.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new_product')}
            className="bg-[#D4AF37] hover:bg-[#C29E2E] text-black px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>

        {/* Quick Tabs Switcher */}
        <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-black font-semibold'
                : 'text-[#BBB] hover:text-white hover:bg-white/10'
            }`}
          >
            Products & Wigs ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-black font-semibold'
                : 'text-[#BBB] hover:text-white hover:bg-white/10'
            }`}
          >
            Salon Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('new_product')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'new_product'
                ? 'bg-white text-black font-semibold'
                : 'text-[#BBB] hover:text-white hover:bg-white/10'
            }`}
          >
            + Create New Item
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCT LIST & PRICE EDIT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search products by title or texture (e.g. 4C, Bone Straight)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#E0DACE] rounded-xl px-4 py-2.5 text-xs text-[#111] focus:border-black outline-hidden flex-1 shadow-2xs"
            />
            <span className="text-xs text-[#666] shrink-0 font-medium">
              {filteredProducts.length} items listed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-[#EAEAEA] p-4 flex gap-3 shadow-2xs hover:shadow-sm transition-all"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 rounded-lg bg-[#F5F5F5] overflow-hidden shrink-0 border border-[#EAEAEA] relative">
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000'}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                    {prod.texture.slice(0, 8)}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h2 className="text-xs font-semibold text-[#111] truncate">{prod.name}</h2>
                    </div>
                    <div className="text-[11px] text-[#666] mt-0.5">
                      Texture: <span className="text-black font-medium">{prod.texture}</span>
                    </div>
                    <div className="text-sm font-serif font-bold text-[#B89758] mt-1">
                      {formatTZS(prod.basePrice)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F5] text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      (prod.variants?.[0]?.stock || 0) > 0 ? 'bg-[#25D366]/10 text-[#20BA5A]' : 'bg-red-100 text-red-700'
                    }`}>
                      {(prod.variants?.[0]?.stock || 0) > 0 ? `In Stock (${prod.variants?.[0]?.stock || 5})` : 'Out of Stock'}
                    </span>

                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="bg-[#111] hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                      <span>Edit Price & Info</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SALON SERVICES & PRICES */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((serv) => (
              <div
                key={serv.id}
                className="bg-white rounded-xl border border-[#EAEAEA] p-4 flex gap-3 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="w-20 h-20 rounded-lg bg-[#F5F5F5] overflow-hidden shrink-0 border border-[#EAEAEA]">
                  <img
                    src={serv.image}
                    alt={serv.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h2 className="text-xs font-semibold text-[#111]">{serv.name}</h2>
                    <div className="text-[11px] text-[#666] mt-0.5">{serv.durationMinutes} minutes</div>
                    <div className="text-sm font-serif font-bold text-[#B89758] mt-1">
                      {formatTZS(serv.price)} <span className="text-[10px] text-[#888] font-sans font-normal">(Deposit: {formatTZS(serv.depositRequired)})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingService(serv)}
                    className="self-end bg-[#111] hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                    <span>Edit Service Price</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE NEW PRODUCT */}
      {activeTab === 'new_product' && (
        <form onSubmit={handleCreateNewProduct} className="bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="border-b border-[#F0F0F0] pb-3">
            <h2 className="text-lg font-serif font-semibold text-[#111]">Add New Wig or Product to Boutique</h2>
            <p className="text-xs text-[#666]">This will immediately appear in the customer shop and catalog.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Raw 4C Kinky Afro HD Lace Wig"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2.5 text-xs text-[#111] focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">Base Price in TZS</label>
              <input
                type="number"
                required
                step="5000"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2.5 text-xs text-[#111] focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">Hair Texture</label>
              <select
                value={newTexture}
                onChange={(e) => setNewTexture(e.target.value as any)}
                className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2.5 text-xs text-[#111] focus:bg-white outline-hidden"
              >
                <option value="Kinky Coily (4C)">Kinky Coily (4C / 4B Natural Afro)</option>
                <option value="Deep Wave">Deep Wave (3C / 4A Natural Curls)</option>
                <option value="Bone Straight">Bone Straight Raw Hair</option>
                <option value="Yaki Straight">Yaki Straight (4C Blowout)</option>
                <option value="Body Wave">Body Wave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2.5 text-xs text-[#111] focus:bg-white outline-hidden"
              >
                <option value="wigs">HD Lace Wigs</option>
                <option value="bundles">Raw Bundles</option>
                <option value="closures_frontals">Closures & Frontals</option>
                <option value="hair_care">Hair & Scalp Care</option>
                <option value="installation_tools">Installation Tools & Sprays</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">Image URL (African Natural Hair Photo)</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2.5 text-xs text-[#111] focus:bg-white outline-hidden"
              />
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E0DACE] shrink-0 bg-[#F5F5F5]">
                <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Features, longevity, and lace melt specifications..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Publish to Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="px-5 py-3 rounded-xl border border-[#EAEAEA] text-xs font-medium text-[#666] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* MODAL: EDIT PRODUCT DETAILS & PRICE */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#EAEAEA] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] flex items-center justify-center text-[#666] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#B89758]">Product Editor</span>
              <h2 className="text-xl font-serif font-medium text-[#111]">Update Product & Price</h2>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">Base Price (TZS)</label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">Stock Status</label>
                  <select
                    value={(editingProduct.variants?.[0]?.stock || 0) > 0 ? 'instock' : 'outofstock'}
                    onChange={(e) => {
                      const newStock = e.target.value === 'instock' ? 5 : 0;
                      setEditingProduct({
                        ...editingProduct,
                        variants: (editingProduct.variants || [{ length: 'Standard', price: editingProduct.basePrice, stock: 5 }]).map((v) => ({ ...v, stock: newStock })),
                      });
                    }}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                  >
                    <option value="instock">In Stock (Available)</option>
                    <option value="outofstock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={editingProduct.images?.[0] || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        images: [e.target.value, ...(editingProduct.images?.slice(1) || [])],
                      })
                    }
                    className="flex-1 bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                  />
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E0DACE] shrink-0 bg-[#F5F5F5]">
                    <img src={editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000'} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#111] hover:bg-black text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAEAEA] text-xs font-medium text-[#666] hover:bg-[#F5F5F5] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE DETAILS & PRICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#EAEAEA] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] flex items-center justify-center text-[#666] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#B89758]">Service Editor</span>
              <h2 className="text-xl font-serif font-medium text-[#111]">Update Salon Service</h2>
            </div>

            <form onSubmit={handleSaveServiceEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">Service Price (TZS)</label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1">Deposit (TZS)</label>
                  <input
                    type="number"
                    required
                    step="5000"
                    value={editingService.depositRequired}
                    onChange={(e) => setEditingService({ ...editingService, depositRequired: Number(e.target.value) })}
                    className="w-full bg-[#FAF9F6] border border-[#E0DACE] rounded-xl px-3.5 py-2 text-xs text-[#111] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#111] hover:bg-black text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4 text-[#25D366]" />
                  <span>Save Service Price</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#EAEAEA] text-xs font-medium text-[#666] hover:bg-[#F5F5F5] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
