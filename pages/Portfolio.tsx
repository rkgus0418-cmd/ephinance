import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Report, ReportCategory } from '../types';

// ReportCover component to automatically render image or 1-page PDF
export const ReportCover = ({ imageUrl, pdfUrl, title }: { imageUrl?: string; pdfUrl?: string; title: string }) => {
  const url = imageUrl || pdfUrl;
  const isPdf = url?.toLowerCase().includes('.pdf') || false;

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50/70">
        <FileText strokeWidth={1} size={36} className="text-neutral-200" />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white select-none pointer-events-none">
        <iframe 
          src={`${url}#page=1&toolbar=0&navpanes=0&scrollbar=0`} 
          className="w-full h-full border-0 opacity-90 pointer-events-none overflow-hidden"
          title={title}
          scrolling="no"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-transparent cursor-default" />
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={title}
      className="w-full h-full object-cover"
    />
  );
};

const Portfolio = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await dataService.getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const categories: ReportCategory[] = ['All', 'Equity Research', 'Biotech Strategy & Deals', 'Macro & Markets'];

  const filteredReports = selectedCategory === 'All' 
    ? reports 
    : reports.filter(report => report.category === selectedCategory);

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      {/* Page Header */}
      <header className="pt-32 pb-16 px-6 text-center bg-neutral-50 border-b border-neutral-100">
        <h1 className="text-[11px] font-bold tracking-[0.3em] text-brand-orange uppercase mb-4">Research Archive</h1>
        <h2 className="text-4xl font-light tracking-tight text-brand-charcoal mb-4">E.Phinance Portfolio</h2>
        <p className="text-sm font-light text-neutral-400 max-w-lg mx-auto leading-relaxed text-balanced">
          이화여자대학교 약학대학 약학적 통찰에 기반하여 작성된 바이오 산업, 기업 밸류에이션 및 매크로 시장 리서치 아카이브입니다.
        </p>
      </header>

      {/* Category Filter Buttons */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-brand-charcoal border-brand-charcoal text-white shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-500 hover:text-brand-charcoal hover:border-brand-charcoal'
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Reports Grid (Flat, non-clickable, no download route) */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-neutral-200 rounded-xl">
            <p className="text-neutral-400 text-sm font-light uppercase tracking-widest">No reports registered in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="block space-y-6 bg-white border border-neutral-100/45 p-4 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                {/* Cover Image or PDF Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border border-neutral-100/60 rounded-sm">
                  <ReportCover imageUrl={report.imageUrl} pdfUrl={report.pdfUrl} title={report.title} />
                </div>
                
                {/* Metadata content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-widest text-brand-orange uppercase">{report.category}</span>
                    <span className="text-[9px] font-mono text-neutral-300 tracking-widest">{report.date}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-brand-charcoal leading-snug">
                      {report.title}
                    </h3>
                    {report.subtitle && (
                      <p className="text-xs text-neutral-400 font-light italic">{report.subtitle}</p>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 font-light line-clamp-3 leading-relaxed">
                    {report.executiveSummary}
                  </p>
                  
                  {/* Detailed summary details displayed flattened on card */}
                  <div className="pt-4 border-t border-neutral-50 space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <span className="font-medium italic">Author: {report.author}</span>
                    </div>
                    {report.keyThesis && (
                      <div className="bg-neutral-50/50 p-3 border border-neutral-100/30 rounded">
                        <span className="text-[8px] font-bold tracking-wider uppercase text-brand-orange block mb-1">Key Investment Thesis</span>
                        <p className="text-xs font-light text-neutral-600 line-clamp-2">{report.keyThesis}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
