/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Procedure,
  AppViewMode,
  FontSizeLevel,
  PortalTab,
  NewsArticle,
  WorkScheduleItem,
  CitizenFeedback,
  TransparencyItem,
  TrafficFloodReport,
  AdministrativeContact,
  PartyGovLeader
} from './types';
import {
  DEFAULT_PROCEDURES,
  getStoredProcedures,
  saveStoredProcedures
} from './data/defaultProcedures';
import {
  getStoredNews,
  saveStoredNews,
  getStoredSchedule,
  saveStoredSchedule,
  getStoredFeedbacks,
  saveStoredFeedbacks,
  getStoredTransparencyDocs,
  saveStoredTransparencyDocs,
  getStoredTrafficReports,
  saveStoredTrafficReports,
  getStoredContacts,
  saveStoredContacts,
  getStoredPartyGovLeaders,
  saveStoredPartyGovLeaders
} from './data/portalData';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { PublicView } from './components/PublicView';
import { AdminCMS } from './components/AdminCMS';
import { NewsSection } from './components/portal/NewsSection';
import { ScheduleSection } from './components/portal/ScheduleSection';
import { PartyGovSection } from './components/portal/PartyGovSection';
import { ProceduresRepositorySection } from './components/portal/ProceduresRepositorySection';
import { TransparencySection } from './components/portal/TransparencySection';
import { FeedbackSection } from './components/portal/FeedbackSection';
import { ContactsSection } from './components/portal/ContactsSection';
import { TrafficFloodSection } from './components/portal/TrafficFloodSection';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CompanionChatbot } from './components/CompanionChatbot';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { ttsManager } from './utils/speechSynthesis';
import { voiceService } from './utils/speechRecognition';

export default function App() {
  const [procedures, setProcedures] = useState<Procedure[]>(() => getStoredProcedures());
  const [viewMode, setViewMode] = useState<AppViewMode>('public');
  const [portalTab, setPortalTab] = useState<PortalTab>('home');
  const [fontSize, setFontSize] = useState<FontSizeLevel>('normal');

  // Dynamic portal data
  const [news, setNews] = useState<NewsArticle[]>(() => getStoredNews());
  const [schedules, setSchedules] = useState<WorkScheduleItem[]>(() => getStoredSchedule());
  const [feedbacks, setFeedbacks] = useState<CitizenFeedback[]>(() => getStoredFeedbacks());
  const [transparencyDocs, setTransparencyDocs] = useState<TransparencyItem[]>(() => getStoredTransparencyDocs());
  const [trafficReports, setTrafficReports] = useState<TrafficFloodReport[]>(() => getStoredTrafficReports());
  const [contacts, setContacts] = useState<AdministrativeContact[]>(() => getStoredContacts());
  const [partyGovLeaders, setPartyGovLeaders] = useState<PartyGovLeader[]>(() => getStoredPartyGovLeaders());

  // Admin authentication state: secure access to Phân hệ Cán bộ
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tanmy_admin_authenticated') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Link from Procedures Repository to Voice Guidance in Home tab
  const [selectedProcedureForGuidance, setSelectedProcedureForGuidance] = useState<Procedure | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStoredProcedures(procedures);
  }, [procedures]);

  useEffect(() => {
    saveStoredNews(news);
  }, [news]);

  useEffect(() => {
    saveStoredSchedule(schedules);
  }, [schedules]);

  useEffect(() => {
    saveStoredFeedbacks(feedbacks);
  }, [feedbacks]);

  useEffect(() => {
    saveStoredTransparencyDocs(transparencyDocs);
  }, [transparencyDocs]);

  useEffect(() => {
    saveStoredTrafficReports(trafficReports);
  }, [trafficReports]);

  useEffect(() => {
    saveStoredContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    saveStoredPartyGovLeaders(partyGovLeaders);
  }, [partyGovLeaders]);

  // Mode change handler with authentication gate
  const handleViewModeChange = (mode: AppViewMode) => {
    if (mode === 'admin') {
      if (!isAdminAuthenticated) {
        setIsLoginModalOpen(true);
        return;
      }
      setViewMode('admin');
    } else {
      setViewMode('public');
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsLoginModalOpen(false);
    setViewMode('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('tanmy_admin_authenticated');
    setIsAdminAuthenticated(false);
    setViewMode('public');
  };

  // Procedure CRUD operations (Admin CMS)
  const handleAddProcedure = (newProc: Procedure) => {
    setProcedures(prev => [newProc, ...prev]);
  };

  const handleUpdateProcedure = (updatedProc: Procedure) => {
    setProcedures(prev =>
      prev.map(p => (p.id === updatedProc.id ? updatedProc : p))
    );
  };

  const handleDeleteProcedure = (id: string) => {
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const handleResetDefault = () => {
    setProcedures(DEFAULT_PROCEDURES);
    saveStoredProcedures(DEFAULT_PROCEDURES);
  };

  const handleImportProcedures = (imported: Procedure[]) => {
    setProcedures(imported);
    saveStoredProcedures(imported);
  };

  const handlePreviewInPublic = (proc: Procedure) => {
    setSelectedProcedureForGuidance(proc);
    setPortalTab('home');
    setViewMode('public');
  };

  const handleUpdateProcedureVideo = (procedureId: string, videoDataUrl: string, fileName: string) => {
    setProcedures(prev =>
      prev.map(p => (p.id === procedureId ? { ...p, videoDataUrl, videoFileName: fileName } : p))
    );
  };

  // Portal News Handlers
  const handleAddNews = (article: NewsArticle) => {
    setNews(prev => [article, ...prev]);
  };

  const handleUpdateNews = (article: NewsArticle) => {
    setNews(prev => prev.map(n => n.id === article.id ? article : n));
  };

  const handleDeleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  // Portal Schedule Handlers
  const handleAddSchedule = (item: WorkScheduleItem) => {
    setSchedules(prev => [item, ...prev]);
  };

  const handleUpdateSchedule = (item: WorkScheduleItem) => {
    setSchedules(prev => prev.map(s => s.id === item.id ? item : s));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Portal Feedback Handlers
  const handleAddFeedback = (feedback: CitizenFeedback) => {
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const handleUpdateFeedback = (updated: CitizenFeedback) => {
    setFeedbacks(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  // Transparency Handlers
  const handleAddTransparencyDoc = (doc: TransparencyItem) => {
    setTransparencyDocs(prev => [doc, ...prev]);
  };

  const handleUpdateTransparencyDoc = (doc: TransparencyItem) => {
    setTransparencyDocs(prev => prev.map(d => d.id === doc.id ? doc : d));
  };

  const handleDeleteTransparencyDoc = (id: string) => {
    setTransparencyDocs(prev => prev.filter(d => d.id !== id));
  };

  // Traffic & Flood Handlers
  const handleAddTrafficReport = (report: TrafficFloodReport) => {
    setTrafficReports(prev => [report, ...prev]);
  };

  const handleUpdateTrafficReport = (report: TrafficFloodReport) => {
    setTrafficReports(prev => prev.map(r => r.id === report.id ? report : r));
  };

  const handleDeleteTrafficReport = (id: string) => {
    setTrafficReports(prev => prev.filter(r => r.id !== id));
  };

  // Contacts Handlers
  const handleAddContact = (contact: AdministrativeContact) => {
    setContacts(prev => [contact, ...prev]);
  };

  const handleUpdateContact = (contact: AdministrativeContact) => {
    setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Party & Gov Leader Handlers
  const handleAddPartyGovLeader = (leader: PartyGovLeader) => {
    setPartyGovLeaders(prev => [leader, ...prev]);
  };

  const handleUpdatePartyGovLeader = (leader: PartyGovLeader) => {
    setPartyGovLeaders(prev => prev.map(l => l.id === leader.id ? leader : l));
  };

  const handleDeletePartyGovLeader = (id: string) => {
    setPartyGovLeaders(prev => prev.filter(l => l.id !== id));
  };

  const handleTabChange = (tab: PortalTab) => {
    if (tab !== 'home') {
      // Stop speech when navigating away from home voice assistant
      ttsManager.stop();
      voiceService.stop();
    }
    setPortalTab(tab);
  };

  const handleSelectProcedureFromRepo = (proc: Procedure) => {
    setSelectedProcedureForGuidance(proc);
    setPortalTab('home');
  };

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-size-${fontSize}`}>
      {/* Official Government App Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        proceduresCount={procedures.length}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {viewMode === 'public' ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Left Sidebar with Vertical Tabs */}
            <SidebarNav
              activeTab={portalTab}
              onTabChange={handleTabChange}
              unreadFeedbacksCount={feedbacks.length}
              newsCount={news.length}
              trafficFloodCount={trafficReports.length}
            />

            {/* Main Center Stage for the Active Tab */}
            <div className="flex-1 w-full min-w-0">
              {portalTab === 'home' && (
                <PublicView
                  procedures={procedures}
                  onUpdateProcedureVideo={handleUpdateProcedureVideo}
                  initialSelectedProcedure={selectedProcedureForGuidance}
                />
              )}

              {portalTab === 'news' && (
                <NewsSection news={news} />
              )}

              {portalTab === 'schedule' && (
                <ScheduleSection schedules={schedules} />
              )}

              {portalTab === 'party_gov' && (
                <PartyGovSection leaders={partyGovLeaders} />
              )}

              {portalTab === 'procedures' && (
                <ProceduresRepositorySection
                  procedures={procedures}
                  onSelectProcedure={handleSelectProcedureFromRepo}
                />
              )}

              {portalTab === 'transparency' && (
                <TransparencySection items={transparencyDocs} />
              )}

              {portalTab === 'traffic_flood' && (
                <TrafficFloodSection
                  reports={trafficReports}
                  onAddReport={handleAddTrafficReport}
                  onUpdateReport={handleUpdateTrafficReport}
                  onDeleteReport={handleDeleteTrafficReport}
                />
              )}

              {portalTab === 'feedback' && (
                <FeedbackSection
                  feedbacks={feedbacks}
                  onAddFeedback={handleAddFeedback}
                />
              )}

              {portalTab === 'contacts' && (
                <ContactsSection contacts={contacts} />
              )}
            </div>
          </div>
        ) : (
          <AdminCMS
            procedures={procedures}
            onAddProcedure={handleAddProcedure}
            onUpdateProcedure={handleUpdateProcedure}
            onDeleteProcedure={handleDeleteProcedure}
            onResetDefault={handleResetDefault}
            onImportProcedures={handleImportProcedures}
            onPreviewInPublic={handlePreviewInPublic}
            onUpdateProcedureVideo={handleUpdateProcedureVideo}
            news={news}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            feedbacks={feedbacks}
            onUpdateFeedback={handleUpdateFeedback}
            onDeleteFeedback={handleDeleteFeedback}
            transparencyDocs={transparencyDocs}
            onAddTransparencyDoc={handleAddTransparencyDoc}
            onUpdateTransparencyDoc={handleUpdateTransparencyDoc}
            onDeleteTransparencyDoc={handleDeleteTransparencyDoc}
            trafficReports={trafficReports}
            onAddTrafficReport={handleAddTrafficReport}
            onUpdateTrafficReport={handleUpdateTrafficReport}
            onDeleteTrafficReport={handleDeleteTrafficReport}
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
            partyGovLeaders={partyGovLeaders}
            onAddPartyGovLeader={handleAddPartyGovLeader}
            onUpdatePartyGovLeader={handleUpdatePartyGovLeader}
            onDeletePartyGovLeader={handleDeletePartyGovLeader}
          />
        )}
      </main>

      {/* Admin Login Modal for protecting officer CMS */}
      {isLoginModalOpen && (
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* 
        AI CHATBOT COMPANION (Góc dưới cùng bên phải)
        Người bạn đồng hành giải đáp thủ tục và tư vấn cuộc sống, y tế khoa học
      */}
      {viewMode === 'public' && (
        <CompanionChatbot procedures={procedures} />
      )}

      {/* Official Administrative Ward Footer - Thiết kế trang trọng, chuyên nghiệp */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 text-xs border-t-2 border-blue-600/50 py-8 px-4 sm:px-6 lg:px-8 mt-12 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-amber-300 flex items-center justify-center font-black text-xl border-2 border-amber-300 shadow-md flex-shrink-0">
              TM
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
                ỦY BAN NHÂN DÂN PHƯỜNG TÂN MỸ - THÀNH PHỐ HỒ CHÍ MINH
              </h3>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Địa chỉ: Số 7, đường Tân Phú, Phường Tân Mỹ, TP. Hồ Chí Minh</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hệ Thống Trợ Lý Số Phục Vụ Nhân Dân</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
