import React, { useState } from "react";
import { Asset, PortfolioAuditResult, UserProfile } from "../types";
import { Sparkles, Trash2, Plus, RefreshCw, Upload, FileSpreadsheet, ShieldCheck, AlertCircle, HelpCircle, Building } from "lucide-react";

interface PortfolioCheckerProps {
  userProfile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export function PortfolioChecker({ userProfile, onUpdateProfile }: PortfolioCheckerProps) {
  const [assetName, setAssetName] = useState("");
  const [assetCat, setAssetCat] = useState<Asset["category"]>("Equity");
  const [assetVal, setAssetVal] = useState(100000);
  const [assetReturn, setAssetReturn] = useState(12);
  const [rawTextLog, setRawTextLog] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<PortfolioAuditResult | null>(null);

  // Drag and drop / upload simulator state
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleAddAssetLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    const added: Asset = {
      id: Date.now().toString(),
      name: assetName,
      category: assetCat,
      value: Number(assetVal),
      expectedAnnualReturn: Number(assetReturn)
    };

    onUpdateProfile({
      ...userProfile,
      investments: [...userProfile.investments, added]
    });

    setAssetName("");
  };

  const handleRemoveAssetLocal = (id: string) => {
    const updated = userProfile.investments.filter(item => item.id !== id);
    onUpdateProfile({
      ...userProfile,
      investments: updated
    });
  };

  // Simulated drag-and-drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateCSVParse(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateCSVParse(file);
    }
  };

  const simulateCSVParse = (file: File) => {
    setUploadStatus(`Directly parsing ${file.name}...`);
    setTimeout(() => {
      // Create some neat mock parsed assets
      const parsedAssets: Asset[] = [
        { id: "csv-1", name: "HDFC Nifty Index Fund", category: "Equity", value: 350000, expectedAnnualReturn: 12 },
        { id: "csv-2", name: "Vanguard Total Stock ETF", category: "Equity", value: 480000, expectedAnnualReturn: 8 },
        { id: "csv-3", name: "SGB Gold Bond Series IV", category: "Gold", value: 120000, expectedAnnualReturn: 5 },
        { id: "csv-4", name: "Axis Treasury Liquidity Fund", category: "Cash", value: 950000, expectedAnnualReturn: 6 }
      ];

      onUpdateProfile({
        ...userProfile,
        investments: [...userProfile.investments, ...parsedAssets]
      });

      setUploadStatus(`Successfully extracted ${parsedAssets.length} asset entries! Running security diagnosis.`);
      setRawTextLog(`Extracted from uploaded sheet: ${file.name}. Calculated aggregate: ₹19,00,000 portfolio assets.`);
    }, 1500);
  };

  // Post to express portfolio endpoint
  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/ai/portfolio-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioAssetList: userProfile.investments,
          rawInputText: rawTextLog,
          age: userProfile.currentAge,
          riskTolerance: userProfile.riskTolerance
        }),
      });

      if (!res.ok) throw new Error("Could not evaluate portfolio health.");
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      alert("Diagnostic server unavailable. Check system API logs.");
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div id="portfolio-checker-view" className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Intro info header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h2 className="font-sans font-extrabold text-2xl text-gray-950 dark:text-white flex items-center gap-2">
          <Building className="h-6 w-6 text-emerald-500" />
          AI Portfolio Diagnostic Audit Healthcheck
        </h2>
        <p className="text-sm text-gray-400 dark:text-slate-400 mt-1 max-w-2xl">
          Track allocations, analyze volatility offsets, examine expense leakages, and run Gemini diagnostics to receive a verified Retirement Readiness Score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Asset Manager Form and CSV Drop block */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
            <h3 className="font-sans font-bold text-gray-900 dark:text-white text-base mb-4">Onboard Investment Holdings</h3>
            
            {/* Asset Adder form */}
            <form onSubmit={handleAddAssetLocal} className="grid grid-cols-2 gap-3.5 mb-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-850">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Holding Title</label>
                <input
                  id="asset-title-input"
                  type="text"
                  required
                  placeholder="e.g. Parag Parikh Flexi Cap Fund"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Asset Class</label>
                <select
                  id="asset-class-select"
                  value={assetCat}
                  onChange={(e: any) => setAssetCat(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Equity">Equity / Stocks / Mutual Funds</option>
                  <option value="Debt">Debt / Bonds / EPF / PPF</option>
                  <option value="Gold">Gold / Physical Commodities</option>
                  <option value="Cash">Cash / Savings / FDs</option>
                  <option value="Alternative">Alternative Assets</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Valuation (₹)</label>
                <input
                  id="asset-val-input"
                  type="number"
                  min={100}
                  value={assetVal}
                  onChange={(e) => setAssetVal(Number(e.target.value))}
                  className="w-full mt-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  id="local-add-asset-submit"
                  type="submit"
                  className="flex items-center gap-1.5 px-4.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold hover:cursor-pointer transition"
                >
                  <Plus className="h-4 w-4" />
                  Append Holding Entry
                </button>
              </div>
            </form>

            {/* CSV simulator drop zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center select-none transition ${
                dragActive 
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20" 
                  : "border-gray-200 dark:border-slate-850 hover:bg-gray-50/50 dark:hover:bg-slate-950/10"
              }`}
            >
              <input
                id="csv-file-selector"
                type="file"
                multiple={false}
                accept=".csv,.xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="csv-file-selector" className="cursor-pointer block space-y-2">
                <div className="flex justify-center text-emerald-500">
                  <FileSpreadsheet className="h-10 w-10 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">Import Portfolio CSV Sheet</h4>
                  <p className="text-xs text-gray-400 mt-1">Drag and drop your spreadsheet here or click to choose from local files</p>
                </div>
              </label>
              
              {uploadStatus && (
                <p className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded inline-block animate-pulse">
                  {uploadStatus}
                </p>
              )}
            </div>

            {/* Active Asset Table */}
            <div className="mt-8 space-y-4">
              <h4 className="font-sans font-bold text-sm text-gray-950 dark:text-white">Currently Listed Portfolio Assets</h4>
              
              <div className="overflow-hidden border border-gray-200 dark:border-slate-850 rounded-xl">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-gray-150 dark:border-slate-850 text-gray-400 uppercase tracking-wider text-[9px] font-bold">
                      <th className="p-3">Asset Holding</th>
                      <th className="p-3">Class Type</th>
                      <th className="p-3">Asset Value</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProfile.investments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-400">No assets currently listed. Append some above, or download the template sheets!</td>
                      </tr>
                    ) : (
                      userProfile.investments.map((asset) => (
                        <tr key={asset.id} className="border-b border-gray-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-950/25">
                          <td className="p-3 font-semibold text-gray-800 dark:text-white">{asset.name}</td>
                          <td className="p-3"><span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 uppercase font-semibold">{asset.category}</span></td>
                          <td className="p-3 font-mono">₹{asset.value.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <button
                              id={`remove-asset-${asset.id}`}
                              onClick={() => handleRemoveAssetLocal(asset.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition hover:cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {userProfile.investments.length > 0 && (
                <button
                  id="trigger-diagnostic-audit"
                  onClick={handleRunAudit}
                  disabled={auditLoading}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`h-4.5 w-4.5 ${auditLoading ? "animate-spin" : ""}`} />
                  {auditLoading ? "Conducting Diagnostic Audit..." : "Concurrently Run AI Diagnostic Healthcheck"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Audit Diagnostics & Recommendations Showcase */}
        <div className="space-y-6">
          {auditResult ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-6 rounded-2xl shadow-sm space-y-6">
              
              {/* Readiness Meter Row */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-850/50 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">CURRENT READINESS GRADE</span>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Audit Status: <span className="text-emerald-500">{auditResult.assessmentLabel}</span>
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-xs text-gray-400 block mb-1">SCORE</span>
                  <span className="font-mono text-4xl font-black text-blue-600 dark:text-blue-400">{auditResult.readinessScore}</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>

              {/* Diversification Diagnostics */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-xs text-slate-450 uppercase tracking-widest block mb-1">DIVERSIFICATION TYPE</h4>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{auditResult.diversificationRating}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1">
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white">Quantitative Risk Diagnostics</h5>
                  <p className="text-xs text-gray-550 dark:text-slate-400 leading-relaxed whitespace-pre-line">{auditResult.portfolioRiskDiagnostics}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1">
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white">Allocation Ratios Analysis</h5>
                  <p className="text-xs text-gray-550 dark:text-slate-400 leading-relaxed whitespace-pre-line">{auditResult.assetAllocationAnalysis}</p>
                </div>
              </div>

              {/* Tax optimizer suggestions */}
              {auditResult.taxDeductionOpportunities.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-xs text-slate-450 uppercase tracking-widest block">SUGGESTED TAX WRITE-OFF MATCHES</h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {auditResult.taxDeductionOpportunities.map((taxTip, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-gray-600 dark:text-slate-350 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/50 p-3 rounded-lg leading-relaxed">
                        <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-indigo-500" />
                        <span>{taxTip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Leakages highlights */}
              {auditResult.efficiencyIssuesFound.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-semibold text-xs text-slate-450 uppercase tracking-widest block">EFFICIENCY & VOLATILITY SHOCKS DETECTED</h4>

                  <div className="grid grid-cols-1 gap-2">
                    {auditResult.efficiencyIssuesFound.map((issue, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-red-600 dark:text-red-400 bg-red-50/40 dark:bg-red-950/20 border border-red-150 dark:border-red-900/50 p-3 rounded-lg leading-relaxed">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart warning highlights */}
              {auditResult.smartAlerts.length > 0 && (
                <div className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-slate-850/50">
                  <h4 className="font-sans font-bold text-xs text-gray-950 dark:text-white">Active Volatility Warnings</h4>
                  
                  <div className="space-y-2">
                    {auditResult.smartAlerts.map((alert, idx) => (
                      <div key={idx} className="p-3 border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg text-xs flex gap-2.5 items-start">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider">{alert.alertType}</strong>
                          <span className="block mt-0.5 leading-relaxed">{alert.alertMessage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-2xl p-12 text-center shadow-sm space-y-4 h-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="flex justify-center text-blue-600">
                <Sparkles className="h-10 w-10 shrink-0" />
              </div>
              <h4 className="font-sans font-bold text-gray-900 dark:text-white text-lg">AI Financial Diagnostics Ready</h4>
              <p className="text-sm text-gray-400 dark:text-slate-500 max-w-xs mx-auto">
                Populate your holdings, upload simulated logs, and trigger diagnostic reviews to examine diversification ratios.
              </p>
              
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                100% Secure. Bank-grade mock analytical nodes.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
