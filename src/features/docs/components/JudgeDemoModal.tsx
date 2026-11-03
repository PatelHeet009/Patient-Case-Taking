import {
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserCheck,
  UserPlus,
  Search,
  FolderOpen,
  FilePlus2,
  History,
  ShieldAlert,
  Brain,
  ClipboardCheck,
  Stethoscope,
  Database,
} from 'lucide-react';

import { Patient } from '../../../types';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep: (stepNumber: number) => void;
  patients: Patient[];
}

export default function JudgeDemoModal({
  isOpen,
  onClose,
  onNavigateToStep,
  patients,
}: JudgeDemoModalProps) {
  if (!isOpen) return null;

  /*
   * Main workflow
   *
   * 1. Login
   * 2. Register Patient
   * 3. Search Patient
   * 4. Open Patient Profile
   * 5. AI-Assisted Case Taking
   * 6. Review & Case History
   */

  const steps = [
    {
      num: 1,
      title: 'Role Authentication & Login',
      requirement: 'FR-01',
      desc: 'Securely authenticate doctors, staff, and administrators using username and password with session protection and logout.',
      actionLabel: 'Test Login',
      icon: UserCheck,
      color: 'blue',
      features: [
        'Role-based access',
        'Secure login',
        'Session protection',
      ],
    },
    {
      num: 2,
      title: 'Register New Patient',
      requirement: 'FR-02',
      desc: 'Create a structured patient profile with demographic information, emergency contact details, validation, and an auto-generated Patient ID.',
      actionLabel: 'Register Patient',
      icon: UserPlus,
      color: 'indigo',
      features: [
        'Auto Patient ID',
        'Form validation',
        'Emergency contact',
      ],
    },
    {
      num: 3,
      title: 'Search & Filter Patient Directory',
      requirement: 'FR-03',
      desc: 'Quickly find patients using Patient ID, name, or mobile number with real-time search and filtering.',
      actionLabel: 'Open Directory',
      icon: Search,
      color: 'violet',
      features: [
        'Real-time search',
        'Patient ID search',
        'Mobile search',
      ],
    },
    {
      num: 4,
      title: 'Open Patient Profile',
      requirement: 'FR-04',
      desc: 'View patient demographics, emergency contacts, previous encounters, and existing clinical records before starting a new case.',
      actionLabel: 'View Patient',
      icon: FolderOpen,
      color: 'cyan',
      features: [
        'Patient overview',
        'Emergency details',
        'Previous encounters',
      ],
    },
    {
      num: 5,
      title: 'AI-Assisted Case Taking',
      requirement: 'FR-05',
      desc: 'Capture structured clinical information while AI assists with organization, completeness checking, and preparation of a case summary.',
      actionLabel: 'Start Case Taking',
      icon: FilePlus2,
      color: 'emerald',
      features: [
        'AI case assistance',
        'Missing information check',
        'Structured case summary',
      ],
      ai: true,
    },
    {
      num: 6,
      title: 'Review Case History',
      requirement: 'FR-06',
      desc: 'Review the chronological clinical timeline, verify the AI-assisted summary, and access complete saved case records.',
      actionLabel: 'View Case History',
      icon: History,
      color: 'amber',
      features: [
        'Chronological timeline',
        'Doctor review',
        'Printable summary',
      ],
    },
  ];

  const colorClasses: Record<
    string,
    {
      icon: string;
      badge: string;
      hover: string;
      number: string;
    }
  > = {
    blue: {
      icon: 'bg-blue-100 text-blue-700',
      badge: 'bg-blue-50 text-blue-700 border-blue-100',
      hover: 'hover:border-blue-300 hover:bg-blue-50/40',
      number: 'bg-blue-600',
    },
    indigo: {
      icon: 'bg-indigo-100 text-indigo-700',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      hover: 'hover:border-indigo-300 hover:bg-indigo-50/40',
      number: 'bg-indigo-600',
    },
    violet: {
      icon: 'bg-violet-100 text-violet-700',
      badge: 'bg-violet-50 text-violet-700 border-violet-100',
      hover: 'hover:border-violet-300 hover:bg-violet-50/40',
      number: 'bg-violet-600',
    },
    cyan: {
      icon: 'bg-cyan-100 text-cyan-700',
      badge: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      hover: 'hover:border-cyan-300 hover:bg-cyan-50/40',
      number: 'bg-cyan-600',
    },
    emerald: {
      icon: 'bg-emerald-100 text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      hover: 'hover:border-emerald-300 hover:bg-emerald-50/40',
      number: 'bg-emerald-600',
    },
    amber: {
      icon: 'bg-amber-100 text-amber-700',
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
      hover: 'hover:border-amber-300 hover:bg-amber-50/40',
      number: 'bg-amber-600',
    },
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
        bg-slate-950/60
        backdrop-blur-sm
        animate-fadeIn
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="judge-demo-title"
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-hidden
          border border-slate-200
          flex flex-col
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="bg-slate-950 text-white px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-blue-600
                  flex items-center justify-center
                  shadow-lg shadow-blue-600/20
                  flex-shrink-0
                "
              >
                <Sparkles className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="judge-demo-title"
                    className="text-base font-bold tracking-tight"
                  >
                    AI-Assisted Patient Case Taking
                  </h2>

                 
                </div>

                <p className="text-[12px] text-slate-300 mt-1">
                  Login → Patient → Case → AI Assistance → Review → History
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close walkthrough"
              className="
                text-slate-400
                hover:text-white
                hover:bg-white/10
                p-2
                rounded-lg
                transition
                flex-shrink-0
              "
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Workflow Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                Clinical Workflow
              </span>

              <span className="text-[11px] text-slate-400">
                6 Steps
              </span>
            </div>

            <div className="flex items-center gap-1">
              {steps.map((step, index) => (
                <div
                  key={step.num}
                  className="flex items-center flex-1"
                >
                  <div
                    className={`
                      h-1.5
                      rounded-full
                      flex-1
                      ${
                        step.ai
                          ? 'bg-emerald-500'
                          : 'bg-slate-700'
                      }
                    `}
                  />

                  {index !== steps.length - 1 && (
                    <div className="w-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            BODY
        ====================================================== */}
        <div className="overflow-y-auto flex-1">
          <div className="p-5 sm:p-6 space-y-5">

            {/* Intro */}
            <div
              className="
                rounded-xl
                border border-blue-100
                bg-gradient-to-r from-blue-50 to-indigo-50
                p-4
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    w-9 h-9
                    rounded-lg
                    bg-white
                    border border-blue-100
                    flex items-center justify-center
                    text-blue-600
                    flex-shrink-0
                  "
                >
                  <Brain className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    How the AI-assisted workflow works
                  </h3>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    The system helps clinicians collect structured case
                    information, identify potentially missing fields, and
                    prepare a concise case summary for clinician review.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                STEP CARDS
            ================================================== */}
            <div className="space-y-3">
              {steps.map((step) => {
                const Icon = step.icon;
                const colors = colorClasses[step.color];

                return (
                  <div
                    key={step.num}
                    className={`
                      relative
                      rounded-xl
                      border border-slate-200
                      p-4
                      transition-all
                      duration-200
                      group
                      ${colors.hover}
                    `}
                  >
                    {/* AI Badge */}
                    {step.ai && (
                      <div
                        className="
                          absolute
                          -top-2
                          right-4
                          inline-flex items-center gap-1
                          px-2.5 py-1
                          rounded-full
                          bg-emerald-600
                          text-white
                          text-[9px]
                          font-bold
                          shadow-sm
                        "
                      >
                        <Sparkles className="w-3 h-3" />
                        AI POWERED
                      </div>
                    )}

                    <div className="flex items-start gap-3">

                      {/* Step Number */}
                      <div
                        className={`
                          w-9 h-9
                          rounded-lg
                          ${colors.number}
                          text-white
                          flex items-center justify-center
                          flex-shrink-0
                          font-bold
                          text-xs
                          shadow-sm
                        `}
                      >
                        {step.num}
                      </div>

                      {/* Icon */}
                      <div
                        className={`
                          w-9 h-9
                          rounded-lg
                          ${colors.icon}
                          flex items-center justify-center
                          flex-shrink-0
                        `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className="
                              text-xs
                              font-bold
                              text-slate-900
                              group-hover:text-blue-700
                              transition-colors
                            "
                          >
                            {step.title}
                          </h4>

                          <span
                            className={`
                              px-1.5 py-0.5
                              rounded
                              border
                              text-[8px]
                              font-bold
                              ${colors.badge}
                            `}
                          >
                            {step.requirement}
                          </span>
                        </div>

                        <p
                          className="
                            text-[11px]
                            text-slate-500
                            mt-1
                            leading-relaxed
                          "
                        >
                          {step.desc}
                        </p>

                        {/* Feature Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {step.features.map((feature) => (
                            <span
                              key={feature}
                              className="
                                inline-flex
                                items-center
                                gap-1
                                px-2
                                py-1
                                rounded-md
                                bg-slate-50
                                border border-slate-100
                                text-[9px]
                                font-medium
                                text-slate-600
                              "
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Special AI Information */}
                        {step.ai && (
                          <div
                            className="
                              mt-3
                              rounded-lg
                              border border-emerald-100
                              bg-emerald-50/70
                              p-3
                            "
                          >
                            <div className="flex items-start gap-2">
                              <Sparkles
                                className="
                                  w-3.5 h-3.5
                                  text-emerald-600
                                  mt-0.5
                                  flex-shrink-0
                                "
                              />

                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-emerald-800">
                                  AI Assistance
                                </p>

                                <p className="text-[9px] text-emerald-700 leading-relaxed">
                                  AI can organize clinician-entered information,
                                  highlight incomplete sections, and generate
                                  a draft case summary for review.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => {
                          onNavigateToStep(step.num);
                          onClose();
                        }}
                        className="
                          flex-shrink-0
                          inline-flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-lg
                          bg-slate-100
                          hover:bg-blue-600
                          hover:text-white
                          text-slate-700
                          text-[10px]
                          font-semibold
                          transition-all
                          group/button
                        "
                      >
                        <span className="hidden sm:inline">
                          {step.actionLabel}
                        </span>

                        <ArrowRight
                          className="
                            w-3 h-3
                            transition-transform
                            group-hover/button:translate-x-0.5
                          "
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =================================================
                AI CAPABILITIES
            ================================================== */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="
                    w-7 h-7
                    rounded-lg
                    bg-slate-100
                    flex items-center justify-center
                    text-slate-700
                  "
                >
                  <Brain className="w-3.5 h-3.5" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    AI Capabilities
                  </h3>

                  <p className="text-[9px] text-slate-500">
                    Assistance built into the case-taking workflow
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                {/* AI 1 */}
                <div
                  className="
                    p-3
                    rounded-xl
                    border border-slate-200
                    bg-white
                  "
                >
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      flex items-center justify-center
                      mb-2
                    "
                  >
                    <Stethoscope className="w-4 h-4" />
                  </div>

                  <h4 className="text-[10px] font-bold text-slate-900">
                    Guided Case Taking
                  </h4>

                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                    Helps organize information into structured clinical
                    sections.
                  </p>
                </div>

                {/* AI 2 */}
                <div
                  className="
                    p-3
                    rounded-xl
                    border border-slate-200
                    bg-white
                  "
                >
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-amber-50
                      text-amber-600
                      flex items-center justify-center
                      mb-2
                    "
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </div>

                  <h4 className="text-[10px] font-bold text-slate-900">
                    Missing Information
                  </h4>

                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                    Highlights incomplete case sections before the record is
                    finalized.
                  </p>
                </div>

                {/* AI 3 */}
                <div
                  className="
                    p-3
                    rounded-xl
                    border border-slate-200
                    bg-white
                  "
                >
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      bg-emerald-50
                      text-emerald-600
                      flex items-center justify-center
                      mb-2
                    "
                  >
                    <ClipboardCheck className="w-4 h-4" />
                  </div>

                  <h4 className="text-[10px] font-bold text-slate-900">
                    Case Summary
                  </h4>

                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                    Creates a draft summary that the clinician can review and
                    confirm.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                IMPORTANT AI NOTICE
            ================================================== */}
            <div
              className="
                flex items-start gap-2.5
                p-3
                rounded-lg
                border border-blue-100
                bg-blue-50
              "
            >
              <ShieldAlert
                className="
                  w-4 h-4
                  text-blue-600
                  mt-0.5
                  flex-shrink-0
                "
              />

              <p
                className="
                  text-[9px]
                  text-blue-800
                  leading-relaxed
                "
              >
                <strong>AI assistance notice:</strong> AI-generated
                organization and summaries are intended to assist the
                clinician. The clinician should review and confirm information
                before saving the final clinical record.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div
          className="
            px-5 sm:px-6
            py-3.5
            bg-slate-50
            border-t border-slate-200
            flex items-center
            justify-between
            gap-3
            flex-shrink-0
          "
        >
          <div className="hidden sm:block">
            <p className="text-[14px] text-slate-400">
              Patient Case Taking System
            </p>

            <p className="text-[11px] text-slate-500 mt-0.5">
              AI-assisted clinical documentation workflow
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              ml-auto
              px-4
              py-2
              rounded-lg
              bg-slate-900
              hover:bg-slate-800
              text-white
              text-[10px]
              font-semibold
              transition
              shadow-sm
            "
          >
            Close Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}