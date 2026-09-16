// netlify/functions/send-guide.js
// Costa Capital — Lead magnet delivery + Brevo CRM
// WHY-first email copy (Sinek) + value-first lead magnet (Hormozi)
// Languages: NL / EN / ES / PL
// Each language gets its own PDF from /public/ on costacapital.pro

exports.handler = async (event) => {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, company, role, lang = "en" } = body;

  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name and email are required" }),
    };
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  // ── PDF URL per language ────────────────────────────────────────────────────
  // Upload each PDF to the /public folder of your Netlify site (costacapital.pro)
  // with EXACTLY these filenames:
  //
  //   EN  →  Costa_Capital_Finance_Guide_EN.pdf   (your existing English original)
  //   NL  →  Costa_Capital_Finance_Guide_NL.pdf
  //   ES  →  Costa_Capital_Finance_Guide_ES.pdf
  //   PL  →  Costa_Capital_Finance_Guide_PL.pdf
  //
  // They will be publicly accessible at https://costacapital.pro/<filename>

  const PDF_URLS = {
    en: "https://costacapital.pro/Costa_Capital_Finance_Guide_EN.pdf",
    nl: "https://costacapital.pro/Costa_Capital_Finance_Guide_NL.pdf",
    es: "https://costacapital.pro/Costa_Capital_Finance_Guide_ES.pdf",
    pl: "https://costacapital.pro/Costa_Capital_Finance_Guide_PL.pdf",
  };

  const PDF_URL = PDF_URLS[lang] || PDF_URLS.en;

  // Brevo list ID per language
  const LIST_IDS = { nl: 3, en: 4, es: 5, pl: 8 };
  const LIST_ID = LIST_IDS[lang] || LIST_IDS.en;

  // ── EMAIL COPY — WHY-first (Sinek) + value-first (Hormozi) ─────────────────
  const copy = {

    // ── NEDERLANDS ──────────────────────────────────────────────────────────────
    nl: {
      subject: "Uw Spain Real Estate Finance Playbook 2026 staat klaar — Costa Capital",
      preheader: "Een praktische gids voor professionele vastgoed kredietnemers met projecten in Spanje.",
      greeting: `Hallo ${name},`,
      hook: "Professionele financiers verwachten dat kredietnemers financieringsgereedzaam zijn — weten wat zij beoordelen, welke documenten van belang zijn, en hoe u uw project succesvol positioneert.",
      hookSub: "Het Spain Real Estate Finance Playbook 2026 is een praktische gids om uw financieringsgereedzaamheid te verbeteren en beter te begrijpen hoe professionele financiers aanvragen beoordelen.",
      btnText: "↓ Download uw Playbook (PDF)",
      insideTitle: "Wat staat erin:",
      inside: [
        "Hoe professionele financiers een financieringsaanvraag beoordelen",
        "Bridge-, acquisitie-, development- en herfinancieringsstructuren",
        "LTV, LTC en Debt/GDV uitgelegd",
        "Het lender-ready documentatiepakket",
        "Waarom financieringsaanvragen vertragen of afvallen",
        "Hoe u uw financieringspositie kunt verbeteren",
        "Financing Readiness Checklist",
      ],
      valueNote: "Dit playbook is uitgebreid en praktisch — wij bieden het normaal alleen aan serieuze kredietnemers.",
      dividerTitle: "Hebt u een actueel project?",
      dividerText: "Voer uw project door de Costa Capital Real Estate Financing Assessment om financieringsgereedzaamsheidsaspecten en mogelijke structurele verbeteringen voor marktbenadering in kaart te brengen.",
      cta1Text: "Project beoordelen →",
      cta1Url: "https://app.costacapital.pro?lang=nl",
      cta2Text: "Indienen voor financiering →",
      cta2Url: "https://costacapital.pro/#deal",
      signoff: "Met vriendelijke groet,",
      signature: "Jaap Meelker",
      signatureRole: "Founder · Costa Capital / JLMX B.V. · Dénia, Costa Blanca",
      ps: "P.S. Costa Capital biedt een eerste financieringsbeoordeling binnen 48 uur na ontvangst van voldoende projectdetails. Stuur de uwe naar info@costacapital.pro",
    },

    // ── ENGLISH ──────────────────────────────────────────────────────────────────
    en: {
      subject: "Your Spain Real Estate Finance Playbook 2026 is ready — Costa Capital",
      preheader: "A practical guide for professional real estate borrowers with projects in Spain.",
      greeting: `Hi ${name},`,
      hook: "Professional lenders expect borrowers to be financing-ready — knowing what they assess, which documents matter most, and how to position your project for success.",
      hookSub: "The Spain Real Estate Finance Playbook 2026 is a practical guide designed to help you improve your financing readiness and better understand how professional lenders evaluate requests.",
      btnText: "↓ Download Your Playbook (PDF)",
      insideTitle: "What's inside:",
      inside: [
        "How professional lenders assess a financing request",
        "Bridge, acquisition, development &amp; refinancing structures",
        "LTV, LTC and Debt/GDV explained",
        "The lender-ready documentation pack",
        "Why financing requests stall or fail",
        "How to improve your financing position",
        "Financing Readiness Checklist",
      ],
      valueNote: "This playbook is comprehensive and useful — we normally offer it only to serious borrowers.",
      dividerTitle: "Do you have a live project?",
      dividerText: "Run your project through the Costa Capital Real Estate Financing Assessment to identify lender-readiness issues and potential structural improvements before approaching the market.",
      cta1Text: "Assess your project →",
      cta1Url: "https://app.costacapital.pro?lang=en",
      cta2Text: "Submit to financing →",
      cta2Url: "https://costacapital.pro/#deal",
      signoff: "Best regards,",
      signature: "Jaap Meelker",
      signatureRole: "Founder · Costa Capital / JLMX B.V. · Dénia, Costa Blanca",
      ps: "P.S. Costa Capital provides an initial financing assessment within 48 hours of receiving sufficient project details. Send yours to info@costacapital.pro",
    },

    // ── ESPAÑOL ───────────────────────────────────────────────────────────────────
    es: {
      subject: "Su guía de financiación está lista — Costa Capital",
      preheader: "Las mejores oportunidades inmobiliarias en España se pierden sin el socio de capital adecuado.",
      greeting: `Hola ${name},`,
      hook: "Las mejores oportunidades inmobiliarias en España se pierden — no por falta de proyectos, sino por falta del socio de capital adecuado.",
      hookSub: "Esta guía le muestra cómo funciona la financiación en España, qué quieren ver realmente los prestamistas y qué errores arruinan la mayoría de las operaciones.",
      btnText: "↓ Descargar su guía de financiación (PDF)",
      insideTitle: "Qué encontrará:",
      inside: [
        "Cómo funciona la financiación inmobiliaria española — LTV, LTC, tipos de prestamistas",
        "Préstamos puente y financiación para promotores explicados",
        "Lo que los prestamistas realmente quieren ver — los 7 documentos clave",
        "LTV y precios por región — Costa del Sol, Costa Blanca, Valencia, Ibiza",
        "NIE, escritura y conceptos jurídicos básicos en España",
        "10 errores que arruinan operaciones",
        "Su checklist completo de financiación",
      ],
      valueNote: "Esta guía es tan completa que podríamos cobrar por ella. Usted la tiene gratis.",
      dividerTitle: "¿Tiene un proyecto que necesita financiación?",
      dividerText: "Costa Capital estructura financiación para prestatarios profesionales e introduce las solicitudes adecuadas a fuentes de financiación profesionales. Independiente.",
      cta1Text: "Enviar su proyecto →",
      cta1Url: "https://costacapital.pro/es/#deal",
      cta2Text: "Analizar financiación con IA →",
      cta2Url: "https://app.costacapital.pro?lang=es",
      signoff: "Atentamente,",
      signature: "Jaap Meelker",
      signatureRole: "Fundador · Costa Capital / JLMX B.V. · Dénia, Costa Blanca",
      ps: "P.D. Evaluación inicial de financiación en 48 horas — envíe los detalles de su proyecto a info@costacapital.pro",
    },

    // ── POLSKI ────────────────────────────────────────────────────────────────────
    pl: {
      subject: "Twój przewodnik finansowania jest gotowy — Costa Capital",
      preheader: "Najlepsze okazje nieruchomościowe w Hiszpanii pozostają niewykorzystane bez właściwego partnera kapitałowego.",
      greeting: `Cześć ${name},`,
      hook: "Najlepsze okazje nieruchomościowe w Hiszpanii pozostają niewykorzystane — nie z powodu braku projektów, ale z powodu braku właściwego partnera kapitałowego.",
      hookSub: "Ten przewodnik pokazuje jak działa finansowanie w Hiszpanii, czego naprawdę chcą pożyczkodawcy i które błędy niszczą większość transakcji zanim w ogóle się zaczną.",
      btnText: "↓ Pobierz Przewodnik Finansowania (PDF)",
      insideTitle: "Co znajdziesz w środku:",
      inside: [
        "Jak działa finansowanie nieruchomości w Hiszpanii — LTV, LTC, typy pożyczkodawców",
        "Kredyty pomostowe i finansowanie deweloperskie wyjaśnione",
        "Czego naprawdę chcą pożyczkodawcy — 7 kluczowych dokumentów",
        "LTV i ceny według regionu — Costa del Sol, Costa Blanca, Walencja, Ibiza",
        "NIE, escritura i podstawy prawne w Hiszpanii",
        "10 błędów, które niszczą transakcje",
        "Kompletna lista kontrolna finansowania",
      ],
      valueNote: "Ten przewodnik jest tak kompletny, że moglibyśmy za niego pobierać opłaty. Ty masz go za darmo.",
      dividerTitle: "Masz projekt, który potrzebuje finansowania?",
      dividerText: "Costa Capital strukturyzuje finansowanie dla profesjonalnych kredytobiorców i wprowadza odpowiednie wnioski do profesjonalnych źródeł finansowania. Niezależnie.",
      cta1Text: "Wyślij swój projekt →",
      cta1Url: "https://costacapital.pro/pl/#deal",
      cta2Text: "Analizuj finansowanie z AI →",
      cta2Url: "https://app.costacapital.pro?lang=en",
      signoff: "Z poważaniem,",
      signature: "Jaap Meelker",
      signatureRole: "Założyciel · Costa Capital / JLMX B.V. · Dénia, Costa Blanca",
      ps: "P.S. Wstępna ocena finansowania w ciągu 48 godzin — wyślij szczegóły projektu na info@costacapital.pro",
    },
  };

  const c = copy[lang] || copy.en;

  // ── HTML EMAIL TEMPLATE ──────────────────────────────────────────────────────
  const buildEmail = (c) => `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${c.subject}</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Helvetica,Arial,sans-serif;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${c.preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#0f172a;padding:0 0 4px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:32px 40px 28px;">
                  <p style="margin:0 0 6px;color:#c8a96e;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">COSTA CAPITAL</p>
                  <p style="margin:0;color:#f5f0e8;font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:0.5;">Real Estate Finance · Spanish Mediterranean Coast</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GOLD LINE -->
        <tr><td style="background:linear-gradient(90deg,#c8a96e,#e2c99a,#c8a96e);height:2px;"></td></tr>

        <!-- MAIN BODY -->
        <tr>
          <td style="background:#141414;padding:40px 40px 32px;">

            <p style="margin:0 0 20px;color:#f5f0e8;font-size:16px;line-height:1.5;">${c.greeting}</p>

            <p style="margin:0 0 12px;color:#c8a96e;font-size:20px;font-weight:bold;line-height:1.4;font-style:italic;">"${c.hook}"</p>
            <p style="margin:0 0 28px;color:rgba(245,240,232,0.6);font-size:15px;line-height:1.7;">${c.hookSub}</p>

            <!-- DOWNLOAD BUTTON -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
              <tr>
                <td style="background:#c8a96e;border-radius:4px;">
                  <a href="${PDF_URL}" style="display:block;padding:16px 36px;color:#080808;font-size:15px;font-weight:bold;text-decoration:none;letter-spacing:0.5px;">
                    ${c.btnText}
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 32px;color:rgba(245,240,232,0.4);font-size:12px;font-style:italic;">${c.valueNote}</p>

            <!-- WHAT'S INSIDE -->
            <p style="margin:0 0 12px;color:#f5f0e8;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${c.insideTitle}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;background:#1a1a1a;border:1px solid rgba(200,169,110,0.15);border-radius:4px;">
              ${c.inside.map((item, i) => `
              <tr>
                <td style="padding:10px 16px;border-bottom:${i < c.inside.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'};">
                  <span style="color:#c8a96e;font-size:13px;margin-right:8px;">—</span>
                  <span style="color:rgba(245,240,232,0.65);font-size:13px;line-height:1.5;">${item}</span>
                </td>
              </tr>`).join('')}
            </table>

            <!-- DIVIDER SECTION -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#0f172a;border-left:3px solid #c8a96e;border-radius:0 4px 4px 0;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 8px;color:#c8a96e;font-size:14px;font-weight:bold;">${c.dividerTitle}</p>
                  <p style="margin:0;color:rgba(245,240,232,0.55);font-size:13px;line-height:1.7;">${c.dividerText}</p>
                </td>
              </tr>
            </table>

            <!-- DUAL CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${c.cta1Url}" style="display:inline-block;padding:12px 24px;background:#c8a96e;color:#080808;font-size:13px;font-weight:bold;text-decoration:none;border-radius:4px;">${c.cta1Text}</a>
                </td>
                <td>
                  <a href="${c.cta2Url}" style="display:inline-block;padding:12px 24px;background:transparent;color:#c8a96e;font-size:13px;font-weight:bold;text-decoration:none;border-radius:4px;border:1px solid rgba(200,169,110,0.4);">${c.cta2Text}</a>
                </td>
              </tr>
            </table>

            <!-- SIGN-OFF -->
            <p style="margin:0 0 4px;color:rgba(245,240,232,0.5);font-size:13px;">${c.signoff}</p>
            <p style="margin:0 0 2px;color:#f5f0e8;font-size:15px;font-weight:bold;">${c.signature}</p>
            <p style="margin:0 0 20px;color:rgba(245,240,232,0.4);font-size:12px;">${c.signatureRole}</p>

            <p style="margin:0;color:rgba(245,240,232,0.45);font-size:12px;font-style:italic;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">${c.ps}</p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0a0a0a;padding:20px 40px;border-top:1px solid rgba(200,169,110,0.15);">
            <p style="margin:0;color:rgba(245,240,232,0.25);font-size:11px;line-height:1.8;">
              Costa Capital · JLMX B.V. · <a href="https://costacapital.pro" style="color:#c8a96e;text-decoration:none;">costacapital.pro</a> · info@costacapital.pro<br>
              Dénia, Costa Blanca · Spain
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  // ── LEAD NOTIFICATION TO JAAP ─────────────────────────────────────────────────
  const langLabel = { nl: "Nederlands", en: "Engels", es: "Spaans", pl: "Pools" }[lang] || lang;

  const notifyEmail = {
    sender: { name: "Costa Capital Bot", email: "info@costacapital.pro" },
    to: [{ email: process.env.NOTIFY_EMAIL || "info@costacapital.pro", name: "Jaap" }],
    subject: `Nieuwe lead: ${name} — Gids download (${langLabel})`,
    htmlContent: `
<div style="font-family:Helvetica,Arial,sans-serif;max-width:540px;padding:24px;background:#f8fafc;">
  <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a96e;font-weight:bold;">COSTA CAPITAL — NIEUWE LEAD</p>
  <p style="margin:0 0 20px;font-size:20px;font-weight:bold;color:#0f172a;">Guide download · ${langLabel}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
    <tr style="background:#f8fafc;">
      <td style="padding:10px 16px;font-weight:bold;color:#334155;width:110px;border-bottom:1px solid #e2e8f0;">Naam</td>
      <td style="padding:10px 16px;color:#0f172a;font-weight:bold;border-bottom:1px solid #e2e8f0;">${name}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-weight:bold;color:#334155;border-bottom:1px solid #e2e8f0;">E-mail</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#f97316;font-weight:bold;">${email}</a></td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:10px 16px;font-weight:bold;color:#334155;border-bottom:1px solid #e2e8f0;">Bedrijf</td>
      <td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">${company || "—"}</td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-weight:bold;color:#334155;border-bottom:1px solid #e2e8f0;">Rol</td>
      <td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;">${role || "—"}</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:10px 16px;font-weight:bold;color:#334155;border-bottom:1px solid #e2e8f0;">Taal</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e2e8f0;"><span style="background:#c8a96e;color:#080808;padding:2px 8px;border-radius:3px;font-size:12px;font-weight:bold;">${langLabel}</span></td>
    </tr>
    <tr>
      <td style="padding:10px 16px;font-weight:bold;color:#334155;border-bottom:1px solid #e2e8f0;">PDF verstuurd</td>
      <td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e2e8f0;font-size:12px;">${PDF_URL}</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:10px 16px;font-weight:bold;color:#334155;">Tijdstip</td>
      <td style="padding:10px 16px;color:#64748b;">${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Madrid" })}</td>
    </tr>
  </table>
  <div style="margin:16px 0 0;padding:14px 16px;background:#fef9ec;border-left:3px solid #c8a96e;border-radius:0 4px 4px 0;">
    <p style="margin:0;font-size:13px;color:#334155;font-weight:bold;">Aanbevolen actie:</p>
    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">Stuur binnen 24 uur een persoonlijk follow-up bericht naar ${name} via <a href="mailto:${email}" style="color:#f97316;">${email}</a></p>
  </div>
  <p style="margin:12px 0 0;font-size:11px;color:#94a3b8;">Via costacapital.pro — Guide download formulier · ${new Date().toISOString()}</p>
</div>`,
  };

  // ── BREVO CONTACT ─────────────────────────────────────────────────────────────
  const contactPayload = {
    email,
    attributes: {
      FIRSTNAME: name.split(" ")[0],
      LASTNAME: name.split(" ").slice(1).join(" ") || "",
      COMPANY: company || "",
      JOB_TITLE: role || "",
      SOURCE: "guide_download",
      LANGUAGE: lang.toUpperCase(),
    },
    listIds: [LIST_ID],
    updateEnabled: true,
  };

  const visitorEmail = {
    sender: { name: "Jaap Meelker · Costa Capital", email: "info@costacapital.pro" },
    to: [{ email, name }],
    subject: c.subject,
    htmlContent: buildEmail(c),
  };

  try {
    const r1 = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(visitorEmail),
    });

    if (!r1.ok) {
      const err = await r1.text();
      throw new Error(`Brevo visitor email failed: ${err}`);
    }

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(notifyEmail),
    });

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(contactPayload),
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    console.error("Brevo error:", err.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Send failed", detail: err.message }),
    };
  }
};
