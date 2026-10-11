(function(){
 var box=document.querySelector('.car'); if(!box) return;
 var track=box.querySelector('.car-track');
 var slides=track.children, n=slides.length, idx=0, timer=null;
 var dots=box.querySelector('.car-dots');
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var MS=5000; /* segundos entre fotos: 5000 = 5 s */
 
 for(var i=0;i<n;i++){
  (function(i){
   var d=document.createElement('button');
   d.type='button'; d.className='car-dot'; d.setAttribute('aria-label','Ir a la foto '+(i+1));
   d.addEventListener('click',function(){go(i)});
   dots.appendChild(d);
  })(i);
 }
 
 function paint(){
  var ds=dots.children;
  for(var i=0;i<ds.length;i++) ds[i].setAttribute('aria-current', i===idx);
 }
 function go(i){
  idx=(i+n)%n;
  track.scrollTo({left:idx*track.clientWidth, behavior:reduce?'auto':'smooth'});
  paint();
 }
 track.addEventListener('scroll',function(){
  var i=Math.round(track.scrollLeft/track.clientWidth);
  if(i!==idx){idx=i;paint();}
 },{passive:true});
 window.addEventListener('resize',function(){track.scrollLeft=idx*track.clientWidth});
 
 box.querySelector('.car-prev').addEventListener('click',function(){go(idx-1)});
 box.querySelector('.car-next').addEventListener('click',function(){go(idx+1)});
 track.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft'){go(idx-1)} else if(e.key==='ArrowRight'){go(idx+1)}
 });
 
 /* Autoplay: se pausa al pasar el mouse, tocar o enfocar */
 function play(){ if(reduce||n<2) return; stop(); timer=setInterval(function(){go(idx+1)},MS); }
 function stop(){ if(timer){clearInterval(timer);timer=null;} }
 ['mouseenter','focusin','touchstart'].forEach(function(ev){box.addEventListener(ev,stop,{passive:true})});
 ['mouseleave','focusout','touchend'].forEach(function(ev){box.addEventListener(ev,play,{passive:true})});
 
 paint(); play();
})();