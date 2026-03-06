
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Member } from '../types';

const People = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await dataService.getMembers();
      setMembers(data);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  // Group members by cohort
  const cohorts = members.reduce((acc: { [key: string]: Member[] }, member) => {
    if (!acc[member.cohort]) acc[member.cohort] = [];
    acc[member.cohort].push(member);
    return acc;
  }, {});

  // Sort cohort keys (e.g., "2기", "1기")
  const sortedCohortKeys = Object.keys(cohorts).sort((a, b) => b.localeCompare(a));

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading...</div>;

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      <header className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-4">Leadership</h1>
        <h2 className="text-4xl font-light tracking-tight text-brand-charcoal">Researchers</h2>
      </header>

      {sortedCohortKeys.map((cohortKey) => (
        <section key={cohortKey} className="max-w-4xl mx-auto px-6 mb-20">
          <h3 className="text-sm font-bold tracking-widest text-neutral-300 mb-8 border-b border-neutral-100 pb-2">
            {cohortKey}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {cohorts[cohortKey].map((member) => (
              <div key={member.id} className="flex items-baseline justify-between border-b border-neutral-50 py-6 hover:px-4 transition-all duration-300 group">
                <div className="flex items-baseline space-x-6">
                  <span className="text-[10px] font-mono text-neutral-300 group-hover:text-brand-orange">{member.classOf}</span>
                  <span className="text-xl font-light text-brand-charcoal">{member.name}</span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-neutral-400">{member.cohort} Researcher</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-brand-charcoal py-32 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
          <h3 className="text-[10px] font-bold tracking-[0.3em] text-brand-orange uppercase">Our Network</h3>
          <p className="text-2xl font-light leading-relaxed text-balanced text-neutral-300">
            E.Phinance는 바이오 산업, VC, 금융 시장, 임상 현장을 연결하는<br />
            독보적인 네트워크를 구축해가고 있습니다.
          </p>
          <div className="w-12 h-[1px] bg-neutral-700 mx-auto" />
          <p className="text-xs font-light text-neutral-500 uppercase tracking-widest">
            Collective Intelligence for Biotech Industry
          </p>
        </div>
      </section>
    </div>
  );
};

export default People;
