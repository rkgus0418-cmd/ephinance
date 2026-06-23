
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { REPORTS } from '../data';

const ReportDetail = () => {
  const { id } = useParams();
  const report = REPORTS.find(r => r.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!report) return <div className="p-32 text-center">Report not found.</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 bg-neutral-50 min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-6 pt-32">
        <Link to="/research" className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-brand-orange mb-12">
          <ArrowLeft size={12} className="mr-2" /> Back to Archive
        </Link>
        
        <article className="bg-white p-12 md:p-24 shadow-2xl shadow-neutral-200/50 border border-neutral-100">
          <header className="border-b border-neutral-100 pb-16 mb-16 text-center">
            <div className="flex justify-center space-x-4 mb-8">
              <span className="text-[10px] border border-neutral-200 px-3 py-1 text-neutral-400 tracking-widest uppercase">{report.category}</span>
              <span className="text-[10px] border border-neutral-200 px-3 py-1 text-neutral-400 tracking-widest uppercase">{report.date}</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight mb-4 text-brand-charcoal">{report.title}</h1>
            <p className="text-lg text-neutral-500 font-light italic mb-8">{report.subtitle}</p>
            <p className="text-xs text-neutral-400 uppercase tracking-widest">Author: {report.author}</p>
          </header>

          <div className="space-y-16">
            {report.sections.map((section, idx) => (
              <section key={idx} className="space-y-6">
                <h2 className="text-xs font-bold tracking-[0.2em] text-brand-orange uppercase flex items-center">
                  <span className="mr-4">{idx + 1}.</span> {section.title}
                </h2>
                <div className="pl-10 text-neutral-600 leading-relaxed font-light space-y-4">
                  <p>{section.content}</p>
                  <p>In addition to the primary findings, our proprietary model suggests that the structural evolution of the {report.category} landscape is being driven by fundamental shifts in capital allocation and regulatory hurdles.</p>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-24 pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Internal Document No.</p>
              <p className="text-xs font-mono text-neutral-300">EP-RES-2025-{report.id.split('-')[1]}</p>
            </div>
            <button className="flex items-center space-x-3 bg-brand-charcoal text-white px-10 py-5 hover:bg-brand-orange transition-colors text-xs font-bold tracking-widest uppercase">
              <Download size={16} />
              <span>Download Full Internal PDF</span>
            </button>
          </div>
        </article>

        <div className="mt-12 flex justify-between">
          <button className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-brand-charcoal opacity-50 cursor-not-allowed">
            <ArrowLeft size={12} />
            <span>Previous Report</span>
          </button>
          <button className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-brand-charcoal">
            <span>Next Report</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
