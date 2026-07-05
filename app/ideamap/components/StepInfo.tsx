"use client";

import { useEffect, useRef, useState } from "react";
import { AGE_GROUPS, CASABLANCA_PREFECTURES, COLORS, MAX_UPLOAD_BYTES, MOROCCAN_REGIONS, RE_EMAIL, RE_PHONE } from "../lib/constants";
import { t } from "../lib/i18n";
import { EducationLevel, Gender, Lang, OccupationStatus, PersonalInfo } from "../lib/types";
import { fileToDataUrl } from "../lib/utils";
import * as ui from "../lib/ui";

type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "ageGroup"
  | "gender"
  | "educationLevel"
  | "occupationStatus"
  | "region"
  | "prefecture";

const FIELD_LABEL_KEY: Record<FieldKey, string> = {
  firstName: "infoFirstName",
  lastName: "infoLastName",
  email: "infoEmail",
  phone: "infoPhone",
  ageGroup: "infoAgeGroup",
  gender: "infoGender",
  educationLevel: "infoEducationLevel",
  occupationStatus: "infoOccupationStatus",
  region: "infoRegion",
  prefecture: "infoPrefecture",
};

const GENDER_OPTIONS: { value: Gender; key: string }[] = [
  { value: "male", key: "infoGenderMale" },
  { value: "female", key: "infoGenderFemale" },
  { value: "other", key: "infoGenderOther" },
];

const EDUCATION_OPTIONS: { value: EducationLevel; key: string }[] = [
  { value: "college", key: "infoEduCollege" },
  { value: "bac", key: "infoEduBac" },
  { value: "bac2", key: "infoEduBac2" },
  { value: "bac3", key: "infoEduBac3" },
  { value: "bac5", key: "infoEduBac5" },
  { value: "doctorat", key: "infoEduDoctorat" },
];

const OCCUPATION_OPTIONS: { value: OccupationStatus; key: string }[] = [
  { value: "student", key: "infoOccStudent" },
  { value: "jobseeker", key: "infoOccJobseeker" },
  { value: "employed", key: "infoOccEmployed" },
  { value: "selfemployed", key: "infoOccSelfemployed" },
];

export default function StepInfo({
  lang,
  cin,
  info,
  onSubmit,
}: {
  lang: Lang;
  cin: string;
  info: PersonalInfo;
  onSubmit: (info: PersonalInfo) => void;
}) {
  const tr = (k: string) => t(lang, k);
  const [form, setForm] = useState<PersonalInfo>(info);
  const [touched, setTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const prefectureRef = useRef<HTMLDivElement>(null);

  const needsPrefecture = form.region === "Casablanca-Settat";

  useEffect(() => {
    if (needsPrefecture) prefectureRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [needsPrefecture]);

  const fieldErrors: Partial<Record<FieldKey, string>> = {};
  if (!form.firstName.trim()) fieldErrors.firstName = tr("infoRequiredField");
  if (!form.lastName.trim()) fieldErrors.lastName = tr("infoRequiredField");
  if (!form.email.trim()) fieldErrors.email = tr("infoRequiredField");
  else if (!RE_EMAIL.test(form.email.trim())) fieldErrors.email = tr("infoEmailInvalid");
  if (!form.phone.trim()) fieldErrors.phone = tr("infoRequiredField");
  else if (!RE_PHONE.test(form.phone.trim())) fieldErrors.phone = tr("infoPhoneInvalid");
  if (!form.ageGroup) fieldErrors.ageGroup = tr("infoRequiredField");
  if (!form.gender) fieldErrors.gender = tr("infoRequiredField");
  if (!form.educationLevel) fieldErrors.educationLevel = tr("infoRequiredField");
  if (!form.occupationStatus) fieldErrors.occupationStatus = tr("infoRequiredField");
  if (!form.region) fieldErrors.region = tr("infoRequiredField");
  if (needsPrefecture && !form.prefecture) fieldErrors.prefecture = tr("infoRequiredField");

  const missingKeys = Object.keys(fieldErrors) as FieldKey[];
  const isComplete = missingKeys.length === 0;

  const totalFields = needsPrefecture ? 10 : 9;
  const filledFields = [
    form.firstName.trim(),
    form.lastName.trim(),
    RE_EMAIL.test(form.email.trim()) ? "1" : "",
    RE_PHONE.test(form.phone.trim()) ? "1" : "",
    form.ageGroup,
    form.gender,
    form.educationLevel,
    form.occupationStatus,
    form.region,
    ...(needsPrefecture ? [form.prefecture || ""] : []),
  ].filter(Boolean).length;
  const progressPct = Math.round((filledFields / totalFields) * 100);

  function update(patch: Partial<PersonalInfo>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setTouched(true);
    if (!isComplete) return;
    onSubmit(form);
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setPhotoError(tr("documentsTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      update({ photoDataUrl: dataUrl });
      setPhotoError(null);
    } catch {
      setPhotoError(tr("documentsUploadError"));
    } finally {
      setUploading(false);
    }
  }

  function fieldStyle(key: FieldKey): React.CSSProperties {
    if (!touched) return ui.input;
    return { ...ui.input, borderColor: fieldErrors[key] ? COLORS.red : COLORS.green };
  }

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          background: COLORS.background,
          padding: "4px 0 16px",
          marginBottom: 16,
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: "monospace", color: COLORS.primaryDark, fontWeight: 700 }}>{cin}</div>
            <h1 style={{ ...ui.h1, fontSize: 24, margin: "4px 0 0" }}>{tr("infoTitle")}</h1>
          </div>
          <button
            onClick={handleSubmit}
            style={{
              ...ui.btnPrimary,
              ...(isComplete ? {} : { background: COLORS.surfaceContainer, color: COLORS.onSurfaceVariant, cursor: "default" }),
            }}
          >
            {tr("next")} →
          </button>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: COLORS.primary, transition: "width .3s" }} />
        </div>
        <div style={{ fontSize: 11, color: COLORS.onSurfaceVariant, marginTop: 6 }}>
          {tr("infoProgress")} · {progressPct}%
        </div>
        {touched && !isComplete && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: COLORS.redContainer, borderRadius: 8, fontSize: 12.5, color: "#7a1c14" }}>
            {tr("infoErrorBanner")} {missingKeys.map((k) => tr(FIELD_LABEL_KEY[k])).join(", ")}
          </div>
        )}
      </div>

      <p style={{ ...ui.subtitle, marginBottom: 24 }}>{tr("infoSubtitle")}</p>

      <div style={{ ...ui.card, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <div>
          <label style={ui.label}>{tr("infoFirstName")}</label>
          <input
            style={fieldStyle("firstName")}
            value={form.firstName}
            placeholder={tr("infoFirstNamePlaceholder")}
            onChange={(e) => update({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label style={ui.label}>{tr("infoLastName")}</label>
          <input
            style={fieldStyle("lastName")}
            value={form.lastName}
            placeholder={tr("infoLastNamePlaceholder")}
            onChange={(e) => update({ lastName: e.target.value })}
          />
        </div>
        <div>
          <label style={ui.label}>{tr("infoEmail")}</label>
          <input
            style={fieldStyle("email")}
            value={form.email}
            placeholder={tr("infoEmailPlaceholder")}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>
        <div>
          <label style={ui.label}>{tr("infoPhone")}</label>
          <input
            style={fieldStyle("phone")}
            value={form.phone}
            placeholder={tr("infoPhonePlaceholder")}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
        <div>
          <label style={ui.label}>{tr("infoAgeGroup")}</label>
          <select style={fieldStyle("ageGroup")} value={form.ageGroup} onChange={(e) => update({ ageGroup: e.target.value })}>
            <option value="">{tr("infoSelectPlaceholder")}</option>
            {AGE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={ui.label}>{tr("infoGender")}</label>
          <select style={fieldStyle("gender")} value={form.gender} onChange={(e) => update({ gender: e.target.value as Gender })}>
            <option value="">{tr("infoSelectPlaceholder")}</option>
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {tr(o.key)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={ui.label}>{tr("infoEducationLevel")}</label>
          <select
            style={fieldStyle("educationLevel")}
            value={form.educationLevel}
            onChange={(e) => update({ educationLevel: e.target.value as EducationLevel })}
          >
            <option value="">{tr("infoSelectPlaceholder")}</option>
            {EDUCATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {tr(o.key)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={ui.label}>{tr("infoOccupationStatus")}</label>
          <select
            style={fieldStyle("occupationStatus")}
            value={form.occupationStatus}
            onChange={(e) => update({ occupationStatus: e.target.value as OccupationStatus })}
          >
            <option value="">{tr("infoSelectPlaceholder")}</option>
            {OCCUPATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {tr(o.key)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={ui.label}>{tr("infoRegion")}</label>
          <select
            style={fieldStyle("region")}
            value={form.region}
            onChange={(e) =>
              update({ region: e.target.value, prefecture: e.target.value === "Casablanca-Settat" ? form.prefecture : "" })
            }
          >
            <option value="">{tr("infoSelectPlaceholder")}</option>
            {MOROCCAN_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {needsPrefecture && (
          <div ref={prefectureRef}>
            <label style={ui.label}>{tr("infoPrefecture")}</label>
            <select style={fieldStyle("prefecture")} value={form.prefecture || ""} onChange={(e) => update({ prefecture: e.target.value })}>
              <option value="">{tr("infoSelectPlaceholder")}</option>
              {CASABLANCA_PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label style={ui.label}>{tr("infoPhoto")}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {form.photoDataUrl && (
              <img
                src={form.photoDataUrl}
                alt=""
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `1px solid ${COLORS.border}` }}
              />
            )}
            <label htmlFor="info-photo" style={{ ...ui.btnSecondary, cursor: "pointer", padding: "9px 16px", fontSize: 12.5 }}>
              {uploading ? tr("loading") : tr("infoPhotoUpload")}
            </label>
            <input id="info-photo" type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
          </div>
          {photoError && <p style={{ fontSize: 11.5, color: COLORS.red, marginTop: 6 }}>{photoError}</p>}
        </div>
      </div>
    </div>
  );
}
