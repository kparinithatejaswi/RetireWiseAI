import React, { useState } from "react";
import { Scale, Sparkles, AlertCircle, HelpCircle, ShieldCheck, DollarSign, ListTodo } from "lucide-react";

interface TaxOptimizerProps {
  country: string;
}

export function TaxOptimizer({ country }: TaxOptimizerProps) {
  const [selectedCountry, setSelectedCountry] = useState(country || "India");
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  // Checkbox tracker
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    ded80c: true,
    ded80ccd: false,
    iraRoth: true,
    ira401k: false,
    isaMatch: true,
    pensionMatch: false
  });

  // Calculate generic tax savings based on boxes ticked
  const calculateTaxSaved = () => {
    let base = 0;
    if (selectedCountry === "India") {
      if (checklist.ded80c) base += 46800; // 30% of 1.5L
      if (checklist.ded80ccd) base += 15600; // 30% of 50K
    } else if (selectedCountry === "United States") {
      if (checklist.iraRoth) base += 1400; // typical 20% bracket on 7K
      if (checklist.ira401k) base += 4600; // typical 20% on 23K max
    } else {
      if (checklist.isaMatch) base += 4000;
      if (checklist.pensionMatch) base += 8000;
    }
    return base;
  };

  const currentSavings = calculateTaxSaved();

  const handleFetchTaxAdvice = async () => {
    setLoading(true);
    try {
      const prompt = `Provide the top 4 tax optimization savings vehicles, deductions, and tax-efficient portfolio strategies for a user retiring in ${selectedCountry}. Explain eligibility, threshold limits, and how it aligns with long-term capital compounding. Deliver in clean lists with bullet points.`;
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) throw new Error("Could not evaluate tax advisory parameters.");
      const data = await res.json();
      setAiAdvice(data.text);
    } catch (err) {
      alert("Tax database server busy. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tax-optimizer-panel" className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Intro info header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h2 className="font-sans font-extrabold text-2xl text-gray-950 dark:text-white flex items-center gap-2">
          <Scale className="h-6 w-6 text-indigo-500" />
          Tax Optimization & Write-Off Assistant
        </h2>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-1 max-w-2xl">
          AI helps structure tax-efficient vehicle allocations so you preserve compounding returns. Examine local deduction caps across pension schemes, 401ks, NPS, and ISAs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Localised checklists and calculators */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-gray-950 dark:text-white text-base">Select Your Jurisdiction</h3>
            
            <select
              id="tax-jurisdiction-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-255 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
            >
              <option value="India">India (Income Tax Department Guidelines)</option>
              <option value="United States">United States (IRS Revenue Rules)</option>
              <option value="United Kingdom">United Kingdom (HMRC Pension Rules)</option>
            </select>

            {/* Checklists */}
            <div className="pt-2.5 space-y-4">
              <h4 className="font-sans font-semibold text-xs text-gray-450 uppercase tracking-widest flex items-center gap-1.5">
                <ListTodo className="h-4 w-4" />
                Active Savings Checklist
              </h4>

              {selectedCountry === "India" && (
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-ded80c"
                      type="checkbox" 
                      checked={checklist.ded80c} 
                      onChange={(e) => setChecklist({ ...checklist, ded80c: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">Section 80C Deductions (Maximum ₹1.5L)</strong>
                      <span className="block text-gray-450 mt-0.5">Includes ELSS Mutual Funds, PPF investments, and EPF matching contributions.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-ded80ccd"
                      type="checkbox"
                      checked={checklist.ded80ccd}
                      onChange={(e) => setChecklist({ ...checklist, ded80ccd: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">Section 80CCD(1B) NPS Additional (Maximum ₹50K)</strong>
                      <span className="block text-gray-450 mt-0.5">Supplementary tax write-offs for National Pension System allocations.</span>
                    </div>
                  </label>
                </div>
              )}

              {selectedCountry === "United States" && (
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-iraRoth"
                      type="checkbox" 
                      checked={checklist.iraRoth} 
                      onChange={(e) => setChecklist({ ...checklist, iraRoth: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">Traditional / Roth IRA Contributions (Max $7,000)</strong>
                      <span className="block text-gray-450 mt-0.5">Roth IRAs yield 100% tax-free capital growths on withdrawal bounds.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-ira401k"
                      type="checkbox"
                      checked={checklist.ira401k}
                      onChange={(e) => setChecklist({ ...checklist, ira401k: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">Pre-Tax Employer 401(k) Matching (Max $23,000)</strong>
                      <span className="block text-gray-450 mt-0.5">Lowers intermediate gross taxable incomes instantly.</span>
                    </div>
                  </label>
                </div>
              )}

              {selectedCountry !== "India" && selectedCountry !== "United States" && (
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-isaMatch"
                      type="checkbox" 
                      checked={checklist.isaMatch} 
                      onChange={(e) => setChecklist({ ...checklist, isaMatch: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">UK Stocks & Shares ISA Allowance (Max £20,000)</strong>
                      <span className="block text-gray-450 mt-0.5">Shields dynamic dividends and interest gains from capital taxes.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 border border-gray-100 dark:border-slate-850 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-950/20 cursor-pointer transition">
                    <input 
                      id="check-pensionMatch"
                      type="checkbox"
                      checked={checklist.pensionMatch}
                      onChange={(e) => setChecklist({ ...checklist, pensionMatch: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded accent-indigo-600"
                    />
                    <div className="text-xs">
                      <strong className="block text-gray-900 dark:text-white">Self-Invested Personal Pension (SIPP) Tax Match</strong>
                      <span className="block text-gray-450 mt-0.5">Government matches 20-40% tax back allocations on individual pension contributions.</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Estimated generic tax saved display */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-850/50 flex justify-between items-center bg-indigo-50/10 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">ESTIMATED TAX SAVED CURRENTLY</span>
                <span className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {selectedCountry === "India" ? `₹${currentSavings.toLocaleString()}` : selectedCountry === "United States" ? `$${currentSavings.toLocaleString()}` : `£${currentSavings.toLocaleString()}`}
                </span>
              </div>
              
              <div className="text-right">
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active Deductions</span>
              </div>
            </div>

            <button
              id="request-ai-tax-review"
              onClick={handleFetchTaxAdvice}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-xs font-sans text-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white flex items-center justify-center gap-2 transition hover:scale-[1.01] hover:cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Pulling Advice..." : "Fetch Specialized AI Tax Strategy"}
            </button>
          </div>
        </div>

        {/* Right column: Dynamic Gemini suggestions */}
        <div className="lg:col-span-2">
          {aiAdvice ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-850 pb-4">
                <h3 className="font-sans font-bold text-gray-950 dark:text-white text-base">Fiduciary Tax Recommendations</h3>
                <span className="text-[10px] font-mono font-medium text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full animate-pulse">Gemini Output</span>
              </div>
              
              <div className="text-xs text-gray-700 dark:text-slate-350 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-930/30 p-4.5 rounded-xl border border-gray-100 dark:border-slate-850">
                {aiAdvice}
              </div>

              <div className="text-[10px] text-gray-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Deductions adjusted for year 2026/2027 fiscal indices.
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center min-h-[350px]">
              <div className="flex justify-center text-indigo-500">
                <Scale className="h-10 w-10 shrink-0" />
              </div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white text-base">Jurisdictional Tax Diagnosis Ready</h4>
              <p className="text-xs text-gray-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                Tweak deduction boxes for {selectedCountry}, measure baseline write-offs, and query custom strategy suggestions.
              </p>
              
              <button
                id="default-itax-search"
                onClick={handleFetchTaxAdvice}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline hover:cursor-pointer"
              >
                Request local tax review now →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
