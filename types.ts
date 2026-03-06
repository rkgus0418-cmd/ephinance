
export type ReportCategory = 'All' | 'Equity Research' | 'Biotech Strategy & Deals' | 'Macro & Markets';

export interface Report {
  id: string;
  title: string;
  subtitle: string;
  category: ReportCategory;
  date: string;
  author: string;
  executiveSummary: string;
  keyThesis: string;
  riskOverview: string;
  valuationSnapshot: string;
  pdfUrl?: string;
  imageUrl?: string;
  order?: number;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface Member {
  id: string;
  cohort: string;
  classOf: string;
  name: string;
  order?: number;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
}
