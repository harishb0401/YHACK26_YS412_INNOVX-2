import React, { useState } from 'react';
import { 
  ArrowRight, Search, CheckCircle2, MapPin, Truck, Award, Sparkles, 
  BookOpen, Heart, Leaf, ShieldCheck, ChevronRight, ChevronLeft, Droplets, Users, RefreshCw
} from 'lucide-react';
import { 
  communityImpactStats, recyclingCategories, ecoJournalArticles, 
  communityTestimonials, searchableMaterials 
} from '../mockData';

export default function LandingView({ setActiveView, onOpenSearchModal }) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % communityTestimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + communityTestimonials.length) % communityTestimonials.length);
  };

  const activeTestimonial = communityTestimonials[testimonialIndex];

  return (
    <div className="space-y-0 text-[#203128]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F8F5EA] py-16 sm:py-20 lg:py-24 border-b border-[#3F7655]/10">
        
        {/* Decorative organic shapes */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#DDEBD8]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-[#F2C94C]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Eyebrow label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold tracking-wider uppercase border border-[#3F7655]/20">
                <Leaf className="w-4 h-4 text-[#3F7655]" />
                <span>A GREENER WAY TO LIVE</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#203128] tracking-tight leading-[1.15]">
                Recycle today. <br />
                <span className="text-[#3F7655]">Make tomorrow greener.</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-lg sm:text-xl text-[#718078] max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                Turn everyday waste into a positive impact. EcoLoop connects you with local recycling points, doorstep pickups, and verified educational guides.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveView('pickup')}
                  className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-full shadow-lg shadow-[#3F7655]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start Recycling</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('guide')}
                  className="w-full sm:w-auto px-7 py-4 text-base font-bold text-[#203128] bg-white hover:bg-[#DDEBD8]/50 border border-[#3F7655]/20 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#3F7655]" />
                  <span>Explore Guide</span>
                </button>
              </div>

              {/* Hero Stats */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-sm font-bold text-[#203128]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3F7655] text-white flex items-center justify-center text-xs font-bold">♻</div>
                  <span>12,480 kg recycled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F2C94C] text-[#244936] flex items-center justify-center text-xs font-bold">👥</div>
                  <span>3,420 users</span>
                </div>
              </div>

            </div>

            {/* Right Eco Illustration Container */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-8 rounded-[32px] border border-[#3F7655]/20 shadow-xl relative overflow-hidden text-center space-y-6">
                
                <div className="w-24 h-24 rounded-full bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center text-4xl mx-auto shadow-inner border border-[#3F7655]/20 animate-float-slow">
                  ♻
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#F2C94C] bg-[#244936] px-3 py-1 rounded-full">
                    ECOILLUSTRATION
                  </span>
                  <h3 className="text-xl font-extrabold text-[#203128]">Circular Everyday Life</h3>
                  <p className="text-xs text-[#718078] max-w-xs mx-auto">
                    From household sorting to material recovery and community reforestation.
                  </p>
                </div>

                {/* Floating Pill Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/10 text-left">
                    <span className="text-xs font-bold text-[#3F7655] block">💧 Water Saved</span>
                    <span className="text-sm font-black text-[#203128]">4.2M Liters</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/10 text-left">
                    <span className="text-xs font-bold text-[#3F7655] block">🌱 CO₂ Offset</span>
                    <span className="text-sm font-black text-[#203128]">8,240 kg</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. IMPACT STATISTICS STRIP */}
      <section className="py-8 bg-[#244936] text-white border-y border-[#3F7655]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#F2C94C] flex items-center justify-center gap-1">
                <span>♻</span> 12,480 kg
              </div>
              <p className="text-xs text-[#DDEBD8] font-semibold">Waste recycled</p>
              <span className="inline-block text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">↑ 18% this month</span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#DDEBD8] flex items-center justify-center gap-1">
                <span>🌱</span> 8,240 kg
              </div>
              <p className="text-xs text-[#DDEBD8] font-semibold">CO₂ saved</p>
              <span className="inline-block text-[10px] font-bold text-[#DDEBD8] opacity-80">Equivalent to 400 trees</span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#F2C94C] flex items-center justify-center gap-1">
                <span>💧</span> 4.2M L
              </div>
              <p className="text-xs text-[#DDEBD8] font-semibold">Water saved</p>
              <span className="inline-block text-[10px] font-bold text-[#DDEBD8] opacity-80">Basin conservation</span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#DDEBD8] flex items-center justify-center gap-1">
                <span>👥</span> 3,420
              </div>
              <p className="text-xs text-[#DDEBD8] font-semibold">Active recyclers</p>
              <span className="inline-block text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded">Community verified</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#F8F5EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128]">
              Simple, Predictable 4-Step Journey
            </h2>
            <p className="text-sm text-[#718078]">What → How → Where → Result</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 01 */}
            <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#3F7655] font-mono">01</span>
                <span className="text-3xl">♻</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#203128]">Sort</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Choose what you want to recycle using our material guide or search tool.
              </p>
            </div>

            {/* Step 02 */}
            <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#3F7655] font-mono">02</span>
                <span className="text-3xl">📦</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#203128]">Prepare</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Rinse bottles, flatten cardboard boxes, and keep materials clean and dry.
              </p>
            </div>

            {/* Step 03 */}
            <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#3F7655] font-mono">03</span>
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#203128]">Drop off / Pickup</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Find your nearest drop-off point or book a doorstep collection pickup.
              </p>
            </div>

            {/* Step 04 */}
            <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#3F7655] font-mono">04</span>
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#203128]">Impact</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Track what you've achieved, earn points, and redeem rewards.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RECYCLING CATEGORY SECTION */}
      <section className="py-20 bg-white border-y border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128]">
              What are you recycling today?
            </h2>
            <p className="text-sm text-[#718078]">
              Explore instructions and impact points for each material type.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recyclingCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setActiveView('guide')}
                className="bg-[#F8F5EA] p-6 rounded-[24px] border border-[#3F7655]/15 hover:border-[#3F7655]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="text-[11px] font-extrabold text-[#3F7655] bg-white px-2.5 py-0.5 rounded-full border border-[#3F7655]/15">
                      {cat.points}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#203128] group-hover:text-[#3F7655] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#718078] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between text-xs font-extrabold text-[#3F7655]">
                  <span>Learn →</span>
                  <span className="text-[10px] text-[#718078] font-medium">{cat.status}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE "CAN I RECYCLE THIS?" BANNER WIDGET */}
      <section className="py-16 bg-[#F8F5EA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#244936] text-white p-8 sm:p-10 rounded-[32px] shadow-xl border border-[#3F7655]/30 text-center space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#F2C94C] bg-[#14291E] px-3.5 py-1 rounded-full">
                INSTANT CHECKER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Not sure if it's recyclable?
              </h2>
              <p className="text-xs sm:text-sm text-[#DDEBD8]">
                Tell us what you're throwing away and get instant preparation rules.
              </p>
            </div>

            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenSearchModal}
                className="w-full py-4 bg-white hover:bg-[#DDEBD8] text-[#244936] font-extrabold text-sm rounded-2xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-5 h-5 text-[#3F7655]" />
                <span>Search Item (e.g. "pizza box", "batteries")</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SUSTAINABILITY STORY SECTION */}
      <section className="py-20 bg-white border-t border-[#3F7655]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="w-20 h-20 rounded-full bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center text-4xl mx-auto shadow-inner">
            🌱
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-[#203128] tracking-tight">
              Every small action adds up.
            </h2>
            <p className="text-base text-[#718078] leading-relaxed">
              Your daily commitment to clean sorting and responsible disposal helps divert tons of waste from local landfills and protects natural waterways.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F8F5EA] border border-[#3F7655]/20 text-sm font-extrabold text-[#3F7655]">
            <span>128 kg average waste diverted per active user</span>
          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS / COMMUNITY CAROUSEL */}
      <section className="py-16 bg-[#F8F5EA] border-t border-[#3F7655]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
            WHAT OUR COMMUNITY SAYS
          </span>

          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/15 shadow-sm space-y-6">
            <p className="text-lg sm:text-xl font-bold text-[#203128] italic leading-relaxed">
              “{activeTestimonial.quote}”
            </p>

            <div className="flex items-center justify-center gap-3">
              <img 
                src={activeTestimonial.avatar} 
                alt={activeTestimonial.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#3F7655]" 
              />
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-[#203128]">{activeTestimonial.name}</h4>
                <p className="text-xs text-[#718078]">{activeTestimonial.location}</p>
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-[#3F7655]/20 text-[#203128] hover:bg-[#DDEBD8] transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {communityTestimonials.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === testimonialIndex ? 'bg-[#3F7655] w-6' : 'bg-[#3F7655]/20'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-[#3F7655]/20 text-[#203128] hover:bg-[#DDEBD8] transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. ECO JOURNAL / BLOG */}
      <section className="py-20 bg-white border-t border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
              ECO JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128]">
              Educational Articles & Recycling Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ecoJournalArticles.map((art) => (
              <div 
                key={art.id}
                className="bg-[#F8F5EA] p-6 rounded-[24px] border border-[#3F7655]/15 hover:border-[#3F7655]/40 transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{art.icon}</span>
                    <span className="text-[11px] font-bold text-[#718078] font-mono">{art.readTime}</span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2 py-0.5 rounded">
                    {art.category}
                  </span>

                  <h3 className="text-base font-extrabold text-[#203128] mt-2 mb-1 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#718078] leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3F7655]/10">
                  <button 
                    onClick={() => alert(`Opening article: "${art.title}"`)}
                    className="text-xs font-bold text-[#3F7655] hover:underline flex items-center gap-1"
                  >
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
