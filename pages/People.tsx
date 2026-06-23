import React, { useState, useEffect } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Member } from '../types';

const People = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCohorts, setExpandedCohorts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await dataService.getMembers();
        setMembers(data);
        
        // Group temporarily to expand the newest cohort automatically
        const grouped = data.reduce((acc: { [key: string]: Member[] }, member) => {
          if (!acc[member.cohort]) acc[member.cohort] = [];
          acc[member.cohort].push(member);
          return acc;
        }, {});
        
        const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
        if (sortedKeys.length > 0) {
          setExpandedCohorts({ [sortedKeys[0]]: true });
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
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

  const toggleCohort = (cohortKey: string) => {
    setExpandedCohorts(prev => ({
      ...prev,
      [cohortKey]: !prev[cohortKey]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      {/* Page Header */}
      <header className="pt-32 pb-24 px-6 text-center bg-neutral-50 border-b border-neutral-100/50 mb-16">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-4">Leadership & Network</h1>
        <h2 className="text-4xl font-light tracking-tight text-brand-charcoal">Our Researchers</h2>
      </header>

      {/* Cohort-by-cohort items lists */}
      <div className="space-y-6">
        {sortedCohortKeys.map((cohortKey) => {
          const isExpanded = !!expandedCohorts[cohortKey];
          const memberCount = cohorts[cohortKey].length;

          return (
            <section key={cohortKey} className="max-w-4xl mx-auto px-6">
              {/* Accordion Toggle Card Bar */}
              <button
                onClick={() => toggleCohort(cohortKey)}
                className={`w-full flex items-center justify-between py-5 px-6 border rounded-lg group transition-all duration-300 text-left outline-none ${
                  isExpanded 
                    ? 'bg-neutral-50/70 border-brand-orange/35 shadow-sm'
                    : 'bg-white border-neutral-100 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`text-lg font-light tracking-wide transition-colors duration-300 ${isExpanded ? 'text-brand-orange font-normal' : 'text-brand-charcoal'}`}>
                    {cohortKey}
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {memberCount} Researchers
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase transition-colors duration-300 group-hover:text-brand-charcoal">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <span className={`text-neutral-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-brand-orange' : 'group-hover:text-brand-charcoal'
                  }`}>
                    <ChevronDown size={18} />
                  </span>
                </div>
              </button>

              {/* Members Inner Grid List */}
              <div 
                className={`grid grid-cols-1 gap-1 overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-[1200px] mt-4 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                {cohorts[cohortKey].map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between border-b border-neutral-50 py-4 hover:px-4 hover:bg-neutral-50/50 rounded-sm transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-5">
                      <span className="text-[10px] font-mono text-neutral-30 w-12 group-hover:text-brand-orange transition-colors">{member.classOf}</span>
                      {member.imageUrl ? (
                        <img 
                          src={member.imageUrl} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-full object-cover border border-neutral-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs border border-neutral-100 font-medium">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-base font-light text-brand-charcoal">
                          {member.name}
                        </span>
                        {member.role && (
                          <span className="text-[9px] text-brand-orange font-bold tracking-wider uppercase mt-0.5">
                            {member.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-neutral-400">{member.cohort}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Network Bottom section */}
      <section className="bg-brand-charcoal py-32 text-white mt-24">
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
