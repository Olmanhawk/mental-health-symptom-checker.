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
  if (typeof window.displayMatchedDisorders === 'function') {
    window.displayMatchedDisorders(matches);
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