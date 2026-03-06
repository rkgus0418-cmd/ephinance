
import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Report } from '../types';
import { Logo } from '../components/Logo';

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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="group block space-y-6"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border border-neutral-100">
                    {report.imageUrl ? (
                      <img 
                        src={report.imageUrl} 
                        alt={report.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <span className="text-[10px] tracking-widest uppercase">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold tracking-widest text-brand-orange uppercase">{report.category}</span>
                      <span className="text-[9px] font-mono text-neutral-300 tracking-widest">{report.date}</span>
                    </div>
                    <h3 className="text-xl font-medium text-brand-charcoal leading-tight">
                      {report.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed">
                      {report.subtitle || report.executiveSummary}
                    </p>
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
