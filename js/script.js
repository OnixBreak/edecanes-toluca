/* del pie de página */
(function(){
  var a=document.getElementById('anio');
  if(a) a.textContent=new Date().getFullYear();
})();

/* Fade */
(function(){
  var box=document.querySelector('.fade'); if(!box) return;
  var slides=box.querySelectorAll('.fade-slide'), n=slides.length, idx=0, timer=null;
  var dots=box.querySelector('.fade-dots');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MS=5000; /* segundos que se queda cada foto: 5000 = 5 s */

  /* puntos de navegación del fade */
  if(dots){
    for(var i=0;i<n;i++){
      (function(i){
        var d=document.createElement('button');
        d.type='button'; d.className='fade-dot'; d.setAttribute('aria-label','Ver foto '+(i+1));
        d.addEventListener('click',function(){show(i);play()});
        dots.appendChild(d);
      })(i);
    }
  }
  function show(i){
    slides[idx].classList.remove('on');
    idx=(i+n)%n;
    slides[idx].classList.add('on');
    if(!dots) return;
    var ds=dots.children;
    for(var k=0;k<ds.length;k++) ds[k].setAttribute('aria-current',k===idx);
  }
  function play(){ stop(); if(reduce||n<2) return; timer=setInterval(function(){show(idx+1)},MS); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  document.addEventListener('visibilitychange',function(){ document.hidden?stop():play(); });
  show(0); play();
})();

/* Galería de servicios cards */
/* Computadora: pasar el mouse (CSS) o hacer clic. Celular: con solo tocar o deslizar el dedo sobre una tarjeta, se abre. */
(function(){
  var cards=document.querySelectorAll('.gal-card');
  if(!cards.length) return;
  var touched=false;

  function closeAll(except){
    cards.forEach(function(x){ if(x!==except) x.setAttribute('aria-expanded','false'); });
  }
  function openCard(c){
    if(c.getAttribute('aria-expanded')!=='true'){ closeAll(c); c.setAttribute('aria-expanded','true'); }
  }
  function cardAt(x,y){
    var el=document.elementFromPoint(x,y);
    return el&&el.closest?el.closest('.gal-card'):null;
  }

  /* Clic (mouse o teclado): abre o cierra la tarjeta */
  cards.forEach(function(c){
    c.addEventListener('click',function(){
      if(touched){ touched=false; return; }   /* el dedo ya la abrió */
      var open=c.getAttribute('aria-expanded')==='true';
      closeAll();
      if(!open) c.setAttribute('aria-expanded','true');
    });
  });

  /* Dedo: al tocar o deslizar sobre una tarjeta, se abre sin soltar */
  document.addEventListener('touchstart',function(e){
    var t=e.touches[0]; if(!t) return;
    var c=cardAt(t.clientX,t.clientY);
    if(c){ touched=true; openCard(c); } else { closeAll(); }
  },{passive:true});
  document.addEventListener('touchmove',function(e){
    var t=e.touches[0]; if(!t) return;
    var c=cardAt(t.clientX,t.clientY);
    if(c){ touched=true; openCard(c); }
  },{passive:true});
  document.addEventListener('touchend',function(){
    setTimeout(function(){ touched=false; },500);
  },{passive:true});

  /* Clic fuera de las tarjetas: las cierra */
  document.addEventListener('click',function(e){
    if(!e.target.closest('.gal-card')) closeAll();
  });
})();

/*servicios: galería emergente*/
(function(){
  var dlg=document.getElementById('lb');
  var cards=document.querySelectorAll('.gal-card');
  if(!dlg||!dlg.showModal||!cards.length) return;

  var WA='527224807838';  /* número de WhatsApp */
  var img=dlg.querySelector('.lb-img'),
      stage=dlg.querySelector('.lb-stage'),
      thumbs=dlg.querySelector('.lb-thumbs'),
      title=dlg.querySelector('#lb-title'),
      desc=dlg.querySelector('.lb-desc'),
      list=dlg.querySelector('.lb-list'),
      wa=dlg.querySelector('.lb-info .btn'),
      prev=dlg.querySelector('.lb-prev'),
      next=dlg.querySelector('.lb-next');
  var fotos=[], idx=0, nombre='';

  function show(i){
    if(!fotos.length) return;
    idx=(i+fotos.length)%fotos.length;
    img.src=fotos[idx];
    img.alt=nombre+' · foto '+(idx+1);
    var ts=thumbs.children;
    for(var k=0;k<ts.length;k++) ts[k].setAttribute('aria-current',k===idx);
  }

  var sesion=0;

function agregarFoto(src,i){
  fotos.push(src);
  var b=document.createElement('button');
  b.type='button'; b.className='lb-thumb'; b.setAttribute('aria-label','Ver foto '+(i+1));
  var t=document.createElement('img'); t.src=src; t.alt='';
  b.appendChild(t);
  b.addEventListener('click',function(){show(i)});
  thumbs.appendChild(b);
  var varias=fotos.length>1;
  thumbs.style.display=varias?'':'none';
  prev.style.display=next.style.display=varias?'':'none';
  if(fotos.length===1){ stage.style.display=''; show(0); }
}

function open(card){
  var mia=++sesion;
  nombre=card.querySelector('.gal-name').textContent.trim();
  fotos=[]; thumbs.innerHTML='';
  stage.style.display='none'; thumbs.style.display='none';
  prev.style.display=next.style.display='none';

  title.textContent=nombre;
  desc.textContent=card.dataset.desc||'';
  var ul=card.querySelector('.gal-over ul');
  list.innerHTML=ul?ul.innerHTML:'';
  wa.href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hola, quiero cotizar el servicio de '+nombre);

  document.documentElement.style.overflow='hidden';
  dlg.showModal();

  var carpeta=(card.dataset.carpeta||'').replace(/\/+$/,'');
  var total=parseInt(card.dataset.total,10)||0;   /* opcional */
  var n=1;
  function siguiente(){
    if(mia!==sesion) return;
    if(total&&n>total) return fin();
    var src=carpeta+'/'+n+'.jpg', im=new Image();
    im.onload=function(){ if(mia!==sesion) return; agregarFoto(src,n-1); n++; siguiente(); };
    im.onerror=fin;
    im.src=src;
  }
  function fin(){
    if(mia!==sesion||fotos.length) return;
    var own=card.querySelector('img');           /* si no hay carpeta o fotos, usa la de la tarjeta */
    if(own) agregarFoto(own.getAttribute('src'),0);
  }
  carpeta?siguiente():fin();
}

  cards.forEach(function(c){ c.addEventListener('click',function(){open(c)}); });

  prev.addEventListener('click',function(){show(idx-1)});
  next.addEventListener('click',function(){show(idx+1)});
  dlg.querySelector('.lb-close').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){ if(e.target===dlg) dlg.close(); });  /* clic en el fondo oscuro */
  dlg.addEventListener('close',function(){ document.documentElement.style.overflow=''; });
  dlg.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft') show(idx-1);
    else if(e.key==='ArrowRight') show(idx+1);
  });

  /* Deslizar el dedo sobre la foto: anterior / siguiente */
  var x0=null;
  stage.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; },{passive:true});
  stage.addEventListener('touchend',function(e){
    if(x0===null) return;
    var dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40) show(dx<0?idx+1:idx-1);
  },{passive:true});
})();