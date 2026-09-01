import React, { useState, useEffect } from 'react';
import {
  EcosystemPerspective,
  Product,
  Service,
  StaffMember,
  Appointment,
  Order,
  OrderItem,
  StaffDailyReport,
  CustomerHairProfile,
  Language,
  InventoryAuditItem,
  StockReconciliationItem,
  StockExceptionItem,
  FinancialTransaction,
} from './types';
import {
  mockProducts,
  mockServices,
  mockStaff,
  mockAppointments,
  mockOrders,
  mockDailyReports,
  mockFinancials,
  mockCustomerProfile,
  mockEducationalArticles,
  mockAuditLog,
  mockReconciliation,
  mockStockExceptions,
  mockTransactions,
} from './data/mockData';
import { Header } from './components/Header';
import { CustomerHome } from './components/CustomerApp/CustomerHome';
import { ShopView } from './components/CustomerApp/ShopView';
import { BookingView } from './components/CustomerApp/BookingView';
import { CartDrawer } from './components/CustomerApp/CartDrawer';
import { HairAdvisorModal } from './components/CustomerApp/HairAdvisorModal';
import { HairProfileModal } from './components/CustomerApp/HairProfileModal';
import { LoginModal } from './components/CustomerApp/LoginModal';
import { UnifiedSearchModal } from './components/UnifiedSearchModal';
import { StaffDashboard } from './components/StaffApp/StaffDashboard';
import { ManagementDashboard } from './components/ManagementDashboard/ManagementDashboard';
import { EducationAcademy } from './components/EducationAcademy/EducationAcademy';
import { RoleAccessModal } from './components/RoleAccessModal';
import { BusinessOSDashboard } from './components/BusinessOS/BusinessOSDashboard';
import { generateWhatsAppLink } from './utils/formatters';
import { MessageSquare, Sparkles, ShoppingBag, Heart, ArrowUp, LogIn, UserCheck, Lock, ShieldCheck, ClipboardList } from 'lucide-react';
import { BOSService, BOSAppointment } from './types/businessOS';
import {
  serviceToBOSService,
  appointmentToBOS,
  bosToAppointment,
  calculateAuditedFinancials,
} from './utils/domainBridge';
import { api, UserAccount, SessionRecord, getStoredUser, getStoredSession, clearApiSession } from './utils/apiClient';

export default function App() {
  // Enterprise IAM Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(getStoredUser());
  const [currentSession, setCurrentSession] = useState<SessionRecord | null>(getStoredSession());
  const [activeRole, setActiveRole] = useState<'customer' | 'staff' | 'management'>('customer');
  const [activeStaffId, setActiveStaffId] = useState<string>('staff-1');
  const [isRoleAccessModalOpen, setIsRoleAccessModalOpen] = useState<boolean>(false);

  // Global Perspective & Customer Sub-Tab (Default to Customer Storefront for security)
  const [perspective, setPerspective] = useState<EcosystemPerspective | 'business-os'>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'shop' | 'book' | 'learn' | 'profile'>('home');
  const [language, setLanguage] = useState<Language>('en');

  // Business Data State
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [dailyReports, setDailyReports] = useState<StaffDailyReport[]>(mockDailyReports);
  const [financials, setFinancials] = useState(mockFinancials);
  const [userProfile, setUserProfile] = useState<CustomerHairProfile>(mockCustomerProfile);

  // Operational State (Audit, Reconciliation, Exceptions, Ledger)
  const [auditLog, setAuditLog] = useState<InventoryAuditItem[]>(mockAuditLog);
  const [reconciliationList, setReconciliationList] = useState<StockReconciliationItem[]>(mockReconciliation);
  const [stockExceptions, setStockExceptions] = useState<StockExceptionItem[]>(mockStockExceptions);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);

  // Check current session validity on startup and fetch database state
  useEffect(() => {
    const initApp = async () => {
      try {
        const meRes = await api.getMe();
        if (meRes.success && meRes.user && meRes.session) {
          setCurrentUser(meRes.user);
          setCurrentSession(meRes.session);
          if (['Executive', 'Manager', 'Supervisor', 'Admin'].includes(meRes.user.role)) {
            setActiveRole('management');
          } else if (['Stylist', 'Colorist', 'Trichologist', 'Staff'].includes(meRes.user.role)) {
            setActiveRole('staff');
            if (meRes.user.staffProfileId) {
              setActiveStaffId(meRes.user.staffProfileId);
            }
          }
        }
      } catch (err) {
        console.warn('Session verification fallback to guest', err);
      }

      // Fetch live business data
      try {
        const [svcs, stff, apts] = await Promise.allSettled([
          api.getServices(),
          api.getStaff(),
          api.getAppointments(),
        ]);
        if (svcs.status === 'fulfilled' && svcs.value && svcs.value.length > 0) {
          setServices(svcs.value);
        }
        if (stff.status === 'fulfilled' && stff.value && stff.value.length > 0) {
          setStaffList(stff.value);
        }
        if (apts.status === 'fulfilled' && apts.value && apts.value.length > 0) {
          setAppointments(apts.value);
        }
      } catch (err) {
        console.warn('Could not sync initial business collections', err);
      }
    };
    initApp();
  }, []);

  // Modal and Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState<OrderItem[]>([
    {
      productId: 'prod-cls-1',
      productName: 'Raw 4C Afro Coily 5x5 HD Lace Closure (Single Donor)',
      variantLength: '18 inch',
      price: 340000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000',
    },
  ]);
  const [isHairAdvisorOpen, setIsHairAdvisorOpen] = useState(false);
  const [isHairProfileOpen, setIsHairProfileOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  // Active Staff Member Reference
  const activeStaffMember = staffList.find((s) => s.id === activeStaffId) || staffList?.[0];

  // Enterprise Authentication Handlers
  const handleAuthenticated = (user: UserAccount, session: SessionRecord) => {
    setCurrentUser(user);
    setCurrentSession(session);
    if (['Executive', 'Manager', 'Supervisor', 'Admin'].includes(user.role)) {
      setActiveRole('management');
      setPerspective('business-os');
    } else if (['Stylist', 'Colorist', 'Trichologist', 'Staff'].includes(user.role)) {
      setActiveRole('staff');
      if (user.staffProfileId) {
        setActiveStaffId(user.staffProfileId);
      }
      setPerspective('staff');
    } else {
      setActiveRole('customer');
      setPerspective('customer');
    }
  };

  const handleLoggedOut = () => {
    clearApiSession();
    setCurrentUser(null);
    setCurrentSession(null);
    setActiveRole('customer');
    setPerspective('customer');
  };

  // Role Access Handler
  const handleRoleSelection = (role: 'customer' | 'staff' | 'management', staffId?: string) => {
    setActiveRole(role);
    if (role === 'staff') {
      if (staffId) setActiveStaffId(staffId);
      setPerspective('staff');
    } else if (role === 'management') {
      setPerspective('business-os');
    } else {
      setPerspective('customer');
      setCustomerTab('home');
    }
  };

  // Safe Perspective Selector with Strict Role Verification
  const handleSelectPerspective = (targetPerspective: any) => {
    if (targetPerspective === 'business-os' || targetPerspective === 'management') {
      if (currentUser && ['Executive', 'Manager', 'Supervisor', 'Admin'].includes(currentUser.role)) {
        setPerspective('business-os');
      } else {
        setIsRoleAccessModalOpen(true);
      }
    } else if (targetPerspective === 'staff') {
      if (currentUser && ['Executive', 'Manager', 'Supervisor', 'Admin', 'Stylist', 'Colorist', 'Trichologist', 'Staff'].includes(currentUser.role)) {
        setPerspective('staff');
      } else {
        setIsRoleAccessModalOpen(true);
      }
    } else if (targetPerspective === 'education' || targetPerspective === 'learn') {
      setPerspective('education');
    } else {
      setPerspective('customer');
    }
  };

  // Product & Service Management Handlers
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    const auditEntry: InventoryAuditItem = {
      id: `audit-${Date.now().toString().slice(-4)}`,
      productId: updated.id,
      productName: updated.name,
      sku: updated.sku,
      action: 'ADJUSTED',
      quantityChange: 0,
      previousAvailable: updated.availableQuantity,
      newAvailable: updated.availableQuantity,
      reason: 'Price / Spec Update in Master Catalog',
      staffName: activeRole === 'management' ? 'Salon Director' : 'Executive Admin',
      timestamp: new Date().toISOString(),
    };
    setAuditLog((prev) => [auditEntry, ...prev]);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateService = (updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // Stock Control & Restocking
  const handleRestockProduct = (productId: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedQty = p.availableQuantity + amount;
          const auditEntry: InventoryAuditItem = {
            id: `audit-${Date.now().toString().slice(-4)}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            action: 'AVAILABLE',
            quantityChange: amount,
            previousAvailable: p.availableQuantity,
            newAvailable: updatedQty,
            reason: 'Atelier Floor Restock Batch',
            staffName: activeStaffMember?.name || 'Inventory Lead',
            timestamp: new Date().toISOString(),
          };
          setAuditLog((prevLog) => [auditEntry, ...prevLog]);
          return {
            ...p,
            availableQuantity: updatedQty,
            variants: p.variants.map((v) => ({ ...v, stock: v.stock + amount })),
          };
        }
        return p;
      })
    );
  };

  // Reconciliations & Exception Handlers
  const handleApproveReconciliation = (recId: string) => {
    setReconciliationList((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, approvalStatus: 'Approved' } : r))
    );
  };

  const handleResolveException = (excId: string, status: any, notes: string) => {
    setStockExceptions((prev) =>
      prev.map((e) => (e.id === excId ? { ...e, status, resolutionNotes: notes } : e))
    );
  };

  // Cart Operations
  const handleAddToCart = (product: Product, variantLength: string) => {
    const variant = product.variants?.find((v) => v.length === variantLength) || product.variants?.[0];
    const price = variant?.price || product.basePrice;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.variantLength === (variant?.length || 'Standard')
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.variantLength === (variant?.length || 'Standard')
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            variantLength: variant?.length || 'Standard',
            price,
            quantity: 1,
            image: product.images?.[0] || '',
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, variantLength: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variantLength === variantLength) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveCartItem = (productId: string, variantLength: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantLength === variantLength))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock upon checkout
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const orderItem = newOrder.items.find((item) => item.productId === p.id);
        if (orderItem) {
          const newQty = Math.max(0, p.availableQuantity - orderItem.quantity);
          const auditEntry: InventoryAuditItem = {
            id: `audit-${Date.now().toString().slice(-4)}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            action: 'SOLD',
            quantityChange: -orderItem.quantity,
            previousAvailable: p.availableQuantity,
            newAvailable: newQty,
            reason: `Order #${newOrder.id} (${newOrder.customerName})`,
            staffName: 'Online POS Checkout',
            timestamp: new Date().toISOString(),
          };
          setAuditLog((prevLog) => [auditEntry, ...prevLog]);

          return {
            ...p,
            availableQuantity: newQty,
            variants: p.variants.map((v) =>
              v.length === orderItem.variantLength
                ? { ...v, stock: Math.max(0, v.stock - orderItem.quantity) }
                : v
            ),
          };
        }
        return p;
      })
    );

    // Update financials & create verified transaction
    const newTxn: FinancialTransaction = {
      id: `txn-${Date.now().toString().slice(-4)}`,
      type: 'revenue',
      categoryTag: 'Product Sales (Hair Pieces & Wigs)',
      amount: newOrder.total,
      paymentMethod: newOrder.paymentMethod === 'M-Pesa' ? 'M-Pesa' : newOrder.paymentMethod === 'Lipa Namba' ? 'Lipa Namba' : newOrder.paymentMethod === 'Card' ? 'Bank' : 'Cash',
      reference: `ORD-${newOrder.id}`,
      partyName: newOrder.customerName,
      date: new Date().toISOString(),
      status: newOrder.paymentStatus === 'paid' ? 'completed' : 'pending',
    };
    const updatedTransactions = [newTxn, ...transactions];
    setTransactions(updatedTransactions);

    const updatedOrders = [newOrder, ...orders];
    const audited = calculateAuditedFinancials(financials, appointments, updatedOrders, updatedTransactions);
    setFinancials(audited);
  };

  // Appointment operations with double-entry reconciliation
  const handleConfirmAppointment = (newAppointment: Appointment) => {
    const updatedAppointments = [newAppointment, ...appointments];
    setAppointments(updatedAppointments);

    // Persist to unified single-source database
    api.createAppointment({
      customerName: newAppointment.customerName,
      customerPhone: newAppointment.customerPhone,
      serviceId: newAppointment.serviceId,
      staffId: newAppointment.staffId,
      date: newAppointment.date,
      time: newAppointment.time,
      paymentMethod: newAppointment.paymentMethod || 'M-Pesa',
      depositPaid: newAppointment.depositPaid,
    }).catch((err) => {
      console.warn('Central DB sync notice:', err.message);
    });

    const depositTxn: FinancialTransaction = {
      id: `txn-${Date.now().toString().slice(-4)}`,
      type: 'revenue',
      categoryTag: 'FineTouch Salon Booking Deposit',
      amount: newAppointment.depositPaid,
      paymentMethod: (newAppointment.paymentMethod as any) || 'M-Pesa',
      reference: `APT-${newAppointment.id}`,
      partyName: newAppointment.customerName,
      date: new Date().toISOString(),
      status: newAppointment.paymentMethod === 'Cash at Salon' ? 'pending' : 'completed',
    };
    const updatedTransactions = [depositTxn, ...transactions];
    setTransactions(updatedTransactions);

    const audited = calculateAuditedFinancials(financials, updatedAppointments, orders, updatedTransactions);
    setFinancials(audited);
  };

  // Synchronize price approvals from Business OS directly into customer booking catalogue
  const handleUpdateBOSServices = (updatedBOSServices: BOSService[]) => {
    setServices((prev) =>
      prev.map((s) => {
        const matchingBOS = updatedBOSServices.find(
          (b) => b.id === s.id || b.name.toLowerCase() === s.name.toLowerCase()
        );
        if (matchingBOS) {
          return {
            ...s,
            price: matchingBOS.currentPrice,
            description: matchingBOS.description,
            isActive: matchingBOS.status === 'Active',
          };
        }
        return s;
      })
    );
  };

  const handleAddBOSAppointment = (newBOS: BOSAppointment) => {
    const storefrontApt = bosToAppointment(newBOS);
    handleConfirmAppointment(storefrontApt);
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleSubmitDailyReport = (report: StaffDailyReport) => {
    setDailyReports((prev) => [report, ...prev]);
    // Increment staff streak
    setStaffList((prev) =>
      prev.map((st) =>
        st.id === report.staffId ? { ...st, reportingStreakDays: st.reportingStreakDays + 1 } : st
      )
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (perspective === 'business-os') {
    return (
      <BusinessOSDashboard
        onOpenStorefront={() => setPerspective('customer')}
        externalServices={services.map(serviceToBOSService)}
        onUpdateServices={handleUpdateBOSServices}
        externalAppointments={appointments.map(appointmentToBOS)}
        onAddAppointment={handleAddBOSAppointment}
        initialRole="Executive"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#111111] flex flex-col selection:bg-[#B89758] selection:text-white">
      {/* Ecosystem Role-Aware Global Header */}
      <Header
        currentPerspective={perspective}
        activeRole={activeRole}
        activeStaffMember={activeStaffMember}
        currentUser={currentUser}
        currentSession={currentSession}
        onSelectPerspective={handleSelectPerspective}
        onOpenRoleAccess={() => setIsRoleAccessModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'sw' : 'en')}
        onOpenHairAdvisor={() => setIsHairAdvisorOpen(true)}
        onOpenHairProfile={() => setIsHairProfileOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWhatsApp={() =>
          window.open(
            generateWhatsAppLink('+255754892110', 'Habari Fine Hair! Naomba msaada kuhusu wigs na appointment.'),
            '_blank'
          )
        }
        userProfile={userProfile}
        customerTab={customerTab}
        onSelectCustomerTab={setCustomerTab}
      />

      {/* Main Role & Perspective Router */}
      <main className="flex-1">
        {/* =========================================================================
            ROLE 1: CUSTOMER VIEW (Only accessible to customer or when previewing)
            ========================================================================= */}
        {perspective === 'customer' && (
          <div>
            {/* Customer Sub-Navigation Bar */}
            <div className="bg-white border-b border-[#EAEAEA] sticky top-16 z-30 shadow-2xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-4 py-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'home', label: language === 'en' ? 'Atelier Home' : 'Mwanzo' },
                    { id: 'shop', label: language === 'en' ? 'Shop Wigs & Bundles' : 'Duka la Wigs' },
                    { id: 'book', label: language === 'en' ? 'Book FineTouch Stylist' : 'Weka Nafasi' },
                    { id: 'learn', label: language === 'en' ? 'Hair Academy & Care' : 'Utunzaji & Elimu' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCustomerTab(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        customerTab === tab.id
                          ? 'bg-[#111111] text-white shadow-xs'
                          : 'text-[#666666] hover:text-black hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
                  {userProfile.isLoggedIn ? (
                    <button
                      onClick={() => setIsHairProfileOpen(true)}
                      className="bg-[#FAF9F5] border border-[#E8DECC] px-3 py-1 rounded-full text-[#8A6D3B] hover:text-black font-medium flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="truncate max-w-[120px]">
                        {userProfile.name} ({userProfile.naturalHairTexture})
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-[#111] hover:bg-black text-white px-3.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{language === 'en' ? 'Sign In / Profile' : 'Ingia / Wasifu'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Sub-Views */}
            {customerTab === 'home' && (
              <CustomerHome
                products={products}
                services={services}
                language={language}
                userProfile={userProfile}
                onAddToCart={(prod) => handleAddToCart(prod, prod.variants?.[0]?.length || 'Standard')}
                onSelectProduct={(prod) => {
                  setSelectedProductForModal(prod);
                  setCustomerTab('shop');
                }}
                onSelectService={(serv) => {
                  setSelectedServiceForBooking(serv);
                  setCustomerTab('book');
                }}
                onOpenHairAdvisor={() => setIsHairAdvisorOpen(true)}
                onOpenHairProfile={() => setIsHairProfileOpen(true)}
                onNavigateTab={setCustomerTab}
              />
            )}

            {customerTab === 'shop' && (
              <ShopView
                products={products}
                language={language}
                onAddToCart={handleAddToCart}
                onSelectProduct={setSelectedProductForModal}
                selectedProduct={selectedProductForModal}
                onCloseProductModal={() => setSelectedProductForModal(null)}
                onOpenHairAdvisor={() => setIsHairAdvisorOpen(true)}
              />
            )}

            {customerTab === 'book' && (
              <BookingView
                services={services}
                staffList={staffList}
                language={language}
                userProfile={userProfile}
                onConfirmAppointment={handleConfirmAppointment}
                onNavigateTab={setCustomerTab}
                initialSelectedService={selectedServiceForBooking}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
              />
            )}

            {customerTab === 'learn' && (
              <EducationAcademy
                articles={mockEducationalArticles}
                language={language}
                onNavigateToShop={() => setCustomerTab('shop')}
                onNavigateToBook={() => setCustomerTab('book')}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            ROLE 2: STAFF WORKSTATION (Accessible only to authenticated stylists)
            ========================================================================= */}
        {perspective === 'staff' && (
          <StaffDashboard
            staffList={staffList}
            appointments={appointments}
            orders={orders}
            dailyReports={dailyReports}
            language={language}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSubmitDailyReport={handleSubmitDailyReport}
          />
        )}

        {/* =========================================================================
            ROLE 3: UPPER MANAGEMENT EXECUTIVE HQ (Accessible only to management)
            ========================================================================= */}
        {perspective === 'management' && (
          <ManagementDashboard
            products={products}
            services={services}
            staffList={staffList}
            appointments={appointments}
            orders={orders}
            dailyReports={dailyReports}
            financials={financials}
            language={language}
            auditLog={auditLog}
            reconciliationList={reconciliationList}
            stockExceptions={stockExceptions}
            transactions={transactions}
            onRestockProduct={handleRestockProduct}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateService={handleUpdateService}
            onApproveReconciliation={handleApproveReconciliation}
            onResolveException={handleResolveException}
          />
        )}

        {/* =========================================================================
            EDUCATION / ACADEMY VIEW
            ========================================================================= */}
        {perspective === 'education' && (
          <EducationAcademy
            articles={mockEducationalArticles}
            language={language}
            onNavigateToShop={() => {
              setPerspective('customer');
              setCustomerTab('shop');
            }}
            onNavigateToBook={() => {
              setPerspective('customer');
              setCustomerTab('book');
            }}
          />
        )}
      </main>

      {/* Floating WhatsApp Concierge & AI Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        {/* Switch back to Business OS */}
        <button
          onClick={() => setPerspective('business-os')}
          className="bg-[#171518] hover:bg-black text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-[#ad8d58]/40 flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          title="Switch to Fine Hair Business OS"
        >
          <ShieldCheck className="w-4 h-4 text-[#ad8d58]" />
          <span>Business OS</span>
        </button>

        {/* Quick AI Advisor floating pill */}
        {perspective === 'customer' && (
          <button
            onClick={() => setIsHairAdvisorOpen(true)}
            className="bg-[#111111] hover:bg-black text-[#D4AF37] px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-[#D4AF37]/40 flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">AI Hair Advisor</span>
          </button>
        )}

        {/* Direct WhatsApp Concierge */}
        <a
          href={generateWhatsAppLink(
            '+255754892110',
            'Habari Fine Hair! Naomba msaada kuhusu wigs, appointment au delivery ya Mikocheni B, Ussagara Street.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-5 h-5" />
        </a>
      </div>

      {/* Role-Based Access Control Gate Modal */}
      <RoleAccessModal
        isOpen={isRoleAccessModalOpen}
        onClose={() => setIsRoleAccessModalOpen(false)}
        currentUser={currentUser}
        currentSession={currentSession}
        onAuthenticated={handleAuthenticated}
        onLoggedOut={handleLoggedOut}
        language={language}
      />

      {/* Unified Search Modal across all 534 inventory pieces, FineTouch services and articles */}
      <UnifiedSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        services={services}
        tutorials={mockEducationalArticles}
        language={language}
        onSelectProduct={(p) => {
          setSelectedProductForModal(p);
          setPerspective('customer');
          setCustomerTab('shop');
        }}
        onSelectService={(s) => {
          setSelectedServiceForBooking(s);
          setPerspective('customer');
          setCustomerTab('book');
        }}
        onSelectTutorial={() => {
          setPerspective('customer');
          setCustomerTab('learn');
        }}
      />

      {/* Login & Client Info Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        onLogin={(updatedProfile) => setUserProfile(updatedProfile)}
        language={language}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        language={language}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* AI Hair Consultant Modal */}
      <HairAdvisorModal
        isOpen={isHairAdvisorOpen}
        onClose={() => setIsHairAdvisorOpen(false)}
        userProfile={userProfile}
        products={products}
        services={services}
        onSelectProduct={(prod) => {
          setSelectedProductForModal(prod);
          setPerspective('customer');
          setCustomerTab('shop');
        }}
        onSelectService={(serv) => {
          setSelectedServiceForBooking(serv);
          setPerspective('customer');
          setCustomerTab('book');
        }}
      />

      {/* Customer Hair Profile & Loyalty Modal */}
      <HairProfileModal
        isOpen={isHairProfileOpen}
        onClose={() => setIsHairProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={setUserProfile}
        staffList={staffList}
      />

      {/* Luxury Minimalist Footer */}
      <footer className="bg-[#111111] text-white mt-16 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl tracking-[0.2em] font-semibold text-white">FINE HAIR</span>
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold">TANZANIA</span>
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">
                Dar es Salaam's premier luxury hair atelier specializing in African natural hair (Type 4 & Type 3), raw donor hair, undetectable HD lace melts, and salon artistry.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#AAA]">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
                SALON ATELIER
              </span>
              <p>• Mikocheni B Boutique: Ussagara Street, Dar es Salaam</p>
              <p>• VIP Home & Hotel Glam: Across Dar es Salaam</p>
            </div>

            <div className="space-y-2 text-xs text-[#AAA]">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
                CONTACT & BOOKINGS
              </span>
              <p>WhatsApp / Call: +255 754 892 110</p>
              <p>Email: concierge@finehair.co.tz</p>
              <p>Mon - Sun: 08:30 AM - 08:30 PM</p>
            </div>

            <div className="space-y-2 text-xs text-[#AAA]">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
                AUTHENTIC ACCESS
              </span>
              <div className="flex flex-col space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setPerspective('customer');
                      setCustomerTab('shop');
                    }}
                    className="text-[#DDD] hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    Boutique Catalog (4C/4B/Raw)
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setPerspective('customer');
                      setCustomerTab('book');
                    }}
                    className="text-[#DDD] hover:text-[#D4AF37] transition-colors cursor-pointer"
                  >
                    FineTouch Stylist Booking
                  </button>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setIsRoleAccessModalOpen(true)}
                    className="text-[11px] text-[#A5A5A5] hover:text-[#D4AF37] flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Staff & Management Portal Access"
                  >
                    <Lock className="w-3 h-3 text-[#B89758]" />
                    <span>Staff & Upper Management Portal</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-[#666] pt-2">
                Payments secured via M-Pesa, Lipa Namba, Airtel Money & Tigo Pesa.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777] gap-2">
            <span>© 2026 Fine Hair Luxe. All Rights Reserved.</span>
            <div className="flex space-x-4">
              <span>Authentic African Hair Textures</span>
              <span>•</span>
              <span>HD Lace Melting Standard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
