import React, { useState } from 'react';
import { CustomerHairProfile, Product, Service } from '../../types';
import { Sparkles, Send, X, Bot, User, ArrowRight, Check } from 'lucide-react';

interface HairAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: CustomerHairProfile;
  products: Product[];
  services: Service[];
  onSelectProduct: (product: Product) => void;
  onSelectService: (service: Service) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  recommendedProductIds?: string[];
  suggestedService?: string;
}

export const HairAdvisorModal: React.FC<HairAdvisorModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  products,
  services,
  onSelectProduct,
  onSelectService,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Karibu Fine Hair Beauty Lounge! I am your AI Master Stylist. I know our 100% Raw Cambodian Bundles, HD Lace melting techniques, and scalp care for the Tanzanian coastal climate. How can I assist with your crown today?`,
    },
  ]);

  const quickPrompts = [
    'Best wig for Dar es Salaam humidity?',
    'HD Frontal vs 5x5 Closure difference?',
    'How to blend 4C natural hairline?',
    'Care routine for 30" Bone Straight hair?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/hair-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          customerProfile: userProfile,
          conversationHistory: newMessages,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || 'Our Fine Hair master stylists recommend pairing HD lace closures with our lightweight Rosemary Silk Elixir for all-day comfort.',
          recommendedProductIds: data.recommendedProductIds,
          suggestedService: data.suggestedService,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'For optimal results in tropical weather, we recommend our 100% Raw Cambodian Bone Straight 13x6 HD Lace Wig with our Invisible Lace Melt Kit.',
          recommendedProductIds: ['prod-1', 'prod-5'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] flex flex-col shadow-2xl border border-[#EAEAEA] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#FAF9F5] border-b border-[#E8DECC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-medium text-[#111111]">Fine Hair AI Beauty Stylist</h3>
                <span className="bg-[#B89758] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                  GEMINI 3.7
                </span>
              </div>
              <p className="text-[11px] text-[#777]">Tailored hair textures, lace choices & Tanzanian climate care</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#777] hover:text-black rounded-full hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#111111] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#111111] text-white rounded-tr-xs'
                    : 'bg-[#FAF9F6] text-[#222222] border border-[#E8DECC] rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Recommended Product Chips */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EAE6DD] space-y-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8A6D3B] block">
                      Recommended Fine Hair Pieces:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedProductIds.map((pid) => {
                        const prod = products.find((p) => p.id === pid);
                        if (!prod) return null;
                        return (
                          <div
                            key={pid}
                            onClick={() => {
                              onSelectProduct(prod);
                              onClose();
                            }}
                            className="bg-white p-2 rounded-lg border border-[#E8DECC] hover:border-black transition-all cursor-pointer flex items-center space-x-2"
                          >
                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded object-cover" />
                            <div className="truncate">
                              <span className="font-serif font-medium text-[#111] block truncate text-[11px]">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-[#B89758] font-semibold">
                                View Piece →
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#EAEAEA] text-[#333] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#777]">
              <div className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="italic">Fine Hair Master Stylist is analyzing textures & climate needs...</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 bg-[#FBFBFA] border-t border-[#EAEAEA] overflow-x-auto no-scrollbar flex items-center space-x-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-[#F5F5F0] border border-[#E5E5DE] rounded-full px-3 py-1 text-[11px] text-[#555] whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EAEAEA] flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about wig care, lace melting, or 4C natural blending..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-full px-4 py-2.5 text-xs text-[#111] focus:outline-none focus:border-black"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || loading}
            className="p-2.5 bg-[#111111] hover:bg-black text-[#D4AF37] rounded-full transition-colors cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
