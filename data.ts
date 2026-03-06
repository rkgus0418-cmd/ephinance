
import { Report, Member, Insight } from './types';

export const REPORTS: Report[] = [
  {
    id: 'rep-olix',
    title: '올릭스 (226950)',
    subtitle: 'MASH는 거들 뿐, 열린 상방',
    category: 'Equity Research',
    date: '2026.01.31',
    author: '김가현 (rkgus0418@ewha.ac.kr)',
    executiveSummary: '산업 전환기 속 RNAi 플랫폼의 전략적 위치. 동사는 GalNAc 기반 간 표적화 플랫폼과 자가전달 RNAi 플랫폼을 동시에 보유한 국내 유일의 플레이어입니다.',
    keyThesis: 'GalNAc 기반 플랫폼의 기술 검증 완료 및 글로벌 빅파마(릴리)와의 L/O 계약을 통한 리스크 감소.',
    riskOverview: 'GLP-1 제제의 제지방 감소 한계 및 대사 질환 치료 축으로의 확장성 분석.',
    valuationSnapshot: 'Base Case 134,068원 | rNPV Method 적용 | 글로벌 Peer 대비 저평가 국면.',
    sections: [
      { title: '산업 전환기 속 RNAi 플랫폼의 전략적 위치', content: '글로벌 제약 산업은 고위험·고비용 R&D 한계를 겪고 있으며, 이에 따라 표적 특이성이 높고 PoC 검증이 빠른 치료제로 자본이 이동 중이다. 동사는 국내 유일의 GalNAc 및 자가전달 RNAi 플랫폼 동시 보유 기업이다.' },
      { title: '투자포인트1: GLP-1 한계 극복 및 SAM의 확장', content: '기존 GLP-1 제제는 제지방(근육) 감소 및 체중 감량 정체기라는 한계가 있다. OLX702A는 MARC1 억제를 통해 대사 중심 메커니즘을 제시하며 상보적 병용 구조를 형성한다.' },
      { title: '투자포인트2: 확장성의 증명, 열린 상방', content: 'Théa와의 OLX301A 기술이전은 안과 질환 확장성을 입증했다. 또한 탈모 치료제 OLX104C는 전신 부작용 리스크를 최소화하는 구조적 강점을 보유한다.' },
      { title: 'Valuation 및 최종 주가 산출', content: 'rNPV Method를 이용해 Base Case 134,068원, Bull Case를 제시한다. 현 주가는 사실상 Base 하단에 위치하며 리레이팅 가능성이 열려 있다.' }
    ]
  },
  {
    id: 'rep-april',
    title: '에이프릴바이오 (AprilBio)',
    subtitle: 'SAFA Platform: Enhancing Biologic Half-life',
    category: 'Equity Research',
    date: '2025.02.20',
    author: 'E.Phinance Research Team',
    executiveSummary: 'Analysis of the SAFA platform technology and its licensing potential. Focus on the durability of the albumin-binding technology.',
    keyThesis: 'SAFA platform provides superior half-life extension compared to PEGylation.',
    riskOverview: 'Clinical trial delays in multi-indication strategies.',
    valuationSnapshot: 'Target P/E: 25x | Implied Upside: 18%',
    sections: [
      { title: 'Executive Summary', content: 'Detailed breakdown of AprilBio\'s platform advantages...' },
      { title: 'Valuation Model', content: 'rNPV based on APB-A1 and APB-R3 pipelines...' }
    ]
  },
  {
    id: 'rep-orum',
    title: '오름테라퓨틱스 (Orum Therapeutics)',
    subtitle: 'Dual-Precision Targeted Protein Degradation',
    category: 'Biotech Strategy & Deals',
    date: '2025.02.15',
    author: 'E.Phinance Research Team',
    executiveSummary: 'Decomposing the deal structure of the recent $180M asset transfer to Bristol Myers Squibb.',
    keyThesis: 'DAC technology overcomes limitations of traditional payload toxicity.',
    riskOverview: 'Complexity in manufacturing TPD-antibody conjugates.',
    valuationSnapshot: 'Recent Deal Premium: 45% over historical benchmarks.',
    sections: [
      { title: 'Executive Summary', content: 'Strategic analysis of the Orum-BMS deal dynamics...' }
    ]
  },
  {
    id: 'rep-voronoi',
    title: '보로노이 (Voronoi)',
    subtitle: 'AI-Driven Kinase Inhibitors',
    category: 'Equity Research',
    date: '2025.02.10',
    author: 'E.Phinance Research Team',
    executiveSummary: 'Impact of the Voronoomics platform on lead optimization speed. Analysis of VRN11 clinical timelines.',
    keyThesis: 'Superior selectivity in kinase inhibition reduces systemic toxicity.',
    riskOverview: 'High dependence on external clinical partners.',
    valuationSnapshot: 'Pipeline Value: $850M | PoS-adjusted NPV.',
    sections: [
      { title: 'Executive Summary', content: 'Review of Voronoi\'s computational chemistry edge...' }
    ]
  }
];

export const MEMBERS: Member[] = [
  { id: 'm1', cohort: '1기', classOf: '21학번', name: '권세연' },
  { id: 'm2', cohort: '1기', classOf: '21학번', name: '민다경' },
  { id: 'm3', cohort: '1기', classOf: '21학번', name: '김가현' },
  { id: 'm4', cohort: '1기', classOf: '22학번', name: '김경인' },
  { id: 'm5', cohort: '1기', classOf: '22학번', name: '배유미' },
];

export const INSIGHTS: Insight[] = [
  { id: 'i1', title: 'GLP-1 Market Structure', summary: 'Analysis of demand-supply mismatch in the global peptide supply chain.' },
  { id: 'i2', title: 'RNA Platform Scalability', summary: 'Challenges in extrahepatic delivery and lipid nanoparticle toxicity.' },
  { id: 'i3', title: 'Licensing Deal Economics', summary: 'How royalty stacking affects long-term profitability of biotech assets.' },
  { id: 'i4', title: 'Interest Rates & Biotech Valuation', summary: 'The non-linear impact of treasury yields on pre-revenue biotech rNPV.' },
];
