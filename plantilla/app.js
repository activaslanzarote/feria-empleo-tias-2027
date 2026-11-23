/* Feria de Empleo de Tías · interacción de la página (menú, programa por perfil, pestañas y galería). */
(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');
  var reduce=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav sólida + progreso + sección activa */
  var nav=d.getElementById('nav'), bar=d.getElementById('progress');
  function onScroll(){
    var y=window.scrollY||0, h=d.body.scrollHeight-innerHeight;
    nav.classList.toggle('solid', y>innerHeight*0.6);
    bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var links=[].slice.call(d.querySelectorAll('.links a'));
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    d.querySelectorAll('main section[id]').forEach(function(s){so.observe(s)});
  }

  /* menú móvil */
  var mb=d.getElementById('menu-btn'), sheet=d.getElementById('sheet');
  if(mb&&sheet){
    mb.addEventListener('click',function(){var o=sheet.hidden; sheet.hidden=!o; mb.setAttribute('aria-expanded',String(o)); if(o)nav.classList.add('solid')});
    sheet.addEventListener('click',function(e){if(e.target.tagName==='A'){sheet.hidden=true; mb.setAttribute('aria-expanded','false')}});
  }

  /* revelado suave (solo desplazamiento, contenido siempre visible) */
  if(!reduce && 'IntersectionObserver' in window){
    var rv=[].slice.call(d.querySelectorAll('.rv'));
    var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in'); ro.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){var r=el.getBoundingClientRect(); if(r.top<innerHeight){el.classList.add('in')} else ro.observe(el)});
  } else { d.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')}) }

  /* contadores: cuentan hasta la cifra si es un número sencillo */
  if(!reduce && 'IntersectionObserver' in window){
    var nums=[].slice.call(d.querySelectorAll('.stat .n')).filter(function(el){return /^\d+$/.test(el.textContent.trim())});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; co.unobserve(e.target);
      var el=e.target, to=+el.textContent.trim(), t0=null;
      function step(ts){ if(!t0)t0=ts; var p=Math.min(1,(ts-t0)/1300); el.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1)requestAnimationFrame(step) }
      requestAnimationFrame(step);
    })},{threshold:.6});
    nums.forEach(function(el){var r=el.getBoundingClientRect(); if(r.top>innerHeight) co.observe(el)});
  }

  /* programa por perfil */
  var routes=window.FERIA_RUTAS||{};
  var chips=[].slice.call(d.querySelectorAll('.chips button'));
  var marcables=[].slice.call(d.querySelectorAll('#programa [data-p]'));
  var conSalas=[].slice.call(d.querySelectorAll('#programa .slot[data-salas]'));
  var route=d.getElementById('route'), rt=d.getElementById('route-title'), rl=d.getElementById('route-list');
  function tiene(el,p){return (' '+(el.getAttribute('data-p')||'')+' ').indexOf(' '+p+' ')>-1}
  function setP(p){
    chips.forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.p===p))});
    marcables.concat(conSalas).forEach(function(el){el.classList.remove('dim','pick')});
    if(p==='all'||!routes[p]){ if(route)route.hidden=true; return }
    marcables.forEach(function(el){
      var on=tiene(el,p);
      if(el.classList.contains('room')){ el.classList.toggle('pick',on); el.classList.toggle('dim',!on); return }
      el.classList.add(on?'pick':'dim');
    });
    conSalas.forEach(function(s){
      var any=[].some.call(s.querySelectorAll('.room'),function(r){return tiene(r,p)});
      s.classList.toggle('dim',!any);
    });
    var r=routes[p]; rt.textContent=r.t; rl.innerHTML=r.l.map(function(x){return '<li><span>'+x+'</span></li>'}).join(''); route.hidden=false;
  }
  chips.forEach(function(c){c.addEventListener('click',function(){setP(c.dataset.p)})});

  /* pestañas Hoy contratamos */
  var tabs=[].slice.call(d.querySelectorAll('[role="tab"]'));
  function selTab(t){tabs.forEach(function(x){var on=x===t; x.setAttribute('aria-selected',String(on)); x.tabIndex=on?0:-1; d.getElementById(x.getAttribute('aria-controls')).hidden=!on})}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){selTab(t)});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length]; selTab(n); n.focus()}});
  });

  /* galería ampliable */
  var gb=[].slice.call(d.querySelectorAll('#mos button')), lb=d.getElementById('lb'), li=d.getElementById('lb-img'), lc=d.getElementById('lb-cap'), cur=0, last=null;
  if(!gb.length||!lb)return;
  function show(i){cur=(i+gb.length)%gb.length; var b=gb[cur], im=b.querySelector('img'); li.src=im.src; li.alt=im.alt; lc.textContent=(b.dataset.cap?b.dataset.cap+' · ':'')+(cur+1)+'/'+gb.length}
  function open(i){last=d.activeElement; show(i); lb.hidden=false; d.getElementById('lb-close').focus()}
  function close(){lb.hidden=true; if(last)last.focus()}
  gb.forEach(function(b,i){b.addEventListener('click',function(){open(i)})});
  d.getElementById('lb-close').addEventListener('click',close);
  d.getElementById('lb-prev').addEventListener('click',function(){show(cur-1)});
  d.getElementById('lb-next').addEventListener('click',function(){show(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  d.addEventListener('keydown',function(e){if(lb.hidden)return; if(e.key==='Escape')close(); if(e.key==='ArrowRight')show(cur+1); if(e.key==='ArrowLeft')show(cur-1)});
})();
