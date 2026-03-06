
import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

const Curriculum = () => {
  const [phases, setPhases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const settings = await dataService.getSettings();
      if (settings.curriculumContent?.phases) {
        setPhases(settings.curriculumContent.phases);
      } else {
        // Default phases
        setPhases([
          {
            title: 'Phase 1 – Industry Architecture',
            desc: '바이오 산업 구조 이해',
            details: '플랫폼, CDMO, 개발사 모델 비교'
          },
          {
            title: 'Phase 2 – Financial Anatomy',
            desc: '재무상태표 구조 분석',
            details: 'Burn rate 계산, 자본 구조 해부'
          },
          {
            title: 'Phase 3 – Valuation Framework',
            desc: 'Valuation Methodology',
            details: 'rNPV, SOTP, DCF, PoS 반영 모델링'
          },
          {
            title: 'Phase 4 – Investment Thesis',
            desc: 'Investment Strategy',
            details: '투자포인트 도출, 리스크 구조화, 목표주가 산출'
          },
          {
            title: 'Phase 5 – Licensing Strategy Simulation',
            desc: '라이선싱 전략 시뮬레이션',
            details: '파트너 선정 논리, Upfront·Milestone 구조 설계, 전략적 라이선싱 시나리오 구성'
          }
        ]);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading...</div>;

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      <header className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-4">Education</h1>
        <h2 className="text-4xl font-light tracking-tight text-brand-charcoal">Structured Research Program</h2>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="relative border-l border-neutral-200 ml-4 space-y-24">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative pl-12 group">
              <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-brand-orange rounded-full group-hover:scale-150 transition-transform" />
              <div className="space-y-2">
                <h3 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">{phase.title}</h3>
                <p className="text-xl font-medium text-brand-charcoal">{phase.desc}</p>
                <p className="text-sm text-neutral-500 font-light">{phase.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Curriculum;
