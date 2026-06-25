import React, { useState, useEffect } from 'react';
import { ArrowDown, FileText } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Report } from '../types';
import { Logo } from '../components/Logo';
import { ReportCover } from './Portfolio';

const Home = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

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

  const visibleReports = reports
    .filter(r => r.isMainVisible !== false)
    .sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999999;
      const orderB = b.order !== undefined ? b.order : 999999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return b.date.localeCompare(a.date);
    });

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400" 
            alt="Institutional Architecture"
            className="w-full h-full object-cover grayscale opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-40"></div>
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white/40 backdrop-blur-sm p-4 border border-neutral-100/50">
              <Logo className="h-20 w-auto" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-brand-charcoal">
                E.Phinance
              </h1>
              <div className="space-y-3">
                <p className="text-lg md:text-xl font-light text-neutral-400 tracking-[0.4em] uppercase">
                  Decoding Biotech Value
                </p>
                <p className="text-sm md:text-base font-medium text-neutral-500 tracking-tight opacity-70">
                  이화여자대학교 약학대학 바이오 산업 학회
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 flex flex-col items-center space-y-2">
          <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-300 font-bold">Scroll to Portfolio</span>
          <div className="animate-bounce">
            <ArrowDown strokeWidth={1} className="text-neutral-200" size={16} />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-20 text-center">
            <span className="text-[10px] font-bold tracking-[0.4em] text-brand-orange uppercase mb-3">Research Portfolio</span>
            <h2 className="text-4xl font-light tracking-tight text-brand-charcoal">Research Highlights</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : visibleReports.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded-xl">
              <p className="text-neutral-400 text-sm font-light uppercase tracking-widest">No featured reports at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {visibleReports.map((report) => (
                <div 
                  key={report.id} 
                  className="block space-y-6 bg-white border border-neutral-100/45 p-4 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border border-neutral-100/60 rounded-sm">
                    <ReportCover imageUrl={report.imageUrl} pdfUrl={report.pdfUrl} title={report.title} />
                  </div>
                  
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
                        <p className="text-sm text-neutral-400 font-light italic">{report.subtitle}</p>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 font-light line-clamp-3 leading-relaxed">
                      {report.executiveSummary}
                    </p>
                    
                    <div className="pt-4 border-t border-neutral-50 space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
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
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-10">
           <h3 className="text-[9px] font-bold tracking-[0.4em] text-brand-orange uppercase">Our Methodology</h3>
           <p className="text-2xl font-light leading-snug text-brand-charcoal italic opacity-80">
             "Rigor in analysis. Integrity in valuation. <br />Decoding the complex structures of modern biotechnology."
           </p>
           <div className="w-12 h-[1px] bg-neutral-200 mx-auto" />
           <p className="text-[9px] text-neutral-400 font-light uppercase tracking-widest">E.Phinance Institutional Archive</p>
         </div>
      </section>
    </div>
  );
};

export default Home;
