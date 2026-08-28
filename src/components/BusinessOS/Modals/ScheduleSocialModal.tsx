import React, { useState } from 'react';
import { BOSMarketingPost } from '../../../types/businessOS';
import { X, Send, Calendar, Clock, CheckSquare, ShieldCheck } from 'lucide-react';

interface ScheduleSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BOSMarketingPost) => void;
}

export const ScheduleSocialModal: React.FC<ScheduleSocialModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('Fine Hair Fix #09: Scalp hydration for protective sew-in weaves');
  const [series, setSeries] = useState<BOSMarketingPost['series']>('Fine Hair Fix');
  const [platforms, setPlatforms] = useState<('Instagram' | 'TikTok' | 'Facebook' | 'YouTube')[]>([
    'Instagram',
    'TikTok',
  ]);
  const [publishDate, setPublishDate] = useState('2026-08-30');
  const [publishTime, setPublishTime] = useState('17:00');
  const [notes, setNotes] = useState('Demonstrate botanical scalp oil application using fine needle dropper on client rows.');
  const [hairTextureTag, setHairTextureTag] = useState('4C Coily & Protective Styling');
  const [brandRuleAcknowledged, setBrandRuleAcknowledged] = useState(true);

  if (!isOpen) return null;

  const togglePlatform = (p: 'Instagram' | 'TikTok' | 'Facebook' | 'YouTube') => {
    if (platforms.includes(p)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((item) => item !== p));
      }
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brandRuleAcknowledged) return;

    const newPost: BOSMarketingPost = {
      id: `mkt-${Date.now()}`,
      title,
      series,
      platforms,
      publishDate,
      publishTime,
      status: 'Scheduled',
      author: 'Marketing Team',
      notes,
      reachEstimate: '15K - 25K',
    };

    onSave(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9b627d] font-bold block">Publishing Hub</span>
            <h2 className="font-serif text-2xl font-semibold text-[#141214]">Schedule Content</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#e3dce0] flex items-center justify-center text-[#716a70] hover:text-black hover:bg-[#f6f3f4] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Content Title / Caption Headline</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Content Series</label>
            <select
              value={series}
              onChange={(e) => setSeries(e.target.value as any)}
              className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            >
              <option value="Fine Hair Fix">Fine Hair Fix (Tutorials & Pro Tips)</option>
              <option value="Transformations">Client Transformations & Melts</option>
              <option value="Education">Education & Aftercare Science</option>
              <option value="VIP Spotlights">VIP Spotlights & Events</option>
              <option value="Behind the Scenes">Behind the Scenes at Atelier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Target Channels</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Instagram', 'TikTok', 'Facebook', 'YouTube'] as const).map((p) => {
                const checked = platforms.includes(p);
                return (
                  <label
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      checked
                        ? 'border-[#9b627d] bg-[#efe7eb] text-[#9b627d]'
                        : 'border-[#e3dce0] bg-[#faf9fa] text-[#716a70]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="accent-[#9b627d]"
                    />
                    {p}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Fine Hair Visual Standard Compliance Tag */}
          <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ad8d58]" />
              <span className="text-xs font-bold text-[#141214] uppercase tracking-wider">
                Visual Identity Standard & Hair Texture Tag
              </span>
            </div>
            <div>
              <label className="block text-[11px] text-[#716a70] mb-1 font-medium">
                Primary African Hair Feature Represented:
              </label>
              <select
                value={hairTextureTag}
                onChange={(e) => setHairTextureTag(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-[#9b627d]"
              >
                <option value="4C Coily & Protective Styling">4C Coily & Protective Cornrows</option>
                <option value="4B/4A Texture Blend">4B / 4A Textured Extensions Blend</option>
                <option value="HD Lace Melt on Melanin">HD Lace Melt Seamless Skin Blend</option>
                <option value="Knotless Braids African Art">Knotless Braids & Natural Scalp Care</option>
                <option value="Cambodian Wave Silk Press">Cambodian Waves / Bone Straight Silk Press</option>
              </select>
            </div>
            <label className="flex items-start gap-2 pt-1 text-xs text-[#554e54] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={brandRuleAcknowledged}
                onChange={(e) => setBrandRuleAcknowledged(e.target.checked)}
                className="mt-0.5 accent-[#ad8d58]"
              />
              <span>
                <b>Brand Identity Compliance:</b> I verify that all visual assets depict Black or mixed Black women with African-type hair/textures adhering to Fine Hair representation guidelines.
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Publish Date</label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Time</label>
              <input
                type="time"
                required
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full border border-[#e3dce0] rounded-xl px-3 py-2 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#716a70] mb-1 uppercase tracking-wider">Production & Visual Brief</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key talking points, hashtags, tagged stylist..."
              className="w-full border border-[#e3dce0] rounded-xl p-2.5 text-sm bg-[#faf9fa] focus:bg-white focus:outline-[#9b627d]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e3dce0] bg-white text-[#141214] font-medium text-sm hover:bg-[#f6f3f4] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!brandRuleAcknowledged}
              className={`px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-colors cursor-pointer ${
                brandRuleAcknowledged ? 'bg-[#141214] hover:bg-[#262226]' : 'bg-[#aaa1a8] cursor-not-allowed'
              }`}
            >
              Schedule Publication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
