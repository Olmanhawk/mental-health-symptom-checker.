(function () {
  "use strict";

  const form = document.getElementById("checkerForm");
  const resultsSection = document.getElementById("results");
  const scoreSummary = document.getElementById("scoreSummary");
  const guidance = document.getElementById("guidance");
  const formError = document.getElementById("formError");

  if (!form) return;

  const questionNames = [
    "q1",
    "q2",
    "q3",
    "q4",
    "q5",
    "q6",
    "q7",
    "q8",
    "q9",
  ];

  function getSelectedValue(name) {
    const input = form.querySelector(`input[name="${name}"]:checked`);
    return input ? Number(input.value) : null;
  }

  function validateAllAnswered() {
    for (const name of questionNames) {
      const value = getSelectedValue(name);
      if (value === null) {
        const group = form.querySelector(`input[name="${name}"]`)?.closest(".question");
        if (group) group.scrollIntoView({ behavior: "smooth", block: "center" });
        formError.textContent = "Please answer all questions before continuing.";
        return false;
      }
    }
    formError.textContent = "";
    return true;
  }

  function categorizeScore(total) {
    if (total <= 4) return { label: "minimal", color: "#60a5fa" };
    if (total <= 9) return { label: "mild", color: "#34d399" };
    if (total <= 14) return { label: "moderate", color: "#f59e0b" };
    if (total <= 19) return { label: "moderately severe", color: "#f97316" };
    return { label: "severe", color: "#ef4444" };
  }

  function buildGuidance(total, riskFlag) {
    const parts = [];

    if (riskFlag) {
      parts.push(
        `<p><strong style="color:#ef4444">Important:</strong> You indicated having thoughts of self-harm. If you feel at risk of harming yourself or others, please contact emergency services or a crisis hotline now. See resources below.</p>`
      );
    }

    if (total <= 4) {
      parts.push(
        "<ul>" +
          "<li>Keep up healthy routines: sleep, nutrition, movement, and social connection.</li>" +
          "<li>Try brief stress-reduction practices (breathing, mindfulness, or a short walk).</li>" +
          "<li>Check in with yourself again in a couple of weeks.</li>" +
        "</ul>"
      );
    } else if (total <= 9) {
      parts.push(
        "<ul>" +
          "<li>Consider self-guided tools (mood tracking, CBT-based apps) and supportive routines.</li>" +
          "<li>Talk with a trusted person about how you’ve been feeling.</li>" +
          "<li>If symptoms persist or worsen, consider speaking with a healthcare professional.</li>" +
        "</ul>"
      );
    } else if (total <= 14) {
      parts.push(
        "<ul>" +
          "<li>Consider scheduling time with a primary care clinician or mental health professional.</li>" +
          "<li>Plan small, manageable activities that restore energy and connection.</li>" +
          "<li>Prioritize sleep hygiene and reduce alcohol/substance use.</li>" +
        "</ul>"
      );
    } else if (total <= 19) {
      parts.push(
        "<ul>" +
          "<li>Reaching out to a licensed mental health professional is recommended.</li>" +
          "<li>Ask your support network for help with daily tasks and routines while you recover.</li>" +
          "<li>If symptoms escalate or you feel unsafe, seek urgent care.</li>" +
        "</ul>"
      );
    } else {
      parts.push(
        "<ul>" +
          "<li>Seeking help promptly is important. Consider urgent care or contacting a licensed professional as soon as possible.</li>" +
          "<li>Let someone you trust know how you’re feeling and ask for support.</li>" +
          "<li>If you feel unsafe, contact emergency services or a crisis hotline now.</li>" +
        "</ul>"
      );
    }

    return parts.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateAllAnswered()) return;

    let total = 0;
    let riskFlag = false;

    for (const name of questionNames) {
      const value = getSelectedValue(name);
      total += value || 0;
      if (name === "q9" && (value || 0) > 0) {
        riskFlag = true;
      }
    }

    const category = categorizeScore(total);

    scoreSummary.innerHTML = `Total score: <strong style="color:${category.color}">${total} / 27</strong> &ndash; ${category.label}`;
    guidance.innerHTML = buildGuidance(total, riskFlag);

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", function () {
    resultsSection.hidden = true;
    scoreSummary.textContent = "";
    guidance.textContent = "";
    formError.textContent = "";
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  });
})();