
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/dataService';

const Recruit = () => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await dataService.getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const requirements = [
    "이화여자대학교 약학대학 4,5학년 재학생",
    "숫자를 통해 기술을 해석하고 싶은신 분",
    "배우고자 하는 의지와 열정이 뛰어나신 분",
    "E.Phinance 네트워크 안에서 교류하고 싶으신 분"
  ];

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      <header className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-4">Admissions</h1>
        <div className="w-16 h-[1px] bg-brand-charcoal mx-auto opacity-20" />
      </header>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        <section className="space-y-12">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-8">Who We Look For</h3>
            <ul className="space-y-6">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span className="text-base font-light text-brand-charcoal">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sticky top-32 space-y-12">
          <div className="border border-neutral-200 p-12 text-center space-y-8 bg-white">
            <h3 className="text-2xl font-light tracking-tight">
              {settings.recruitmentTitle || '2026 Spring Cohort Recruitment'}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs border-b border-neutral-100 pb-3">
                <span className="text-neutral-400 uppercase tracking-widest">Recruitment Period</span>
                <span className="font-semibold">{settings.recruitmentDate || 'Feb 23 - Feb 27, 2026'}</span>
              </div>
            </div>
            <button 
              onClick={() => settings.recruitmentApplyUrl && window.open(settings.recruitmentApplyUrl, '_blank')}
              className="w-full bg-brand-charcoal text-white py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-orange transition-all duration-300 disabled:opacity-50"
              disabled={!settings.recruitmentApplyUrl}
            >
              Apply Now
            </button>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest italic">
              * Late applications will not be considered.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recruit;
