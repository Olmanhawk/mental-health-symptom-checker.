let allDisorders = [];

async function loadDisordersOnLoad() {
  try {
    const response = await fetch('data.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load data.json (HTTP ${response.status})`);
    }
    const data = await response.json();
    allDisorders = Array.isArray(data.disorders) ? data.disorders : [];
  } catch (error) {
    console.error('Error loading data.json:', error);
  }
}

// Run once when the page first loads
window.addEventListener('DOMContentLoaded', loadDisordersOnLoad);

// Optionally expose the loader for manual retry/debugging
window.loadDisordersOnLoad = loadDisordersOnLoad;

// Optional mapping from UI checkbox values to canonical symptom codes in data.json
const RAW_TO_CANON = {
  low_mood: 'depressed_mood',
  loss_interest: 'loss_of_interest',
  anxiety_worry: 'excessive_worry',
  appetite_changes: 'changes_in_appetite',
  concentration: 'difficulty_concentrating',
  guilt_worthlessness: 'feelings_of_worthlessness',
  // pass-throughs and other common values
  fatigue: 'fatigue',
  sleep_problems: 'sleep_problems',
  restlessness: 'restlessness',
  irritability: 'irritability',
  muscle_tension: 'muscle_tension',
  social_withdrawal: 'social_withdrawal',
  substance_use: 'substance_use',
  tearfulness: 'tearfulness',
  headaches: 'headaches',
  stomach_issues: 'stomach_issues',
  hopelessness: 'hopelessness',
};

function toCanonical(sym) {
  return RAW_TO_CANON[sym] || sym;
}

// Primary function: analyze selected symptoms against allDisorders
function analyzeSymptoms(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  // 1) Gather selected symptoms from checked checkboxes
  const checkedInputs = Array.from(
    document.querySelectorAll('input[type="checkbox"][name^="sym_"]:checked')
  );
  const selectedCanonical = new Set(
    checkedInputs.map((el) => toCanonical(String(el.value)))
  );

  // 2) Compute match scores for each disorder
  const matches = [];
  for (const disorder of allDisorders) {
    const symptoms = Array.isArray(disorder.symptoms) ? disorder.symptoms : [];
    let score = 0;
    const matched = [];
    for (const s of symptoms) {
      if (selectedCanonical.has(s)) {
        score += 1;
        matched.push(s);
      }
    }
    if (score > 0) {
      matches.push({ disorder, score, total: symptoms.length, matched });
    }
  }

  // 3) Sort by score descending for a better UX
  matches.sort((a, b) => b.score - a.score);

  // 4) Call separate function to display results
  if (typeof window.displayResults === 'function') {
    window.displayResults(matches);
  } else {
    // Placeholder to avoid runtime errors until UI renderer is implemented
    console.info('Matched disorders:', matches);
  }
}

// Expose globally so it can be bound to a button click via HTML or JS
window.analyzeSymptoms = analyzeSymptoms;

// If an Analyze button exists, wire it up; otherwise no-op
window.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeSymptoms);
});

function displayResults(matchedDisorders) {
  const resultsSection = document.getElementById('results');
  if (!resultsSection) {
    console.warn('Results section not found');
    return;
  }

  // 1) Clear previous results
  resultsSection.innerHTML = '';

  // 5) Prominent disclaimer at the top
  const disclaimer = document.createElement('p');
  disclaimer.innerHTML = '<strong>This is not a medical diagnosis. This tool is for informational purposes only and you must consult a qualified healthcare professional for an accurate diagnosis.</strong>';
  resultsSection.appendChild(disclaimer);

  if (!Array.isArray(matchedDisorders) || matchedDisorders.length === 0) {
    // 2) Empty state message
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No specific disorders match the selected symptoms. Please consult a healthcare professional for guidance.';
    resultsSection.appendChild(emptyMsg);
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // 3) Render each matched disorder
  matchedDisorders.forEach((item) => {
    const { disorder, score, total, matched } = item;

    const card = document.createElement('section');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = disorder.name || 'Unknown';
    card.appendChild(title);

    if (disorder.description) {
      const p = document.createElement('p');
      p.textContent = disorder.description;
      card.appendChild(p);
    }

    if (disorder.early_signs) {
      const wrap = document.createElement('div');
      const h = document.createElement('h4');
      h.textContent = 'Early signs';
      wrap.appendChild(h);
      if (Array.isArray(disorder.early_signs)) {
        const ul = document.createElement('ul');
        disorder.early_signs.forEach((s) => {
          const li = document.createElement('li');
          li.textContent = s;
          ul.appendChild(li);
        });
        wrap.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.textContent = String(disorder.early_signs);
        wrap.appendChild(p);
      }
      card.appendChild(wrap);
    }

    if (disorder.threat_assessment) {
      const ta = disorder.threat_assessment;
      const wrap = document.createElement('div');
      const h = document.createElement('h4');
      h.textContent = 'Threat assessment';
      wrap.appendChild(h);

      if (ta && typeof ta === 'object' && !Array.isArray(ta)) {
        const { risk_factors, when_to_seek_help, emergency_information } = ta;
        if (Array.isArray(risk_factors) && risk_factors.length) {
          const h3 = document.createElement('h5');
          h3.textContent = 'Risk factors';
          wrap.appendChild(h3);
          const ul = document.createElement('ul');
          risk_factors.forEach((s) => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
          wrap.appendChild(ul);
        }
        if (Array.isArray(when_to_seek_help) && when_to_seek_help.length) {
          const h3 = document.createElement('h5');
          h3.textContent = 'When to seek help';
          wrap.appendChild(h3);
          const ul = document.createElement('ul');
          when_to_seek_help.forEach((s) => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
          wrap.appendChild(ul);
        }
        if (Array.isArray(emergency_information) && emergency_information.length) {
          const h3 = document.createElement('h5');
          h3.textContent = 'Emergency information';
          wrap.appendChild(h3);
          const ul = document.createElement('ul');
          emergency_information.forEach((s) => { const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
          wrap.appendChild(ul);
        }
      } else {
        const p = document.createElement('p');
        p.textContent = String(ta);
        wrap.appendChild(p);
      }

      card.appendChild(wrap);
    }

    resultsSection.appendChild(card);
  });

  // 4) Reveal results and scroll into view
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.displayResults = displayResults;