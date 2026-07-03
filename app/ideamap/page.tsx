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
  parseJSON,
} from "./lib/ai";
import { STEP_ORDER } from "./lib/constants";
import { t } from "./lib/i18n";
import { BusinessPlan, Budget, ChatMessage, ComplianceReport, HolderState, Lang, ProjectProfile, StepId } from "./lib/types";
import { loadHolder, newHolderState, saveHolder } from "./lib/storage";
import { COLORS } from "./lib/constants";

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
      const text = await ai(buildDialogueMessages(idea, msgsSoFar), dialogueSystemPrompt(lang, idea, callNumber));
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
        businessPlanSystemPrompt(lang)
      );
      const plan = parseJSON<BusinessPlan>(planText);
      const budgetText = await ai(
        [{ role: "user", content: JSON.stringify(proj) }],
        budgetSystemPrompt(lang)
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
        complianceSystemPrompt(lang)
      );
      const comp = parseJSON<ComplianceReport>(text);
      updateHolder({ comp });
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
        <StepBudget lang={lang} budget={holder.budget} onContinue={() => updateHolder({ step: "compliance" })} />
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
          onToggle={(id) => updateHolder({ docs: { ...holder.docs, [id]: !holder.docs[id] } })}
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
