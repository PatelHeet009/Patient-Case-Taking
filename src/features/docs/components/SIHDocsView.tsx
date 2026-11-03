import { useState } from 'react';
import {
  BookOpen,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Database,
  Printer,
} from 'lucide-react';
import { SIH_DOCUMENTS } from '../../../data/sihDocContent';

interface SIHDocsViewProps {
  onStartDemoTour: () => void;
}

export default function SIHDocsView({ onStartDemoTour }: SIHDocsViewProps) {
  const [activeDocId, setActiveDocId] = useState<string>('prd');

  const activeDoc = SIH_DOCUMENTS.find((d) => d.id === activeDocId) || SIH_DOCUMENTS[0];

  const definitionOfDone = [
    { title: '1. UI exists', desc: 'Clean healthcare light theme, dashboard, forms, and tables' },
    { title: '2. API works', desc: 'REST-compliant data flow for auth, patients, and cases' },
    { title: '3. Database operation works', desc: 'Structured schema with users, patients, and cases foreign keys' },
    { title: '4. Error case is handled', desc: 'Validation for required fields, clear error banners' },
    { title: '5. Team can explain the feature', desc: 'Documented architecture and transparent data models' },
    { title: '6. Tested manually', desc: '10-point test flow verified from login to history view' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <span>SIH26047 • 6 Official Planning Files</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Patient Case-Taking Software — Documentation
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Complete project documentation suite prepared for hackathon judges and evaluation panels.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={onStartDemoTour}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Judge Live Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for the 6 files */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {SIH_DOCUMENTS.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveDocId(doc.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
              activeDocId === doc.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{doc.filename}</span>
          </button>
        ))}
      </div>

      {/* Active Document Viewer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {activeDoc.filename}
            </span>
            <span className="text-xs text-slate-400">SIH Hackathon Specification</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">{activeDoc.title}</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Purpose: {activeDoc.purpose}</p>
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            {activeDoc.summary}
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {activeDoc.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{sec.heading}</span>
              </h3>
              <ul className="space-y-1.5 pl-4">
                {sec.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-slate-700 flex items-start space-x-2">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Definition of Done & Success Criteria Card */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Hackathon Definition of Done Checklist (Rules.md Section 14)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {definitionOfDone.map((item, idx) => (
            <div key={idx} className="bg-white/80 p-3 rounded-xl border border-blue-100 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                <span className="text-[11px] text-slate-600">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
