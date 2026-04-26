/* ════════════════════════════════════
   STATE & DATE DETECTION
════════════════════════════════════ */
const STATE = { person:'gyaan', tab:'today', checked:new Set(), selected:{}, hideDoneShopping:false };
const LS_KEY = 'mealPlannerState_v1';

const TODAY  = new Date();
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MSHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// Week of month: day 1-7=week1, 8-14=week2, 15-21=week3, 22-28=week4, 29+=week1
function weekOfMonth(date) {
  const w = Math.ceil(date.getDate() / 7);
  return w > 4 ? 1 : w;
}

// Day index: 0=Monday … 6=Sunday
function dayIndex(date) {
  const raw = date.getDay(); // 0=Sun, 1=Mon…6=Sat
  return raw === 0 ? 6 : raw - 1;
}

const WEEK_N  = weekOfMonth(TODAY);
const DAY_I   = dayIndex(TODAY);
const WEEK_K  = 'week' + WEEK_N;
const WEEK_D  = PLAN[WEEK_K];
const TODAY_D = WEEK_D.days[DAY_I];

// Tomorrow
const TOMORROW = new Date(TODAY);
TOMORROW.setDate(TOMORROW.getDate() + 1);
const TMR_WEEK_N = weekOfMonth(TOMORROW);
const TMR_DAY_I  = dayIndex(TOMORROW);
const TMR_WEEK_K = 'week' + TMR_WEEK_N;
const TMR_D      = PLAN[TMR_WEEK_K].days[TMR_DAY_I];

// Day after tomorrow
const DAY2 = new Date(TODAY);
DAY2.setDate(DAY2.getDate() + 2);
const DAY2_WEEK_N = weekOfMonth(DAY2);
const DAY2_DAY_I  = dayIndex(DAY2);
const DAY2_WEEK_K = 'week' + DAY2_WEEK_N;
const DAY2_D      = PLAN[DAY2_WEEK_K].days[DAY2_DAY_I];

// Next week (cycle 1→2→3→4→1)
const NEXT_WEEK_N = WEEK_N === 4 ? 1 : WEEK_N + 1;
const NEXT_WEEK_K = 'week' + NEXT_WEEK_N;
const NEXT_WEEK_D = PLAN[NEXT_WEEK_K];

// Flags
const IS_NIGHT    = TODAY.getHours() >= 17;   // 5 PM+
const IS_WEEK_END = DAY_I >= 4;               // Fri(4) Sat(5) Sun(6)

function fmtDate(d){ return MSHORT[d.getMonth()] + ' ' + d.getDate(); }

function weekRange(){
  const d = new Date(TODAY);
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(d); mon.setDate(d.getDate() + diff);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return MSHORT[mon.getMonth()] + ' ' + mon.getDate() + '–' + sun.getDate();
}


/* ════════════════════════════════════
   LOCAL STORAGE
════════════════════════════════════ */
function loadState(){
  try {
    var saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    if(saved.person && PERSONS[saved.person]) STATE.person = saved.person;
    if(Array.isArray(saved.checked)) STATE.checked = new Set(saved.checked);
    if(saved.selected && typeof saved.selected === 'object') STATE.selected = saved.selected;
    if(typeof saved.hideDoneShopping === 'boolean') STATE.hideDoneShopping = saved.hideDoneShopping;
  } catch(e) {
    console.warn('Could not load saved meal planner state', e);
  }
}

function saveState(){
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      person: STATE.person,
      checked: Array.from(STATE.checked),
      selected: STATE.selected,
      hideDoneShopping: STATE.hideDoneShopping
    }));
  } catch(e) {
    console.warn('Could not save meal planner state', e);
  }
}

function mealKey(dateKey, mealIdx){
  return STATE.person + '-' + dateKey + '-meal' + mealIdx;
}

function selectMealOption(dateKey, mealIdx, optIdx){
  STATE.selected[mealKey(dateKey, mealIdx)] = optIdx;
  saveState();
  renderCurrent();
}

function getSelectedOption(dateKey, mealIdx){
  var key = mealKey(dateKey, mealIdx);
  return Object.prototype.hasOwnProperty.call(STATE.selected, key) ? STATE.selected[key] : null;
}


function resetToday(){
  var dateKey = WEEK_K + '-' + DAY_I;
  TODAY_D.meals.forEach(function(_, mealIdx){
    delete STATE.selected[mealKey(dateKey, mealIdx)];
  });
  saveState();
  renderCurrent();
}

function selectedTodayTotals(dayData, dateKey, pF, cF, snack){
  var selectedP = snack.pro;
  var selectedC = snack.cal;
  var selectedCount = 0;
  dayData.meals.forEach(function(meal, mealIdx){
    var si = getSelectedOption(dateKey, mealIdx);
    if(si !== null){
      selectedCount++;
      selectedP += Math.round(meal.opts[si].p*pF);
      selectedC += Math.round(meal.opts[si].c*cF);
    }
  });
  return {protein:selectedP, calories:selectedC, count:selectedCount};
}

function renderTodayProgress(stats, per){
  var totalMeals = TODAY_D.meals.length;
  var pPct = Math.min(100, Math.round(stats.protein / per.proMin * 100));
  var cPct = Math.min(100, Math.round(stats.calories / per.calMin * 100));
  var proteinGap = Math.max(0, per.proMin - stats.protein);
  var status = stats.count === 0
    ? 'Select your meal options to start tracking today.'
    : (proteinGap > 0 ? proteinGap + 'g protein left to hit minimum target.' : 'Protein target reached for today.');

  document.getElementById('todayProgress').innerHTML =
    '<div class="progress-card">'+
      '<div class="pc-top">'+
        '<div><div class="pc-title">Today Progress</div><div class="pc-status">'+status+'</div></div>'+
        '<div class="pc-actions"><div class="pc-pill">'+stats.count+'/'+totalMeals+' meals</div><button class="mini-action-btn danger" onclick="resetToday()">Reset</button></div>'+
      '</div>'+
      '<div class="pc-grid">'+
        '<div class="pc-metric">'+
          '<div class="pc-label">Protein</div>'+
          '<div class="pc-value">'+stats.protein+'g</div>'+
          '<div class="pc-sub">Goal '+per.proMin+'–'+per.proMax+'g</div>'+
          '<div class="pc-bar"><div class="pc-fill" style="width:'+pPct+'%"></div></div>'+
        '</div>'+
        '<div class="pc-metric">'+
          '<div class="pc-label">Calories</div>'+
          '<div class="pc-value">'+stats.calories+'</div>'+
          '<div class="pc-sub">Goal '+per.calMin+'–'+per.calMax+' kcal</div>'+
          '<div class="pc-bar"><div class="pc-fill" style="width:'+cPct+'%"></div></div>'+
        '</div>'+
      '</div>'+
    '</div>';
}


/* ════════════════════════════════════
   HELPERS
════════════════════════════════════ */
function mac(p, c){
  return '<span class="mac p">'+p+'g</span><span class="mac c">'+c+' kcal</span>';
}

function macSm(p, c){
  return '<div class="mini-macs"><span class="mac p">'+p+'g</span><span class="mac c">'+c+'</span></div>';
}

function dayRange(dayData, pF, cF){
  let minP=0,maxP=0,minC=0,maxC=0;
  dayData.meals.forEach(function(meal){
    var p0=Math.round(meal.opts[0].p*pF), p1=Math.round(meal.opts[1].p*pF);
    var c0=Math.round(meal.opts[0].c*cF), c1=Math.round(meal.opts[1].c*cF);
    minP+=Math.min(p0,p1); maxP+=Math.max(p0,p1);
    minC+=Math.min(c0,c1); maxC+=Math.max(c0,c1);
  });
  return {minP:minP, maxP:maxP, minC:minC, maxC:maxC};
}

function getPortionHint(mealName, person){
  var n = mealName.toLowerCase();
  var g = (person === 'gyaan');
  var parts = [];
  if(n.includes('chicken'))                          parts.push(g ? '160g chicken' : '120g chicken');
  if(n.includes('paneer'))                           parts.push(g ? '100g paneer'  : '80g paneer');
  if(n.includes('omelette'))                         parts.push(g ? '3 eggs'       : '2 eggs');
  else if(n.includes('egg bhurji') || n.includes('egg roll') || n.includes('egg sandwich') || n.includes('boiled egg'))
                                                     parts.push(g ? '3 eggs'       : '2 eggs');
  else if(n.includes('egg') || n.includes('eggs'))   parts.push(g ? '2–3 eggs'     : '2 eggs');
  if(n.includes('whey') && !n.includes('skip'))      parts.push(g ? '1 scoop (25g)': '— skip whey');
  if(n.includes('dal'))                              parts.push(g ? '1½ cup dal'   : '1 cup dal');
  if(n.includes('rice'))                             parts.push(g ? '¾ cup rice'   : '½ cup rice');
  if(n.includes('roti'))                             parts.push(g ? '2 roti'       : '1½ roti');
  if(n.includes('bread') || n.includes('toast') || n.includes('sandwich'))
                                                     parts.push(g ? '2 slices'     : '1½ slices');
  if(n.includes('curd') || n.includes('yogurt'))     parts.push(g ? '150g curd'    : '100g curd');
  if(n.includes('milk') && !n.includes('whey'))      parts.push(g ? '300ml milk'   : '200ml milk');
  if(n.includes('poha'))                             parts.push(g ? '1 cup poha'   : '¾ cup poha');
  if(n.includes('upma'))                             parts.push(g ? '1 cup upma'   : '¾ cup upma');
  if(n.includes('banana'))                           parts.push('1 banana');
  return parts.join(' · ');
}

function renderOptRow(opt, i, pF, cF, person, dateKey, mealIdx){
  var portion = getPortionHint(opt.n, person);
  var query = encodeURIComponent(opt.n + ' recipe indian');
  var ytUrl = 'https://www.youtube.com/results?search_query=' + query;
  var selectable = dateKey !== undefined && mealIdx !== undefined;
  var selected = selectable && getSelectedOption(dateKey, mealIdx) === i;
  var clickAttr = selectable ? ' onclick="selectMealOption(\''+dateKey+'\','+mealIdx+','+i+')" onkeydown="handleOptionKey(event,\''+dateKey+'\','+mealIdx+','+i+')" role="button" tabindex="0" aria-pressed="'+(selected ? 'true' : 'false')+'"' : '';
  var cls = 'opt-row' + (selectable ? ' selectable' : '') + (selected ? ' selected' : '');
  return '<div class="'+cls+'"'+clickAttr+'>'+
    '<div style="flex:1">'+
      '<span class="opt-num">OPT '+(i+1)+'</span>'+
      '<div class="opt-name">'+opt.n+'</div>'+
      (portion ? '<div class="opt-portion">'+portion+'</div>' : '')+
      (selected ? '<div class="selected-note">Selected for today</div>' : '')+
    '</div>'+
    '<div style="display:flex;align-items:center;gap:7px;flex-shrink:0">'+
      '<div class="opt-macs">'+mac(Math.round(opt.p*pF), Math.round(opt.c*cF))+'</div>'+
      '<a href="'+ytUrl+'" target="_blank" class="yt-btn" onclick="event.stopPropagation()">▶️</a>'+
    '</div>'+
  '</div>';
}


function handleOptionKey(event, dateKey, mealIdx, optIdx){
  if(event.key === 'Enter' || event.key === ' '){
    event.preventDefault();
    selectMealOption(dateKey, mealIdx, optIdx);
  }
}

/* ════════════════════════════════════
   RENDER TODAY
════════════════════════════════════ */
function renderToday(){
  var per = PERSONS[STATE.person];
  var pF = per.pFactor, cF = per.cFactor;

  document.getElementById('dayName').textContent = DAYS[DAY_I];
  document.getElementById('daySubtitle').textContent =
    MONTHS[TODAY.getMonth()] + ' ' + TODAY.getDate() + ' · Week ' + WEEK_N + ' of ' + MONTHS[TODAY.getMonth()];

  // Low protein alert for Gyaan
  var alertHtml = '';
  if(STATE.person === 'gyaan'){
    var bestBfast = Math.max(TODAY_D.meals[0].opts[0].p, TODAY_D.meals[0].opts[1].p);
    if(bestBfast < 20){
      alertHtml = '<div class="protein-alert"><span>⚠️</span><span><strong>Low-protein breakfast day.</strong> Pick Option 2 at breakfast — or add 2 boiled eggs to your choice — to stay on track for 100g+.</span></div>';
    }
  }
  document.getElementById('alertBox').innerHTML = alertHtml;

  var todayDateKey = WEEK_K + '-' + DAY_I;
  var progressStats = selectedTodayTotals(TODAY_D, todayDateKey, pF, cF, per.snack);
  renderTodayProgress(progressStats, per);

  // Meals
  var mealsHtml = TODAY_D.meals.map(function(meal, mealIdx){
    var optsHtml = meal.opts.map(function(opt, i){
      return renderOptRow(opt, i, pF, cF, STATE.person, todayDateKey, mealIdx);
    }).join('');
    return '<div class="meal-card">'+
      '<div class="mc-hd"><span class="mc-emoji">'+meal.ic+'</span><span class="mc-title">'+meal.title+'</span><span class="mc-time">'+meal.time+'</span></div>'+
      optsHtml+'</div>';
  }).join('');
  document.getElementById('todayMeals').innerHTML = mealsHtml;

  // Snack
  var sk = per.snack;
  document.getElementById('snackCard').innerHTML =
    '<div class="snack-card '+STATE.person+'">'+
      '<span class="snack-emoji">'+sk.emoji+'</span>'+
      '<div class="snack-body"><div class="snack-title">Snack · '+sk.label+'</div><div class="snack-desc">'+sk.desc+'</div></div>'+
      '<div class="snack-macs">'+mac(sk.pro, sk.cal)+'</div>'+
    '</div>';

  // Day totals
  var r = dayRange(TODAY_D, pF, cF);
  var selectedP = progressStats.protein;
  var selectedC = progressStats.calories;
  var selectedCount = progressStats.count;

  var wMinP = r.minP + sk.pro, wMaxP = r.maxP + sk.pro;
  var wMinC = r.minC + sk.cal, wMaxC = r.maxC + sk.cal;
  var showSelected = selectedCount > 0;
  var displayP = showSelected ? selectedP : Math.round((wMinP+wMaxP)/2);
  var displayC = showSelected ? selectedC : Math.round((wMinC+wMaxC)/2);
  var tgtMidP = (per.proMin+per.proMax)/2, tgtMidC = (per.calMin+per.calMax)/2;
  var pPct = Math.min(100, Math.round(displayP/tgtMidP*100));
  var cPct = Math.min(100, Math.round(displayC/tgtMidC*100));
  var footerText = showSelected
    ? 'Selected '+selectedCount+'/'+TODAY_D.meals.length+' meals · snack included'
    : 'Tap Option 1 or 2 to calculate selected totals';

  document.getElementById('dayTotal').innerHTML =
    '<div class="day-total">'+
      '<div class="dt-label-top">'+(showSelected ? 'Selected Total' : 'Estimated Day Range')+'</div>'+
      '<div class="dt-block">'+
        '<div class="dt-top"><span class="dt-key">Protein</span><span class="dt-val">'+(showSelected ? selectedP+'g' : wMinP+'–'+wMaxP+'g')+'</span></div>'+
        '<div class="dt-bar"><div class="dt-fill" style="width:'+pPct+'%"></div></div>'+
        '<div class="dt-sub">Target: '+per.proMin+'–'+per.proMax+'g</div>'+
      '</div>'+
      '<div class="dt-block">'+
        '<div class="dt-top"><span class="dt-key">Calories</span><span class="dt-val">'+(showSelected ? selectedC : wMinC+'–'+wMaxC)+'</span></div>'+
        '<div class="dt-bar"><div class="dt-fill" style="width:'+cPct+'%"></div></div>'+
        '<div class="dt-sub">Target: '+per.calMin+'–'+per.calMax+' kcal</div>'+
      '</div>'+
      '<div class="dt-footer">'+footerText+'</div>'+
    '</div>';

  // Tomorrow + Day2 section (5 PM+)
  var tmrHtml = '';
  if(IS_NIGHT){
    function buildDayCards(dayData, dayLabel, weekNote){
      var mHtml = dayData.meals.map(function(meal){
        var optsHtml = meal.opts.map(function(opt, i){
          return renderOptRow(opt, i, pF, cF, STATE.person);
        }).join('');
        return '<div class="meal-card">'+
          '<div class="mc-hd"><span class="mc-emoji">'+meal.ic+'</span><span class="mc-title">'+meal.title+'</span><span class="mc-time">'+meal.time+'</span></div>'+
          optsHtml+'</div>';
      }).join('');
      return '<div class="section-divider">'+
          '<div class="sd-line"></div>'+
          '<span class="sd-label">'+dayLabel+'</span>'+
          '<span class="sd-chip">'+DAYS[dayIndex(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + (dayLabel==='Tomorrow'?1:2)))]+(weekNote?' · Week '+weekNote:'')+'</span>'+
          '<div class="sd-line"></div>'+
        '</div>'+ mHtml;
    }
    var tmrWeekNote = (TMR_WEEK_N !== WEEK_N) ? TMR_WEEK_N : '';
    var day2WeekNote = (DAY2_WEEK_N !== WEEK_N) ? DAY2_WEEK_N : '';
    tmrHtml = buildDayCards(TMR_D, 'Tomorrow', tmrWeekNote) +
              buildDayCards(DAY2_D, 'Day After', day2WeekNote);
  }
  document.getElementById('tomorrowSection').innerHTML = tmrHtml;
}

/* ════════════════════════════════════
   RENDER WEEK
════════════════════════════════════ */
function renderWeek(){
  var per = PERSONS[STATE.person];
  var pF = per.pFactor, cF = per.cFactor;

  document.getElementById('weekTitle').textContent = 'Week ' + WEEK_N;
  document.getElementById('weekDesc').textContent = WEEK_D.desc;

  var html = WEEK_D.days.map(function(dayData, idx){
    var isToday = (idx === DAY_I);
    var r = dayRange(dayData, pF, cF);
    var abbr = DAYS[idx].slice(0,3).toUpperCase();

    var mealsHtml = dayData.meals.map(function(meal){
      var optsHtml = meal.opts.map(function(opt, i){
        var query = encodeURIComponent(opt.n + ' recipe indian');
        var ytUrl = 'https://www.youtube.com/results?search_query=' + query;
        return '<div class="mini-opt">'+
          '<span class="mini-tag">O'+(i+1)+'</span>'+
          '<span class="mini-name">'+opt.n+'</span>'+
          macSm(Math.round(opt.p*pF), Math.round(opt.c*cF))+
          '<a href="'+ytUrl+'" target="_blank" class="yt-btn" style="width:24px;height:24px;font-size:11px">▶️</a>'+
        '</div>';
      }).join('');
      return '<div class="mini-meal"><div class="mini-title">'+meal.ic+' '+meal.title+'</div>'+optsHtml+'</div>';
    }).join('');

    return '<div class="day-acc'+(isToday?' today-acc open':'')+'" id="dacc'+idx+'">'+
      '<button class="day-acc-btn" onclick="toggleDay('+idx+')">'+
        '<div class="day-dot'+(isToday?' today-dot':'')+'">'+
          '<span>'+abbr+'</span>'+
          '<span>'+(isToday?'NOW':'')+'</span>'+
        '</div>'+
        '<div style="flex:1">'+
          '<div class="dai-name">'+dayData.name+(isToday?'<span class="today-badge">Today</span>':'')+'</div>'+
          '<div class="dai-note">'+dayData.note+'</div>'+
        '</div>'+
        '<div class="day-meta">'+
          '<div class="day-meta-pro">↑'+r.maxP+'g</div>'+
          '<div class="day-meta-cal">'+r.maxC+' kcal</div>'+
        '</div>'+
        '<span class="acc-arrow">⌄</span>'+
      '</button>'+
      '<div class="day-acc-body">'+mealsHtml+'</div>'+
    '</div>';
  }).join('');

  document.getElementById('weekDays').innerHTML = html;

  // Next week section (Fri/Sat/Sun only)
  var nwHtml = '';
  if(IS_WEEK_END){
    var nwDays = NEXT_WEEK_D.days.map(function(dayData, idx){
      var r = dayRange(dayData, pF, cF);
      var abbr = DAYS[idx].slice(0,3).toUpperCase();
      var mealsHtml = dayData.meals.map(function(meal){
        var optsHtml = meal.opts.map(function(opt, i){
          return '<div class="mini-opt"><span class="mini-tag">O'+(i+1)+'</span><span class="mini-name">'+opt.n+'</span>'+macSm(Math.round(opt.p*pF), Math.round(opt.c*cF))+'</div>';
        }).join('');
        return '<div class="mini-meal"><div class="mini-title">'+meal.ic+' '+meal.title+'</div>'+optsHtml+'</div>';
      }).join('');
      return '<div class="day-acc next-week-acc" id="nwdacc'+idx+'">'+
        '<button class="day-acc-btn" onclick="toggleNwDay('+idx+')">'+
          '<div class="day-dot"><span>'+abbr+'</span><span></span></div>'+
          '<div style="flex:1">'+
            '<div class="dai-name">'+dayData.name+'</div>'+
            '<div class="dai-note">'+dayData.note+'</div>'+
          '</div>'+
          '<div class="day-meta">'+
            '<div class="day-meta-pro">↑'+r.maxP+'g</div>'+
            '<div class="day-meta-cal">'+r.maxC+' kcal</div>'+
          '</div>'+
          '<span class="acc-arrow">⌄</span>'+
        '</button>'+
        '<div class="day-acc-body">'+mealsHtml+'</div>'+
      '</div>';
    }).join('');

    nwHtml =
      '<div class="section-divider">'+
        '<div class="sd-line"></div>'+
        '<span class="sd-label">Next Week</span>'+
        '<span class="sd-chip">Week '+NEXT_WEEK_N+'</span>'+
        '<div class="sd-line"></div>'+
      '</div>'+
      '<div class="nw-week-header">'+
        '<div>'+
          '<div class="nw-week-title">Week '+NEXT_WEEK_N+'</div>'+
          '<div class="nw-week-desc">'+NEXT_WEEK_D.desc+'</div>'+
        '</div>'+
      '</div>'+
      nwDays;
  }
  document.getElementById('weekDays').innerHTML = html + nwHtml;
}

/* ════════════════════════════════════
   RENDER SHOPPING
════════════════════════════════════ */
function renderShopping(){
  document.getElementById('shopSub').textContent = 'Week ' + WEEK_N + ' · ' + weekRange();
  renderWeeklyShop();
  renderDailyShop();
}

function shopItem(key, name, qty){
  var done = STATE.checked.has(key);
  if(STATE.hideDoneShopping && done) return '';
  return '<button type="button" class="shop-item'+(done?' done':'')+'" onclick="toggleCheck(\''+key+'\',this)" aria-pressed="'+(done ? 'true' : 'false')+'">'+
    '<span class="chk" aria-hidden="true">'+(done?'✓':'')+'</span>'+
    '<span class="si-name">'+name+'</span>'+
    '<span class="si-qty">'+qty+'</span>'+
  '</button>';
}


function shopGroup(label, items, prefix){
  var rows = items.map(function(it,i){ return shopItem(prefix+'-'+i, it.n, it.q); }).join('');
  if(!rows && STATE.hideDoneShopping){ rows = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">All caught up</div><div class="empty-copy">Everything in this section is completed.</div></div>'; }
  return '<div class="shop-group"><div class="sg-label">'+label+'</div>'+ rows + '</div>';
}

function shoppingKeys(scope){
  var keys = [];
  if(scope === 'weekly'){
    var w = SHOP.weekly[WEEK_K];
    [['wp',w.proteins],['wc',w.carbs],['wv',w.produce],['wpa',w.pantry]].forEach(function(pair){
      pair[1].forEach(function(_, i){ keys.push(WEEK_K+'-'+pair[0]+'-'+i); });
    });
  } else {
    [['de',SHOP.daily.everyday],['da',SHOP.daily.altday],['do',SHOP.daily.once]].forEach(function(pair){
      pair[1].forEach(function(_, i){ keys.push('daily-'+pair[0]+'-'+i); });
    });
  }
  return keys;
}

function shoppingProgress(scope){
  var keys = shoppingKeys(scope);
  var done = keys.filter(function(k){ return STATE.checked.has(k); }).length;
  return {done:done, total:keys.length, pct: keys.length ? Math.round(done/keys.length*100) : 0};
}

function shopProgressCard(scope){
  var pr = shoppingProgress(scope);
  var label = scope === 'weekly' ? 'Weekly Shopping Progress' : 'Daily Top-up Progress';
  return '<div class="shop-progress-card">'+
    '<div class="spc-top"><div class="spc-title">'+label+'</div><div class="spc-count">'+pr.done+' / '+pr.total+'</div></div>'+ 
    '<div class="spc-bar"><div class="spc-fill" style="width:'+pr.pct+'%"></div></div>'+ 
    '<div class="spc-actions">'+
      '<button class="mini-action-btn" onclick="toggleHideCompleted()">'+(STATE.hideDoneShopping ? 'Show completed' : 'Hide completed')+'</button>'+ 
      '<button class="mini-action-btn danger" onclick="resetShoppingScope(\''+scope+'\')">Reset '+(scope === 'weekly' ? 'week' : 'daily')+'</button>'+ 
    '</div>'+ 
  '</div>';
}

function toggleHideCompleted(){
  STATE.hideDoneShopping = !STATE.hideDoneShopping;
  saveState();
  renderShopping();
}

function resetShoppingScope(scope){
  shoppingKeys(scope).forEach(function(k){ STATE.checked.delete(k); });
  saveState();
  renderShopping();
}

function renderWeeklyShop(){
  var w = SHOP.weekly[WEEK_K];
  document.getElementById('sp-weekly').innerHTML =
    shopProgressCard('weekly') +
    shopGroup('🥩 Proteins', w.proteins, WEEK_K+'-wp') +
    shopGroup('🌾 Carbs & Staples', w.carbs, WEEK_K+'-wc') +
    shopGroup('🥬 Fresh Produce', w.produce, WEEK_K+'-wv') +
    shopGroup('🫙 Pantry', w.pantry, WEEK_K+'-wpa') +
    '<div class="shop-note-box">💡 <strong>Weekly shop = ~70% of your meals.</strong> Buy chicken in 2–3 batches (not all at once). Paneer keeps 3–4 days once opened.</div>';
}

function renderDailyShop(){
  document.getElementById('sp-daily').innerHTML =
    shopProgressCard('daily') +
    shopGroup('🥛 Buy Daily (or every 2 days)', SHOP.daily.everyday, 'daily-de') +
    shopGroup('🍋 Alternate Day Top-up', SHOP.daily.altday, 'daily-da') +
    shopGroup('📦 Weekly Once', SHOP.daily.once, 'daily-do') +
    '<div class="shop-note-box">💡 <strong>The 3 things to never run out of:</strong> milk, curd, bananas. Everything else can wait 2 days. Buy fruit based on what looks good that day.</div>';
}

/* ════════════════════════════════════
   INTERACTIONS
════════════════════════════════════ */
function setPerson(p, btn){
  STATE.person = p;
  saveState();
  document.querySelectorAll('.p-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  updateStats();
  renderCurrent();
}

function setTab(tab, btn){
  STATE.tab = tab;
  document.querySelectorAll('.tab-panel').forEach(function(el){ el.classList.remove('on'); });
  document.getElementById('tab-'+tab).classList.add('on');
  document.querySelectorAll('.nb').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  renderCurrent();
}

function setShopTab(tab, btn){
  document.querySelectorAll('.st-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  document.querySelectorAll('.shop-panel').forEach(function(el){ el.classList.remove('on'); });
  document.getElementById('sp-'+tab).classList.add('on');
}

function toggleDay(idx){
  document.getElementById('dacc'+idx).classList.toggle('open');
}

function toggleNwDay(idx){
  document.getElementById('nwdacc'+idx).classList.toggle('open');
}

function toggleCheck(key, el){
  if(STATE.checked.has(key)){
    STATE.checked.delete(key);
    el.classList.remove('done');
    el.querySelector('.chk').textContent = '';
    el.setAttribute('aria-pressed', 'false');
  } else {
    STATE.checked.add(key);
    el.classList.add('done');
    el.querySelector('.chk').textContent = '✓';
    el.setAttribute('aria-pressed', 'true');
  }
  saveState();
  if(STATE.tab === 'shop') renderShopping();
}

function renderCurrent(){
  if(STATE.tab==='today') renderToday();
  else if(STATE.tab==='week') renderWeek();
  else renderShopping();
}

function updateStats(){
  var per = PERSONS[STATE.person];
  document.getElementById('statsBar').innerHTML =
    '<span class="s-chip pro">🥩 '+per.proMin+'–'+per.proMax+'g protein</span>'+
    '<span class="s-chip cal">🔥 '+per.calMin+'–'+per.calMax+' kcal</span>'+
    '<span class="s-note">'+per.note+'</span>';
}

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
(function init(){
  loadState();
  document.getElementById('weekChip').textContent = 'Week ' + WEEK_N + ' · ' + fmtDate(TODAY);
  document.querySelectorAll('.p-btn').forEach(function(b){
    b.classList.toggle('on', b.getAttribute('data-p') === STATE.person);
  });
  updateStats();
  renderToday();
})();
