import React, { useState } from 'react';
import { OrderItem, Order, Language } from '../../types';
import { formatTZS, generateWhatsAppLink } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Check, MessageSquare } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  language: Language;
  onUpdateQuantity: (productId: string, variantLength: string, delta: number) => void;
  onRemoveItem: (productId: string, variantLength: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState('Sarah Mkwawa');
  const [customerPhone, setCustomerPhone] = useState('+255 754 892 110');
  const [customerAddress, setCustomerAddress] = useState('Toure Drive, Masaki, Dar es Salaam');
  const [deliveryType, setDeliveryType] = useState<
    'Masaki Store Pickup' | 'Mlimani City Store Pickup' | 'Dar es Salaam Same-Day Express' | 'Regional Bus Courier (Arusha/Mwanza/Zanzibar)'
  >('Dar es Salaam Same-Day Express');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Lipa Namba' | 'Tigo Pesa' | 'Airtel Money' | 'Card' | 'Cash on Delivery'>('M-Pesa');
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentRefCode, setPaymentRefCode] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee =
    deliveryType === 'Masaki Store Pickup' || deliveryType === 'Mlimani City Store Pickup'
      ? 0
      : deliveryType === 'Dar es Salaam Same-Day Express'
      ? 10000
      : 20000;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) return;

    setIsProcessingPayment(true);
    // Simulate mobile payment prompt & gateway verification
    setTimeout(() => {
      const generatedRef = `MP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setPaymentRefCode(generatedRef);

      const newOrder: Order = {
        id: `ord-${Date.now().toString().slice(-4)}`,
        customerName,
        customerPhone,
        customerAddress: deliveryType.includes('Pickup') ? undefined : customerAddress,
        deliveryType,
        items: [...items],
        subtotal,
        deliveryFee,
        total,
        status: 'processing',
        paymentMethod,
        // Genuine payment state: Cash is pending on delivery; Mobile money requires verified confirmation
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pay_on_pickup' : 'paid',
        orderDate: new Date().toISOString(),
      };

      onPlaceOrder(newOrder);
      setOrderComplete(newOrder);
      setIsProcessingPayment(false);
      onClearCart();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden border-l border-[#EAEAEA]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAEAEA] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#B89758]" />
            <h2 className="font-serif text-lg font-medium text-[#111111]">
              {language === 'en' ? 'Your Shopping Bag' : 'Mfuko Wako'}
            </h2>
            <span className="text-xs text-[#777]">({items.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#777] hover:text-black rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Complete Screen */}
        {orderComplete ? (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E8DECC] rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-[#B89758]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold">
                ORDER RECEIVED • #{orderComplete.id}
              </span>
              <h3 className="editorial-title text-2xl text-[#111]">Asante Sana!</h3>
              <p className="text-xs text-[#666]">
                Your Fine Hair order is being prepared by our Masaki atelier team.
              </p>
            </div>

            <div className="w-full bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#777]">Total Paid:</span>
                <span className="font-bold text-black">{formatTZS(orderComplete.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Payment:</span>
                <span className="font-medium text-black">{orderComplete.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777]">Delivery:</span>
                <span className="font-medium text-black">{orderComplete.deliveryType}</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <a
                href={generateWhatsAppLink(
                  orderComplete.customerPhone,
                  `Habari Fine Hair! Nimefanya order #${orderComplete.id} ya ${formatTZS(orderComplete.total)} kupitia ${orderComplete.paymentMethod}. Tafadhali thibitisha delivery.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Receipt</span>
              </a>

              <button
                onClick={() => {
                  setOrderComplete(null);
                  onClose();
                }}
                className="w-full bg-[#111] hover:bg-black text-white py-3 rounded-full text-xs font-medium cursor-pointer"
              >
                Back to Boutique
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag */
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#999]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-medium text-[#111]">Your bag is empty</h3>
              <p className="text-xs text-[#777]">
                Explore our raw Cambodian donor wigs and invisible HD lace pieces.
              </p>
            </div>
          </div>
        ) : (
          /* Items List & Checkout */
          <>
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.variantLength}-${idx}`}
                  className="flex space-x-3 p-3 rounded-xl border border-[#EAEAEA] bg-white items-center"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 rounded-lg object-cover border border-[#EAEAEA] shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-serif text-xs font-medium text-[#111] truncate">{item.productName}</h4>
                    <span className="text-[10px] text-[#B89758] block font-semibold">{item.variantLength}</span>
                    <span className="text-xs font-semibold text-black">{formatTZS(item.price)}</span>
                  </div>

                  {/* Quantity and Delete */}
                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <button
                      onClick={() => onRemoveItem(item.productId, item.variantLength)}
                      className="text-[#999] hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center space-x-2 bg-[#F5F5F5] rounded-full px-2 py-0.5 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantLength, -1)}
                        className="text-[#666] hover:text-black cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-medium text-xs text-black">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.variantLength, 1)}
                        className="text-[#666] hover:text-black cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery and Customer Form */}
              <div className="pt-2 space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#777] block mb-1">
                    Delivery / Pickup Option
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as any)}
                    className="w-full bg-[#FBFBFB] border border-[#EAEAEA] rounded-lg p-2 text-xs text-[#111] focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="Dar es Salaam Same-Day Express">Dar es Salaam Same-Day Express (+TSh 10,000)</option>
                    <option value="Masaki Store Pickup">Masaki Boutique Pickup (Free)</option>
                    <option value="Mlimani City Store Pickup">Mlimani City Mall Pickup (Free)</option>
                    <option value="Regional Bus Courier (Arusha/Mwanza/Zanzibar)">Regional Bus Courier (+TSh 20,000)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#777] block mb-1">Payment Method</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['M-Pesa', 'Lipa Namba', 'Tigo Pesa', 'Airtel Money', 'Card', 'Cash on Delivery'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m as any)}
                        className={`py-1.5 px-1 rounded-md text-[11px] border text-center transition-all cursor-pointer ${
                          paymentMethod === m ? 'border-black bg-black text-white font-medium' : 'border-[#EAEAEA] bg-white text-[#444]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#777] block mb-1">Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-[#EAEAEA] rounded-md p-1.5 text-xs text-[#111]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#777] block mb-1">M-Pesa / Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FBFBFB] border border-[#EAEAEA] rounded-md p-1.5 text-xs text-[#111]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Summary & Checkout Button */}
            <div className="p-4 sm:p-5 border-t border-[#EAEAEA] bg-[#FAF9F5] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#666]">
                  <span>Subtotal:</span>
                  <span>{formatTZS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Delivery Fee:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatTZS(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-black pt-1 border-t border-[#E8DECC]">
                  <span>Total (TZS):</span>
                  <span>{formatTZS(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessingPayment}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md disabled:opacity-70"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {isProcessingPayment
                    ? `Verifying ${paymentMethod} Gateway...`
                    : `Place Order & Pay with ${paymentMethod}`}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
