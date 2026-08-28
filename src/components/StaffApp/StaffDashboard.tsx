import React, { useState } from 'react';
import { StaffMember, Appointment, Order, StaffDailyReport, Language } from '../../types';
import { formatTZS } from '../../utils/formatters';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  CheckSquare,
  AlertCircle,
  Scissors,
  Package,
  Calendar,
  Send,
  Volume2,
  Check,
  RefreshCw,
  Award,
  TrendingUp,
} from 'lucide-react';

interface StaffDashboardProps {
  staffList: StaffMember[];
  appointments: Appointment[];
  orders: Order[];
  dailyReports: StaffDailyReport[];
  language: Language;
  onUpdateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSubmitDailyReport: (report: StaffDailyReport) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staffList = [],
  appointments = [],
  orders = [],
  dailyReports = [],
  language,
  onUpdateAppointmentStatus,
  onUpdateOrderStatus,
  onSubmitDailyReport,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList?.[0]?.id || 'staff-1');
  const activeStaff = staffList.find((s) => s.id === selectedStaffId) || staffList?.[0];

  // Daily Report Interactive State (Swahili Questions 1-5)
  const [clientsCount, setClientsCount] = useState<number>(3);
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['Wig', 'Installation', 'Wash']);
  const [problemCategory, setProblemCategory] = useState<'Hakuna' | 'Stock' | 'Customer' | 'Equipment' | 'Payment' | 'Other'>('Hakuna');
  const [problemDetails, setProblemDetails] = useState<string>('');
  const [needsForTomorrow, setNeedsForTomorrow] = useState<string>('');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isParsingVoice, setIsParsingVoice] = useState<boolean>(false);
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState<boolean>(false);

  // Today's appointments filtered for this staff
  const staffAppointments = activeStaff
    ? appointments.filter(
        (apt) => apt.staffId === activeStaff.id || apt.staffName?.includes(activeStaff.name)
      )
    : [];

  // Available task icons for Swahili workflow
  const availableWorkIcons = [
    { id: 'Wig', label: 'Wig / Unit', icon: '💇‍♀️' },
    { id: 'Installation', label: 'Installation / No Leave Out', icon: '✨' },
    { id: 'Wash', label: 'Wash & Blowdry', icon: '🧼' },
    { id: 'Braids', label: 'Braids / Twists', icon: '🪮' },
    { id: 'Treatment', label: '4C Silk Press / Spa', icon: '💆‍♀️' },
    { id: 'Sales', label: 'Product Sales', icon: '🛍️' },
    { id: 'Stock', label: 'Stock Audit', icon: '📦' },
    { id: 'Other', label: 'Other / Cleaning', icon: '🧹' },
  ];

  const toggleTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // Voice Speech-to-Report simulation & AI Parser
  const handleSimulateVoiceRecording = async () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        const sampleSwahiliAudio = `Habari uongozi wa Fine Hair, leo nimehudumia wateja wanne. Nimefanya No Leave Out installation mbili, wig revamp moja na 4C treatment moja. Kwenye stoo, nywele za Kinky Straight 14 inch zimeisha kabisa. Kesho asubuhi nahitaji lace melt spray mpya na taulo safi.`;
        setVoiceTranscript(sampleSwahiliAudio);
        setClientsCount(4);
        setSelectedTasks(['Wig', 'Installation', 'Treatment']);
        setProblemCategory('Stock');
        setProblemDetails('Nywele za Kinky Straight 14" zimeisha stoo.');
        setNeedsForTomorrow('Lace Melt Spray na taulo safi.');
      }, 2000);
    }
  };

  const handleSubmitReport = () => {
    const newReport: StaffDailyReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      date: new Date().toISOString().split('T')[0],
      clientsServed: clientsCount,
      workCategories: selectedTasks,
      problemCategory,
      problemDetails: problemDetails || (problemCategory === 'Hakuna' ? 'Hakuna tatizo' : 'Tatizo lililoripotiwa'),
      needsForTomorrow: needsForTomorrow || 'Vifaa vya kawaida',
      voiceTranscript: voiceTranscript || undefined,
      summaryNote: `${activeStaff.name} alihudumia wateja ${clientsCount}: ${selectedTasks.join(', ')}.`,
      submittedAt: new Date().toISOString(),
      verifiedByManager: false,
    };

    onSubmitDailyReport(newReport);
    setReportSubmittedSuccess(true);
    setTimeout(() => setReportSubmittedSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Active Stylist Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89758] font-bold">
            FINETOUCH ATELIER WORKSPACE
          </span>
          <h1 className="editorial-title text-2xl sm:text-4xl text-[#111111] mt-1">
            {language === 'en' ? 'Staff Portal & Daily Voice Log' : 'Daftari la Kazi & Ripoti ya Sauti'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Mikocheni B, Ussagara Street • Fast 60-second daily reporting and customer appointment queue.
          </p>
        </div>

        {/* Staff Switcher */}
        <div className="flex items-center space-x-2 bg-[#F5F5F3] p-1.5 rounded-full border border-[#E5E5E0]">
          {staffList.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStaffId(s.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeStaff.id === s.id
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <img
                src={s.avatar}
                alt={s.name}
                className="w-5 h-5 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="truncate">{s.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Staff Scorecard Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>Reporting Streak</span>
            <Award className="w-4 h-4 text-[#B89758]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#111111]">{activeStaff.reportingStreakDays} Days</p>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Consistent Log</span>
        </div>

        <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>Attendance Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#111111]">{activeStaff.attendanceScore}%</p>
          <span className="text-[10px] text-[#666666]">Mikocheni B Clock-in</span>
        </div>

        <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>Completed Appointments</span>
            <Scissors className="w-4 h-4 text-[#B89758]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#111111]">{activeStaff.completedAppointmentsCount}</p>
          <span className="text-[10px] text-[#666666]">★ {activeStaff.rating} ({activeStaff.reviewCount} reviews)</span>
        </div>

        <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-[#888888]">
            <span>Revenue Generated</span>
            <TrendingUp className="w-4 h-4 text-[#B89758]" />
          </div>
          <p className="text-lg sm:text-xl font-serif font-bold text-[#111111]">{formatTZS(activeStaff.monthlyRevenueGenerated)}</p>
          <span className="text-[10px] text-[#666666]">This month at salon</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Today's Appointments & Tasks */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#111111] flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#B89758]" />
              <span>{language === 'en' ? "Today's Client Queue" : 'Wateja Wako wa Leo'}</span>
            </h2>
            <span className="text-xs bg-[#111111] text-white px-2.5 py-0.5 rounded-full font-bold">
              {staffAppointments.length} Bookings
            </span>
          </div>

          {staffAppointments.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-[#EAEAEA] text-[#777] text-xs">
              Hakuna appointments zilizopangwa leo.
            </div>
          ) : (
            <div className="space-y-3">
              {staffAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-xl border border-[#EAEAEA] p-4 space-y-3 hover:border-[#D4AF37] transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-[#111111]">{apt.customerName}</span>
                        <span className="text-[10px] text-[#888888]">({apt.customerPhone})</span>
                      </div>
                      <p className="text-xs font-medium text-[#B89758] mt-0.5">{apt.serviceName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#111111] block">{apt.time}</span>
                      <span className="text-[10px] text-[#888888]">{apt.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#666666] bg-[#FAF9F6] p-2 rounded-lg">
                    <span>Texture: <strong className="text-black">{apt.hairTexture || '4C'}</strong></span>
                    <span>Paid: <strong className="text-emerald-700">{formatTZS(apt.depositPaid)}</strong> (Deposit)</span>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-[#777777] italic bg-[#F9F9F9] p-2 rounded-md">
                      Note: {apt.notes}
                    </p>
                  )}

                  {/* Status Toggle Buttons */}
                  <div className="pt-2 border-t border-[#F0F0F0] flex flex-wrap gap-1.5">
                    {(['confirmed', 'arrived', 'in_progress', 'completed', 'no_show'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateAppointmentStatus(apt.id, st)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          apt.status === st
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#F2F2F0] text-[#666666] hover:bg-[#EAEAEA]'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Swahili 60-Second Daily Report Log */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 sm:p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold">
                  RIPOTI YA KILA SIKU (SWAHILI)
                </span>
                <h3 className="font-serif text-lg font-bold text-[#111111]">
                  Daftari Rahisi la {activeStaff.name}
                </h3>
              </div>

              {/* Voice simulation trigger */}
              <button
                onClick={handleSimulateVoiceRecording}
                disabled={isRecordingVoice}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#FAF6EC] border border-[#D4AF37] text-[#8A6D3B] hover:bg-[#F5EED8]'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecordingVoice ? 'Inarekodi...' : 'Sema kwa Sauti'}</span>
              </button>
            </div>

            {/* Question 1: How many clients today? */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">
                1. Leo umehudumia wateja wangapi?
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setClientsCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      clientsCount === num
                        ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                        : 'border-[#EAEAEA] bg-white text-[#444444] hover:border-black'
                    }`}
                  >
                    {num === 5 ? '5+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Work Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">
                2. Kazi gani ulizofanya leo? (Chagua zote zilizofanyika)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableWorkIcons.map((item) => {
                  const isSelected = selectedTasks.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleTask(item.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#B89758] bg-[#FDFBF7] text-[#111111] font-semibold'
                          : 'border-[#EAEAEA] bg-white text-[#666666] hover:border-[#CCCCCC]'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[11px] mt-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: Problem / Issues */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#111111] block">
                3. Je, kuna tatizo lolote limetokea leo?
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {(['Hakuna', 'Stock', 'Customer', 'Equipment', 'Payment', 'Other'] as const).map((prob) => (
                  <button
                    type="button"
                    key={prob}
                    onClick={() => setProblemCategory(prob)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                      problemCategory === prob
                        ? prob === 'Hakuna'
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-red-600 bg-red-600 text-white'
                        : 'border-[#EAEAEA] bg-white text-[#444444] hover:border-black'
                    }`}
                  >
                    {prob}
                  </button>
                ))}
              </div>
              {problemCategory !== 'Hakuna' && (
                <input
                  type="text"
                  placeholder="Eleza tatizo kwa ufupi (mfano: Gundi ya lace imeisha stoo)..."
                  value={problemDetails}
                  onChange={(e) => setProblemDetails(e.target.value)}
                  className="w-full bg-[#FFF9F9] border border-red-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-hidden"
                />
              )}
            </div>

            {/* Question 4: Needs for tomorrow */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] block">
                4. Unahitaji nini kesho asubuhi saluni?
              </label>
              <input
                type="text"
                placeholder="Mfano: Taulo safi, lace melt spray, kinky straight bundles..."
                value={needsForTomorrow}
                onChange={(e) => setNeedsForTomorrow(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-hidden"
              />
            </div>

            {/* Voice Transcript Preview */}
            {voiceTranscript && (
              <div className="p-3 bg-[#FAF8F5] border border-[#E8DECC] rounded-xl text-xs text-[#666666] space-y-1">
                <span className="font-bold text-[#111111] block">Maneno Yaliyorekodiwa (Swahili Transcript):</span>
                <p className="italic">"{voiceTranscript}"</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitReport}
                className="w-full bg-[#111111] hover:bg-black text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tuma Ripoti ya Leo kwa Uongozi</span>
              </button>

              {reportSubmittedSuccess && (
                <p className="text-center text-xs text-emerald-700 font-bold mt-2 animate-bounce">
                  Ripoti imetumwa kikamilifu kwa Uongozi wa Fine Hair!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
