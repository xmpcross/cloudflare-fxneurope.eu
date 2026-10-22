(() => {
 'use strict';
 const host=document.querySelector('[data-development-animation]');
 if(!host || !window.lottie)return;
 const poster=document.querySelector('.development-poster'), button=document.querySelector('.animation-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let animation,ready=false,manuallyPaused=false,visible=true;
 const sync=()=>{
  if(!ready)return;
  const still=reduced.matches;
  poster.hidden=!still;host.hidden=still;button.hidden=still;
  if(still||manuallyPaused||!visible||document.hidden)animation.pause();else animation.play();
  button.textContent=manuallyPaused?button.dataset.play:button.dataset.pause;
 };
 const init=()=>{
  if(animation||reduced.matches)return;
  animation=lottie.loadAnimation({container:host,renderer:'svg',loop:true,autoplay:false,path:'/lottie/development-build.json',rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
  animation.addEventListener('DOMLoaded',()=>{ready=true;sync();});
  animation.addEventListener('data_failed',()=>{poster.hidden=false;host.hidden=true;button.hidden=true;});
 };
 button.addEventListener('click',()=>{manuallyPaused=!manuallyPaused;sync();});
 reduced.addEventListener('change',()=>{init();sync();});
 document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(host.parentElement);
 init();
})();
