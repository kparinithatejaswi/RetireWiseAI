import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, BarChart3, Calculator, PiggyBank, Briefcase, BookOpen, AlertCircle, DollarSign } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onTryAdvisor: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: "dashboard" | "chat" | "platforms" | "portfolio" | "tax" | "learning") => void;
}

export function LandingPage({ onGetStarted, onTryAdvisor, onOpenAuth, onNavigateTab }: LandingPageProps) {
  const [isSuiteCategoriesOpen, setIsSuiteCategoriesOpen] = React.useState(false);

  return (
    <div id="landing-container" className="pt-20 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Hero Section */}
      <section id="hero-section" className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-20 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute inset-0 top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 top-1/3 left-1/4 w-[400px] h-[200px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/50 mb-6 animate-pulse">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Next-Gen Wealth Management</span>
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Plan Your Retirement <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">Smarter with AI</span>
          </h1>
          
          <p className="mt-6 font-sans text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get personalized retirement plans, investment recommendations, tax-saving strategies, and financial guidance powered by AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              id="hero-get-started"
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-200 hover:scale-102 hover:cursor-pointer"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              id="hero-try-advisor"
              onClick={onTryAdvisor}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-850 px-8 py-4 text-base font-semibold text-gray-750 dark:text-slate-200 shadow-md transition-all duration-200 hover:scale-102 hover:cursor-pointer"
            >
              Try AI Advisor
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 pt-8 border-t border-gray-200/60 dark:border-slate-850 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-3xl font-bold text-blue-600 dark:text-blue-400">₹4500C+</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">Assets Simulated</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-emerald-500 dark:text-emerald-400">25,000+</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">Smart Planners</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-indigo-500 dark:text-indigo-400">99.4%</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">AI Match Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner / Core Brand Pillars */}
      <section id="features-grid-header" className="bg-white dark:bg-slate-930 border-y border-gray-200/50 dark:border-slate-850/50 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white">Strict Fiduciary Alignment</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Every recommendation matches your true risk appetite. Zero biased platform listings.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white">Real-Time Scenario Calculus</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Instantly stress test inflation surges, premature retirement, or volatile equity corrections.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white">Gemini-Engine Intelligence</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Harness advanced language parameters to compare local tax laws, EPF, PPF, Roth IRAs, or 401ks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section Breakdown */}
      <section id="features-highlights" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">Our AI Financial Suite</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">Pragmatic, math-driven algorithms to protect, grow, and audit your future nest egg.</p>
        </div>

        {/* Categories Explorable Toggle Panel */}
        <div className="flex flex-col items-center justify-center mb-12">
          <button
            id="toggle-financial-suite-categories"
            onClick={() => setIsSuiteCategoriesOpen(!isSuiteCategoriesOpen)}
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-sans font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-102 cursor-pointer"
          >
            <span>Our AI financial suit categories</span>
            <ChevronRight className={`h-5 w-5 transition-transform duration-350 ${isSuiteCategoriesOpen ? "rotate-90" : ""}`} />
          </button>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-3">
            {isSuiteCategoriesOpen ? "▲ Click to collapse suite categories drawer" : "▼ Click to open and expand all categories"}
          </p>
        </div>

        {isSuiteCategoriesOpen ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Feature 1 */}
            <div 
              id="category-retirement-planner"
              onClick={() => onNavigateTab("dashboard")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit mb-5">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">AI Retirement Planner</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Enter basic details. Let our AI map an inflation-adjusted roadmap charting target corpora, monthly saving matches, and specific asset indices.
              </p>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open Planner Tool <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              id="category-broker-advisor"
              onClick={() => onNavigateTab("platforms")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-emerald-100/50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 w-fit mb-5">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Investment Broker Advisor</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Detailed suggestions on best brokerage apps (Fidelity, Vanguard, Charles Schwab, Zerodha, Groww) mapped precisely to fees, reviews, and countries.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                Open Broker Advisor <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              id="category-portfolio-audit"
              onClick={() => onNavigateTab("portfolio")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 w-fit mb-5">
                <PiggyBank className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Portfolio Diagnosis Audit</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Upload existing holdings. Analyze expected volatility, diversification balance, expected returns, and fetch a concrete Retirement Readiness Score.
              </p>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                Open Diagnostic Audit <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              id="category-tax-assistant"
              onClick={() => onNavigateTab("tax")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 w-fit mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Tax Optimization Assistant</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                AI maps tax-efficient legal deductions (Section 80C/80CCD in India, 401(k)/Roth in US, Pension schemes) allowing massive lifetime savings.
              </p>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                Open Tax Optimizer <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 5 */}
            <div 
              id="category-scenario-sandbox"
              onClick={() => onNavigateTab("dashboard")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-pink-500/50 dark:hover:border-pink-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-pink-100/50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 w-fit mb-5">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Interactive Scenario Sandbox</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Stress test calculations on what happens if you retire at 55 instead of 60, increase investments, experience deep market crashes, or inflation hikes.
              </p>
              <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                Open Scenario Sandbox <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 6 */}
            <div 
              id="category-goals-tracker"
              onClick={() => onNavigateTab("dashboard")}
              className="rounded-2xl border border-gray-100 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-md hover:border-teal-500/50 dark:hover:border-teal-500/40 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 animate-fade-in"
            >
              <div className="p-3 rounded-lg bg-teal-100/50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 w-fit mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Secure Goals Tracker</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Establish child education, home deposits, and emergency fund milestones. Visually monitor aggregate success against simulated targets.
              </p>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                Open Goals Tracker <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div 
              onClick={() => setIsSuiteCategoriesOpen(true)}
              className="w-full max-w-lg p-6 rounded-xl border border-dashed border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-930/50 transition text-center group"
            >
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition">
                Suite catalog is currently collapsed. Click here or use the button above to expose all 6 dynamic financial components.
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Monetization / Plans Showcase */}
      <section id="pricing-plans-section" className="py-20 px-4 bg-gray-100/50 dark:bg-slate-900/40 border-y border-gray-200 dark:border-slate-850">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/50 mb-3">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Fair, Tiered Pricing</span>
            </div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-900 dark:text-white">Choose Your Advisory Horizon</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Access individual PDF reports, professional CFP consultation booking, or full-platform AI suites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
              <div>
                <span className="font-semibold text-xs tracking-wider text-gray-400 uppercase">STARTER ROADMAP</span>
                <h3 className="font-sans font-bold text-2xl text-gray-900 dark:text-white mt-1">Free Basic Suite</h3>
                <p className="text-sm text-gray-400 mt-2">Kickstart essential metrics and platform selection.</p>
                <p className="font-mono text-4xl font-extrabold text-gray-900 dark:text-white mt-6">₹0 <span className="text-xs font-normal text-gray-400">/ forever</span></p>
                
                <ul className="mt-8 space-y-3.5 text-sm text-gray-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Local savings projections</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Smart alerts (Maximum 3)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Basic broker suggestions</li>
                  <li className="flex items-center gap-2 text-gray-300 line-through"><CheckCircle2 className="h-4 w-4 shrink-0" /> Unlimited AI chat credits</li>
                </ul>
              </div>
              <button
                id="select-free-plan"
                onClick={onGetStarted}
                className="mt-8 w-full rounded-xl border border-gray-300 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 py-3 text-sm font-semibold transition"
              >
                Access Free Tools
              </button>
            </div>

            {/* Premium App (Best Value) */}
            <div className="rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-300 transform scale-102">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">POPULAR PRO</div>
              <div>
                <span className="font-semibold text-xs tracking-wider text-blue-600 dark:text-blue-400 uppercase">UNRESTRICTED POWER</span>
                <h3 className="font-sans font-bold text-2xl text-gray-900 dark:text-white mt-1">RetireWise Elite</h3>
                <p className="text-sm text-gray-400 mt-2">Fully loaded AI-powered dynamic platform access.</p>
                <p className="font-mono text-4xl font-extrabold text-gray-900 dark:text-white mt-6">₹1,499 <span className="text-xs font-normal text-gray-400">/ month</span></p>
                
                <ul className="mt-8 space-y-3.5 text-sm text-gray-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> **Unlimited** Server-Side Gemini Planner</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Downloadable PDF Financial Audits</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Full sandbox scenario sliders</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Comprehensive drag-and-drop portfolio analysis</li>
                </ul>
              </div>
              <button
                id="select-premium-plan"
                onClick={onGetStarted}
                className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition"
              >
                Launch Elite Suite
              </button>
            </div>

            {/* Consultation */}
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
              <div>
                <span className="font-semibold text-xs tracking-wider text-gray-400 uppercase">HUMAN CFP COLLABORATION</span>
                <h3 className="font-sans font-bold text-2xl text-gray-900 dark:text-white mt-1">Advisor Consulting</h3>
                <p className="text-sm text-gray-400 mt-2">1-on-1 direct session with a registered CFP.</p>
                <p className="font-mono text-4xl font-extrabold text-gray-900 dark:text-white mt-6">₹4,999 <span className="text-xs font-normal text-gray-400">/ booking</span></p>
                
                <ul className="mt-8 space-y-3.5 text-sm text-gray-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> 60-minute focused Zoom session</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Custom tax strategy review</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Verified official documentation review</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Post-session localized portfolio mapping</li>
                </ul>
              </div>
              <motion.button
                id="book-cfpadvisor"
                onClick={onOpenAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full rounded-xl border border-gray-300 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900 py-3 text-sm font-semibold transition"
              >
                Secure Slot Bookings
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate partners disclaimer section */}
      <section id="affiliate-disclosure-section" className="py-12 bg-white dark:bg-slate-950 px-4 text-center">
        <div className="max-w-4xl mx-auto border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="font-sans text-xs text-gray-400 leading-relaxed dark:text-slate-500">
            **Affiliate Referral Transparency Disclosure**: RetireWise AI recommended brokers (such as Vanguard, Fidelity, Charles Schwab, Zerodha, Groww) may compensate RetireWise with commissions on secure account establishments. This enables us to run premium server-side Gemini calculations and deliver state-of-the-art reports. This transaction cost has zero overhead effect on you. All analyses undergo strict fiduciary objective metrics.
          </p>
        </div>
      </section>
    </div>
  );
}
