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