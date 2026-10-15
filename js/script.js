/*fade*/
/*fade*/
(function(){
 var box=document.querySelector('.fade'); if(!box) return;
 var slides=box.querySelectorAll('.fade-slide'), n=slides.length, idx=0, timer=null;
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var MS=5000; /* tiempo que se queda cada foto 5 segundos */

 function show(i){
  slides[idx].classList.remove('on');
  idx=(i+n)%n;
  slides[idx].classList.add('on');
 }
 function play(){ stop(); if(reduce||n<2) return; timer=setInterval(function(){show(idx+1)},MS); }
 function stop(){ if(timer){clearInterval(timer);timer=null;} }

 /* No cambia de foto si la pestaña está en segundo plano */
 document.addEventListener('visibilitychange',function(){ document.hidden?stop():play(); });

 show(0); play();
})();
/*Aquí termina el código del fade*/


/*elementos en vista móvil*/

/* ===== Año del pie de página ===== */
(function(){
  var a=document.getElementById('anio');
  if(a) a.textContent=new Date().getFullYear();
})();

/* ===== Fotos que se desvanecen ===== */
(function(){
  var box=document.querySelector('.fade'); if(!box) return;
  var slides=box.querySelectorAll('.fade-slide'), n=slides.length, idx=0, timer=null;
  var dots=box.querySelector('.fade-dots');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MS=5000; /* segundos que se queda cada foto: 5000 = 5 s */

  /* Los puntos son opcionales: si borras <div class="fade-dots"></div> del HTML, no se crean */
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

/* ===== Galería de servicios ===== */
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