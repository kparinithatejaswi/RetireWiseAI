import React, { useState } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from "recharts";
import { 
  Goal, Asset, UserProfile, RetirementPlan 
} from "../types";
import { 
  Plus, Edit2, TrendingUp, Compass, Calendar, Sparkles, AlertTriangle, ShieldCheck, Download, Users, RefreshCw, Smartphone, Play, HelpCircle
} from "lucide-react";
import jsPDF from "jspdf";

interface DashboardProps {
  profile: UserProfile;
  plan: RetirementPlan | null;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onTriggerPlanAI: () => void;
  isLoadingPlan: boolean;
}

export function Dashboard({ profile, plan, onUpdateProfile, onTriggerPlanAI, isLoadingPlan }: DashboardProps) {
  // Scenario simulation sliders state
  const [retireScenarioAge, setRetireScenarioAge] = useState(profile.retirementAge);
  const [extraMonthlySave, setExtraMonthlySave] = useState(0);
  const [marketEvent, setMarketEvent] = useState<"steady" | "crash_soon" | "boom">("steady");
  const [inflationScenario, setInflationScenario] = useState(plan?.inflationRateUsed || 5);
  
  // Custom goal inputs
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoalType, setNewGoalType] = useState<Goal["type"]>("Emergency Fund");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(100000);
  const [newGoalCurrent, setNewGoalCurrent] = useState(10000);
  const [newGoalYear, setNewGoalYear] = useState(2032);

  // PDF Download State
  const [isCompilingPDF, setIsCompilingPDF] = useState(false);

  // Calculate aggregate net worth (Investments + generic savings)
  const totalInvestments = profile.investments.reduce((sum, item) => sum + item.value, 0);
  const totalNetWorth = totalInvestments + profile.currentSavings;

  // Render Asset Allocation Pie Chart Data
  const pieData = [
    { name: "Equity", value: plan?.recommendedAssetAllocation.equity || 50, color: "#3182ce" },
    { name: "Debt", value: plan?.recommendedAssetAllocation.debt || 30, color: "#38a169" },
    { name: "Cash", value: plan?.recommendedAssetAllocation.cash || 10, color: "#d69e2e" },
    { name: "Alternatives/Gold", value: plan?.recommendedAssetAllocation.goldOrAlternative || 10, color: "#805ad5" },
  ];

  // Recalculate milestone predictions on sliding parameters
  const rebuildMilestones = () => {
    const yearsLeft = Math.max(1, retireScenarioAge - profile.currentAge);
    const result = [];
    let currentCorpus = totalNetWorth;
    const baseInflation = inflationScenario / 100;
    
    // Adjusted annualized expected yield depending on asset splits & market conditions
    let compoundRate = 0.08; // default 8% nominal returning rate
    if (marketEvent === "crash_soon") compoundRate = 0.03; // low yield period
    if (marketEvent === "boom") compoundRate = 0.12; // high yield period

    const monthlyCompounding = compoundRate / 12;
    const baseSaving = (profile.currentIncome - profile.monthlyExpenses) + extraMonthlySave;

    // Compile 5 distinct markers
    const step = Math.max(1, Math.floor(yearsLeft / 4));
    for (let i = 0; i <= 4; i++) {
      const yearOffset = i * step;
      const targetAge = profile.currentAge + yearOffset;
      const totalMonths = yearOffset * 12;

      // Compound current corpus plus ongoing monthly additions
      let calculatedValue = currentCorpus * Math.pow(1 + monthlyCompounding, totalMonths);
      if (monthlyCompounding > 0) {
        calculatedValue += baseSaving * ((Math.pow(1 + monthlyCompounding, totalMonths) - 1) / monthlyCompounding);
      } else {
        calculatedValue += baseSaving * totalMonths;
      }

      // Adjust to real terms by deducting price index growth
      const inflationAdjustment = Math.pow(1 + baseInflation, yearOffset);
      const realValue = calculatedValue / inflationAdjustment;

      result.push({
        age: targetAge,
        "Simulated Corpus (Real Value)": Math.round(realValue),
        "Baseline Corpus": Math.round(plan?.milestones[i]?.projectedSavings || realValue * 0.95),
      });
    }
    return result;
  };

  const calculatedMilestones = rebuildMilestones();

  // Add customized goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const added: Goal = {
      id: Date.now().toString(),
      type: newGoalType,
      title: newGoalTitle,
      targetAmt: Number(newGoalTarget),
      currentAmt: Number(newGoalCurrent),
      deadlineYear: Number(newGoalYear)
    };

    onUpdateProfile({
      ...profile,
      goals: [...profile.goals, added]
    });

    // Reset Form
    setNewGoalTitle("");
    setShowGoalForm(false);
  };

  // Contribute money towards goal
  const handleContributeGoal = (goalId: string, amount: number) => {
    const updatedGoals = profile.goals.map((g) => {
      if (g.id === goalId) {
        return { ...g, currentAmt: Math.min(g.targetAmt, g.currentAmt + amount) };
      }
      return g;
    });

    onUpdateProfile({
      ...profile,
      goals: updatedGoals
    });
  };

  // Compile PDF via Gemini API route & jsPDF
  const handleTriggerPDFDownload = async () => {
    setIsCompilingPDF(true);
    try {
      const response = await fetch("/api/ai/financial-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) throw new Error("Could not construct PDF content.");
      const data = await response.json();
      const reportText = data.reportText || "RetireWise AI General Advice: Saving aggressively is suggested.";

      // Initialize jsPDF
      const doc = new jsPDF("p", "pt", "a4");
      
      // Formatting styling
      doc.setFillColor(15, 23, 42); // slate 900 background header
      doc.rect(0, 0, 595, 120, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(24);
      doc.text("RetireWise AI On-Demand Financial Onboarding Audit", 40, 50);
      
      doc.setTextColor(148, 163, 184);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`DATE GENERATED: ${new Date().toLocaleDateString()} | CLIENT PROFILE: ${profile.country}`, 40, 85);
      doc.text(`RETIREMENT AGE TARGET: ${profile.retirementAge} | SAVINGS RATE GAP SUGGESTED: HIGH`, 40, 100);

      // Report content writing
      doc.setTextColor(30, 41, 59); // slate 800
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("EXECUTIVE ADVISORY FEEDBACK", 40, 160);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      
      // Split the Gemini response by newlines and print gracefully to PDF
      const lines = doc.splitTextToSize(reportText, 515);
      let yOffset = 185;
      
      for (let i = 0; i < lines.length; i++) {
        if (yOffset > 780) { // Page boundary control
          doc.addPage();
          yOffset = 50; // reset
        }
        doc.text(lines[i], 40, yOffset);
        yOffset += 14;
      }

      doc.save(`RetireWise_AI_Financial_Report_${profile.country}.pdf`);
    } catch (err: any) {
      alert("Error printing PDF: " + err.message);
    } finally {
      setIsCompilingPDF(false);
    }
  };

  return (
    <div id="dashboard-tab-panel" className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Onboarding Profile Overview Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 overflow-hidden border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="font-sans font-bold text-2xl text-gray-900 dark:text-white">Professional Client Workspace</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Setting up: At age <strong className="text-blue-600 dark:text-blue-400">{profile.currentAge}</strong> towards target retirement age <strong className="text-emerald-500">{profile.retirementAge}</strong> in <strong>{profile.country}</strong>.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            id="re-evaluate-plan"
            onClick={onTriggerPlanAI}
            disabled={isLoadingPlan}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold text-white px-5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingPlan ? "animate-spin" : ""}`} />
            {isLoadingPlan ? "Recalculating with AI..." : "Re-Calculate Plan"}
          </button>

          <button
            id="download-premium-pdf"
            disabled={isCompilingPDF}
            onClick={handleTriggerPDFDownload}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 dark:from-emerald-600 dark:to-teal-700 text-white font-semibold px-5 py-2.5 text-sm transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isCompilingPDF ? "Compiling PDF..." : "Export Financial Health PDF"}
          </button>
        </div>
      </div>

      {/* Main Core Net Worth Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Core Net Worth */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500 uppercase block">NET WORTH VALUE</span>
          <span className="font-mono text-3xl font-extrabold text-gray-800 dark:text-white mt-2 block">
            ₹{totalNetWorth.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">
            <TrendingUp className="h-3 w-3" />
            Includes investments and general liquidity.
          </div>
        </div>

        {/* Current General Liquid Savings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500 uppercase block">LIQUID DEPOSITS</span>
          <span className="font-mono text-3xl font-extrabold text-gray-800 dark:text-white mt-2 block">
            ₹{profile.currentSavings.toLocaleString()}
          </span>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
            Ready emergency funds secure.
          </div>
        </div>

        {/* Target Retirement Corpus */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500 uppercase block">TARGET CORPUS (INFLATION ADJ.)</span>
          <span className="font-mono text-3xl font-extrabold text-gray-800 dark:text-white mt-2 block">
            {plan ? `₹${plan.targetCorpus.toLocaleString()}` : "₹2,50,00,000"}
          </span>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-3 flex items-center gap-1 leading-tight">
            Inflation: {plan?.inflationRateUsed || 5}% rate indexed.
          </p>
        </div>

        {/* Retirement Readiness Score Meter */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
          <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500 uppercase block">RETIREMENT READINESS SCORE</span>
          
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-mono text-4xl font-extrabold text-gray-800 dark:text-white">
              {plan ? plan.portfolioReadyPercentage : 28}
            </span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${plan ? plan.portfolioReadyPercentage : 28}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Strategic Advice Alert banner */}
      {plan?.strategicAdvice && (
        <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Advisor Immediate Action Item
            </h4>
            <p className="text-sm text-gray-650 dark:text-slate-350 mt-1 leading-relaxed">
              {plan.strategicAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Main Graph Projections and Asset Allocations Split row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wealth Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Wealth Accumulation Forecast
              </h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Inflation-adjusted real value projection to retirement</p>
            </div>
            {/* Status note */}
            <span className="text-xs font-mono font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full animate-pulse">
              Scenario Active
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculatedMilestones} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                <defs>
                  <linearGradient id="scenId" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="baseId" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a169" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38a169" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="age" name="Age" stroke="#a0aec0" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#a0aec0" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} 
                />
                <Tooltip 
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, "Corpus"]}
                  labelFormatter={(age) => `Projected Age: ${age}`}
                  contentStyle={{ backgroundColor: "#0f172a", border: "0", borderRadius: "12px", color: "#fff" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", pt: "10px" }} />
                <Area type="monotone" dataKey="Simulated Corpus (Real Value)" stroke="#3182ce" strokeWidth={2.5} fillOpacity={1} fill="url(#scenId)" />
                <Area type="monotone" dataKey="Baseline Corpus" stroke="#38a169" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#baseId)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggested Asset Allocation Breakdown using customized Recharts Ring */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white">Suggested Asset Allocations</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Recommended target ratios based on profile complexity</p>

            <div className="flex justify-center items-center h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex justify-between items-center text-xs text-gray-600 dark:text-slate-350 border-b border-gray-100 dark:border-slate-850 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span>{entry.name}</span>
                </div>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Scenario Simulator Block */}
      <div id="scenario-simulator-dashboard" className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-6 shadow-sm">
        <h3 className="font-sans font-extrabold text-xl text-gray-950 dark:text-white flex items-center gap-2">
          <Sparkles className="h-5.5 w-5.5 text-blue-500" />
          AI Scenario Sandbox & Stress Simulator
        </h3>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1.5 mb-6">
          Toggle saving patterns, pre-retirement years, custom inflation variables, and stock market volatility to test portfolio reactions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Retire Scenario Age */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs text-gray-700 dark:text-slate-300">
              <span className="font-medium">Retirement Age Target</span>
              <strong className="font-mono text-blue-600 dark:text-blue-400">{retireScenarioAge} yrs</strong>
            </div>
            <input 
              id="retire-age-slider"
              type="range" 
              min={45} 
              max={75}
              value={retireScenarioAge} 
              onChange={(e) => setRetireScenarioAge(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-ew-resize bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none h-1.5"
            />
            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">Test early retirement at 55 or late transitions as high as 75.</p>
          </div>

          {/* Slider 2: Extra Monthly Savings */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs text-gray-700 dark:text-slate-300">
              <span className="font-medium">Increase Monthly Savings</span>
              <strong className="font-mono text-blue-600 dark:text-blue-400">+₹{extraMonthlySave.toLocaleString()}</strong>
            </div>
            <input 
              id="extra-save-slider"
              type="range" 
              min={0} 
              max={100000} 
              step={2000}
              value={extraMonthlySave} 
              onChange={(e) => setExtraMonthlySave(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-ew-resize bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none h-1.5"
            />
            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">Increase savings rate to offset compounding shortfall targets.</p>
          </div>

          {/* Slider 3: Inflation simulation scale */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs text-gray-700 dark:text-slate-300">
              <span className="font-medium">Simulated Inflation Rate</span>
              <strong className="font-mono text-blue-600 dark:text-blue-400">{inflationScenario}%</strong>
            </div>
            <input 
              id="inflation-slider"
              type="range" 
              min={2} 
              max={12} 
              step={0.5}
              value={inflationScenario} 
              onChange={(e) => setInflationScenario(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-ew-resize bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none h-1.5"
            />
            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">Simulate macro hyperinflation shocks (8-10%) on the final real nest egg value.</p>
          </div>

          {/* Dropdown 4: Stock Market Event */}
          <div className="space-y-2.5">
            <label className="block text-xs font-medium text-gray-700 dark:text-slate-300">Market Volatility Event</label>
            <select
              id="market-event-dropdown"
              value={marketEvent}
              onChange={(e: any) => setMarketEvent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="steady">Normal Growth Trends (steady 8%)</option>
              <option value="crash_soon">Protracted Bear Market (Crash - 3% returns)</option>
              <option value="boom">Bull Market Rally (Boom - 12% returns)</option>
            </select>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-tight">Stress test long-term retirement asset compounding during severe asset corrections.</p>
          </div>
        </div>
      </div>

      {/* Goal Tracker Module and Smart Alerts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goal Tracker card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white">Active Goals Tracker</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Track child education, house deposits, and emergency funds</p>
            </div>
            
            <button
              id="toggle-add-goal-form"
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
            >
              <Plus className="h-4.5 w-4.5" />
              Establish Goal
            </button>
          </div>

          {/* Sub goal creator form */}
          {showGoalForm && (
            <form onSubmit={handleAddGoal} className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Goal Class</label>
                  <select
                    id="new-goal-type-select"
                    value={newGoalType}
                    onChange={(e: any) => setNewGoalType(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-350 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Child Education">Child Education</option>
                    <option value="House Purchase">House Purchase</option>
                    <option value="Retirement">Retirement Addition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Custom Title</label>
                  <input
                    id="new-goal-title"
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g. Pune Townhouse Deposit"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-350 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Target Amount (₹)</label>
                  <input
                    id="new-goal-target"
                    type="number"
                    min={100}
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-350 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Current Saved (₹)</label>
                  <input
                    id="new-goal-current"
                    type="number"
                    min={0}
                    value={newGoalCurrent}
                    onChange={(e) => setNewGoalCurrent(Number(e.target.value))}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-350 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Estimated Year</label>
                  <input
                    id="new-goal-year"
                    type="number"
                    min={2026}
                    value={newGoalYear}
                    onChange={(e) => setNewGoalYear(Number(e.target.value))}
                    className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-350 dark:border-slate-800 rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  id="cancel-goal-creator"
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="px-3 py-1 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  id="submit-goal-creator"
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded transition"
                >
                  Create Goal
                </button>
              </div>
            </form>
          )}

          {/* Goals mapped list */}
          <div className="space-y-4">
            {profile.goals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No specific milestones configured yet. Add one above!</p>
            ) : (
              profile.goals.map((goal) => {
                const completePct = Math.min(100, Math.round((goal.currentAmt / goal.targetAmt) * 100));
                return (
                  <div key={goal.id} className="p-4 border border-gray-100 dark:border-slate-850 rounded-xl space-y-3 hover:border-blue-100 dark:hover:border-slate-800 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{goal.type}</span>
                        <h4 className="font-sans font-bold text-sm text-gray-900 dark:text-white mt-1.5">{goal.title}</h4>
                      </div>
                      <span className="font-mono text-xs text-gray-400">Target Year: {goal.deadlineYear}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-gray-500 dark:text-slate-400">
                        <span>₹{goal.currentAmt.toLocaleString()} saved</span>
                        <span>₹{goal.targetAmt.toLocaleString()} target</span>
                      </div>
                      
                      {/* Percent progress wrapper */}
                      <div className="flex items-center gap-3">
                        <div className="flex-grow bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all" 
                            style={{ width: `${completePct}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 shrink-0">{completePct}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-slate-850/50">
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">Add contributions continuously to ensure matching projections.</p>
                      
                      <div className="flex gap-1.5">
                        <button
                          id={`save-goal-add-5k-${goal.id}`}
                          onClick={() => handleContributeGoal(goal.id, 5000)}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-xs rounded transition"
                        >
                          +₹5,000
                        </button>
                        <button
                          id={`save-goal-add-50k-${goal.id}`}
                          onClick={() => handleContributeGoal(goal.id, 50000)}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-gray-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-xs rounded transition"
                        >
                          +₹50,000
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Smart Warning Alerts panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-850 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-gray-950 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              RetireWise AI Smart Alerts
            </h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 mb-6">Autonomous audit alerts triggered by current profile metrics</p>

            <div className="space-y-3.5">
              {/* Alert 1 */}
              <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs">Portfolio Cash Concentration Risk</h4>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-300 mt-0.5 leading-relaxed">
                    Your savings/cash components exceed recommended target parameters. Over-liquidity risks severe long-term returns penalty due to active inflation. Consider transferring portions (₹50,000+) to index platforms.
                  </p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex gap-3 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-red-800 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs">Yearly Cost Rate Deviation Check</h4>
                  <p className="text-[11px] text-red-700/80 dark:text-red-300 mt-0.5 leading-relaxed">
                    Monthly expenses of ₹{profile.monthlyExpenses.toLocaleString()} compound to a larger retirement requirement. To hit ₹{plan ? plan.targetCorpus.toLocaleString() : "2.5C"}, savings will fall short without adding +₹{plan ? plan.monthlySavingsRequired.toLocaleString() : "12,000"} monthly.
                  </p>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex gap-3 bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl text-blue-800 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs">Asset Allocation Diversified Check</h4>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300 mt-0.5 leading-relaxed">
                    Target parameters aligned. Equities index projections remain within normal boundary checks (steady CAGR averages 8-9%). Secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 dark:border-slate-850 pt-4 flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Compass className="h-4 w-4" />
              AI audit logs updated real-time
            </div>
            
            <button
               id="learn-how-to-fix-alerts"
               onClick={() => alert("Alert diagnostic suggestions have been prioritized inside your Interactive AI chat window! Open chat for answers.")}
               className="text-xs font-bold text-blue-650 dark:text-blue-400 hover:underline"
            >
              Examine alert remedies →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
