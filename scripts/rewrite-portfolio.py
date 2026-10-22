"""Apply the portfolio editorial layer to the imported preview content."""
import json, html
from pathlib import Path
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
pages=json.loads((root/'src/data/pages.json').read_text())
copy=json.loads((root/'src/data/portfolio-copy.json').read_text())
e=html.escape
# Keep the original public records for legal text and route compatibility.
for p in pages: p.update(kind='',redirect='')
for lang,c in copy.items():
 base=next(p for p in pages if p['path']==lang)
 nav=[{'label':label,'href':f'/{lang}/{slug}'} for label,slug in zip(c['nav'],['','portfolio/','technology/','process/','about/','contact/'])]
 footer=BeautifulSoup(base['footer'],'html.parser')
 for note in footer.select('.group-note'): note.decompose()
 footer.select_one('.footer-about p').string=c['footer']
 fn=footer.select_one('.editorial-footer-nav')
 fn.clear()
 fn.append(BeautifulSoup('<div><h3>'+e(c['nav'][1])+'</h3><nav>'+''.join(f'<a href="{x["href"]}">{e(x["label"])}</a>' for x in nav[1:4])+'</nav></div><div><h3>FXN Europe</h3><nav>'+''.join(f'<a href="{x["href"]}">{e(x["label"])}</a>' for x in nav[4:])+f'<a href="/{lang}/faq/">FAQ</a><a href="/{lang}/sitemap/">{e(c["sitemap"])}</a></nav></div>','html.parser'))
 for p in pages:
  if p['lang']!=lang:continue
  p['nav']=nav;p['footer']=str(footer).replace('/img/fxn-europe-logo.svg','/img/fxn-europe-synth.svg')
  if p['path'] not in [lang] and not p['path'].startswith(lang+'/'):continue
  suffix=p['path'][len(lang):].strip('/')
  if suffix.startswith('services') or suffix in ['industries','regional-digital-solutions']:
   p['redirect']=f'/{lang}/'+('technology/' if '/' in suffix else 'portfolio/')
   p['body']='';p['intro']='';p['actions']='';p['home']=False
 for suffix,kind,prefix in [('', 'home','home'),('portfolio','portfolio','portfolio'),('technology','technology','technology'),('process','process','process'),('about','about','about'),('contact','contact','contact'),('faq','faq','faq')]:
  path=lang+('/'+suffix if suffix else '')
  p=next((x for x in pages if x['path']==path),None)
  if p is None:
   p=dict(base);p['path']=path;pages.append(p)
  p.update(kind=kind,redirect='',home=kind=='home',title=c[prefix+'Title'],metaTitle=c[prefix+'Title']+' | FXN Europe OÜ',description=c[prefix+'Intro'],intro='<div class="page-intro"><p>'+e(c[prefix+'Intro'])+'</p></div>',body='',actions='',nav=nav,footer=str(footer).replace('/img/fxn-europe-logo.svg','/img/fxn-europe-synth.svg'))
  if kind in ['home','about']:
   p['actions']=f'<div class="hero-actions"><a class="button" href="/{lang}/portfolio/">{e(c["nav"][1])} ↗</a><a class="text-link" href="/{lang}/technology/">{e(c["nav"][2])} ↗</a></div>'
  p['languages']=[{'label':label,'lang':l,'href':f'/{l}/'+(suffix+'/' if suffix else '')} for l,label in [('en','English'),('et','Eesti'),('de','Deutsch'),('es','Español'),('fr','Français')]]
 sitemap=next(x for x in pages if x['path']==lang+'/sitemap')
 links=[(x['title'],'/'+x['path']+'/') for x in pages if x['lang']==lang and not x['redirect'] and (x['path']==lang or x['path'].startswith(lang+'/')) and x is not sitemap]
 sitemap['body']='<section class="wrap map-layout">'+''.join(f'<a class="map-link" href="{u}">{e(t)} ↗</a>' for t,u in links)+'</section>'
(root/'src/data/pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n')
print('Rewritten portfolio pages and navigation in five languages; retained legal pages and legacy redirects.')
