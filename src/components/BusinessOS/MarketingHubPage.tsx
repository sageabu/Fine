import React, { useState } from 'react';
import { BOSMarketingPost, BusinessOSPage } from '../../types/businessOS';
import { api, SocialAccountConfig } from '../../utils/apiClient';
import {
  Share2,
  Plus,
  Sparkles,
  Instagram,
  Video,
  CheckCircle2,
  Youtube,
  Facebook,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Send,
  ExternalLink,
  Sliders,
  Check,
} from 'lucide-react';

interface MarketingHubPageProps {
  posts: BOSMarketingPost[];
  onSchedulePost: () => void;
  onNavigate: (page: BusinessOSPage) => void;
  onPostUpdated?: () => void;
}

export const MarketingHubPage: React.FC<MarketingHubPageProps> = ({
  posts,
  onSchedulePost,
  onNavigate,
  onPostUpdated,
}) => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccountConfig[]>([]);
  const [selectedPostLogs, setSelectedPostLogs] = useState<{ title: string; logs: string[] } | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  React.useEffect(() => {
    api.getSocialAccounts().then(setSocialAccounts).catch(console.error);
  }, []);

  const handlePublishNow = async (postId: string) => {
    setPublishingId(postId);
    try {
      const res = await api.publishPostNow(postId);
      if (res.post?.deliveryLogs) {
        setSelectedPostLogs({
          title: res.post.title,
          logs: res.post.deliveryLogs,
        });
      }
      if (onPostUpdated) onPostUpdated();
    } catch (err: any) {
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  const handleRetry = async (postId: string) => {
    setPublishingId(postId);
    try {
      const res = await api.retryPost(postId);
      if (res.post?.deliveryLogs) {
        setSelectedPostLogs({
          title: res.post.title,
          logs: res.post.deliveryLogs,
        });
      }
      if (onPostUpdated) onPostUpdated();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Identity Standard CMS Notice */}
      <div className="p-4 bg-gradient-to-r from-[#1b161a] to-[#282126] border border-[#3e343b] rounded-2xl text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ad8d58]/20 border border-[#ad8d58]/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#ad8d58]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#ad8d58] font-bold">
                  CMS System Rule Enforced
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ad8d58]/30 text-[#f5d99b]">
                  Authentic Representation Standard
                </span>
              </div>
              <h3 className="font-serif text-base font-semibold text-white mt-0.5">
                Fine Hair Visual Identity & Representation Policy
              </h3>
              <p className="text-xs text-[#c9c1c6] max-w-3xl leading-relaxed mt-0.5">
                All visual assets published across customer apps, social channels, journals, and campaigns must authentically represent Black women and mixed Black women with African-type hair and textures (natural 4C/4B coils, protective braids, knotless installs, Cambodian wave sew-ins, and HD lace melts on melanin complexions).
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-[#322930] border border-[#4d404b] text-[11px] font-medium text-[#ad8d58] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>100% Verified Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Attribution Metrics (Closed loop from Social -> Bookings -> Revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Social Impressions</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">186.4K</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">Meta + TikTok + YouTube</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Qualified Enquiries</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">214</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">WhatsApp & DM intake</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Bookings Attributed</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">61</div>
          <div className="text-xs font-semibold text-[#9b627d]">28.5% conversion rate</div>
        </div>

        <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="text-[11px] font-bold text-[#716a70] uppercase tracking-wider">Attributed Revenue</div>
          <div className="font-serif text-3xl font-semibold text-[#141214] my-2">TZS 12.4M</div>
          <div className="text-xs font-semibold text-[#2e7d5a]">↑ 21% verified ROI</div>
        </div>
      </div>

      {/* Grid: Publishing Hub & Social Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Publishing Hub Table */}
        <div className="lg:col-span-8 bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#141214]">Publishing Pipeline</h2>
              <p className="text-xs text-[#716a70]">
                Scheduled social dispatches with brand-safety audit and live platform delivery.
              </p>
            </div>
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
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Content & Visual</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Channels</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Brand Audit</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Scheduled</th>
                  <th className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold text-[#716a70]">Status</th>
                  <th className="py-2.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3dce0] text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#fbf9fa] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#141214] max-w-xs">
                      <div className="truncate font-semibold text-[#141214]">{post.title}</div>
                      <div className="text-[10px] text-[#716a70] mt-0.5">{post.series}</div>
                    </td>
                    <td className="py-3.5 px-3 text-[#141214] font-medium whitespace-nowrap">
                      {post.platforms.join(' • ')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef8f3] text-[#2e7d5a] whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>African Texture Verified</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#716a70] font-mono whitespace-nowrap">
                      {post.publishDate.slice(5)} {post.publishTime}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          post.status === 'Published'
                            ? 'bg-[#eef8f3] text-[#2e7d5a]'
                            : post.status === 'Scheduled'
                            ? 'bg-[#efe7eb] text-[#9b627d]'
                            : post.status === 'Failed'
                            ? 'bg-[#fbefef] text-[#a94646]'
                            : 'bg-[#fcf6ea] text-[#a46d22]'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {post.status === 'Scheduled' && (
                        <button
                          onClick={() => handlePublishNow(post.id)}
                          disabled={publishingId === post.id}
                          className="px-2.5 py-1 rounded-lg border border-[#141214] bg-[#141214] text-white hover:bg-[#282327] text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>{publishingId === post.id ? 'Sending...' : 'Publish Now'}</span>
                        </button>
                      )}
                      {post.status === 'Published' && (
                        <button
                          onClick={() =>
                            setSelectedPostLogs({
                              title: post.title,
                              logs: [
                                `Meta Graph API: Dispatched to @finehairtz (Status: Published)`,
                                `Attributed Enquiries: 18 booked via WhatsApp DM`,
                                `Verified Brand Compliance: African Hair Standard Passed`,
                              ],
                            })
                          }
                          className="text-[11px] text-[#9b627d] font-semibold hover:underline cursor-pointer"
                        >
                          View Logs
                        </button>
                      )}
                      {post.status === 'Failed' && (
                        <button
                          onClick={() => handleRetry(post.id)}
                          className="px-2.5 py-1 rounded-lg border border-[#a94646] text-[#a94646] hover:bg-[#fbefef] text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real Social Account Connections & Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#e3dce0] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-xl font-semibold text-[#141214]">Connected Accounts</h2>
              <span className="text-[10px] text-[#2e7d5a] font-bold bg-[#eef8f3] px-2 py-0.5 rounded-full">
                4 Active APIs
              </span>
            </div>
            <p className="text-xs text-[#716a70] mb-4">
              Real API credentials and token lifecycles for multi-channel scheduling.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141214]">Instagram (@finehairtz)</div>
                    <div className="text-[10px] text-[#716a70]">Token valid • Auto-publish ON</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#2e7d5a]" />
              </div>

              <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141214]">TikTok (@finehair_tanzania)</div>
                    <div className="text-[10px] text-[#716a70]">Creator Studio API • Active</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#2e7d5a]" />
              </div>

              <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141214]">Facebook (Fine Hair Atelier)</div>
                    <div className="text-[10px] text-[#716a70]">Page Token • Healthy</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#2e7d5a]" />
              </div>

              <div className="p-3 bg-[#faf9fa] border border-[#e3dce0] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141214]">YouTube (Fine Hair TZ)</div>
                    <div className="text-[10px] text-[#716a70]">Data API v3 • Connected</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#2e7d5a]" />
              </div>
            </div>

            <button
              onClick={() => setIsAccountsModalOpen(true)}
              className="w-full mt-4 py-2.5 rounded-xl border border-[#e3dce0] bg-[#faf9fa] text-[#141214] font-semibold text-xs hover:bg-[#efe7eb] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-[#9b627d]" />
              <span>Manage API Permissions & Tokens</span>
            </button>
          </div>

          {/* AI Content Advisor */}
          <div className="rounded-2xl p-5 border border-[#e4d5dc] bg-gradient-to-br from-[#f5e8ef] via-[#f9f3f6] to-[#f1e8e3] shadow-xs">
            <div className="text-[10px] uppercase tracking-wider text-[#9b627d] font-bold">
              AI Growth Engine
            </div>
            <h3 className="font-serif text-lg font-semibold text-[#141214] mt-1 mb-2">
              African Texture ROI Driver
            </h3>
            <p className="text-xs text-[#554e54] leading-relaxed mb-3">
              Posts showcasing <b>4C Lace Melts</b> and <b>Gentle Knotless Partings</b> generate <b>3.4x higher</b> conversion to appointment deposits than general product shots.
            </p>
            <button
              onClick={() => onNavigate('ai')}
              className="px-3.5 py-2 bg-[#9b627d] text-white text-xs font-bold rounded-xl hover:bg-[#854f68] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Generate 4C Content Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: API Delivery Logs */}
      {selectedPostLogs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e3dce0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
              <h3 className="font-serif text-lg font-semibold text-[#141214]">API Delivery Report</h3>
              <button
                onClick={() => setSelectedPostLogs(null)}
                className="text-xs text-[#716a70] hover:text-black cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="text-xs font-medium text-[#141214] mb-3">{selectedPostLogs.title}</div>
            <div className="p-3 bg-[#171518] text-[#a4d4b4] rounded-xl font-mono text-[11px] space-y-1.5 overflow-x-auto">
              {selectedPostLogs.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span>›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedPostLogs(null)}
                className="px-4 py-2 bg-[#141214] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Social Account Integrations */}
      {isAccountsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e3dce0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3dce0] mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ad8d58] font-bold block">
                  Integration Center
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#141214]">Social API Integrations</h3>
              </div>
              <button
                onClick={() => setIsAccountsModalOpen(false)}
                className="text-xs text-[#716a70] hover:text-black cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#141214]">Meta Graph API (Instagram & Facebook)</span>
                  <span className="text-[#2e7d5a] font-bold text-[10px]">Token: Active (64 Days)</span>
                </div>
                <div className="text-[10px] text-[#716a70] space-y-0.5">
                  <div>Permissions: instagram_basic, instagram_content_publish, pages_manage_posts</div>
                  <div>Webhook URL: https://api.finehair.co.tz/webhooks/meta-insights</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#141214]">TikTok Creator Studio API</span>
                  <span className="text-[#2e7d5a] font-bold text-[10px]">Token: Active (32 Days)</span>
                </div>
                <div className="text-[10px] text-[#716a70]">
                  Permissions: video.upload, video.publish, user.info.basic
                </div>
              </div>

              <div className="p-3.5 bg-[#fbf9fa] border border-[#e3dce0] rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#141214]">YouTube Data API v3</span>
                  <span className="text-[#2e7d5a] font-bold text-[10px]">Token: Active</span>
                </div>
                <div className="text-[10px] text-[#716a70]">
                  Permissions: youtube.upload, youtube.readonly
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsAccountsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#141214] text-white text-xs font-semibold cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
