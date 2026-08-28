import React, { useState } from 'react';
import {
  Product,
  Service,
  StaffMember,
  Appointment,
  Order,
  StaffDailyReport,
  ManagementFinancials,
  Language,
  InventoryAuditItem,
  StockReconciliationItem,
  StockExceptionItem,
  FinancialTransaction,
} from '../../types';
import { formatTZS } from '../../utils/formatters';
import { CatalogManager } from '../AdminManager/CatalogManager';
import {
  TrendingUp,
  Package,
  Calendar,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
  RefreshCw,
  Send,
  CheckCircle,
  FileText,
  DollarSign,
  ClipboardList,
  Layers,
  SlidersHorizontal,
  Download,
  Upload,
  Check,
  AlertOctagon,
  ArrowDownRight,
  CreditCard,
  Building2,
} from 'lucide-react';

interface ManagementDashboardProps {
  products: Product[];
  services: Service[];
  staffList: StaffMember[];
  appointments: Appointment[];
  orders: Order[];
  dailyReports: StaffDailyReport[];
  financials: ManagementFinancials;
  language: Language;
  auditLog?: InventoryAuditItem[];
  reconciliationList?: StockReconciliationItem[];
  stockExceptions?: StockExceptionItem[];
  transactions?: FinancialTransaction[];
  onRestockProduct: (productId: string, amount: number) => void;
  onUpdateProduct?: (updated: Product) => void;
  onAddProduct?: (newProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateService?: (updated: Service) => void;
  onApproveReconciliation?: (id: string) => void;
  onResolveException?: (id: string, status: any, notes: string) => void;
  onAddTransaction?: (txn: FinancialTransaction) => void;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  products,
  services,
  staffList,
  appointments,
  orders,
  dailyReports,
  financials,
  language,
  auditLog = [],
  reconciliationList = [],
  stockExceptions = [],
  transactions = [],
  onRestockProduct,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateService,
  onApproveReconciliation,
  onResolveException,
  onAddTransaction,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'custom'>('7d');
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'catalog'
    | 'inventory'
    | 'reconciliation'
    | 'exceptions'
    | 'audit_log'
    | 'financials'
    | 'staff'
  >('overview');

  const [aiInsights, setAiInsights] = useState<any[]>([
    {
      title: 'FineTouch Priority Focus: No Leave Out & Brazilian Knots',
      type: 'opportunity',
      text: 'No Leave Out frontal installations and Brazilian Knots carry an average ticket of 135,000 TZS with 88% gross margin. Increasing weekend booking slots for Farida and Zainab will yield +1,800,000 TZS this week.',
    },
    {
      title: 'CRITICAL STOCK ALERT: Kinky-Straight Weft 14" (0 Units)',
      type: 'inventory',
      text: 'Kinky-Straight Weft 14" 100g is completely OUT OF STOCK (0 units recorded). 3 client inquiries logged over WhatsApp. Restock shipment from Phnom Penh donor batch expected in 48 hours.',
    },
    {
      title: 'Stock Exception Resolution Needed',
      type: 'exception',
      text: '2 bundles of Raw 4C Afro Weft (20") were issued to Room B without being recorded in POS sales ledger. Manager review required.',
    },
  ]);

  const [loadingAI, setLoadingAI] = useState(false);

  // Quick stats calculation
  const totalUnitsInStock = products.reduce((acc, p) => acc + p.availableQuantity, 0);
  const totalRawUnits = products.filter((p) => p.category === 'raw_hair' || p.category === 'bundles').reduce((acc, p) => acc + p.availableQuantity, 0);
  const totalWigUnits = products.filter((p) => p.category === 'wigs').reduce((acc, p) => acc + p.availableQuantity, 0);
  const outOfStockCount = products.filter((p) => p.availableQuantity === 0).length;
  const pendingExceptionsCount = stockExceptions.filter((e) => e.status === 'Needs Review').length;

  // Profitable Services list
  const profitableServices = services.filter((s) => s.isPriorityProfitable);

  const handleFetchAiInsights = async () => {
    setLoadingAI(true);
    setTimeout(() => {
      setAiInsights([
        {
          title: 'FineTouch Bundle + Install Cross-Sell Impact',
          type: 'opportunity',
          text: '4C Afro Glueless HD Closure Wigs combined with No Leave Out installations generated 4,100,000 TZS in revenue this month. 62% of customers also purchase the Tanzanian Rosemary Edge Elixir when suggested at checkout.',
        },
        {
          title: 'Inventory Audit & Discrepancy Health',
          type: 'inventory',
          text: 'Physical audit variance is below 0.5% across all 163 SKU lines. Only 1 SKU (Kinky-Straight Weft 14") is currently awaiting replenishment.',
        },
        {
          title: 'Staff Balanced Performance Metric',
          type: 'staff',
          text: 'Farida Ally and Zainab Rashid achieved 100% Swahili daily reporting streaks, zero client complaints, and 4.9+ star ratings.',
        },
      ]);
      setLoadingAI(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold bg-[#FAF6EE] px-2 py-0.5 rounded-xs border border-[#EAE6DD]">
              EXECUTIVE INTELLIGENCE & BUSINESS OPERATIONS
            </span>
            <span className="text-xs text-[#666]">Mikocheni B, Ussagara St • Dar es Salaam</span>
          </div>
          <h1 className="editorial-title text-2xl sm:text-4xl text-[#111111] mt-1">
            Fine Hair Executive Operations & Control
          </h1>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleFetchAiInsights}
            disabled={loadingAI}
            className="bg-[#111111] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{loadingAI ? 'Analyzing...' : 'Run Operations AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* Critical Stock Alert Banner if any OUT OF STOCK or EXCEPTIONS */}
      {(outOfStockCount > 0 || pendingExceptionsCount > 0) && (
        <div className="bg-[#FFFBF5] border-l-4 border-amber-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#111111] block">
                STOCK CONTROL ALERT: {outOfStockCount} SKU Out of Stock • {pendingExceptionsCount} Stock Exceptions Awaiting Review
              </span>
              <p className="text-[#666666] mt-0.5">
                Kinky-Straight Weft 14" 100g is at 0 units. Check Exceptions tab to reconcile unrecorded stock issues.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('exceptions')}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors cursor-pointer"
            >
              Review Exceptions ({pendingExceptionsCount})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className="px-3 py-1.5 bg-white border border-[#CCCCCC] text-[#333333] rounded-lg text-xs font-semibold hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              View Inventory
            </button>
          </div>
        </div>
      )}

      {/* Executive Key Figures Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium block">
            Total Inventory Units
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">534</span>
            <span className="text-xs text-[#888888]">Units Total</span>
          </div>
          <p className="text-[10px] text-[#666666]">
            458 Raw/Extensions (163 SKUs) + 76 Finished Wigs (41 SKUs)
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium block">
            Monthly Gross Revenue
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#111111]">
              {formatTZS(financials.totalRevenue)}
            </span>
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold">
            Products: {formatTZS(financials.productSalesRevenue)} • Services: {formatTZS(financials.serviceRevenue)}
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium block">
            Net Operating Profit
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-700">
              {formatTZS(financials.netOperatingProfit)}
            </span>
          </div>
          <p className="text-[10px] text-[#666666]">
            Operating Margin: 39.5% after expenses & procurement
          </p>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-xl p-4 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium block">
            Staff Reporting Consistency
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">98.5%</span>
          </div>
          <p className="text-[10px] text-[#8A6D3B] font-semibold">
            32-Day Streak • 0 Customer Complaints
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-[#EAEAEA] overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
          { id: 'catalog', label: 'Master Catalog & Pricing', icon: SlidersHorizontal },
          { id: 'inventory', label: 'Stock & Unit Control (534)', icon: Package },
          { id: 'reconciliation', label: 'Stock Reconciliation', icon: ClipboardList },
          { id: 'exceptions', label: `Stock Exceptions (${stockExceptions.length})`, icon: AlertOctagon },
          { id: 'audit_log', label: 'Inventory Audit Trail', icon: FileText },
          { id: 'financials', label: 'Financial System & Ledger', icon: DollarSign },
          { id: 'staff', label: 'Staff Balanced Scorecard', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-lg font-semibold flex items-center space-x-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-b-2 border-[#111111] text-[#111111] bg-[#FAF9F6]'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#B89758]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & PRIORITY PROFITABLE SERVICES */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* AI Strategic Intelligence Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#111111] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#B89758]" />
                <span>Operational Insights & Profit Maximizers</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#B89758] font-bold">
                      {insight.type}
                    </span>
                    <h3 className="text-xs font-bold text-[#111111]">{insight.title}</h3>
                    <p className="text-[11px] text-[#555555] leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Management-Only Priority Profitable Services Indicator */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold">
                  HIGH-MARGIN SIGNATURE SERVICES
                </span>
                <h3 className="font-serif text-lg font-bold text-[#111111]">
                  Priority Profitable Services (Management View Only)
                </h3>
              </div>
              <span className="text-xs bg-[#FAF6EE] text-[#8A6D3B] px-3 py-1 rounded-full font-bold border border-[#E8DECC]">
                High Margin Focus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profitableServices.map((serv) => (
                <div
                  key={serv.id}
                  className="bg-[#FAF9F6] border border-[#EAE6DD] rounded-xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#B89758] bg-white px-2 py-0.5 rounded-xs border border-[#EAEAEA]">
                        Profitable Priority
                      </span>
                      <span className="text-xs font-bold text-[#111111]">{formatTZS(serv.price)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#111111] mt-2">{serv.name}</h4>
                    <p className="text-[11px] text-[#666666] line-clamp-2 mt-1">{serv.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#EAE6DD] flex items-center justify-between text-[11px] text-[#777]">
                    <span>Duration: {serv.durationMinutes}m</span>
                    <span>Deposit: {formatTZS(serv.depositRequired)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER CATALOG & PRICING */}
      {activeTab === 'catalog' && (
        <CatalogManager
          products={products}
          services={services}
          language={language}
          onUpdateProduct={onUpdateProduct || (() => {})}
          onAddProduct={onAddProduct || (() => {})}
          onDeleteProduct={onDeleteProduct || (() => {})}
          onUpdateService={onUpdateService || (() => {})}
        />
      )}

      {/* TAB 3: INVENTORY & UNIT CONTROL */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Inventory Units & Stock Status
              </h3>
              <p className="text-xs text-[#666666]">
                Distinguishing Full bundle, Half bundle (Nusu), Piece, Pack, Unit, and Wig.
              </p>
            </div>
            <div className="text-xs text-[#888888]">
              Showing {products.length} Products ({totalUnitsInStock} Active Units)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAEA] bg-[#FAF9F6] text-[#666666] uppercase text-[10px] tracking-wider">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Family & Texture</th>
                  <th className="p-3">Unit Type</th>
                  <th className="p-3">Base Price</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Reserved</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {products.map((p) => {
                  const isOut = p.availableQuantity === 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#444] font-bold">{p.sku}</td>
                      <td className="p-3 font-semibold text-[#111] max-w-xs truncate">{p.name}</td>
                      <td className="p-3 text-[#555]">
                        <span className="font-semibold">{p.texture}</span>
                        <span className="block text-[10px] text-[#888]">{p.productFamily}</span>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#F0F0F0] px-2 py-0.5 rounded-xs text-[#333] font-medium">
                          {p.unitType}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#111]">{formatTZS(p.basePrice)}</td>
                      <td className="p-3 font-bold">
                        <span className={isOut ? 'text-red-600' : 'text-emerald-700'}>
                          {p.availableQuantity}
                        </span>
                      </td>
                      <td className="p-3 text-[#777]">{p.reservedQuantity}</td>
                      <td className="p-3">
                        {isOut ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-xs">
                            OUT OF STOCK
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-xs">
                            NORMAL
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onRestockProduct(p.id, 5)}
                          className="px-2.5 py-1 bg-[#111] hover:bg-black text-white text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                        >
                          +5 Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STOCK RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Stock Reconciliation & Physical Audits
              </h3>
              <p className="text-xs text-[#666666]">
                Physical count vs system inventory record matching and adjustment sign-offs.
              </p>
            </div>
            <button className="px-3 py-1.5 bg-[#111111] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Sheet</span>
            </button>
          </div>

          <div className="space-y-3">
            {reconciliationList.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#FAF9F6] border border-[#EAE6DD] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#111111]">{rec.sku}</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-xs border border-[#EAEAEA] text-[#666]">
                      {rec.unitType}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-xs">
                      {rec.approvalStatus}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#111111]">{rec.productName}</h4>
                  <p className="text-[11px] text-[#666666]">
                    Physical: <strong>{rec.physicalCount}</strong> | System: <strong>{rec.systemQuantity}</strong> (Diff: {rec.difference}) • Reason: {rec.reason}
                  </p>
                  <p className="text-[10px] text-[#888888]">
                    Audited by {rec.staffResponsible} on {rec.date}
                  </p>
                </div>

                {rec.approvalStatus === 'Pending Approval' && onApproveReconciliation && (
                  <button
                    onClick={() => onApproveReconciliation(rec.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Approve Variance
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STOCK EXCEPTIONS */}
      {activeTab === 'exceptions' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Stock Exceptions & Unrecorded Issues
              </h3>
              <p className="text-xs text-[#666666]">
                Items issued to stylists or salon floors without immediate receipt linkage.
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
              {stockExceptions.length} Recorded Exceptions
            </span>
          </div>

          <div className="space-y-3">
            {stockExceptions.map((exc) => (
              <div
                key={exc.id}
                className="bg-[#FFFDF9] border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#111111]">{exc.sku}</span>
                    <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-xs">
                      {exc.status}
                    </span>
                    <span className="text-xs text-[#777]">({exc.quantity} {exc.unitType})</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#111111]">{exc.productName}</h4>
                  <p className="text-[11px] text-[#555555]">
                    Location: <strong>{exc.location}</strong> • Flagged: {exc.flaggedReason}
                  </p>
                  <p className="text-[10px] text-[#888888]">
                    Reported by {exc.reportedBy} on {exc.date}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onResolveException && (
                    <>
                      <button
                        onClick={() => onResolveException(exc.id, 'Confirmed Sale', 'Linked to POS transaction')}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Confirm Sale
                      </button>
                      <button
                        onClick={() => onResolveException(exc.id, 'Internal Use', 'Accounted as Salon Operating Expense')}
                        className="px-2.5 py-1 bg-[#111111] hover:bg-black text-white text-[11px] font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Salon Expense
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INVENTORY AUDIT TRAIL */}
      {activeTab === 'audit_log' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Real-Time Inventory Audit Log
              </h3>
              <p className="text-xs text-[#666666]">
                Immutable timestamped log of all stock movements (Available, Reserved, Sold, Adjusted).
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#FAF9F6] rounded-xl border border-[#EAEAEA] flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#111111]">{log.productName}</span>
                    <span className="font-mono text-[10px] text-[#888888]">({log.sku})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                        log.action === 'SOLD'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'RESERVED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666]">{log.reason}</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#111111] block">
                    {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange} units
                  </span>
                  <span className="text-[10px] text-[#888888]">{log.staffName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FINANCIAL SYSTEM & LEDGER */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#111111]">
                Financial Management & Payment Ledgers
              </h3>
              <p className="text-xs text-[#666666]">
                Strict separation of Revenue, Expenses, Procurement, Staff Advances, and Transfers.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-[#FAF6EE] text-[#8A6D3B] px-3 py-1 rounded-full font-bold border border-[#E8DECC]">
                M-Pesa / Lipa Namba / Bank
              </span>
            </div>
          </div>

          {/* Payment Method Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#888888] block">M-Pesa Direct</span>
              <span className="text-lg font-serif font-bold text-[#111111]">{formatTZS(financials.paymentBreakdown.mpesa)}</span>
              <span className="text-[10px] text-[#666666] block mt-0.5">58% of volume</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#888888] block">Lipa Namba</span>
              <span className="text-lg font-serif font-bold text-[#111111]">{formatTZS(financials.paymentBreakdown.lipaNamba)}</span>
              <span className="text-[10px] text-[#666666] block mt-0.5">22% of volume</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#888888] block">Bank Transfer</span>
              <span className="text-lg font-serif font-bold text-[#111111]">{formatTZS(financials.paymentBreakdown.card)}</span>
              <span className="text-[10px] text-[#666666] block mt-0.5">12% of volume</span>
            </div>
            <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-[#888888] block">Cash at Salon</span>
              <span className="text-lg font-serif font-bold text-[#111111]">{formatTZS(financials.paymentBreakdown.cash)}</span>
              <span className="text-[10px] text-[#666666] block mt-0.5">8% of volume</span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-[#111111] tracking-wider">
              Recent Transactions Ledger
            </h4>
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="p-3 bg-[#FAF9F6] rounded-xl border border-[#EAEAEA] flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#111111]">{txn.partyName}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-xs border border-[#EAEAEA] text-[#555]">
                      {txn.paymentMethod} • {txn.reference}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666]">{txn.categoryTag}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-serif font-bold text-sm ${
                      txn.type === 'revenue' ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {txn.type === 'revenue' ? `+${formatTZS(txn.amount)}` : `-${formatTZS(txn.amount)}`}
                  </span>
                  <span className="text-[10px] text-[#888888] block">{txn.date.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: STAFF BALANCED SCORECARD & SWAHILI LOGS */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b border-[#EAEAEA] pb-4">
            <h3 className="font-serif text-lg font-bold text-[#111111]">
              Staff Balanced Scorecards & Daily Swahili Logs
            </h3>
            <p className="text-xs text-[#666666]">
              Performance assessed across Revenue, Attendance, Reporting Consistency, and Client Satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">{staff.name}</h4>
                    <p className="text-[10px] text-[#777777]">{staff.role}</p>
                    <span className="text-[10px] font-bold text-[#B89758]">★ {staff.rating}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#555] pt-2 border-t border-[#EAE6DD]">
                  <div className="flex justify-between">
                    <span className="text-[#888]">Monthly Revenue:</span>
                    <span className="font-bold text-black">{formatTZS(staff.monthlyRevenueGenerated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Reporting Streak:</span>
                    <span className="font-bold text-emerald-700">{staff.reportingStreakDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Attendance:</span>
                    <span className="font-bold text-black">{staff.attendanceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888]">Complaints:</span>
                    <span className="font-bold text-black">{staff.complaintsCount}</span>
                  </div>
                </div>

                {staff.managementNotes && (
                  <p className="text-[11px] text-[#666] italic bg-white p-2 rounded-lg border border-[#EAEAEA]">
                    "{staff.managementNotes}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Daily Swahili Reports Feed */}
          <div className="space-y-3 pt-4 border-t border-[#EAEAEA]">
            <h4 className="text-xs uppercase font-bold text-[#111111] tracking-wider">
              Verified Daily Swahili Staff Reports
            </h4>
            {dailyReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAEAEA] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111111]">{rep.staffName}</span>
                  <span className="text-[10px] text-[#888888]">{rep.submittedAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-white px-2 py-0.5 rounded-xs border border-[#EAEAEA] text-[#444] font-medium">
                    Clients: {rep.clientsServed}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded-xs border border-[#EAEAEA] text-[#444] font-medium">
                    Problem: {rep.problemCategory}
                  </span>
                </div>
                {rep.voiceTranscript && (
                  <p className="text-[11px] text-[#666666] italic bg-white p-2 rounded-lg border border-[#EAEAEA]">
                    Voice Log: "{rep.voiceTranscript}"
                  </p>
                )}
                <p className="text-[11px] text-[#444444]">
                  Needs for tomorrow: <strong>{rep.needsForTomorrow}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
