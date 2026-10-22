(() => {
 'use strict';
 const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('#main-nav'), language = document.querySelector('.language');
 const setMenu = open => {nav.classList.toggle('open', open);toggle.setAttribute('aria-expanded', String(open));toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);};
 toggle.addEventListener('click', () => {const open=toggle.getAttribute('aria-expanded')!=='true';if(open)language.open=false;setMenu(open);});
 document.addEventListener('keydown', ev => {if(ev.key!=='Escape')return;if(toggle.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus();}if(language.open){language.open=false;language.querySelector('summary').focus();}});
 document.addEventListener('click', ev => {if(!ev.target.closest('.header'))setMenu(false);if(!language.contains(ev.target))language.open=false;});
 matchMedia('(min-width: 1101px)').addEventListener('change', ev=>{if(ev.matches)setMenu(false);});
 const cookie=document.querySelector('.cookie-note');let saved;try{saved=localStorage.getItem('cookie-consent');}catch{}
 if(!['accepted','rejected'].includes(saved))cookie.hidden=false;
 document.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{try{localStorage.setItem('cookie-consent',button.dataset.consent);}catch{}cookie.hidden=true;}));
 const toc=document.querySelector('.legal-toc');if(toc && matchMedia('(max-width: 760px)').matches)toc.open=false;
 const form=document.querySelector('[data-contact]');if(!form)return;
 form.addEventListener('formdata', ev => {
  const details=[...form.querySelectorAll('[data-brief]')].filter(el=>el.value.trim()).map(el=>el.dataset.brief+': '+el.value.trim());
  if(details.length)ev.formData.set('message',String(ev.formData.get('message')||'')+'\n\n'+details.join('\n'));
 });
 form.addEventListener('submit',async ev=>{
  ev.preventDefault();if(form.getAttribute('aria-busy')==='true')return;
  const button=form.querySelector('[type=submit]'), status=form.querySelector('.form-status'), original=button.innerHTML;
  button.disabled=true;button.textContent=form.dataset.sending;form.setAttribute('aria-busy','true');status.hidden=true;
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),20000);
  try {
   const response=await fetch(form.action,{method:'POST',body:new URLSearchParams(new FormData(form)),signal:controller.signal,headers:{Accept:'text/plain'}});
   if(!response.ok)throw new Error(response.status===429?'rate':'error');
   status.textContent=form.dataset.success;status.dataset.state='success';form.reset();
  }catch(error){status.textContent=error.message==='rate'?form.dataset.rate:form.dataset.error;status.dataset.state='error';}
  finally{clearTimeout(timeout);button.disabled=false;button.innerHTML=original;form.removeAttribute('aria-busy');status.hidden=false;status.focus();}
 });
})();

// Keep every plan readable without JavaScript; enhance to a selectable workflow.
document.querySelectorAll('[data-venture-process]').forEach(section=>{
 const buttons=[...section.querySelectorAll('[data-process-step]')];
 const panels=[...section.querySelectorAll('[data-process-panel]')];
 const select=index=>{buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));panels.forEach((panel,i)=>panel.hidden=i!==index);};
 buttons.forEach((button,index)=>button.addEventListener('click',()=>select(index)));
 select(0);
});
