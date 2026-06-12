import React, { useState } from "react";
import { BookOpen, CheckCircle, Clock, ChevronRight, HelpCircle, BadgeAlert, Landmark } from "lucide-react";
import { LearningArticle } from "../types";

export function LearningCenter() {
  const [selectedArticle, setSelectedArticle] = useState<LearningArticle | null>(null);

  const articles: LearningArticle[] = [
    {
      id: "art-1",
      category: "Investing Basics",
      title: "The Ultimate Guide to Compound Interest for Retirement",
      readTime: "4 min read",
      summary: "Explore how compound interest operates as a secondary engine to consistently grow modest assets into substantial retirement corpora over a 20-30 year timeline.",
      content: `### 1. The Compound Interest Formula
At its core, compounding is the process where your investment generates earnings, and those earnings are reinvested to generate their own earnings. The formula for annual compounding is:
A = P * (1 + r/n)^(n*t)

Where:
- P = Principal amount
- r = Annual nominal interest rate
- n = Compounding frequency per year
- t = Time duration in years

### 2. The Rule of 72
To quickly estimate how fast your assets double, divide 72 by your expected annual yield. E.g., if your mutual funds yield 8%, your corpus doubles roughly every 9 years:
72 / r = doubling time in years
72 / 8 = 9 years

### 3. Fiduciary Advice
Start as early as possible. A planner allocating ₹10,000 monthly from age 25 ends up with nearly double the final aggregate nest egg of someone starting at 35, even if the latter contributes double the monthly amount later on.`
    },
    {
      id: "art-2",
      category: "Mutual Funds & ETFs",
      title: "How to Build a Diversified Mutual Fund Portfolio",
      readTime: "6 min read",
      summary: "Understand index trackers, large caps, small caps, and localized treasury funds. Map fees against performance markers.",
      content: `### 1. Index Tracking Mutual Funds
Index funds match major benchmarks like the Nifty 50 or the S&P 500. They have exceptionally low expense ratios (typically 0.1% - 0.3%), which preserves returns over several decades.

### 2. Multi-Cap Diversification
For balanced volatility coverage, divide equity allocations across different segments:
- Large Caps (Indices): Stable, lower volatility indices that track bedrock corporations.
- Mid & Small Caps: Higher risk profile, but key for capturing massive growth phases. Only set to 15-20% max of aggregate.

### 3. Actively Managed vs. Passive Indexing
Active managers try to beat markets but charge higher expenses (1%-2%). Passive index funds continuously match market returns at fractional costs, yielding better long term performance in 85%+ of case audits.`
    },
    {
      id: "art-3",
      category: "Tax Optimization",
      title: "Maximizing Section and IRA Contribution Write-Offs",
      readTime: "5 min read",
      summary: "Deep dive into legal tax-shield vehicles to insulate investment compounding from heavy tax rates.",
      content: `### 1. Post-Tax vs. Pre-Tax Vehicles
- Pre-Tax Platforms (e.g., Traditional 401k, NPS Section 80CCD): Contribution amounts decrease your taxable gross income today, but withdrawals are taxed at your future bracket.
- Post-Tax / Zero-Tax Platforms (e.g., Roth IRA, Stock & Shares ISA in the UK): Paid using post-tax income, but withdraw capital gains 100% tax-free in retirement.

### 2. Maximizing Limits
Always capture 100% of any employer matching schemes (401k match or PF contributions). It is essentially "free capital" representing a 100% instant ROI.

### 3. Asset Location Strategy
Place higher-yielding dividend stocks or corporate bonds inside tax bonds (SIPP, IRA, PPF) so that continuous intermediate payouts compound without triggering annual tax audits.`
    },
    {
      id: "art-4",
      category: "Risk Management",
      title: "Portfolio Rebalancing & Inflation Control Strategies",
      readTime: "7 min read",
      summary: "Discover mechanisms to defend your final nest egg against macro hyperinflation and volatile bear drawdowns.",
      content: `### 1. The Asset Rebalancing Trigger
Every year, market movements will shift your current asset weights (e.g. equities surging to 75% when target was 60%). Rebalancing means selling portion gains of high performers to buy lower cost defensive assets to restore your baseline safety coordinates.

### 2. De-Risking near Retirement
Apply the bedrock age-based risk allocation guide:
Baseline Equity Ratio = 100 or 110 minus current age

As retirement age draws near (within 5-10 years), gradually transition volatile stock assets into low expense debt instruments, fixed depositors, and liquid treasury index assets, preserving capital to fund immediate expenses.`
    }
  ];

  return (
    <div id="learning-center-wrapper" className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Intro info header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h2 className="font-sans font-extrabold text-2xl text-gray-950 dark:text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          RetireWise Financial Education Platform
        </h2>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-1 max-w-2xl">
          AI-vetted learning modules reviewing compound mechanics, broker comparisons, tax rules, and asset management parameters.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((art) => (
          <div 
            key={art.id} 
            className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-slate-700 transition flex flex-col justify-between shadow-sm hover:scale-[1.01]"
          >
            <div>
              <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                <span className="font-bold uppercase text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded">
                  {art.category}
                </span>
                
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="font-sans font-bold text-lg text-gray-900 dark:text-white mb-2 leading-tight">
                {art.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                {art.summary}
              </p>
            </div>

            <button
              id={`read-article-${art.id}`}
              onClick={() => setSelectedArticle(art)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline text-left"
            >
              Examine entire module <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Article Focus Modal overlay */}
      {selectedArticle && (
        <div id="article-focus-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
            <button
              id="close-article-focus"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold uppercase py-0.5 px-2.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-2.5 inline-block">
              {selectedArticle.category}
            </span>

            <h3 className="font-sans font-bold text-2xl text-gray-900 dark:text-white leading-tight mb-4 pr-8">
              {selectedArticle.title}
            </h3>

            <div className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-gray-100 dark:border-slate-850 pt-4">
              {selectedArticle.content}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-850/50 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                <Clock className="h-4 w-4" />
                Completed Module
              </span>
              
              <button
                id="close-article-footer"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 font-semibold text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
