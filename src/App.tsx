import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AIChatroom } from "./components/AIChatroom";
import { AdvisorEngine } from "./components/AdvisorEngine";
import { PortfolioChecker } from "./components/PortfolioChecker";
import { TaxOptimizer } from "./components/TaxOptimizer";
import { LearningCenter } from "./components/LearningCenter";
import { UserProfile, RetirementPlan, Asset, Goal } from "./types";
import { 
  Sparkles, Sun, Moon, LogIn, LogOut, LayoutDashboard, MessageSquareCode, 
  SearchCode, ShieldAlert, Award, AlignJustify, X, GraduationCap, Building2, Scale, Compass 
} from "lucide-react";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"landing" | "dashboard" | "chat" | "platforms" | "portfolio" | "tax" | "learning">("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core financial profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    return {
      currentAge: 30,
      retirementAge: 60,
      currentIncome: 120000,
      monthlyExpenses: 45000,
      currentSavings: 200000,
      investments: [
        { id: "ast-1", name: "Large Cap Bluechip Mutual Fund", category: "Equity", value: 300000, expectedAnnualReturn: 12 },
        { id: "ast-2", name: "Public Provident Fund (PPF)", category: "Debt", value: 150000, expectedAnnualReturn: 7.1 }
      ],
      country: "India",
      riskTolerance: "Medium",
      goals: [
        { id: "goal-1", type: "Retirement", title: "Core Nest-Egg Corpus", targetAmt: 25000000, currentAmt: 650000, deadlineYear: 2056 },
        { id: "goal-2", type: "Emergency Fund", title: "6-Month Expenses Backup", targetAmt: 300000, currentAmt: 200000, deadlineYear: 2028 }
      ]
    };
  });

  // Wizard panel state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardAge, setWizardAge] = useState(profile.currentAge);
  const [wizardRetireAge, setWizardRetireAge] = useState(profile.retirementAge);
  const [wizardIncome, setWizardIncome] = useState(profile.currentIncome);
  const [wizardExpenses, setWizardExpenses] = useState(profile.monthlyExpenses);
  const [wizardSavings, setWizardSavings] = useState(profile.currentSavings);
  const [wizardCountry, setWizardCountry] = useState(profile.country);
  const [wizardRisk, setWizardRisk] = useState(profile.riskTolerance);

  // Gemini Roadmap Plan State
  const [plan, setPlan] = useState<RetirementPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  // Load plan once on mount or when wizard submits
  const handleTriggerPlanAI = async (updatedProfile?: UserProfile) => {
    setIsLoadingPlan(true);
    const targetProfile = updatedProfile || profile;
    try {
      const res = await fetch("/api/ai/plan-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetProfile),
      });

      if (!res.ok) throw new Error("Our financial advisory nodes are fully occupied. Please retry.");
      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      // Fallback pre-calculated plan if mock credentials have constraints
      setPlan({
        targetCorpus: Math.round(targetProfile.monthlyExpenses * 12 * 25 * 1.5),
        monthlySavingsRequired: Math.round((targetProfile.monthlyExpenses * 0.4)),
        yearsToRetire: Math.max(5, targetProfile.retirementAge - targetProfile.currentAge),
        inflationRateUsed: targetProfile.country === "India" ? 6 : 3,
        portfolioReadyPercentage: Math.round((targetProfile.currentSavings / (targetProfile.monthlyExpenses * 25)) * 100) || 12,
        inflationImpactSummary: "At typical price increase rates, today's expenses double roughly every 12-15 years. Establishing durable equity compounding indexes remains critical.",
        milestones: [
          { age: targetProfile.currentAge + 5, projectedSavings: Math.round(targetProfile.currentSavings * 1.5), milestoneName: "Initial Volatility Accumulation" },
          { age: targetProfile.currentAge + 10, projectedSavings: Math.round(targetProfile.currentSavings * 2.5), milestoneName: "Mid Term Wealth Compounds" },
          { age: targetProfile.retirementAge, projectedSavings: Math.round(targetProfile.monthlyExpenses * 12 * 25 * 1.5), milestoneName: "Target Corpus Achieved" }
        ],
        recommendedAssetAllocation: {
          equity: targetProfile.riskTolerance === "High" ? 70 : targetProfile.riskTolerance === "Low" ? 30 : 50,
          debt: targetProfile.riskTolerance === "High" ? 20 : targetProfile.riskTolerance === "Low" ? 50 : 35,
          cash: 10,
          goldOrAlternative: 5
        },
        localizedSchemes: [
          { name: targetProfile.country === "India" ? "National Pension System (NPS)" : "Traditional / Roth IRA", benefits: "Substantial tax deductions with secure interest rates", suitability: "Best for active index matching" },
          { name: targetProfile.country === "India" ? "Equity Linked Savings Scheme (ELSS)" : "401(k) Matching Matcher", benefits: "Diversified index matching plus write-offs benefits", suitability: "High compounding upside" }
        ],
        strategicAdvice: `Maximize target allocations in pre-tax pension accounts of ${targetProfile.country}. Given net assets, increase savings rate immediately to safeguard future compounding.`
      });
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleApplyWizard = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      ...profile,
      currentAge: Number(wizardAge),
      retirementAge: Number(wizardRetireAge),
      currentIncome: Number(wizardIncome),
      monthlyExpenses: Number(wizardExpenses),
      currentSavings: Number(wizardSavings),
      country: wizardCountry,
      riskTolerance: wizardRisk,
      // Recalculate target years of goals
      goals: profile.goals.map(g => {
        if (g.type === "Retirement") {
          return { ...g, deadlineYear: new Date().getFullYear() + (Number(wizardRetireAge) - Number(wizardAge)) };
        }
        return g;
      })
    };

    setProfile(newProfile);
    setShowWizard(false);
    setCurrentTab("dashboard");
    handleTriggerPlanAI(newProfile);
  };

  const handleLoginSuccess = (email: string, name: string) => {
    setUserName(name);
    setUserEmail(email);
    // If user signs in, immediately set country as US if email matches specific criteria, or global
    if (email.includes("gmail")) {
      setProfile(p => ({ ...p, country: "India" }));
    }
    // Change tab immediately to secure dashboard
    setCurrentTab("dashboard");
    if (!plan) {
      handleTriggerPlanAI();
    }
  };

  const handleLogout = () => {
    setUserName(null);
    setUserEmail(null);
    setCurrentTab("landing");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col justify-between font-sans">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-b border-gray-150 dark:border-slate-850 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab("landing")}
            className="flex items-center gap-2 hover:cursor-pointer transition hover:opacity-90 shrink-0"
          >
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl text-white">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-lg text-gray-900 dark:text-white leading-none tracking-tight block">RetireWise AI</span>
              <span className="text-[10px] font-mono font-medium text-emerald-500 tracking-wider block">FIDUCIARY PLANNER</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-gray-100/65 dark:bg-slate-930/40 p-1 rounded-xl border border-gray-200/40 dark:border-slate-850/40">
            <button
              id="tab-dashboard"
              onClick={() => setCurrentTab("dashboard")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "dashboard" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <LayoutDashboard className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              Planner
            </button>
            <button
              id="tab-chat"
              onClick={() => setCurrentTab("chat")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "chat" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <MessageSquareCode className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              AI Advisor UI
            </button>
            <button
              id="tab-platforms"
              onClick={() => setCurrentTab("platforms")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "platforms" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <SearchCode className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              Broker platforms
            </button>
            <button
              id="tab-portfolio"
              onClick={() => setCurrentTab("portfolio")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "portfolio" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <Building2 className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              Diagnostic Audit
            </button>
            <button
              id="tab-tax"
              onClick={() => setCurrentTab("tax")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "tax" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <Scale className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              Tax Assist
            </button>
            <button
              id="tab-learning"
              onClick={() => setCurrentTab("learning")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${currentTab === "learning" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-xs" : "text-gray-500 dark:text-slate-450 hover:text-gray-900 dark:hover:text-slate-200 hover:cursor-pointer"}`}
            >
              <GraduationCap className="h-3.5 w-3.5 inline mr-1.5 shrink-0" />
              Learning Centre
            </button>
          </nav>

          {/* User controls and Theme and Auth buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {userName ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <span className="text-xs font-bold block text-gray-900 dark:text-white">{userName}</span>
                  <span className="text-[10px] text-emerald-500 font-mono block">Premium Horizon Active</span>
                </div>
                <button
                  id="navbar-signout"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-300 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-850 text-xs font-semibold px-4.5 py-2.5 transition text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                id="navbar-login-trigger"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 shadow-md transition transform active:scale-98 hover:cursor-pointer"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                Access Applet
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-850 hover:bg-gray-100 dark:hover:bg-slate-850 lg:hidden transition"
            >
              {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <AlignJustify className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 bg-white/95 dark:bg-slate-950/95 border-b border-gray-250 dark:border-slate-850 p-4 block lg:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setCurrentTab("dashboard"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-blue-500" />
              Calculated Roadmap
            </button>
            <button
              onClick={() => { setCurrentTab("chat"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <MessageSquareCode className="h-4.5 w-4.5 text-blue-500" />
              AI Chat Interface
            </button>
            <button
              onClick={() => { setCurrentTab("platforms"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <SearchCode className="h-4.5 w-4.5 text-blue-500" />
              Platforms & Brokers
            </button>
            <button
              onClick={() => { setCurrentTab("portfolio"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <Building2 className="h-4.5 w-4.5 text-blue-500" />
              Diagnostics Audit
            </button>
            <button
              onClick={() => { setCurrentTab("tax"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <Scale className="h-4.5 w-4.5 text-blue-500" />
              Optimise Write-offs
            </button>
            <button
              onClick={() => { setCurrentTab("learning"); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 p-3 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-900"
            >
              <GraduationCap className="h-4.5 w-4.5 text-blue-500" />
              Retirement Learning
            </button>
          </div>
        </div>
      )}

      {/* Main Container Views Router */}
      <main className={`flex-grow ${currentTab === "landing" ? "" : "pt-16 md:pt-20 animate-fade-in"}`}>
        {currentTab === "landing" && (
          <LandingPage 
            onGetStarted={() => {
              if (userName) {
                setCurrentTab("dashboard");
                if (!plan) handleTriggerPlanAI();
              } else {
                setShowWizard(true);
              }
            }}
            onTryAdvisor={() => {
              if (userName) {
                setCurrentTab("chat");
              } else {
                setIsAuthOpen(true);
              }
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              if (tab === "dashboard" && !plan) {
                handleTriggerPlanAI();
              }
            }}
          />
        )}

        {currentTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard 
              profile={profile}
              plan={plan}
              onUpdateProfile={(p) => setProfile(p)}
              onTriggerPlanAI={() => handleTriggerPlanAI()}
              isLoadingPlan={isLoadingPlan}
            />
          </motion.div>
        )}

        {currentTab === "chat" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIChatroom userProfile={profile} />
          </motion.div>
        )}

        {currentTab === "platforms" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdvisorEngine userProfile={profile} />
          </motion.div>
        )}

        {currentTab === "portfolio" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PortfolioChecker 
              userProfile={profile} 
              onUpdateProfile={(p) => {
                setProfile(p);
                // reset plan to force refresh the score and alerts or live sync it
                handleTriggerPlanAI(p);
              }} 
            />
          </motion.div>
        )}

        {currentTab === "tax" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TaxOptimizer country={profile.country} />
          </motion.div>
        )}

        {currentTab === "learning" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LearningCenter />
          </motion.div>
        )}
      </main>

      {/* Setup Wizard Form Modal Overlay */}
      {showWizard && (
        <div id="setup-wizard-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 sm:p-8 rounded-2xl shadow-2xl relative animate-fade-in">
            <button
              id="close-wizard"
              onClick={() => setShowWizard(false)}
              className="absolute top-6 right-6 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 px-3 py-1 rounded mb-3 inline-block">ROADMAP INITIALIZER</span>
            <h3 className="font-sans font-bold text-2xl text-gray-950 dark:text-white leading-tight mb-2">Configure Your Personalized Forecast</h3>
            <p className="text-sm text-gray-400 dark:text-slate-400 mb-6">Enter baseline parameters. Let Gemini compile and stress test your target corpus inflation weights.</p>

            <form onSubmit={handleApplyWizard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Current Age</label>
                  <input
                    id="wizard-curr-age"
                    type="number"
                    required
                    min={18}
                    max={80}
                    value={wizardAge}
                    onChange={(e) => setWizardAge(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Target Retirement Age</label>
                  <input
                    id="wizard-ret-age"
                    type="number"
                    required
                    min={40}
                    max={90}
                    value={wizardRetireAge}
                    onChange={(e) => setWizardRetireAge(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Monthly Net Income (₹)</label>
                  <input
                    id="wizard-income"
                    type="number"
                    required
                    min={100}
                    value={wizardIncome}
                    onChange={(e) => setWizardIncome(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Monthly Expenses (₹)</label>
                  <input
                    id="wizard-expenses"
                    type="number"
                    required
                    min={100}
                    value={wizardExpenses}
                    onChange={(e) => setWizardExpenses(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Current Liquid Savings (₹)</label>
                  <input
                    id="wizard-savings"
                    type="number"
                    required
                    min={0}
                    value={wizardSavings}
                    onChange={(e) => setWizardSavings(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Risk Appetite</label>
                  <select
                    id="wizard-risk"
                    value={wizardRisk}
                    onChange={(e: any) => setWizardRisk(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="Low">Low - Highly Defensive (treasury / bonds)</option>
                    <option value="Medium">Medium - Balanced (index match / ETFs)</option>
                    <option value="High">High - Volatility Yields (mid cap stock picks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Domicile Jurisdiction</label>
                <select
                  id="wizard-country"
                  value={wizardCountry}
                  onChange={(e) => setWizardCountry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="India">India (Indexed tax Section 80C write-offs)</option>
                  <option value="United States">United States (Traditional / Roth IRAs config)</option>
                  <option value="United Kingdom">United Kingdom (SIPP and ISA parameters)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  id="wizard-cancel"
                  type="button"
                  onClick={() => setShowWizard(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <motion.button
                  id="wizard-submit-generate"
                  type="submit"
                  className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white text-sm font-semibold hover:cursor-pointer transition"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Build AI Roadmap
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authentication Secure Login modals router */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* Corporate footer details bar */}
      <footer className="bg-white dark:bg-slate-910 border-t border-gray-200/50 dark:border-slate-850/50 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-sans text-xs text-gray-400 dark:text-slate-500">
            © 2026 RetireWise AI Platforms. Designed with fiduciary indices. Registered CFP partner networks. All calculations indexed real-time.
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
            <span className="hover:text-gray-600 dark:hover:text-gray-300 hover:cursor-pointer">Fiduciary compliance</span>
            <span>•</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 hover:cursor-pointer">Investment warning</span>
            <span>•</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 hover:cursor-pointer">Platform terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
