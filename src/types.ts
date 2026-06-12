export interface Goal {
  id: string;
  type: "Retirement" | "Child Education" | "House Purchase" | "Emergency Fund";
  title: string;
  targetAmt: number;
  currentAmt: number;
  deadlineYear: number;
}

export interface Asset {
  id: string;
  name: string;
  category: "Equity" | "Debt" | "Gold" | "Cash" | "Alternative";
  value: number;
  expectedAnnualReturn: number; // in %
}

export interface UserProfile {
  currentAge: number;
  retirementAge: number;
  currentIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  investments: Asset[];
  country: string;
  riskTolerance: "Low" | "Medium" | "High";
  goals: Goal[];
}

export interface Milestone {
  age: number;
  projectedSavings: number;
  milestoneName: string;
}

export interface AssetAllocation {
  equity: number;
  debt: number;
  cash: number;
  goldOrAlternative: number;
}

export interface LocalizedScheme {
  name: string;
  benefits: string;
  suitability: string;
}

export interface RetirementPlan {
  targetCorpus: number;
  monthlySavingsRequired: number;
  yearsToRetire: number;
  inflationRateUsed: number;
  portfolioReadyPercentage: number;
  inflationImpactSummary: string;
  milestones: Milestone[];
  recommendedAssetAllocation: AssetAllocation;
  localizedSchemes: LocalizedScheme[];
  strategicAdvice: string;
}

export interface RecommendedPlatform {
  name: string;
  category: string;
  rating: number;
  suitability: string;
  pros: string[];
  cons: string[];
  reasonForRecommendation: string;
}

export interface RecommendedAssetVehicle {
  assetClass: string;
  exampleTickersOrNames: string;
  expectedRiskReturnProfile: string;
}

export interface PlatformRecommendations {
  suggestedPlatforms: RecommendedPlatform[];
  recommendedAssetVehicles: RecommendedAssetVehicle[];
  countryContextNote: string;
}

export interface SmartAlert {
  alertType: string;
  alertMessage: string;
}

export interface PortfolioAuditResult {
  readinessScore: number;
  assessmentLabel: "Needs Improvement" | "Good" | "Excellent";
  diversificationRating: string;
  portfolioRiskDiagnostics: string;
  assetAllocationAnalysis: string;
  taxDeductionOpportunities: string[];
  efficiencyIssuesFound: string[];
  smartAlerts: SmartAlert[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface LearningArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  readTime: string;
}
