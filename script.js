(() => {
  const BANK = window.QUESTION_BANK || { categories: [] };
  const $ = (id) => document.getElementById(id);
  const state = {
    lang: localStorage.getItem('elektrovoz:lang') || 'lat',
    theme: localStorage.getItem('elektrovoz:theme') || 'dark',
    category: null,
    quiz: [],
    index: 0,
    score: 0,
    answered: false,
    selected: null,
    startedAt: 0,
    timerId: null,
    lastResult: JSON.parse(localStorage.getItem('elektrovoz:lastResult') || 'null')
  };

  const UI = {
    brand: 'Elektrovoz bilim sinovi',
    brandSub: 'Ta’mirlovchi ishchi-xodimlar uchun',
    eyebrow: 'Temir yo‘l elektrovoz ta’miri',
    title: 'Elektrovozlarni ta’mirlovchi ishchi-xodimlar uchun bilimlarni sinash platformasi',
    subtitle: 'Savollar va javoblar har safar aralashtiriladi. Javob tanlanmaguncha keyingi savolga o‘tib bo‘lmaydi.',
    startBtn: 'Testni boshlash', lastResult: 'Oxirgi natija', directions: 'yo‘nalish', questions: 'savol', offline: 'GitHub Pages',
    chooseTitle: 'Yo‘nalishni tanlang', chooseDesc: 'Kartochka ustiga borganda rang va hajm o‘zgaradi. Har bir bo‘lim alohida test sifatida ishlaydi.',
    searchLabel: 'Qidirish', sizeLabel: 'Test hajmi', contactTitle: 'Murojaat uchun', contactPerson: 'VChD-5 ICHTB boshlig‘i G‘aniyev F.B.',
    back: '← Orqaga', next: 'Keyingi savol', finish: 'Natija', resultTitle: 'Test yakunlandi', retry: 'Qayta topshirish',
    homeBtn: 'Bosh sahifa', exportBtn: 'CSV yuklash', footerText: 'Elektrovoz ta’miri bo‘yicha bilimlarni sinash platformasi',
    footerContact: 'Murojaat uchun: G‘aniyev F.B.', correct: 'To‘g‘ri', wrong: 'Noto‘g‘ri', correctAnswer: 'To‘g‘ri javob',
    noResult: 'Hali natija yo‘q.', resultSentence: 'Siz {total} ta savoldan {score} tasiga to‘g‘ri javob berdingiz.',
    empty: 'Bu qidiruv bo‘yicha yo‘nalish topilmadi.', start: 'Boshlash', allQuestions: 'Barcha savollar', questionWord: 'savol'
  };

  const LAT_TO_CYR_PAIRS = [
    ['O‘','Ў'],['o‘','ў'],['G‘','Ғ'],['g‘','ғ'],['Sh','Ш'],['sh','ш'],['Ch','Ч'],['ch','ч'],['Yo','Ё'],['yo','ё'],['Yu','Ю'],['yu','ю'],['Ya','Я'],['ya','я'],['Ye','Е'],['ye','е'],
    ['Ts','Ц'],['ts','ц'],['A','А'],['a','а'],['B','Б'],['b','б'],['D','Д'],['d','д'],['E','Э'],['e','е'],['F','Ф'],['f','ф'],['G','Г'],['g','г'],['H','Ҳ'],['h','ҳ'],['I','И'],['i','и'],['J','Ж'],['j','ж'],['K','К'],['k','к'],['L','Л'],['l','л'],['M','М'],['m','м'],['N','Н'],['n','н'],['O','О'],['o','о'],['P','П'],['p','п'],['Q','Қ'],['q','қ'],['R','Р'],['r','р'],['S','С'],['s','с'],['T','Т'],['t','т'],['U','У'],['u','у'],['V','В'],['v','в'],['X','Х'],['x','х'],['Y','Й'],['y','й'],['Z','З'],['z','з']
  ];
  const CYR_TO_LAT_PAIRS = [
    ['Ў','O‘'],['ў','o‘'],['Ғ','G‘'],['ғ','g‘'],['Қ','Q'],['қ','q'],['Ҳ','H'],['ҳ','h'],['Ё','Yo'],['ё','yo'],['Ю','Yu'],['ю','yu'],['Я','Ya'],['я','ya'],['Ч','Ch'],['ч','ch'],['Ш','Sh'],['ш','sh'],['Ц','Ts'],['ц','ts'],['Щ','Sh'],['щ','sh'],['А','A'],['а','a'],['Б','B'],['б','b'],['В','V'],['в','v'],['Г','G'],['г','g'],['Д','D'],['д','d'],['Е','E'],['е','e'],['Ж','J'],['ж','j'],['З','Z'],['з','z'],['И','I'],['и','i'],['Й','Y'],['й','y'],['К','K'],['к','k'],['Л','L'],['л','l'],['М','M'],['м','m'],['Н','N'],['н','n'],['О','O'],['о','o'],['П','P'],['п','p'],['Р','R'],['р','r'],['С','S'],['с','s'],['Т','T'],['т','t'],['У','U'],['у','u'],['Ф','F'],['ф','f'],['Х','X'],['х','x'],['Ъ',''],['ъ',''],['Ь',''],['ь',''],['Ы','I'],['ы','i'],['Э','E'],['э','e']
  ];
  function replacePairs(text, pairs){ let s = String(text ?? ''); pairs.forEach(([a,b]) => { s = s.split(a).join(b); }); return s; }
  function toCyr(text){ return replacePairs(String(text ?? '').replace(/O'z/g,'O‘Z').replace(/o'z/g,'o‘z').replace(/g'/g,'g‘').replace(/o'/g,'o‘'), LAT_TO_CYR_PAIRS); }
  function toLat(text){ return replacePairs(text, CYR_TO_LAT_PAIRS); }
  function tr(text){ return state.lang === 'cyr' ? toCyr(text) : toLat(text); }
  function t(key){ return tr(UI[key] || key); }

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  function fmtTime(ms){ const sec=Math.floor(ms/1000); const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`; }

  function applyTheme(){
    document.body.classList.toggle('light', state.theme === 'light');
    $('themeBtn').textContent = state.theme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('elektrovoz:theme', state.theme);
  }
  function applyLang(){
    document.documentElement.lang = state.lang === 'cyr' ? 'uz-Cyrl' : 'uz-Latn';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
    
      if (state.lang === 'cyr' && key === 'contactPerson') {
        el.textContent = 'ВЧД-5 ИЧТБ бошлиғи Ғаниев Ф.Б.';
        return;
      }
    
      if (state.lang === 'lat' && key === 'contactPerson') {
        el.textContent = 'VChD-5 ICHTB boshlig‘i G‘aniyev F.B.';
        return;
      }
    
      el.textContent = t(key);
    });
    $('langBtn').textContent = state.lang === 'lat' ? 'Кирилл' : 'Lotin';
    $('searchInput').placeholder = tr('Masalan: mehnat, g‘ildirak, mexanik...');
    [...$('questionLimit').options].forEach(opt => {
      if(opt.value === 'all') opt.textContent = t('allQuestions');
      else opt.textContent = tr(`${opt.value} ta savol`);
    });
    localStorage.setItem('elektrovoz:lang', state.lang);
    renderCategories();
    if(!$('quizView').classList.contains('hidden')) renderQuestion();
  }

  function renderStats(){
    $('catCount').textContent = BANK.categories.length;
    $('questionCount').textContent = BANK.categories.reduce((sum,c)=>sum+c.questions.length,0);
  }

  function renderCategories(){
    const grid = $('categoryGrid');
    const term = $('searchInput').value.trim().toLowerCase();
    const icons = ['⚡','🚆','🛠️','🛞','🔧','📘','🏭','🧯'];
    const cats = BANK.categories.filter(c => {
      const hay = `${c.title} ${c.description}`.toLowerCase();
      return !term || hay.includes(term) || toCyr(hay).toLowerCase().includes(term);
    });
    grid.innerHTML = '';
    if(!cats.length){ grid.innerHTML = `<div class="empty">${t('empty')}</div>`; return; }
    cats.forEach((cat, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'category-card';
      card.innerHTML = `
        <div class="icon">${icons[i % icons.length]}</div>
        <h3>${tr(cat.title)}</h3>
        <p>${tr(cat.description)}</p>
        <div class="meta"><span>${cat.questions.length} ${t('questionWord')}</span><span>${t('start')} →</span></div>`;
      card.addEventListener('click', () => startQuiz(cat.id));
      grid.appendChild(card);
    });
  }

  function startQuiz(categoryId){
    const cat = BANK.categories.find(c => c.id === categoryId);
    if(!cat || !cat.questions.length) return;
    const limit = $('questionLimit').value;
    const count = limit === 'all' ? cat.questions.length : Math.min(Number(limit), cat.questions.length);
    state.category = cat;
    state.quiz = shuffle(cat.questions).slice(0, count).map(q => ({...q, answers: shuffle(q.answers)}));
    state.index = 0; state.score = 0; state.answered = false; state.selected = null; state.startedAt = Date.now();
    $('home').classList.add('hidden');
    $('quizView').classList.remove('hidden');
    $('quizTitle').textContent = tr(cat.title);
    clearInterval(state.timerId);
    state.timerId = setInterval(() => { $('timer').textContent = fmtTime(Date.now()-state.startedAt); }, 500);
    renderQuestion();
  }

  function renderQuestion(){
    if(!state.quiz.length) return;
    const q = state.quiz[state.index];
    state.answered = false; state.selected = null;
    $('nextBtn').disabled = true;
    $('feedback').className = 'feedback hidden';
    $('questionNo').textContent = tr(`${state.index + 1} / ${state.quiz.length}`);
    $('scoreLive').textContent = tr(`${UI.correct}: ${state.score}`);
    $('progressBar').style.width = `${(state.index / state.quiz.length) * 100}%`;
    $('questionText').textContent = tr(q.question);
    const list = $('answerList'); list.innerHTML = '';
    q.answers.forEach((a, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'answer'; btn.textContent = `${String.fromCharCode(65+idx)}. ${tr(a.text)}`;
      btn.addEventListener('click', () => selectAnswer(idx));
      list.appendChild(btn);
    });
    $('finishBtn').style.display = state.index === state.quiz.length - 1 ? 'inline-flex' : 'none';
    $('nextBtn').style.display = state.index === state.quiz.length - 1 ? 'none' : 'inline-flex';
  }

  function selectAnswer(idx){
    if(state.answered) return;
    const q = state.quiz[state.index];
    const buttons = [...document.querySelectorAll('.answer')];
    const answer = q.answers[idx];
    state.answered = true; state.selected = answer;
    if(answer.correct) state.score += 1;
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if(q.answers[i].correct) btn.classList.add('correct');
      if(i === idx && !q.answers[i].correct) btn.classList.add('wrong');
    });
    const correct = q.answers.find(a => a.correct);
    const feedback = $('feedback');
    feedback.className = `feedback ${answer.correct ? 'good' : 'bad'}`;
    feedback.textContent = answer.correct ? t('correct') : `${t('wrong')}. ${t('correctAnswer')}: ${tr(correct?.text || '')}`;
    $('scoreLive').textContent = tr(`${UI.correct}: ${state.score}`);
    $('nextBtn').disabled = false;
    $('progressBar').style.width = `${((state.index + 1) / state.quiz.length) * 100}%`;
  }

  function nextQuestion(){
    if(!state.answered) return;
    if(state.index < state.quiz.length - 1){ state.index += 1; renderQuestion(); } else finishQuiz();
  }

  function finishQuiz(){
    if(!state.quiz.length) return;
    if(!state.answered && state.index === state.quiz.length - 1) return;
    clearInterval(state.timerId);
    const percent = Math.round((state.score / state.quiz.length) * 100);
    const result = {
      category: state.category?.title || '', score: state.score, total: state.quiz.length, percent,
      duration: fmtTime(Date.now() - state.startedAt), date: new Date().toLocaleString('uz-UZ')
    };
    state.lastResult = result;
    localStorage.setItem('elektrovoz:lastResult', JSON.stringify(result));
    showResult(result);
  }

  function showResult(result){
    if(!result){ alert(t('noResult')); return; }
    $('resultPercent').textContent = `${result.percent}%`;
    document.querySelector('.result-circle').style.setProperty('--p', `${result.percent}%`);
    $('resultSummary').textContent = tr(UI.resultSentence.replace('{total}', result.total).replace('{score}', result.score)) + ` ${tr('Vaqt')}: ${result.duration}.`;
    if(typeof $('resultDialog').showModal === 'function') $('resultDialog').showModal(); else $('resultDialog').setAttribute('open','open');
  }

  function closeResult(){ $('resultDialog').close ? $('resultDialog').close() : $('resultDialog').removeAttribute('open'); }
  function goHome(){ closeResult(); clearInterval(state.timerId); $('quizView').classList.add('hidden'); $('home').classList.remove('hidden'); window.scrollTo({top:0, behavior:'smooth'}); }
  function exportCSV(){
    const r = state.lastResult; if(!r) return;
    const csv = 'Kategoriya,Savollar,To‘g‘ri,Foiz,Vaqt,Sana\n' + [`"${r.category}"`,r.total,r.score,`${r.percent}%`,r.duration,`"${r.date}"`].join(',');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='elektrovoz_test_natija.csv'; a.click(); URL.revokeObjectURL(url);
  }

  $('themeBtn').addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); });
  $('langBtn').addEventListener('click', () => { state.lang = state.lang === 'lat' ? 'cyr' : 'lat'; applyLang(); });
  $('searchInput').addEventListener('input', renderCategories);
  $('backBtn').addEventListener('click', goHome);
  $('nextBtn').addEventListener('click', nextQuestion);
  $('finishBtn').addEventListener('click', finishQuiz);
  $('retryBtn').addEventListener('click', () => { closeResult(); if(state.category) startQuiz(state.category.id); });
  $('homeBtn').addEventListener('click', goHome);
  $('closeResult').addEventListener('click', closeResult);
  $('openResultsBtn').addEventListener('click', () => showResult(state.lastResult));
  $('exportBtn').addEventListener('click', exportCSV);

  renderStats(); applyTheme(); applyLang();
})();
