import React, { useState } from "react";
import { PlatformRecommendations, UserProfile } from "../types";
import { Sparkles, Star, CheckCircle, AlertTriangle, Search, Info, Landmark, HelpCircle, ArrowRight } from "lucide-react";

interface AdvisorEngineProps {
  userProfile: UserProfile;
}

export function AdvisorEngine({ userProfile }: AdvisorEngineProps) {
  const [country, setCountry] = useState(userProfile.country || "India");
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Medium");
  const [amount, setAmount] = useState(50000);
  const [age, setAge] = useState(userProfile.currentAge || 30);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PlatformRecommendations | null>(null);

  // Trigger recommendation search
  const handleQueryPlatforms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommend-platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          income: userProfile.currentIncome,
          riskLevel: risk,
          investmentAmount: amount,
          country,
          goals: userProfile.goals.map((g) => g.title).join(", ")
        }),
      });

      if (!res.ok) throw new Error("Could not fetch recommendations.");
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      alert("Error getting brokerage recommendation details. Check your Gemini API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="advisor-engine-view" className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Intro Summary header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h2 className="font-sans font-extrabold text-2xl text-gray-950 dark:text-white flex items-center gap-2">
          <Landmark className="h-6 w-6 text-blue-500" />
          Investment Platform Platform Recommender
        </h2>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-1 max-w-2xl">
          RetireWise analyzes regional brokerages (such as Vanguard, Fidelity, Schwab, Groww, Zerodha) to find optimal fits with lowest expense percentages and highest compliance safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Filter controls panel */}
        <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm h-fit space-y-5">
          <h3 className="font-sans font-bold text-gray-900 dark:text-white text-base">Onboarding Target Parameters</h3>
          
          {/* Target Country */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase">Country Region</label>
            <select
              id="platform-country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
            >
              <option value="India">India (NSE/BSE, mutual funds, EPF/PPF)</option>
              <option value="United States">United States (NYSE/Nasdaq, ETFs, 401k/IRA)</option>
              <option value="United Kingdom">United Kingdom (LSE, ISAs, Pension SIPs)</option>
              <option value="Canada">Canada (TSX, RRSP, TFSA)</option>
              <option value="Global">Other (International Index tracking)</option>
            </select>
          </div>

          {/* Investment Amount */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase">Monthly Investment Budget</label>
            <input
              id="platform-budget-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Target Age */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Current Age</label>
              <input
                id="platform-age-input"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
              />
            </div>

            {/* Risk profile */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Risk Tolerance</label>
              <select
                id="platform-risk-select"
                value={risk}
                onChange={(e: any) => setRisk(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-gray-900 dark:text-white"
              >
                <option value="Low">Low (Bonds, FDs, PPP)</option>
                <option value="Medium">Medium (Balanced Blue Chips, Indices, ETFs)</option>
                <option value="High">High (Tech portfolios, midcaps, smallcaps)</option>
              </select>
            </div>
          </div>

          <button
            id="query-platform-recommendations"
            onClick={handleQueryPlatforms}
            disabled={loading}
            className="w-full py-3 px-4 font-semibold text-sm text-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition hover:scale-[1.01] hover:cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4.5 w-4.5" />
            {loading ? "Analyzing Platforms..." : "Fetch Best Platforms"}
          </button>
        </div>

        {/* Results layout */}
        <div className="lg:col-span-2 space-y-6">
          {recommendations ? (
            <>
              {/* Regional contextual callout info */}
              <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50 p-4.5 rounded-2xl">
                <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2 leading-relaxed">
                  <Info className="h-4 w-4 shrink-0 text-blue-600" />
                  <span><strong>{recommendations.countryContextNote}</strong></span>
                </p>
              </div>

              {/* Suggested platforms mapping */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-gray-950 dark:text-white text-base">Top Suggested Brokers</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.suggestedPlatforms.map((plat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition shadow-sm">
                      <div>
                        {/* Rating row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">{plat.category}</span>
                            <h5 className="font-sans font-bold text-base text-gray-900 dark:text-white mt-1.5">{plat.name}</h5>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 font-mono text-xs font-bold px-2 py-0.5 rounded">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {plat.rating}
                          </div>
                        </div>

                        {/* Suitability note */}
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium">Best for: {plat.suitability}</p>

                        {/* Pros and Cons */}
                        <div className="mt-4 space-y-3">
                          <div>
                            <span className="text-[9px] font-bold text-gray-450 uppercase block mb-1">PROS</span>
                            <ul className="space-y-1 text-xs text-emerald-600 dark:text-emerald-400 list-inside">
                              {plat.pros.map((p, i) => <li key={i} className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 inline shrink-0" /> {p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-gray-450 uppercase block mb-1">CONS / MITIGATIONS</span>
                            <ul className="space-y-1 text-xs text-red-600 dark:text-red-400 list-inside">
                              {plat.cons.map((c, i) => <li key={i} className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 inline shrink-0" /> {c}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Direct advise on why recommended */}
                      <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-850/50 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        {plat.reasonForRecommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended vehicle details */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-gray-950 dark:text-white text-base">Recommended Asset Allocation Vehicles</h4>
                
                <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-gray-150 dark:border-slate-850 text-gray-450 uppercase tracking-widest text-[10px]">
                        <th className="p-4">Asset Class</th>
                        <th className="p-4">Recommended Ticker / Index Ex</th>
                        <th className="p-4">Expected volatility profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.recommendedAssetVehicles.map((vehicle, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-slate-850/50 text-gray-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                          <td className="p-4 font-bold text-blue-700 dark:text-blue-400">{vehicle.assetClass}</td>
                          <td className="p-4 font-mono font-medium">{vehicle.exampleTickersOrNames}</td>
                          <td className="p-4">{vehicle.expectedRiskReturnProfile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl p-12 text-center shadow-sm space-y-4">
              <div className="flex justify-center text-blue-600">
                <Landmark className="h-10 w-10 shrink-0" />
              </div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white text-lg">Platform Analyzer Ready</h4>
              <p className="text-sm text-gray-400 dark:text-slate-500 max-w-sm mx-auto">
                Set country rules, specify monthly allocation capacities, and pull specialized advice customized immediately.
              </p>
              
              <button
                id="default-init-recs"
                onClick={handleQueryPlatforms}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline hover:cursor-pointer"
              >
                Perform standard search now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
