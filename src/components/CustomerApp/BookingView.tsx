import React, { useState } from 'react';
import { Service, StaffMember, Appointment, Language, CustomerHairProfile, BraidSize } from '../../types';
import { formatTZS, generateWhatsAppLink } from '../../utils/formatters';
import { Calendar, Clock, MapPin, Check, User, Phone, Sparkles, MessageSquare, Scissors, Tag, Info } from 'lucide-react';

interface BookingViewProps {
  services: Service[];
  staffList: StaffMember[];
  language: Language;
  userProfile: CustomerHairProfile;
  onConfirmAppointment: (newAppointment: Appointment) => void;
  onNavigateTab: (tab: 'home' | 'shop' | 'book' | 'learn' | 'profile') => void;
  initialSelectedService?: Service | null;
  onOpenLoginModal?: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  services,
  staffList,
  language,
  userProfile,
  onConfirmAppointment,
  onNavigateTab,
  initialSelectedService,
  onOpenLoginModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service>(initialSelectedService || services?.[0]);
  const [selectedBraidSize, setSelectedBraidSize] = useState<BraidSize>('Medium');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(staffList?.[0]);
  const [selectedLocation, setSelectedLocation] = useState<'Fine Hair Salon (Mikocheni B, Ussagara Street)' | 'VIP Home / Hotel Glam'>('Fine Hair Salon (Mikocheni B, Ussagara Street)');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [customerName, setCustomerName] = useState<string>(userProfile.name || 'Sarah Mkwawa');
  const [customerPhone, setCustomerPhone] = useState<string>(userProfile.phone || '+255 754 892 110');
  const [hairTexture, setHairTexture] = useState<string>(userProfile.naturalHairTexture || '4C');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Lipa Namba' | 'Tigo Pesa' | 'Cash at Salon'>('M-Pesa');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  const timeSlots = ['09:00', '11:00', '13:30', '15:30', '17:30', '19:00'];
  const textureOptions = ['4C', '4B', '4A', '4C2', '4B (AKC)', '4A (CAKC)', '3B', 'Relaxed / Locs'];

  const serviceCategories = [
    { id: 'all', label: language === 'en' ? 'All Services' : 'Huduma Zote' },
    { id: 'finetouch_priority', label: language === 'en' ? 'FineTouch Signature' : 'Sahihi ya FineTouch' },
    { id: 'braids_twists', label: language === 'en' ? 'Braids & Twists' : 'Misuko & Rasta' },
    { id: 'weave_installation', label: language === 'en' ? 'Weaves & Installs' : 'Kushona & Frontals' },
    { id: 'hair_care', label: language === 'en' ? 'Hair Care & Spa' : 'Matibabu & Usafi' },
    { id: 'other_styling', label: language === 'en' ? 'Styling & Waves' : 'Mitindo & Mawimbi' },
  ];

  // Dynamic price calculation with braid sizing
  const baseServicePrice = selectedService.sizeOptions
    ? (selectedService.sizeOptions.find((opt) => opt.size === selectedBraidSize)?.price ?? selectedService.price)
    : selectedService.price;

  const grandTotal = baseServicePrice + (selectedLocation.includes('VIP Home') ? 50000 : 0);
  const depositRequired = selectedService.depositRequired;

  // Filter qualified staff for selected service
  const qualifiedStaff = staffList.filter((s) =>
    selectedService.qualifiedStaffIds ? selectedService.qualifiedStaffIds.includes(s.id) : true
  );

  const filteredServices = services.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const newApt: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      selectedBraidSize: selectedService.sizeOptions ? selectedBraidSize : undefined,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      totalPrice: grandTotal,
      depositPaid: depositRequired,
      paymentMethod,
      hairTexture,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onConfirmAppointment(newApt);
    setConfirmedBooking(newApt);
  };

  if (confirmedBooking) {
    const whatsappMsg = `Habari Fine Hair Mikocheni B! Nimefanya appointment ya ${confirmedBooking.serviceName} ${confirmedBooking.selectedBraidSize ? `(Size: ${confirmedBooking.selectedBraidSize})` : ''} kwa fundi ${confirmedBooking.staffName} tarehe ${confirmedBooking.date} saa ${confirmedBooking.time}. Eneo: ${confirmedBooking.location}. Jina: ${confirmedBooking.customerName} (${confirmedBooking.customerPhone}). Hair: ${confirmedBooking.hairTexture || '4C'}.`;

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 sm:p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-[#25D366]/15 border border-[#25D366]/30 rounded-full mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-[#25D366]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#B89758] font-bold">
              BOOKING CONFIRMED • #{confirmedBooking.id}
            </span>
            <h1 className="editorial-title text-2xl sm:text-3xl text-[#111111]">
              {language === 'en' ? 'Appointment Scheduled!' : 'Nafasi Yako Imethibitishwa!'}
            </h1>
            <p className="text-xs text-[#666]">
              {language === 'en'
                ? 'We look forward to welcoming you at Mikocheni B, Ussagara Street.'
                : 'Tunakusubiri kwa furaha katika salon yetu ya Mikocheni B, Mtaa wa Ussagara.'}
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-xl p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
              <span className="text-[#777]">Service:</span>
              <span className="font-semibold text-black">{confirmedBooking.serviceName}</span>
            </div>
            {confirmedBooking.selectedBraidSize && (
              <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
                <span className="text-[#777]">Braid Size:</span>
                <span className="font-semibold text-black">{confirmedBooking.selectedBraidSize}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
              <span className="text-[#777]">Master Stylist:</span>
              <span className="font-semibold text-black">{confirmedBooking.staffName}</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
              <span className="text-[#777]">Date & Time:</span>
              <span className="font-semibold text-black">{confirmedBooking.date} at {confirmedBooking.time}</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
              <span className="text-[#777]">Location:</span>
              <span className="font-semibold text-black">{confirmedBooking.location}</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE6DD] pb-2">
              <span className="text-[#777]">Client:</span>
              <span className="font-semibold text-black">{confirmedBooking.customerName} ({confirmedBooking.customerPhone})</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-semibold">
              <span>Total Price:</span>
              <span className="text-[#B89758]">{formatTZS(confirmedBooking.totalPrice)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={generateWhatsAppLink('+255754892110', whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'en' ? 'Send Confirmation to Salon WhatsApp' : 'Tuma Tiketi WhatsApp'}</span>
            </a>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                onNavigateTab('shop');
              }}
              className="w-full bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#111] py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
            >
              {language === 'en' ? 'Explore Hair Boutique' : 'Tembelea Duka la Nywele'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-[#EAEAEA] pb-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#B89758] font-bold">
          FINETOUCH SALON & ATELIER
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-[#111111]">
          {language === 'en' ? 'Book FineTouch Services' : 'Weka Nafasi ya Huduma za Saluni'}
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
          {language === 'en'
            ? 'Mikocheni B, Ussagara Street • Specializing in No Leave Out frontals, Brazilian knots, 4C silk press, and luxury braid styling.'
            : 'Mikocheni B, Mtaa wa Ussagara • Wataalamu wa kufunga frontals bila nywele zako kuonekana, Brazilian knots, na matunzo ya 4C.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Service Category & Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="font-serif text-lg font-semibold text-[#111111]">
              {language === 'en' ? 'Choose FineTouch Service' : 'Chagua Huduma ya Saluni'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {serviceCategories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white text-[#555555] border border-[#EAEAEA] hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredServices.map((service) => {
              const isSelected = selectedService.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-3.5 rounded-xl border flex space-x-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#B89758] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#EAEAEA] bg-white hover:border-[#CCCCCC]'
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#111111] truncate">
                        {language === 'en' ? service.name : service.swahiliName}
                      </h3>
                      {isSelected && <Check className="w-4 h-4 text-[#B89758] shrink-0 ml-1" />}
                    </div>
                    <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                      {language === 'en' ? service.description : service.swahiliDescription}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 text-xs font-bold text-[#111111]">
                      <span>{formatTZS(service.price)}</span>
                      <span className="text-[10px] text-[#888888] font-normal">{service.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* If service has size options (e.g. Micro Twists & Boho Braids) */}
          {selectedService.sizeOptions && selectedService.sizeOptions.length > 0 && (
            <div className="p-4 bg-[#FAF9F6] border border-[#E8DECC] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#111111] block">
                {language === 'en' ? 'Select Braid Density / Size:' : 'Chagua Ukubwa wa Misuko:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedService.sizeOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.size}
                    onClick={() => setSelectedBraidSize(opt.size)}
                    className={`p-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      selectedBraidSize === opt.size
                        ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                        : 'border-[#EAEAEA] bg-white text-[#333333] hover:border-black'
                    }`}
                  >
                    <span className="block font-semibold">{opt.size}</span>
                    <span className="text-[10px] block opacity-80">{formatTZS(opt.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Stylist & Schedule */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="font-serif text-lg font-semibold text-[#111111]">
              {language === 'en' ? 'Select Master Stylist & Date' : 'Chagua Fundi na Tarehe'}
            </h2>
          </div>

          {/* Stylist selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(qualifiedStaff.length > 0 ? qualifiedStaff : staffList).map((staff) => {
              const isSelected = selectedStaff.id === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`p-3.5 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#B89758] bg-[#FDFBF7] shadow-xs'
                      : 'border-[#EAEAEA] bg-white hover:border-[#CCCCCC]'
                  }`}
                >
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-[#111111] truncate">{staff.name}</h4>
                    <p className="text-[10px] text-[#777777] truncate">{staff.role}</p>
                    <span className="text-[10px] font-bold text-[#B89758]">★ {staff.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date & Time slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#333333] block mb-1.5">
                {language === 'en' ? 'Appointment Date' : 'Tarehe ya Huduma'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-hidden focus:border-black"
                min="2026-08-24"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#333333] block mb-1.5">
                {language === 'en' ? 'Time Slot' : 'Muda'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedTime === slot
                        ? 'border-[#111111] bg-[#111111] text-white'
                        : 'border-[#EAEAEA] bg-white text-[#444444] hover:border-black'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location & Hair Texture Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs flex items-center justify-center font-bold">3</span>
            <h2 className="font-serif text-lg font-semibold text-[#111111]">
              {language === 'en' ? 'Location & Natural Hair Texture' : 'Eneo na Umbile la Nywele Yako'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedLocation('Fine Hair Salon (Mikocheni B, Ussagara Street)')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLocation.includes('Mikocheni B')
                  ? 'border-[#B89758] bg-[#FDFBF7]'
                  : 'border-[#EAEAEA] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111]">Atelier: Mikocheni B, Ussagara St</span>
                {selectedLocation.includes('Mikocheni B') && <Check className="w-4 h-4 text-[#B89758]" />}
              </div>
              <p className="text-[11px] text-[#666666] mt-1">Full luxury salon amenities, wash basin, AC, & VIP beverage</p>
            </div>

            <div
              onClick={() => setSelectedLocation('VIP Home / Hotel Glam')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLocation.includes('VIP Home')
                  ? 'border-[#B89758] bg-[#FDFBF7]'
                  : 'border-[#EAEAEA] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111]">VIP House Call / Hotel (+50,000 TZS)</span>
                {selectedLocation.includes('VIP Home') && <Check className="w-4 h-4 text-[#B89758]" />}
              </div>
              <p className="text-[11px] text-[#666666] mt-1">Master stylist travels to Masaki, Oysterbay, CBD, or Mbezi Beach</p>
            </div>
          </div>

          {/* Hair Texture Chips */}
          <div>
            <label className="text-xs font-semibold text-[#333333] block mb-1.5">
              {language === 'en' ? 'Your Natural Hair Texture Profile' : 'Umbile la Nywele Zako Asilia'}
            </label>
            <div className="flex flex-wrap gap-2">
              {textureOptions.map((tex) => (
                <button
                  type="button"
                  key={tex}
                  onClick={() => setHairTexture(tex)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    hairTexture === tex
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#EAEAEA] bg-white text-[#444444] hover:border-black'
                  }`}
                >
                  {tex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Client Info & Submit */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs flex items-center justify-center font-bold">4</span>
            <h2 className="font-serif text-lg font-semibold text-[#111111]">
              {language === 'en' ? 'Client Details & Confirmation' : 'Taarifa za Mteja & Malipo'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#333333] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Sarah Mkwawa"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-hidden focus:border-black"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#333333] block mb-1">Phone Number (M-Pesa)</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+255 754 892 110"
                className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#333333] block mb-1">Styling Notes / Special Requests</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Sensitive scalp, bringing 24 inch bundles, require knot bleaching..."
              className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-hidden focus:border-black"
            />
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['M-Pesa', 'Lipa Namba', 'Tigo Pesa', 'Cash at Salon'] as const).map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  paymentMethod === method
                    ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                    : 'border-[#EAEAEA] bg-white text-[#444444] hover:border-black'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Pricing summary & submit button */}
          <div className="bg-[#FAF9F6] border border-[#E8DECC] rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-[#444444]">Total Appointment Estimate:</span>
              <span className="font-serif text-xl font-bold text-[#111111]">{formatTZS(grandTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#666666] border-t border-[#EAE6DD] pt-2">
              <span>Deposit Payable to Secure Slot:</span>
              <span className="font-semibold text-[#B89758]">{formatTZS(depositRequired)}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md"
            >
              {language === 'en' ? 'Confirm Appointment' : 'Thibitisha Nafasi Yako'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
