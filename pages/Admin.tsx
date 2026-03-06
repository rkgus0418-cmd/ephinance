import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Report, Member } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, Upload, FileText, 
  ArrowUp, ArrowDown, Users, Settings, Layout, 
  ChevronRight, ChevronDown, Lock, LogIn
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
    riskOverview: '', valuationSnapshot: '', sections: [{ title: '', content: '' }]
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // People State
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<Member>>({
    cohort: '1기', classOf: '', name: ''
  });

  // Settings State
  const [siteSettings, setSiteSettings] = useState<{ 
    logoUrl?: string;
    recruitmentTitle?: string;
    recruitmentDate?: string;
    recruitmentApplyUrl?: string;
    aboutContent?: {
      pipelineTitle?: string;
      pipelineDesc?: string;
      clinicalTitle?: string;
      clinicalDesc?: string;
      licensingTitle?: string;
      licensingDesc?: string;
      disciplineTitle?: string;
      disciplineDesc?: string;
    };
    curriculumContent?: {
      phases?: Array<{
        title: string;
        desc: string;
        details: string;
      }>;
    };
  }>({});
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
    const [reportsData, membersData, settingsData] = await Promise.all([
      dataService.getReports(),
      dataService.getMembers(),
      dataService.getSettings()
    ]);
    setReports(reportsData);
    setMembers(membersData);
    setSiteSettings(settingsData);
    setLogoPreview(settingsData.logoUrl || null);
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
      alert('Report saved!');
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
      riskOverview: '', valuationSnapshot: '', sections: [{ title: '', content: '' }]
    });
    setPdfFile(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // --- Member Actions ---
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentMember.id) {
        await dataService.updateMember(currentMember.id, currentMember);
      } else {
        await dataService.addMember({ ...currentMember as Omit<Member, 'id'>, order: members.length });
      }
      setIsEditingMember(false);
      setCurrentMember({ cohort: '1기', classOf: '', name: '' });
      fetchData();
    } catch (error) {
      alert('Error saving member');
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
      alert('Settings updated!');
      window.location.reload();
    } catch (error) {
      alert('Error saving settings');
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'reports' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Layout size={18} /> Research Reports
          </button>
          <button 
            onClick={() => setActiveTab('people')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'people' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Users size={18} /> People Management
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'settings' ? 'bg-brand-orange text-white' : 'text-neutral-400 hover:bg-white/5'}`}
          >
            <Settings size={18} /> Site Settings
          </button>
        </nav>
        <div className="p-8 text-[10px] text-neutral-600 uppercase tracking-widest border-t border-white/5">
          v2.0.0 Stable
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-light tracking-tight">Research Reports</h1>
                <p className="text-sm text-neutral-400">Manage and order your research archive</p>
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
                      <input type="text" value={currentReport.title} onChange={(e) => setCurrentReport({...currentReport, title: e.target.value})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Subtitle</label>
                      <input type="text" value={currentReport.subtitle} onChange={(e) => setCurrentReport({...currentReport, subtitle: e.target.value})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</label>
                      <select value={currentReport.category} onChange={(e) => setCurrentReport({...currentReport, category: e.target.value as any})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange">
                        <option value="Equity Research">Equity Research</option>
                        <option value="Biotech Strategy & Deals">Biotech Strategy & Deals</option>
                        <option value="Macro & Markets">Macro & Markets</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Date</label>
                      <input type="text" placeholder="YYYY.MM.DD" value={currentReport.date} onChange={(e) => setCurrentReport({...currentReport, date: e.target.value})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Author</label>
                    <input type="text" value={currentReport.author} onChange={(e) => setCurrentReport({...currentReport, author: e.target.value})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Executive Summary</label>
                    <textarea value={currentReport.executiveSummary} onChange={(e) => setCurrentReport({...currentReport, executiveSummary: e.target.value})} className="w-full p-4 border border-neutral-100 outline-none focus:border-brand-orange h-32" required />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Project Image</label>
                      <label className="block w-full aspect-video border-2 border-dashed border-neutral-100 rounded-xl cursor-pointer hover:border-brand-orange transition-all overflow-hidden relative">
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300">
                            <Upload size={24} />
                            <span className="text-[10px] mt-2 uppercase tracking-widest">Upload Image</span>
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">PDF Document</label>
                      <label className="block w-full p-12 border-2 border-dashed border-neutral-100 rounded-xl cursor-pointer hover:border-brand-orange transition-all text-center">
                        <FileText className="mx-auto text-neutral-200 mb-2" size={32} />
                        <span className="text-xs text-neutral-400">{pdfFile ? pdfFile.name : 'Click to upload PDF'}</span>
                        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <button type="submit" disabled={uploading} className="flex-1 bg-brand-charcoal text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50">
                      {uploading ? 'Processing...' : 'Save Research'}
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
                <h1 className="text-3xl font-light tracking-tight">People Management</h1>
                <p className="text-sm text-neutral-400">Manage researchers by cohort</p>
              </div>
              <button 
                onClick={() => { setCurrentMember({ cohort: '1기', classOf: '', name: '' }); setIsEditingMember(true); }}
                className="bg-brand-charcoal text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all"
              >
                Add Member
              </button>
            </div>

            {isEditingMember && (
              <div className="bg-white p-8 border border-neutral-200 space-y-6">
                <h2 className="text-lg font-light">{currentMember.id ? 'Edit Member' : 'New Member'}</h2>
                <form onSubmit={handleSaveMember} className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Cohort (기수)</label>
                    <input type="text" value={currentMember.cohort} onChange={(e) => setCurrentMember({...currentMember, cohort: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: 1기" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Class Of (학번)</label>
                    <input type="text" value={currentMember.classOf} onChange={(e) => setCurrentMember({...currentMember, classOf: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: 21학번" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
                    <input type="text" value={currentMember.name} onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" required />
                  </div>
                  <div className="col-span-3 flex gap-4">
                    <button type="submit" className="flex-1 bg-brand-charcoal text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all">Save Member</button>
                    <button type="button" onClick={() => setIsEditingMember(false)} className="px-8 border border-neutral-200 text-xs font-bold uppercase tracking-widest">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white border border-neutral-200 divide-y divide-neutral-100">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-8">
                    <span className="text-xs font-bold text-brand-orange w-12">{member.cohort}</span>
                    <span className="text-xs text-neutral-400 w-16">{member.classOf}</span>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setCurrentMember(member); setIsEditingMember(true); }} className="p-2 text-neutral-300 hover:text-brand-charcoal"><Edit size={16} /></button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-neutral-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h1 className="text-3xl font-light tracking-tight">Site Settings</h1>
              <p className="text-sm text-neutral-400">Global configuration and recruitment</p>
            </div>

            <div className="bg-white p-8 border border-neutral-200 space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Brand Identity</h3>
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 border border-neutral-100 flex items-center justify-center bg-neutral-50">
                    {logoPreview ? <img src={logoPreview} className="max-w-full max-h-full p-2" /> : <Upload className="text-neutral-200" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Main Logo</label>
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

              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">Recruitment Section</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recruitment Title</label>
                    <input type="text" value={siteSettings.recruitmentTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentTitle: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: 2026 Spring Cohort Recruitment" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recruitment Date Info</label>
                    <input type="text" value={siteSettings.recruitmentDate || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentDate: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="예: Feb 23 - Feb 27, 2026" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Apply URL</label>
                    <input type="text" value={siteSettings.recruitmentApplyUrl || ''} onChange={(e) => setSiteSettings({...siteSettings, recruitmentApplyUrl: e.target.value})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" placeholder="https://google.form/..." />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-neutral-100">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">About Page Content</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pipeline Title</label>
                      <input type="text" value={siteSettings.aboutContent?.pipelineTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), pipelineTitle: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pipeline Description</label>
                      <textarea value={siteSettings.aboutContent?.pipelineDesc || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), pipelineDesc: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Clinical Title</label>
                      <input type="text" value={siteSettings.aboutContent?.clinicalTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), clinicalTitle: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Clinical Description</label>
                      <textarea value={siteSettings.aboutContent?.clinicalDesc || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), clinicalDesc: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Licensing Title</label>
                      <input type="text" value={siteSettings.aboutContent?.licensingTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), licensingTitle: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Licensing Description</label>
                      <textarea value={siteSettings.aboutContent?.licensingDesc || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), licensingDesc: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Discipline Title</label>
                      <input type="text" value={siteSettings.aboutContent?.disciplineTitle || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), disciplineTitle: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Discipline Description</label>
                      <textarea value={siteSettings.aboutContent?.disciplineDesc || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutContent: {...(siteSettings.aboutContent || {}), disciplineDesc: e.target.value}})} className="w-full p-3 border border-neutral-100 outline-none focus:border-brand-orange h-32" />
                    </div>
                  </div>
                </div>
              </div>

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
                  {(siteSettings.curriculumContent?.phases || []).map((phase, idx) => (
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
                          value={phase.title} 
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
                          value={phase.desc} 
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
                          value={phase.details} 
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

              <button 
                onClick={handleSaveSettings}
                disabled={uploading}
                className="w-full bg-brand-charcoal text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-orange transition-all disabled:opacity-50"
              >
                {uploading ? 'Updating Site...' : 'Update All Settings'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
