"""Snapshot public site content into the isolated Synth preview. Never writes production."""
import json, shutil
from pathlib import Path
from bs4 import BeautifulSoup
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'static'
pages=[]
for route in json.loads((SOURCE/'routes.json').read_text()):
    if route['path']=='/': continue
    soup=BeautifulSoup((SOURCE/'content'/route['file']).read_text(),'html.parser')
    main=soup.find('main')
    if not main: continue
    for el in main.select('script,style'): el.decompose()
    hero=main.select_one('.page-hero')
    h=main.find('h1')
    title=h.get_text(' ',strip=True) if h else 'Page not found'
    intro=hero.select_one('.page-intro') if hero else None
    actions=hero.select_one('.hero-actions') if hero else None
    nav=soup.select('header #main-nav > a')
    links=[{'label':a.get_text(' ',strip=True),'href':a['href']} for a in nav]
    lang=soup.html.get('lang','en').split('-')[0]
    langlinks=[{'label':a.get_text(' ',strip=True),'href':a['href'],'lang':a.get('lang','en')} for a in soup.select('header .language-links a')]
    item={'path':route['path'].strip('/'),'lang':lang,'title':title,'metaTitle':soup.title.get_text() if soup.title else title,'description':(soup.select_one('meta[name=description]') or {}).get('content',''),'intro':str(intro) if intro else '', 'actions':str(actions) if actions else '', 'home':route['path'].strip('/') in ['en','et','de','es','fr'],'nav':links,'languages':langlinks,'footer':str(soup.find('footer') or '')}
    if hero: hero.decompose()
    elif h: h.decompose()
    item['body']=''.join(str(x) for x in main.contents).replace('/sitemap.xml', '/sitemap-index.xml')
    pages.append(item)
(ROOT/'src/data/pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
for name in ['img','vendor']:
    shutil.copytree(SOURCE/'public'/name,ROOT/'public'/name,dirs_exist_ok=True)
for name in ['favicon.ico','favicon.svg']:
    shutil.copy2(SOURCE/'public'/name, ROOT/'public'/name)
print(f'Imported {len(pages)} pages into preview only')
