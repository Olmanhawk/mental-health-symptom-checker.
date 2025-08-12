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
    const threat = document.getElementById('threat');
    const symptoms = document.getElementById('symptoms');

    if(!disorder){
      title.textContent = 'Not found';
      description.textContent = 'The requested entry was not found.';
      return;
    }

    title.textContent = disorder.name;
    description.textContent = disorder.description || '';
    early.textContent = disorder.early_signs || '';
    threat.textContent = disorder.threat_assessment || '';

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