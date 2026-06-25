import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Report, Member } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Upload, FileText, 
  ArrowUp, ArrowDown, Users, Settings, Layout, 
  Lock, LogIn
} from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'people' | 'settings'>('reports');
  
  // Reports State
  const [reports, setReports] = useState<Report[]>([]);
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<Partial<Report>>({
    title: '', subtitle: '', category: 'Equity Research',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    author: '', executiveSummary: '', keyThesis: '',
    riskOverview: '', valuationSnapshot: '', sections: [{ title: '', content: '' }],
    isMainVisible: true
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // People State
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    cohort: '1기', classOf: '', name: '', role: '', statusTag: ''
  });
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
  const [memberImagePreview, setMemberImagePreview] = useState<string | null>(null);

  // Settings State
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
    setLoading(false);
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [reportsData, membersData, settingsData] = await Promise.all([
        dataService.getReports(),
        dataService.getMembers(),
        dataService.getSettings()
      ]);
      const sortedReports = [...reportsData].sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999999;
        const orderB = b.order !== undefined ? b.order : 999999;
        if (orderA !== orderB) return orderA - orderB;
        return b.date.localeCompare(a.date);
      });
      setReports(sortedReports);
      setMembers(membersData);
      setSiteSettings(settingsData);
      setLogoPreview(settingsData.logoUrl || null);
    } catch (error) {
      console.error("Failed to load data for admin panel:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dusrudgusdba') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // --- Report Actions ---
  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let pdfUrl = currentReport.pdfUrl;
      if (pdfFile) pdfUrl = await dataService.uploadPDF(pdfFile);

      let imageUrl = currentReport.imageUrl;
      if (imageFile) imageUrl = await dataService.uploadImage(imageFile);

      const reportData = { ...currentReport, pdfUrl, imageUrl } as Omit<Report, 'id'>;
      if (currentReport.id) {
        await dataService.updateReport(currentReport.id, reportData);
      } else {
        await dataService.addReport({ ...reportData, order: reports.length });
      }
      
      setIsEditingReport(false);
      resetReportForm();
      fetchData();
      alert('Report saved successfully!');
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const moveReport = async (index: number, direction: 'up' | 'down') => {
    const newReports = [...reports];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newReports.length) return;

    const temp = newReports[index];
    newReports[index] = newReports[targetIndex];
    newReports[targetIndex] = temp;

    // Update orders
    await Promise.all(newReports.map((r, i) => dataService.updateReport(r.id, { order: i })));
    fetchData();
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Delete this report?')) {
      await dataService.deleteReport(id);
      fetchData();
    }
  };

  const resetReportForm = () => {
    setCurrentReport({
      title: '', subtitle: '', category: 'Equity Research',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      author: '', executiveSummary: '', keyThesis: '',
      riskOverview: '', valuationSnapshot: '', sections: [{ title: '', content: '' }],
      isMainVisible: true
    });
    setPdfFile(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // --- Member Actions ---
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = currentMember.imageUrl;
      if (memberImageFile) {
        imageUrl = await dataService.uploadImage(memberImageFile);
      }

      const memberData = { ...currentMember, imageUrl };
      
      if (currentMember.id) {
        await dataService.updateMember(currentMember.id, memberData);
      } else {
        await dataService.addMember({ ...memberData as Omit<Member, 'id'>, order: members.length });
      }
      setIsEditingMember(false);
      setCurrentMember({ cohort: '1기', classOf: '', name: '', role: '', statusTag: '' });
      setMemberImageFile(null);
      setMemberImagePreview(null);
      fetchData();
      alert('Member information saved!');
    } catch (error) {
      alert('Error saving member: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Delete this member?')) {
      await dataService.deleteMember(id);
      fetchData();
    }
  };

  // --- Settings Actions ---
  const handleSaveSettings = async () => {
    setUploading(true);
    try {
      let logoUrl = siteSettings.logoUrl;
      if (logoFile) logoUrl = await dataService.uploadImage(logoFile);
      
      await dataService.updateSettings({ ...siteSettings, logoUrl });
      alert('Settings updated successfully!');
      fetchData();
    } catch (error) {
      alert('Error saving settings: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md w-full bg-white p-12 border border-neutral-200 text-center space-y-8">
          <div className="space-y-2">
            <Lock className="mx-auto text-brand-orange" size={32} strokeWidth={1.5} />
            <h1 className="text-2xl font-light tracking-tight">Admin Access</h1>
            <p className="text-xs text-neutral-400 uppercase tracking-widest">Restricted Area</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 border border-neutral-200 outline-none focus:border-brand-orange text-center tracking-[0.5em]"
              required
            />
            <button type="submit" className="w-full bg-brand-charcoal text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-brand-orange transition-all">
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Group members into cohorts dynamically for administration
  const membersByCohort = members.reduce((acc: { [key: string]: Member[] }, m) => {
    if (!acc[m.cohort]) acc[m.cohort] = [];
    acc[m.cohort].push(m);
    return acc;
  }, {});

  const getCohortNum = (cohort: string): number => {
    const match = cohort.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortedAdminCohortKeys = Object.keys(membersByCohort).sort((a, b) => getCohortNum(a) - getCohortNum(b));

  const currentCategories = siteSettings.categories || [
    { slug: 'Equity Research', name: 'Equity Research' },
    { slug: 'Biotech Strategy & Deals', name: 'Biotech Strategy & Deals' },
    { slug: 'Macro & Markets', name: 'Macro & Markets' },
    { slug: 'open-study', name: 'Open Studies' }
  ];

  const uniqueCohorts = (Array.from(new Set(members.map(m => m.cohort))) as string[]).sort((a, b) => getCohortNum(a) - getCohortNum(b));

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-charcoal text-white flex flex-col">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-lg font-bold tracking-tighter">E.Phinance</h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Control Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${activeTab === 'reports' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Layout size={18} /> Research Reports
          </button>
          <button 
            onClick={() => setActiveTab('people')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${activeTab === 'people' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Users size={18} /> People & cohorts
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${activeTab === 'settings' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Settings size={18} /> Site & Recruit Settings
          </button>
        </nav>
        <div className="p-8 text-[10px] text-neutral-600 uppercase tracking-widest border-t border-white/5">
          v2.1.0 Stable
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-light tracking-tight">Research Reports</h1>
                <p className="text-sm text-neutral-400">Manage research portfolio posts</p>
              </div>
              <button 
                onClick={() => { resetReportForm(); setIsEditingReport(true); }}
                className="bg-brand-charcoal text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all flex items-center gap-2"
              >
                <Plus size={16} /> New Report
              </button>
            </div>

            {isEditingReport ? (
              <div className="bg-white p-12 border border-neutral-200 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-6">
                  <h2 className="text-xl font-light">{currentReport.id ? 'Edit Research' : 'Create Research'}</h2>
                  <button onClick={() => setIsEditingReport(false)} className="text-neutral-300 hover:text-brand-charcoal"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSaveReport} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Title</label>
                      <input type="text" value={currentReport.title || ''} onChange={(e) => setCurrentReport({...currentReport, title: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Subtitle</label>
                      <input type="text" value={currentReport.subtitle || ''} onChange={(e) => setCurrentReport({...currentReport, subtitle: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</label>
                      <select value={currentReport.category} onChange={(e) => setCurrentReport({...currentReport, category: e.target.value as any})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange bg-white">
                        {currentCategories.map((cat: any) => (
                          <option key={cat.slug} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Date</label>
                      <input type="text" placeholder="YYYY.MM.DD" value={currentReport.date || ''} onChange={(e) => setCurrentReport({...currentReport, date: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange" required />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-neutral-50 p-4 border border-neutral-100 rounded-lg">
                    <input 
                      type="checkbox" 
                      id="isMainVisible" 
                      checked={currentReport.isMainVisible !== false} 
                      onChange={(e) => setCurrentReport({...currentReport, isMainVisible: e.target.checked})} 
                      className="h-4 w-4 bg-white border-neutral-200 accent-brand-orange cursor-pointer" 
                    />
                    <label htmlFor="isMainVisible" className="text-xs font-semibold tracking-wide text-brand-charcoal cursor-pointer select-none">
                      메인 페이지 노출 여부 (체크할 경우 메인 화면의 'Research Highlights'에 노출됩니다.)
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Author</label>
                    <input type="text" value={currentReport.author || ''} onChange={(e) => setCurrentReport({...currentReport, author: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Executive Summary</label>
                    <textarea value={currentReport.executiveSummary || ''} onChange={(e) => setCurrentReport({...currentReport, executiveSummary: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange h-32" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Key Investment Thesis</label>
                    <textarea value={currentReport.keyThesis || ''} onChange={(e) => setCurrentReport({...currentReport, keyThesis: e.target.value})} className="w-full p-4 border border-neutral-150 outline-none focus:border-brand-orange h-24" />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Project Image / Thumbnail Cover</label>
                      <label className="block w-full aspect-video border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-brand-orange transition-all overflow-hidden relative">
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300">
                            <Upload size={24} />
                            <span className="text-[10px] mt-2 uppercase tracking-widest">Upload Cover Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onload = () => setImagePreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} className="hidden" />
                      </label>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">PDF Document (or 1-Page PDF Cover)</label>
                      <label className="block w-full p-12 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-brand-orange transition-all text-center">
                        <FileText className="mx-auto text-neutral-300 mb-2" size={32} />
                        <span className="text-xs text-neutral-500 font-medium">{pdfFile ? pdfFile.name : currentReport.pdfUrl ? 'PDF Already Registered (Click to swap)' : 'Click to upload PDF'}</span>
                        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button type="submit" disabled={uploading} className="flex-1 bg-brand-charcoal text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50">
                      {uploading ? 'Processing & Uploading...' : 'Save Research'}
                    </button>
                    <button type="button" onClick={() => setIsEditingReport(false)} className="px-12 border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-neutral-100">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={report.id} className="bg-white p-6 border border-neutral-200 flex items-center justify-between group hover:border-brand-orange transition-all">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveReport(index, 'up')} disabled={index === 0} className="text-neutral-200 hover:text-brand-orange disabled:opacity-0"><ArrowUp size={16} /></button>
                        <button onClick={() => moveReport(index, 'down')} disabled={index === reports.length - 1} className="text-neutral-200 hover:text-brand-orange disabled:opacity-0"><ArrowDown size={16} /></button>
                      </div>
                      <div className="w-16 h-10 bg-neutral-50 overflow-hidden border border-neutral-100">
                        {report.imageUrl && <img src={report.imageUrl} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold text-brand-orange uppercase tracking-widest">{report.category}</span>
                          <span className="text-[9px] text-neutral-300 font-mono">{report.date}</span>
                          {report.isMainVisible !== false ? (
                            <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-mono font-medium border border-green-100 uppercase tracking-widest">Main</span>
                          ) : (
                            <span className="text-[8px] bg-neutral-50 text-neutral-400 px-1.5 py-0.5 rounded font-mono font-medium border border-neutral-100 uppercase tracking-widest">Portfolio Only</span>
                          )}
                        </div>
                        <h3 className="text-lg font-light text-brand-charcoal">{report.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setCurrentReport(report); setImagePreview(report.imageUrl || null); setIsEditingReport(true); }} className="p-2 text-neutral-400 hover:text-brand-charcoal"><Edit size={18} /></button>
                      <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-light tracking-tight">People & cohort Management</h1>
                <p className="text-sm text-neutral-400">Add 기수(cohorts) and manage members dynamically</p>
              </div>
              <button 
                onClick={() => { 
                  setCurrentMember({ cohort: '3기', classOf: '', name: '', role: '', imageUrl: '' }); 
                  setMemberImageFile(null);
                  setMemberImagePreview(null);
                  setIsEditingMember(true); 
                }}
                className="bg-brand-charcoal text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all"
              >
                Add Member
              </button>
            </div>

            {isEditingMember && (
              <div className="bg-white p-8 border border-neutral-200 space-y-6">
                <h2 className="text-lg font-light">{currentMember.id ? 'Edit Member' : 'New Member'}</h2>
                <form onSubmit={handleSaveMember} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Cohort (기수)</label>
                      <input 
                        type="text" 
                        value={currentMember.cohort || ''} 
                        onChange={(e) => setCurrentMember({...currentMember, cohort: e.target.value})} 
                        className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" 
                        placeholder="예: 3기" 
                        required 
                      />
                      <p className="text-[9px] text-neutral-400">Create new cohort strings like "3기" or "4기" here</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Class Of (학번)</label>
                      <input 
                        type="text" 
                        value={currentMember.classOf || ''} 
                        onChange={(e) => setCurrentMember({...currentMember, classOf: e.target.value})} 
                        className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" 
                        placeholder="예: 21학번" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name (이름)</label>
                      <input 
                        type="text" 
                        value={currentMember.name || ''} 
                        onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})} 
                        className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" 
                        placeholder="예: 김약선"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Role / Position (역할)</label>
                      <input 
                        type="text" 
                        value={currentMember.role || ''} 
                        onChange={(e) => setCurrentMember({...currentMember, role: e.target.value})} 
                        className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" 
                        placeholder="예: 회장, 리서치 부문장 (선택)" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Participation Tag (상태 태그)</label>
                      <input 
                        type="text" 
                        value={currentMember.statusTag || ''} 
                        onChange={(e) => setCurrentMember({...currentMember, statusTag: e.target.value})} 
                        className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" 
                        placeholder="예: 1기, 2기 활동 (선택)" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Profile Image (프로필 이미지)</label>
                    <div className="flex items-center gap-6 bg-neutral-50 p-4 border border-neutral-100 rounded">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        {memberImagePreview ? (
                          <img src={memberImagePreview} className="w-full h-full object-cover" />
                        ) : currentMember.imageUrl ? (
                          <img src={currentMember.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <Users size={24} className="text-neutral-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setMemberImageFile(file);
                              const reader = new FileReader();
                              reader.onload = () => setMemberImagePreview(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} 
                          className="text-xs text-neutral-500" 
                        />
                        <p className="text-[10px] text-neutral-400 mt-1">Recommended clear square format avatar shot</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" disabled={uploading} className="flex-1 bg-brand-charcoal text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50">
                      {uploading ? 'Uploading & Saving...' : 'Save Member'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditingMember(false);
                        setCurrentMember({ cohort: '1기', classOf: '', name: '', role: '', statusTag: '' });
                      }} 
                      className="px-8 border border-neutral-200 text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Structured Cohorts Board */}
            <div className="space-y-8">
              {sortedAdminCohortKeys.map((cohortKey) => {
                const list = membersByCohort[cohortKey];
                return (
                  <div key={cohortKey} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-4 flex justify-between items-center">
                      <h3 className="font-light text-brand-charcoal text-lg">
                        {cohortKey} <span className="text-xs font-mono px-2 py-0.5 bg-brand-orange/10 text-brand-orange rounded-full ml-2">{list.length} Members</span>
                      </h3>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {list.map((member) => (
                        <div key={member.id} className="p-4 px-6 flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-100 bg-neutral-50 flex items-center justify-center">
                              {member.imageUrl ? (
                                <img src={member.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-semibold text-neutral-400">{member.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-sm">{member.name}</span>
                                <span className="text-[10px] text-neutral-400 font-mono italic">{member.classOf}</span>
                                {member.role && (
                                  <span className="text-[10px] font-bold text-brand-orange tracking-wider bg-brand-orange/5 px-2 py-0.5 rounded uppercase">{member.role}</span>
                                )}
                                {member.statusTag && (
                                  <span className="text-[10px] font-medium text-neutral-500 tracking-wider bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">{member.statusTag}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { 
                                setCurrentMember(member); 
                                setMemberImageFile(null);
                                setMemberImagePreview(member.imageUrl || null);
                                setIsEditingMember(true); 
                              }} 
                              className="p-2 text-neutral-400 hover:text-brand-charcoal transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(member.id)} 
                              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h1 className="text-3xl font-light tracking-tight">System & Recruit Settings</h1>
              <p className="text-sm text-neutral-400">Global site overrides, dynamic recruitment notices, and warning content</p>
            </div>

            <div className="bg-white p-8 border border-neutral-200 space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange border-b border-neutral-100 pb-2">Brand Identity</h3>
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 border border-neutral-105 flex items-center justify-center bg-neutral-50">
                    {logoPreview ? <img src={logoPreview} className="max-w-full max-h-full p-2" /> : <Upload className="text-neutral-200" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Main Logo File</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                        const reader = new FileReader();
                        reader.onload = () => setLogoPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} className="text-xs" />
                  </div>
                </div>
              </div>

              {/* Dynamic Recruitment Text Area Fields */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange border-b border-neutral-100 pb-2">Recruitment Section Content (RECRUIT)</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Who We Look For Title</label>
                    <input type="text" value={siteSettings.recruitSectionTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitSectionTitle: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="Defaults to: Who We Look For" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Admissions Guide Intro Text</label>
                    <textarea value={siteSettings.recruitGuideNote || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitGuideNote: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-24" placeholder="Admissions introduction or guidelines details..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">모집 요강 (Requirements list - One requirement per line)</label>
                    <textarea value={siteSettings.requirements || ''} onChange={(e) => setSiteSettings({...siteSettings, requirements: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-36 font-sans text-sm leading-relaxed" placeholder="이화여자대학교 약학대학 4,5학년 재학생&#10;숫자를 통해 기술을 해석하고 싶으신 분&#10;열정이 뛰어나신 분..." />
                    <p className="text-[9px] text-neutral-400">Please enter each item on a separate line. They will automatically be rendered with bullets on the Recruit screen.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recruitment Box Title</label>
                    <input type="text" value={siteSettings.recruitmentTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentTitle: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: 2026 Spring Cohort Recruitment" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recruitment Date Period</label>
                    <input type="text" value={siteSettings.recruitmentDate || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentDate: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: Feb 23 - Feb 27, 2026" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Application URL Link</label>
                    <input type="text" value={siteSettings.recruitmentApplyUrl || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentApplyUrl: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="https://google.form/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Footer Warning text</label>
                    <input type="text" value={siteSettings.recruitFooterWarning || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitFooterWarning: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="Defaults to: * Late applications will not be considered." />
                  </div>
                </div>
              </div>

              {/* Dynamic Curriculum Phases Edit */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Curriculum Phases</h3>
                  <button 
                    onClick={() => {
                      const phases = [...(siteSettings.curriculumContent?.phases || [])];
                      phases.push({ title: '', desc: '', details: '' });
                      setSiteSettings({...siteSettings, curriculumContent: { phases }});
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-orange flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Phase
                  </button>
                </div>
                <div className="space-y-8">
                  {(siteSettings.curriculumContent?.phases || []).map((phase: any, idx: number) => (
                    <div key={idx} className="p-4 border border-neutral-100 space-y-4 relative group">
                      <button 
                        onClick={() => {
                          const phases = [...(siteSettings.curriculumContent?.phases || [])];
                          phases.splice(idx, 1);
                          setSiteSettings({...siteSettings, curriculumContent: { phases }});
                        }}
                        className="absolute top-2 right-2 text-neutral-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">Phase Title</label>
                        <input 
                          type="text" 
                          value={phase.title || ''} 
                          onChange={(e) => {
                            const phases = [...(siteSettings.curriculumContent?.phases || [])];
                            phases[idx].title = e.target.value;
                            setSiteSettings({...siteSettings, curriculumContent: { phases }});
                          }} 
                          className="w-full p-2 text-sm border border-neutral-50 outline-none focus:border-brand-orange" 
                          placeholder="Phase 1 – Industry Architecture"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">Description</label>
                        <input 
                          type="text" 
                          value={phase.desc || ''} 
                          onChange={(e) => {
                            const phases = [...(siteSettings.curriculumContent?.phases || [])];
                            phases[idx].desc = e.target.value;
                            setSiteSettings({...siteSettings, curriculumContent: { phases }});
                          }} 
                          className="w-full p-2 text-sm border border-neutral-50 outline-none focus:border-brand-orange" 
                          placeholder="바이오 산업 구조 이해"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">Details</label>
                        <input 
                          type="text" 
                          value={phase.details || ''} 
                          onChange={(e) => {
                            const phases = [...(siteSettings.curriculumContent?.phases || [])];
                            phases[idx].details = e.target.value;
                            setSiteSettings({...siteSettings, curriculumContent: { phases }});
                          }} 
                          className="w-full p-2 text-sm border border-neutral-50 outline-none focus:border-brand-orange" 
                          placeholder="플랫폼, CDMO, 개발사 모델 비교"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Category Management */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Research Categories</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Dynamically manage categories for research reports. Changing these updates the portfolio tabs and filters instantly.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Category Form */}
                    <div className="p-4 border border-neutral-100 space-y-4 rounded bg-neutral-50/20">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Add New Category</h4>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">English Slug (e.g. open-study)</label>
                        <input 
                          type="text" 
                          id="new-category-slug"
                          className="w-full p-2 text-xs border border-neutral-150 outline-none focus:border-brand-orange bg-white" 
                          placeholder="open-study"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Display Name (e.g. Open Studies)</label>
                        <input 
                          type="text" 
                          id="new-category-name"
                          className="w-full p-2 text-xs border border-neutral-150 outline-none focus:border-brand-orange bg-white" 
                          placeholder="Open Studies"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const slugEl = document.getElementById('new-category-slug') as HTMLInputElement;
                          const nameEl = document.getElementById('new-category-name') as HTMLInputElement;
                          if (slugEl && nameEl && slugEl.value.trim() && nameEl.value.trim()) {
                            const cats = [...currentCategories];
                            const inputSlug = slugEl.value.trim();
                            const inputName = nameEl.value.trim();
                            if (cats.some(c => c.slug === inputSlug)) {
                              alert('Category with this slug already exists!');
                              return;
                            }
                            cats.push({ slug: inputSlug, name: inputName });
                            setSiteSettings({...siteSettings, categories: cats});
                            slugEl.value = '';
                            nameEl.value = '';
                          } else {
                            alert('Please enter both category slug and display name.');
                          }
                        }}
                        className="w-full py-2.5 bg-brand-charcoal hover:bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider transition-colors rounded"
                      >
                        Add Category
                      </button>
                    </div>

                    {/* Categories List */}
                    <div className="p-4 border border-neutral-100 space-y-3 rounded bg-neutral-50/20 max-h-72 overflow-y-auto">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Existing Categories</h4>
                      {currentCategories.map((cat: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-150 text-xs rounded shadow-sm">
                          <div>
                            <span className="font-semibold text-neutral-700">{cat.name}</span>
                            <span className="ml-2 text-[9px] font-mono text-neutral-400">({cat.slug})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                                const cats = currentCategories.filter((_, i) => i !== idx);
                                setSiteSettings({...siteSettings, categories: cats});
                              }
                            }}
                            className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Cohort Metadata Management */}
              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Cohort Metadata & Active Status</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Configure active cohorts (expanded by default) and specify custom activity periods or far-right tags showing active span.
                  </p>
                  <div className="space-y-4">
                    {uniqueCohorts.map((cohortName) => {
                      const meta = siteSettings.cohortMetadata?.[cohortName] || {
                        isActive: cohortName === '1기' || cohortName === '2기',
                        period: cohortName === '1기' ? '25.09~26.02' : '',
                        statusTag: (cohortName === '1기' || cohortName === '2기') ? '1기, 2기 활동' : ''
                      };

                      const updateCohortMeta = (fields: Partial<typeof meta>) => {
                        const nextMetadata = { ...(siteSettings.cohortMetadata || {}) };
                        nextMetadata[cohortName] = { ...meta, ...fields };
                        setSiteSettings({ ...siteSettings, cohortMetadata: nextMetadata });
                      };

                      return (
                        <div key={cohortName} className="p-4 border border-neutral-150 bg-neutral-50/30 rounded space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-2">
                            <span className="text-sm font-semibold text-brand-charcoal">{cohortName} Cohort</span>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={meta.isActive}
                                onChange={(e) => updateCohortMeta({ isActive: e.target.checked })}
                                className="w-4 h-4 accent-brand-orange cursor-pointer"
                              />
                              <span className="text-xs font-medium text-neutral-600">현재 활동 기수 (Currently Active)</span>
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Activity Period (활동 기간)</label>
                              <input 
                                type="text" 
                                value={meta.period || ''}
                                onChange={(e) => updateCohortMeta({ period: e.target.value })}
                                className="w-full p-2 text-xs border border-neutral-150 outline-none focus:border-brand-orange bg-white"
                                placeholder="예: 25.09~26.02"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Status Tag Badge (상태 태그 / 오른쪽 표시)</label>
                              <input 
                                type="text" 
                                value={meta.statusTag || ''}
                                onChange={(e) => updateCohortMeta({ statusTag: e.target.value })}
                                className="w-full p-2 text-xs border border-neutral-150 outline-none focus:border-brand-orange bg-white"
                                placeholder="예: 1기, 2기 활동"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {uniqueCohorts.length === 0 && (
                      <p className="text-xs italic text-neutral-400">No cohorts found. Add members to a cohort first to manage metadata here.</p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                disabled={uploading}
                className="w-full bg-brand-charcoal text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50"
              >
                {uploading ? 'Updating Site System Settings...' : 'Update All Settings'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
