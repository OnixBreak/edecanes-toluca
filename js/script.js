/*carrusel*/
(function(){
 var box=document.querySelector('.fade'); if(!box) return;
 var slides=box.querySelectorAll('.fade-slide'), n=slides.length, idx=0, timer=null;
 var dots=box.querySelector('.fade-dots');
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var MS=5000; /* tiempo que se queda cada foto: 5000 = 5 segundos */

 for(var i=0;i<n;i++){
  (function(i){
   var d=document.createElement('button');
   d.type='button'; d.className='fade-dot'; d.setAttribute('aria-label','Ver foto '+(i+1));
   d.addEventListener('click',function(){show(i);play()});
   dots.appendChild(d);
  })(i);
 }

 function show(i){
  slides[idx].classList.remove('on');
  idx=(i+n)%n;
  slides[idx].classList.add('on');
  var ds=dots.children;
  for(var k=0;k<ds.length;k++) ds[k].setAttribute('aria-current',k===idx);
 }
 function play(){ stop(); if(reduce||n<2) return; timer=setInterval(function(){show(idx+1)},MS); }
 function stop(){ if(timer){clearInterval(timer);timer=null;} }

 /* No cambia de foto si la pestaña está en segundo plano */
 document.addEventListener('visibilitychange',function(){ document.hidden?stop():play(); });

 show(0); play();
})();
/*Aquí termina el código del carrusel*/