
export type ReportCategory = string;

export interface CohortMetadata {
  isActive: boolean;
  period?: string;
  statusTag?: string;
}

export interface SiteSettings {
  logoUrl?: string;
  recruitmentTitle?: string;
  recruitmentDate?: string;
  recruitmentApplyUrl?: string;
  recruitSectionTitle?: string;
  recruitGuideNote?: string;
  requirements?: string;
  recruitFooterWarning?: string;
  aboutContent?: {
    pipelineTitle?: string;
    pipelineDesc?: string;
    clinicalTitle?: string;
    clinicalDesc?: string;
    licensingTitle?: string;
    licensingDesc?: string;
    disciplineTitle?: string;
    disciplineDesc?: string;
  };
  curriculumContent?: {
    phases?: Array<{
      title: string;
      desc: string;
      details: string;
    }>;
  };
  categories?: Array<{
    slug: string;
    name: string;
  }>;
  cohortMetadata?: {
    [cohortKey: string]: CohortMetadata;
  };
}

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
  isMainVisible?: boolean;
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
  role?: string;
  imageUrl?: string;
  order?: number;
  statusTag?: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
}
