import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, UserCheck, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIAssistantPageProps {
  onOpenCustomerAI: () => void;
  onOpenStaffAI: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  onOpenCustomerAI,
  onOpenStaffAI,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ query: string; text: string } | null>({
    query: 'Initial Briefing',
    text: 'Fine Hair AI is running in assisted decision mode. Try asking about bookings, staff attendance, marketing conversion, inventory thresholds, or pricing control principles.',
  });

  const handleAsk = (q: string) => {
    const query = (q || question).toLowerCase();
    let text = '';

    if (query.includes('booking')) {
      text =
        'Bookings are currently healthy overall with 34 scheduled today and 11 qualified conversions this week. Capacity utilization at Mikocheni B is 84%. I recommend reviewing booth turnaround on 3-hour No Leave Out sessions before increasing ad spend.';
    } else if (query.includes('staff') || query.includes('late') || query.includes('attendance')) {
      text =
        'Two late arrivals are flagged today (Morris and Naomi). 17 out of 19 stylists are present. Overall staff monthly KPI stands strong at 82%. I recommend supervisor check-in during the 15:00 shift handover.';
    } else if (query.includes('marketing') || query.includes('content') || query.includes('video')) {
      text =
        'Client Transformation reels are generating 3.4x higher booking conversion than static promotional photos. Fine Hair Fix #08 is performing exceptionally well on TikTok. Maintain high-retention 4C styling demos.';
    } else if (query.includes('price') || query.includes('pricing')) {
      text =
        'All salon prices remain under central governance. Maria or Letisia cannot change prices at checkout without an Executive approval event. The proposed increase on No Leave Out (TZS 280,000 → 300,000) is awaiting review in the Approval Queue.';
    } else if (query.includes('inventory') || query.includes('stock')) {
      text =
        'Four SKU lines require attention. Detangling Brushes (8 remaining) and Silk Scarves (4 remaining) have breached their safety thresholds. Raw hair wefts and 4C HD closure stocks remain healthy for weekend bookings.';
    } else {
      text =
        'I am analyzing live operational, CRM, marketing, and inventory signals across Fine Hair Tanzania. Ask any specific question regarding daily bookings, stylist KPIs, client rebooking rates, or financial reconciliations.';
    }

    setAnswer({ query: q || question || 'Executive Inquiry', text });
  };

  const samplePrompts = [
    'Why are bookings down this week?',
    'Who is late today and what is the attendance score?',
    'Which marketing content series converts best?',
    'What inventory items need restocking?',
    'How does pricing control work?',
  ];

  return (
    <div className="space-y-6">
      {/* Top Grid: Interactive Query & AI Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ask the Business Panel */}
        <div className="lg:col-span-7 rounded-2xl p-6 border border-[#e4d5dc] bg-gradient-to-br from-[#f5e8ef] via-[#f9f3f6] to-[#f1e8e3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#9b627d] font-bold">
              Fine Hair AI
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#141214] mt-1 mb-1">
              Ask the business.
            </h2>
            <p className="text-xs text-[#554e54] leading-relaxed mb-4">
              AI serves as an intelligent co-pilot across client consultation, staff workflows, managerial diagnostics and marketing insights. It recommends and explains with full transparency; authorized humans make the final decisions.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(question);
              }}
              className="flex gap-2 mb-3"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Why are bookings down this week? or Who is late?"
                className="flex-1 border border-[#e3dce0] rounded-xl px-3.5 py-2.5 text-xs bg-white text-[#141214] focus:outline-[#9b627d]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all cursor-pointer shrink-0"
              >
                Ask
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(p);
                    handleAsk(p);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-white/80 border border-[#e3dce0] text-[#716a70] hover:text-[#141214] hover:bg-white transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {answer && (
            <div className="p-4 bg-white border border-[#e3dce0] rounded-xl shadow-xs text-xs text-[#141214]">
              <div className="flex items-center gap-1.5 font-bold text-[#9b627d] text-[10px] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                AI Business Recommendation
              </div>
              <p className="leading-relaxed text-[#332d32]">{answer.text}</p>
            </div>
          )}
        </div>

        {/* AI Guardrails Panel */}
        <div className="lg:col-span-5 bg-white border border-[#e3dce0] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">AI Guardrails</h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <span className="font-medium text-[#141214]">Pricing changes</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fcf6ea] text-[#a46d22]">
                  Human approval
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <span className="font-medium text-[#141214]">Refunds & Waivers</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fcf6ea] text-[#a46d22]">
                  Human approval
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <span className="font-medium text-[#141214]">Staff disciplinary actions</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fbefef] text-[#a94646]">
                  Human decision
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <span className="font-medium text-[#141214]">Marketing publishing</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fcf6ea] text-[#a46d22]">
                  Human approval
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9fa] border border-[#e3dce0]">
                <span className="font-medium text-[#141214]">Customer style advice</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
                  AI assisted
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#f6f3f4] rounded-xl text-[11px] text-[#716a70] mt-4">
            <b>Zero Autonomous Overrides:</b> The Fine Hair platform forbids unmonitored AI price manipulation or unauthorized staff terminations.
          </div>
        </div>
      </div>

      {/* Bottom Grid: Previews of Customer Concierge & Staff Assistant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#9b627d] uppercase tracking-wider block mb-1">
              Customer Touchpoint
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#141214] mb-2">
              Customer AI Concierge
            </h3>
            <p className="text-xs text-[#716a70] leading-relaxed mb-4">
              Guides online clients through hair texture selection (4C, 4B, raw donor straight), maintenance levels, preparation and aftercare, directing them seamlessly into booking.
            </p>
          </div>
          <button
            onClick={onOpenCustomerAI}
            className="px-4 py-2 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#9b627d] text-xs font-semibold text-[#141214] transition-colors cursor-pointer inline-flex items-center justify-between"
          >
            <span>Preview customer concierge</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9b627d]" />
          </button>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#ad8d58] uppercase tracking-wider block mb-1">
              Stylist Touchpoint
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#141214] mb-2">
              Staff AI Assistant
            </h3>
            <p className="text-xs text-[#716a70] leading-relaxed mb-4">
              Summarizes daily completed chairs, drafts standardized end-of-shift reports from booking logs, and aids stylists in referencing approved technical protocols.
            </p>
          </div>
          <button
            onClick={onOpenStaffAI}
            className="px-4 py-2 rounded-xl border border-[#e3dce0] bg-[#fbf9fa] hover:bg-[#efe7eb] hover:border-[#ad8d58] text-xs font-semibold text-[#141214] transition-colors cursor-pointer inline-flex items-center justify-between"
          >
            <span>Preview staff assistant</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ad8d58]" />
          </button>
        </div>
      </div>
    </div>
  );
};
