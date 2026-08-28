import React from 'react';
import { BOSMarketingPost, BusinessOSPage } from '../../types/businessOS';
import { Share2, Plus, Sparkles, Instagram, Video, CheckCircle2, Youtube, Facebook } from 'lucide-react';

interface MarketingHubPageProps {
  posts: BOSMarketingPost[];
  onSchedulePost: () => void;
  onNavigate: (page: BusinessOSPage) => void;
}

export const MarketingHubPage: React.FC<MarketingHubPageProps> = ({
  posts,
  onSchedulePost,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* 4 Attribution Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Marketing Reach</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">186K</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 14% MoM</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Qualified Enquiries</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">214</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 18% MoM</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Bookings Attributed</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">61</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">29% conversion rate</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Attributed Revenue</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">TZS 12.4M</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 21% MoM</div>
        </div>
      </div>

      {/* Grid: Publishing Hub & AI Marketing Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Publishing Hub */}
        <div className="lg:col-span-7 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-[#141214]">Publishing Hub</h2>
            <button
              onClick={onSchedulePost}
              className="px-3.5 py-1.5 bg-[#141214] text-white text-xs font-bold rounded-xl hover:bg-[#282327] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule post</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3dce0]">
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Content</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Series</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Platforms</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Publish</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3dce0] text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#fbf9fa] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#141214] max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="py-3.5 px-3 text-[#716a70]">{post.series}</td>
                    <td className="py-3.5 px-3 text-[#141214] font-medium">
                      {post.platforms.join(' • ')}
                    </td>
                    <td className="py-3.5 px-3 text-[#716a70] font-mono">
                      {post.publishDate.slice(5)} {post.publishTime}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        post.status === 'Scheduled'
                          ? 'bg-[#eef8f3] text-[#2e7d5a]'
                          : post.status === 'Awaiting approval'
                          ? 'bg-[#fcf6ea] text-[#a46d22]'
                          : 'bg-[#efe7eb] text-[#9b627d]'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Marketing Signal */}
        <div className="lg:col-span-5 rounded-2xl p-5 border border-[#e4d5dc] bg-gradient-to-br from-[#f5e8ef] via-[#f9f3f6] to-[#f1e8e3] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#9b627d] font-bold">
              AI Marketing Assistant
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#141214] mt-1 mb-2">
              Monthly signal
            </h2>
            <p className="text-xs text-[#554e54] leading-relaxed mb-4">
              Transformation content (e.g. 4C closure silk press before/after) is converting <b>3.4x higher</b> into booked appointments than generic promotional posts. Recommend increasing transformation-led CTAs while retaining education posts for high bookmarking and shares.
            </p>
          </div>
          <div>
            <button
              onClick={() => onNavigate('ai')}
              className="px-4 py-2 bg-[#9b627d] text-white text-xs font-bold rounded-xl hover:bg-[#854f68] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Ask AI for next month</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connected Channels */}
      <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
        <h2 className="font-serif text-xl font-semibold text-[#141214] mb-4">Connected Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#141214]">Instagram</div>
              <div className="text-[10px] text-[#716a70]">Auto-sync & Reels publishing enabled</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
              Connected
            </span>
          </div>

          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#141214]">TikTok</div>
              <div className="text-[10px] text-[#716a70]">Fine Hair Fix series pipeline active</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
              Connected
            </span>
          </div>

          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#141214]">Facebook</div>
              <div className="text-[10px] text-[#716a70]">Bridal community & events publishing</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
              Connected
            </span>
          </div>

          <div className="p-4 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-[#141214]">YouTube</div>
              <div className="text-[10px] text-[#716a70]">Long-form wig care tutorials scheduled</div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eef8f3] text-[#2e7d5a]">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
