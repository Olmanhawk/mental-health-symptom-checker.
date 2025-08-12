(function(){
  "use strict";

  function slugifyName(name){
    return String(name)
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadData(){
    try{
      const res = await fetch('data.json');
      if(!res.ok) throw new Error('Failed');
      return await res.json();
    }catch(err){
      console.error('Failed to load data.json', err);
      return { disorders: [] };
    }
  }

  function getParam(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function render(disorder){
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const early = document.getElementById('early');
    const threatRisk = document.getElementById('threatRisk');
    const threatWhen = document.getElementById('threatWhen');
    const threatEmergency = document.getElementById('threatEmergency');
    const symptoms = document.getElementById('symptoms');

    if(!disorder){
      title.textContent = 'Not found';
      description.textContent = 'The requested entry was not found.';
      return;
    }

    title.textContent = disorder.name;
    description.textContent = disorder.description || '';
    if (Array.isArray(disorder.early_signs)) {
      early.innerHTML = '<ul>' + disorder.early_signs.map(i => `<li>${i}</li>`).join('') + '</ul>';
    } else {
      early.textContent = disorder.early_signs || '';
    }

    const ta = disorder.threat_assessment;
    if (ta && typeof ta === 'object' && !Array.isArray(ta)) {
      if (Array.isArray(ta.risk_factors) && ta.risk_factors.length) {
        threatRisk.innerHTML = '<h3>Risk factors</h3><ul>' + ta.risk_factors.map(i => `<li>${i}</li>`).join('') + '</ul>';
      }
      if (Array.isArray(ta.when_to_seek_help) && ta.when_to_seek_help.length) {
        threatWhen.innerHTML = '<h3>When to seek help</h3><ul>' + ta.when_to_seek_help.map(i => `<li>${i}</li>`).join('') + '</ul>';
      }
      if (Array.isArray(ta.emergency_information) && ta.emergency_information.length) {
        threatEmergency.innerHTML = '<h3>Emergency information</h3><ul>' + ta.emergency_information.map(i => `<li>${i}</li>`).join('') + '</ul>';
      } else {
        threatEmergency.innerHTML = '<h3>Emergency information</h3><ul>' +
          '<li>United States: Call or text 988 for the Suicide & Crisis Lifeline, or chat at <a href="https://988lifeline.org/" target="_blank" rel="noopener">988lifeline.org</a></li>' +
          '<li>Text HOME to 741741 to reach a Crisis Text Line counselor</li>' +
          '<li>Outside the U.S.: Find international helplines at <a href="https://www.opencounseling.com/suicide-hotlines" target="_blank" rel="noopener">OpenCounseling</a></li>' +
          '<li>If in immediate danger, call your local emergency number</li>' +
        '</ul>';
      }
    } else {
      // Backward compatible: show plain text, if present
      if (ta) {
        threatRisk.innerHTML = '<p class="meta">' + String(ta) + '</p>';
      }
    }

    const list = document.createElement('div');
    (disorder.symptoms || []).forEach(sym => {
      const tag = document.createElement('span');
      tag.className = 'pill';
      tag.textContent = String(sym).replaceAll('_',' ');
      list.appendChild(tag);
    });
    symptoms.innerHTML = '';
    symptoms.appendChild(list);
  }

  (async function init(){
    const slug = getParam('d');
    const data = await loadData();
    const found = (data.disorders || []).find(d => slugifyName(d.name) === slug);
    render(found);
  })();
})();