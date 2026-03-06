
import React, { useEffect, useState } from 'react';
import { Database, LineChart, PieChart } from 'lucide-react';
import { dataService } from '../services/dataService';

const About = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const settings = await dataService.getSettings();
      setContent(settings.aboutContent || {});
      setLoading(false);
    };
    fetchContent();
  }, []);

  const defaultContent = {
    pipelineTitle: 'Pipeline Strategy',
    pipelineDesc: '기전 타당성, 임상 설계, 적응증 확장 전략을 분석하여 파이프라인의 과학적 기반과 성장 경로를 해석합니다.',
    clinicalTitle: 'Clinical Sustainability',
    clinicalDesc: '임상 단계, 개발 속도, 자원 운용을 종합적으로 검토하여 후속 개발의 지속 가능성을 평가합니다.',
    licensingTitle: 'Licensing & Capital Strategy',
    licensingDesc: '라이선싱 구조와 자본 조달 전략을 통해 기술의 확장 경로와 기업의 전략을 분석합니다.',
    disciplineTitle: 'Discipline',
    disciplineDesc: '바이오 기업의 가치는 기전 타당성, 파이프라인 전략, 임상 설계의 완성도에서 형성됩니다. E.Phinance는 약학적 이해에 기반하여 기술의 확장성, 라이선싱 전략, 개발 구조를 분석하고, 산업 내 위치와 성장 경로를 해석합니다.'
  };

  const display = { ...defaultContent, ...content };

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-8">About</h1>
        <p className="text-2xl md:text-3xl font-light leading-snug text-brand-charcoal text-balanced">
          E.Phinance는 이화여자대학교 약학대학 최초의<br />
          바이오 산업 구조 분석 리서치 그룹입니다.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="mb-12 border-b border-neutral-100 pb-4">
          <h2 className="text-sm font-medium text-neutral-400 tracking-widest uppercase">Our Lens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-neutral-100">
          <div className="p-12 border-r border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
            <Database strokeWidth={1} className="text-brand-orange mb-8" size={32} />
            <h3 className="text-lg font-medium mb-4">{display.pipelineTitle}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed font-light whitespace-pre-wrap">
              {display.pipelineDesc}
            </p>
          </div>
          <div className="p-12 border-r border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
            <LineChart strokeWidth={1} className="text-brand-orange mb-8" size={32} />
            <h3 className="text-lg font-medium mb-4">{display.clinicalTitle}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed font-light whitespace-pre-wrap">
              {display.clinicalDesc}
            </p>
          </div>
          <div className="p-12 border-r border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
            <PieChart strokeWidth={1} className="text-brand-orange mb-8" size={32} />
            <h3 className="text-lg font-medium mb-4">{display.licensingTitle}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed font-light whitespace-pre-wrap">
              {display.licensingDesc}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mt-40">
        <div className="space-y-12 text-center md:text-left">
          <h2 className="text-xl font-light tracking-tight">{display.disciplineTitle}</h2>
          <p className="text-neutral-500 font-light leading-relaxed whitespace-pre-wrap">
            {display.disciplineDesc}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
