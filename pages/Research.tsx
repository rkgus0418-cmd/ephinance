
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { REPORTS } from '../data';
import { ReportCategory } from '../types';

const Research = () => {
  const [filter, setFilter] = useState<ReportCategory>('All');
  
  const categories: ReportCategory[] = ['All', 'Equity Research', 'Biotech Strategy & Deals', 'Macro & Markets'];
  const filteredReports = filter === 'All' ? REPORTS : REPORTS.filter(r => r.category === filter);

  return (
    <div className="animate-in fade-in duration-700 pb-40">
      <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-neutral-100 pb-12">
          <div className="space-y-4">
            <h1 className="text-[11px] font-bold tracking-[0.4em] text-brand-orange uppercase">Digital Archive</h1>
            <h2 className="text-5xl font-light tracking-tighter text-brand-charcoal">Research Repository</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 text-[10px] tracking-widest uppercase font-bold transition-all border ${
                  filter === cat 
                    ? 'bg-brand-charcoal text-white border-brand-charcoal' 
                    : 'text-neutral-400 hover:text-brand-charcoal border-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 gap-16">
          {filteredReports.map((report) => (
            <div key={report.id} className="group flex flex-col md:flex-row gap-12 bg-white p-12 border border-neutral-50 hover:shadow-2xl hover:shadow-neutral-100 transition-all duration-700">
              <div className="flex-grow space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="h-px w-8 bg-brand-orange"></span>
                    <span className="text-[10px] text-brand-orange uppercase tracking-widest font-extrabold">{report.category}</span>
                  </div>
                  <h3 className="text-3xl font-semibold tracking-tight text-brand-charcoal group-hover:text-brand-orange transition-colors">
                    <Link to={`/research/${report.id}`}>{report.title}</Link>
                  </h3>
                  <p className="text-sm font-medium text-neutral-400 tracking-wide">{report.subtitle}</p>
                </div>
                
                <p className="text-base text-neutral-500 leading-relaxed font-light line-clamp-3 max-w-3xl">
                  {report.executiveSummary}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-neutral-50">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">Core Thesis</p>
                    <p className="text-[12px] leading-relaxed text-neutral-600 font-medium">{report.keyThesis}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">Risk Assessment</p>
                    <p className="text-[12px] leading-relaxed text-neutral-600 font-medium">{report.riskOverview}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">Valuation Model</p>
                    <p className="text-[12px] leading-relaxed text-neutral-600 font-medium">{report.valuationSnapshot}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end shrink-0 md:border-l md:border-neutral-50 md:pl-12">
                <div className="text-right">
                  <span className="text-xs font-mono text-neutral-300 tracking-tighter">{report.date}</span>
                  <p className="text-[10px] uppercase text-neutral-400 tracking-widest mt-1">Ref: {report.id}</p>
                </div>
                <a 
                  href="#" 
                  className="flex items-center space-x-3 px-8 py-4 bg-neutral-50 text-brand-charcoal border border-neutral-200 hover:bg-brand-charcoal hover:text-white transition-all text-[10px] font-bold tracking-[0.2em] uppercase"
                  onClick={(e) => { e.preventDefault(); alert('Requesting PDF download from secure archive...'); }}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}

          {/* Secure Upload Simulation */}
          <div className="group border-2 border-dashed border-neutral-100 p-20 flex flex-col items-center justify-center text-neutral-300 hover:text-brand-orange hover:border-brand-orange hover:bg-neutral-50/50 transition-all cursor-pointer">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
               <Plus size={32} strokeWidth={1} />
            </div>
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold">Secure Internal Repository Upload</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
