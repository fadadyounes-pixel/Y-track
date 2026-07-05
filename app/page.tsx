import Link from "next/link";

// Aligned with the IdeaMap brand mark (navy / white / blue / gold).
const colors = {
  dark: "#0A0F2C",
  darkGray: "#141B45",
  primary: "#2B5CFF",
  cyan: "#2B5CFF",
  gold: "#E8B84B",
  gray: "#94A3B8",
  light: "#F8FAFC",
  white: "#FFFFFF",
  ideamapTeal: "#2B5CFF",
};

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: colors.light, color: colors.darkGray }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          background: colors.dark,
          color: colors.white,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>Y-TRACK</span>
        </div>
        <nav style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500, color: colors.gray }}>
          <a href="#programs" style={{ color: "inherit", textDecoration: "none" }}>
            Programmes
          </a>
          <a href="#ideamap" style={{ color: "inherit", textDecoration: "none" }}>
            IdeaMap
          </a>
          <Link href="/ideamap" style={{ color: colors.white, textDecoration: "none", fontWeight: 700 }}>
            Se connecter →
          </Link>
        </nav>
      </header>

      <section
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darkGray} 100%)`,
          color: colors.white,
          padding: "96px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.cyan,
              marginBottom: 16,
            }}
          >
            Youth Tracking, Reporting &amp; Knowledge System
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, margin: "0 0 20px" }}>
            Un seul portail pour suivre, financer et faire grandir
            <br />
            les initiatives citoyennes.
          </h1>
          <p style={{ fontSize: 16, color: colors.gray, lineHeight: 1.6, margin: "0 auto 36px", maxWidth: 560 }}>
            Y-TRACK relie porteurs de projets, coordinateurs et administrateurs autour d&apos;un
            même parcours : de l&apos;idée au dossier de financement INDH prêt à déposer.
          </p>
          <Link
            href="/ideamap"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: colors.ideamapTeal,
              color: "white",
              padding: "14px 28px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Ouvrir IdeaMap
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section style={{ padding: "64px 40px", background: colors.dark, color: colors.white }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.cyan,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            L&apos;INDH à grande échelle
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 24,
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            {[
              ["18 milliards MAD", "Enveloppe de la Phase 3 (2019–2023+)"],
              ["62 000+", "Projets financés à ce jour"],
              ["12 millions", "Bénéficiaires directs"],
              ["100 000 MAD", "Financement max. par projet"],
            ].map(([value, label]) => (
              <div key={label}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 12.5, color: colors.gray, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.cyan,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Le défi que résout IdeaMap
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 1,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div style={{ background: colors.darkGray, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: colors.gray, textTransform: "uppercase", marginBottom: 16 }}>
                Sans accompagnement
              </div>
              {[
                ["< 30 %", "des dossiers soumis sont complets"],
                ["6–8 semaines", "de préparation en moyenne"],
                ["3 langues", "une barrière pour de nombreux porteurs"],
              ].map(([value, label]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#F87171" }}>{value}</span>
                  <span style={{ fontSize: 13, color: colors.gray, marginLeft: 10 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ background: colors.darkGray, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: colors.ideamapTeal, textTransform: "uppercase", marginBottom: 16 }}>
                Avec IdeaMap
              </div>
              {[
                ["< 1 heure", "pour un dossier structuré et chiffré"],
                ["3 langues", "français, arabe (RTL) et anglais, nativement"],
                ["1 score", "de conformité avant même le dépôt"],
              ].map(([value, label]) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#34D399" }}>{value}</span>
                  <span style={{ fontSize: 13, color: colors.gray, marginLeft: 10 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ideamap" style={{ padding: "72px 40px", maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.ideamapTeal,
              marginBottom: 12,
            }}
          >
            Module IdeaMap
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: colors.dark, margin: "0 0 12px" }}>
            De l&apos;idée au dossier INDH, en 8 étapes guidées par votre conseiller
          </h2>
          <p style={{ color: "#475569", maxWidth: 620, margin: "0 auto" }}>
            IdeaMap accompagne chaque porteur de projet : idée, dialogue avec son conseiller,
            plan d&apos;affaires, budget, conformité INDH, documents et export du dossier final.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {[
            ["💡", "Idée", "Décrivez votre projet en langage simple."],
            ["💬", "Conseiller", "5 questions ciblées pour structurer le projet."],
            ["📄", "Plan & Budget", "Business plan et budget générés automatiquement."],
            ["✅", "Conformité", "Score et recommandations selon les critères INDH."],
            ["📎", "Documents", "Liste des pièces justificatives à fournir."],
            ["📤", "Dossier final", "Export et taux de préparation global."],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontWeight: 700, color: colors.dark, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="programs"
        style={{ padding: "56px 40px", background: colors.white, borderTop: "1px solid #e2e8f0" }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
            textAlign: "center",
          }}
        >
          {[
            ["100 000 MAD", "Subvention maximale par projet"],
            ["85% / 15%", "Contribution INDH / porteur"],
            ["4", "Axes stratégiques de la Phase 3"],
            ["10", "Secteurs éligibles"],
          ].map(([value, label]) => (
            <div key={label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: colors.dark }}>{value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          padding: "24px 40px",
          background: colors.dark,
          color: colors.gray,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        © 2026 Y-TRACK · IdeaMap · Initiative Nationale pour le Développement Humain
      </footer>
    </main>
  );
}
