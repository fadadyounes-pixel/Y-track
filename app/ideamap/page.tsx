"use client";

import { useEffect, useState } from "react";
import AuthGate, { AuthResult } from "./components/AuthGate";
import Shell from "./components/Shell";
import StepIdea from "./components/StepIdea";
import StepDialogue from "./components/StepDialogue";
import StepProfile from "./components/StepProfile";
import StepPlan from "./components/StepPlan";
import StepBudget from "./components/StepBudget";
import StepCompliance from "./components/StepCompliance";
import StepDocuments from "./components/StepDocuments";
import StepExport from "./components/StepExport";
import CoordinatorDashboard from "./components/CoordinatorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import {
  ai,
  budgetSystemPrompt,
  businessPlanSystemPrompt,
  complianceSystemPrompt,
  dialogueSystemPrompt,
  logoConceptSystemPrompt,
  parseJSON,
} from "./lib/ai";
import { MAX_UPLOAD_BYTES, STEP_ORDER } from "./lib/constants";
import { t } from "./lib/i18n";
import {
  BusinessPlan,
  Budget,
  ChatMessage,
  ComplianceReport,
  HolderState,
  Lang,
  LogoConcept,
  ProjectProfile,
  StepId,
} from "./lib/types";
import { loadHolder, newHolderState, saveHolder } from "./lib/storage";
import { fileToDataUrl } from "./lib/utils";
import { COLORS } from "./lib/constants";
import StepLogo from "./components/StepLogo";

function LoadingCard({ lang }: { lang: Lang }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 240,
        color: COLORS.onSurfaceVariant,
        fontSize: 14,
        fontStyle: "italic",
      }}
    >
      {t(lang, "loading")}
    </div>
  );
}

export default function IdeaMapPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [auth, setAuth] = useState<AuthResult | null>(null);
  const [holder, setHolder] = useState<HolderState | null>(null);
  const [busy, setBusy] = useState(false);

  function updateHolder(patch: Partial<HolderState>) {
    setHolder((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveHolder(next);
      return next;
    });
  }

  function handleAuth(result: AuthResult) {
    setAuth(result);
    if (result.role === "holder" && result.cin) {
      const existing = loadHolder(result.cin);
      setHolder(existing ?? newHolderState(result.cin, ""));
    }
  }

  function handleLogout() {
    setAuth(null);
    setHolder(null);
  }

  // --- Dialogue orchestration ---
  function buildDialogueMessages(idea: string, msgs: ChatMessage[]) {
    return [{ role: "user" as const, content: idea }, ...msgs.map((m) => ({ role: m.role, content: m.content }))];
  }

  async function runDialogueCall(idea: string, msgsSoFar: ChatMessage[], callNumber: number) {
    setBusy(true);
    try {
      const text = await ai(
        buildDialogueMessages(idea, msgsSoFar),
        dialogueSystemPrompt(lang, idea, callNumber),
        callNumber < 5 ? 200 : 1200,
        callNumber < 5 ? "chat" : "json"
      );
      if (callNumber < 5) {
        updateHolder({ msgs: [...msgsSoFar, { role: "assistant", content: text }], qN: callNumber });
      } else {
        const proj = parseJSON<ProjectProfile>(text);
        updateHolder({ proj, step: "profile", qN: 5 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function generatePlanAndBudget(proj: ProjectProfile) {
    setBusy(true);
    try {
      const planText = await ai(
        [{ role: "user", content: JSON.stringify(proj) }],
        businessPlanSystemPrompt(lang),
        2200,
        "json"
      );
      const plan = parseJSON<BusinessPlan>(planText);
      const budgetText = await ai(
        [{ role: "user", content: JSON.stringify(proj) }],
        budgetSystemPrompt(lang),
        1500,
        "json"
      );
      const budget = parseJSON<Budget>(budgetText);
      updateHolder({ plan, budget });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function generateCompliance(proj: ProjectProfile, plan: BusinessPlan, budget: Budget) {
    setBusy(true);
    try {
      const text = await ai(
        [{ role: "user", content: JSON.stringify({ proj, plan, budget }) }],
        complianceSystemPrompt(lang),
        1500,
        "json"
      );
      const comp = parseJSON<ComplianceReport>(text);
      updateHolder({ comp });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  async function generateLogo(proj: ProjectProfile, plan: BusinessPlan | null, budget: Budget | null) {
    setBusy(true);
    try {
      // Plan + budget are already known by this point in the workflow, so the
      // advisor grounds the logo concept in the real business model and
      // numbers, not just the raw idea.
      const context = { proj, plan, budget };
      const text = await ai([{ role: "user", content: JSON.stringify(context) }], logoConceptSystemPrompt(lang), 300, "json");
      const concept = parseJSON<LogoConcept>(text);
      updateHolder({ logo: { source: "generated", concept } });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  // Fire AI calls automatically when entering a step that needs them.
  useEffect(() => {
    if (!holder || busy) return;
    if (holder.step === "dialogue" && holder.msgs.length === 0 && holder.qN === 0) {
      runDialogueCall(holder.idea, [], 1);
    } else if (holder.step === "plan" && !holder.plan && holder.proj) {
      generatePlanAndBudget(holder.proj);
    } else if (holder.step === "compliance" && !holder.comp && holder.proj && holder.plan && holder.budget) {
      generateCompliance(holder.proj, holder.plan, holder.budget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holder?.step, holder?.msgs.length, holder?.plan, holder?.comp, busy]);

  if (!auth) {
    return <AuthGate lang={lang} setLang={setLang} onAuth={handleAuth} />;
  }

  if (auth.role === "coordinator" && auth.coordCode) {
    return <CoordinatorDashboard lang={lang} setLang={setLang} coordCode={auth.coordCode} onLogout={handleLogout} />;
  }

  if (auth.role === "admin") {
    return <AdminDashboard lang={lang} setLang={setLang} onLogout={handleLogout} />;
  }

  if (!holder) return null;

  const stepTitleKey: Record<StepId, string> = {
    idea: "navIdea",
    dialogue: "navDialogue",
    profile: "navProfile",
    plan: "navPlan",
    budget: "navBudget",
    logo: "navLogo",
    compliance: "navCompliance",
    documents: "navDocuments",
    export: "navExport",
  };

  return (
    <Shell
      lang={lang}
      setLang={setLang}
      step={holder.step}
      furthestStepIndex={STEP_ORDER.indexOf(holder.step)}
      onStepClick={(s) => updateHolder({ step: s })}
      onLogout={handleLogout}
      title={t(lang, stepTitleKey[holder.step])}
    >
      {holder.step === "idea" && (
        <StepIdea
          lang={lang}
          initialIdea={holder.idea}
          onSubmit={(idea) => updateHolder({ idea, step: "dialogue", msgs: [], qN: 0 })}
        />
      )}

      {holder.step === "dialogue" && (
        <StepDialogue
          lang={lang}
          msgs={holder.msgs}
          qN={holder.qN}
          busy={busy}
          onSend={(answer) => {
            const updatedMsgs: ChatMessage[] = [...holder.msgs, { role: "user", content: answer }];
            updateHolder({ msgs: updatedMsgs });
            runDialogueCall(holder.idea, updatedMsgs, holder.qN + 1);
          }}
        />
      )}

      {holder.step === "profile" && holder.proj && (
        <StepProfile lang={lang} proj={holder.proj} busy={busy} onConfirm={() => updateHolder({ step: "plan" })} />
      )}

      {holder.step === "plan" && (holder.plan ? (
        <StepPlan lang={lang} plan={holder.plan} onContinue={() => updateHolder({ step: "budget" })} />
      ) : (
        <LoadingCard lang={lang} />
      ))}

      {holder.step === "budget" && holder.budget && (
        <StepBudget lang={lang} budget={holder.budget} onContinue={() => updateHolder({ step: "logo" })} />
      )}

      {holder.step === "logo" && (
        <StepLogo
          lang={lang}
          logo={holder.logo}
          proj={holder.proj}
          plan={holder.plan}
          budget={holder.budget}
          holderLabel={holder.name || holder.cin}
          busy={busy}
          onGenerate={() => holder.proj && generateLogo(holder.proj, holder.plan, holder.budget)}
          onUpload={async (file) => {
            if (file.size > MAX_UPLOAD_BYTES) return t(lang, "documentsTooLarge");
            try {
              const dataUrl = await fileToDataUrl(file);
              updateHolder({ logo: { source: "uploaded", imageDataUrl: dataUrl } });
              return null;
            } catch {
              return t(lang, "documentsUploadError");
            }
          }}
          onRemove={() => updateHolder({ logo: null })}
          onContinue={() => updateHolder({ step: "compliance" })}
        />
      )}

      {holder.step === "compliance" && (holder.comp ? (
        <StepCompliance lang={lang} comp={holder.comp} onContinue={() => updateHolder({ step: "documents" })} />
      ) : (
        <LoadingCard lang={lang} />
      ))}

      {holder.step === "documents" && (
        <StepDocuments
          lang={lang}
          docs={holder.docs}
          uploads={holder.uploads}
          onToggle={(id) => updateHolder({ docs: { ...holder.docs, [id]: !holder.docs[id] } })}
          onUpload={async (id, file) => {
            if (file.size > MAX_UPLOAD_BYTES) return t(lang, "documentsTooLarge");
            try {
              const dataUrl = await fileToDataUrl(file);
              updateHolder({
                uploads: {
                  ...holder.uploads,
                  [id]: { fileName: file.name, fileType: file.type, dataUrl, uploadedAt: new Date().toISOString() },
                },
                docs: { ...holder.docs, [id]: true },
              });
              return null;
            } catch {
              return t(lang, "documentsUploadError");
            }
          }}
          onRemoveUpload={(id) => {
            const nextUploads = { ...holder.uploads };
            delete nextUploads[id];
            updateHolder({ uploads: nextUploads });
          }}
          onContinue={() => updateHolder({ step: "export" })}
        />
      )}

      {holder.step === "export" && (
        <StepExport
          lang={lang}
          state={holder}
          onRestart={() => updateHolder(newHolderState(holder.cin, holder.name, holder.coordinatorCode))}
        />
      )}
    </Shell>
  );
}
