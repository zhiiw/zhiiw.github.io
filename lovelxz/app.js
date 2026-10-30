'use strict';
const photoNames=['DSCF4475','DSCF1257','DSCF0773','DSCF1518','DSCF1509','DSCF0935','DSCF4572','DSCF0684','DSCF4547','DSCF4592','DSCF3571','DSCF1473','DSCF1307','DSCF4524','DSCF1306','DSCF4269'];
const grid=document.querySelector('#photoGrid'),box=document.querySelector('#lightbox');
let selectedPhoto=0,photoOpener=null;
photoNames.forEach((name,i)=>{const b=document.createElement('button');b.className='photo-item';b.setAttribute('aria-label',`放大第 ${i+1} 张照片`);b.innerHTML=`<img src="assets/${name}.JPG" alt="之之的影像记录 ${String(i+1).padStart(2,'0')}" loading="lazy"><span>FRAME ${String(i+1).padStart(2,'0')}<span>↗</span></span>`;b.addEventListener('click',()=>{photoOpener=b;showPhoto(i);box.showModal();document.body.style.overflow='hidden'});grid.append(b)});
function showPhoto(i){selectedPhoto=(i+photoNames.length)%photoNames.length;document.querySelector('#largePhoto').src=`assets/${photoNames[selectedPhoto]}.JPG`;document.querySelector('#largePhoto').alt=`之之的影像记录 ${selectedPhoto+1}`;document.querySelector('#photoCaption').textContent=`FRAME ${String(selectedPhoto+1).padStart(2,'0')} / ${photoNames.length} — PHOTOGRAPHIC NOTES`}
document.querySelector('#closePhoto').onclick=()=>box.close();document.querySelector('#prevPhoto').onclick=()=>showPhoto(selectedPhoto-1);document.querySelector('#nextPhoto').onclick=()=>showPhoto(selectedPhoto+1);box.addEventListener('close',()=>{document.body.style.overflow='';photoOpener?.focus()});box.addEventListener('click',e=>{if(e.target===box)box.close()});box.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(selectedPhoto+1)}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(selectedPhoto-1)}});
const audio=document.querySelector('#audio'),list=document.querySelector('#trackList'),statusEl=document.querySelector('#audioStatus'),playButton=document.querySelector('#playMusic');let tracks=[],selectedTrack=-1;
function durationLabel(s){return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
function renderPlaylist(){list.replaceChildren();tracks.forEach((t,i)=>{const li=document.createElement('li'),b=document.createElement('button'),num=document.createElement('span'),info=document.createElement('span'),title=document.createElement('strong'),artist=document.createElement('small'),duration=document.createElement('span');num.className='track-number';num.textContent=String(i+1).padStart(2,'0');info.className='track-info';title.textContent=t.title;artist.textContent=t.artist;info.append(title,artist);duration.className='track-duration';duration.textContent=durationLabel(t.duration);b.append(num,info,duration);b.setAttribute('aria-label',`播放 ${t.title} — ${t.artist}`);b.onclick=()=>selectTrack(i,true);li.append(b);list.append(li)});document.querySelector('#trackCount').textContent=`${tracks.length} 首收藏`;document.querySelector('#prevTrack').disabled=document.querySelector('#nextTrack').disabled=tracks.length<2;playButton.disabled=!tracks.length;}
async function playCurrent(){try{await audio.play()}catch{statusEl.textContent='播放暂未成功，请再点击播放。'}}
async function selectTrack(i,play){if(!tracks.length)return;selectedTrack=(i+tracks.length)%tracks.length;audio.src=tracks[selectedTrack].url;document.querySelector('#trackName').textContent=tracks[selectedTrack].title;statusEl.textContent=tracks[selectedTrack].artist;list.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('current',n===selectedTrack);b.setAttribute('aria-current',n===selectedTrack?'true':'false')});if(play)await playCurrent();}
playButton.onclick=()=>{if(audio.paused)playCurrent();else audio.pause()};document.querySelector('#prevTrack').onclick=()=>selectTrack(selectedTrack-1,true);document.querySelector('#nextTrack').onclick=()=>selectTrack(selectedTrack+1,true);audio.addEventListener('ended',()=>selectTrack(selectedTrack+1,true));audio.addEventListener('play',()=>{document.querySelector('.record').classList.add('playing');playButton.textContent='暂停音乐 Ⅱ';statusEl.textContent=tracks[selectedTrack]?.artist||''});audio.addEventListener('pause',()=>{document.querySelector('.record').classList.remove('playing');playButton.textContent='播放这首歌 ▶'});audio.addEventListener('error',()=>{statusEl.textContent='这首歌暂时加载失败，可以重试或切换下一首。';playButton.textContent='重试播放 ▶'});
fetch('playlist.json').then(r=>{if(!r.ok)throw new Error('Playlist unavailable');return r.json()}).then(data=>{tracks=data;renderPlaylist();if(tracks.length)selectTrack(0,false);else statusEl.textContent='歌单暂时为空。'}).catch(()=>{document.querySelector('#trackName').textContent='歌单暂时未能加载';statusEl.textContent='请刷新页面重试。'});
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}})},{rootMargin:'-20% 0px -55% 0px'});document.querySelectorAll('main>.section').forEach(s=>observer.observe(s));

// Keep touch/wheel scrolling native; the cover has a separate, slower visual plane.
const cover=document.querySelector('#home'),coverPhoto=cover.querySelector('.cover-photo'),coverText=cover.querySelector('.cover-content');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
let coverFrame=0,coverScrollFrame=0;
function paintCover(){
  coverFrame=0;
  const height=cover.offsetHeight,passed=Math.max(0,-cover.getBoundingClientRect().top),progress=Math.min(1,passed/height);
  const amount=motionPreference.matches?0:progress;
  coverPhoto.style.transform=`translate3d(0,${amount*height*.2}px,0)`;
  coverText.style.transform=`translate3d(0,${amount*height*.1}px,0)`;
  coverText.style.opacity=String(1-Math.min(1,amount*1.65));
}
function queueCover(){if(!coverFrame)coverFrame=requestAnimationFrame(paintCover)}
addEventListener('scroll',queueCover,{passive:true});addEventListener('resize',queueCover);motionPreference.addEventListener('change',queueCover);paintCover();
function cancelCoverScroll(){cancelAnimationFrame(coverScrollFrame);coverScrollFrame=0;document.documentElement.style.scrollBehavior=''}
for(const event of ['wheel','touchstart','pointerdown','keydown'])addEventListener(event,cancelCoverScroll,{passive:true});
cover.querySelector('.cover-scroll').addEventListener('click',event=>{
  if(motionPreference.matches)return;
  event.preventDefault();cancelCoverScroll();
  const start=scrollY,target=document.querySelector('header').getBoundingClientRect().top+start,distance=target-start;
  const begin=performance.now();document.documentElement.style.scrollBehavior='auto';
  function step(now){const t=Math.min(1,(now-begin)/1100),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;scrollTo(0,start+distance*ease);if(t<1)coverScrollFrame=requestAnimationFrame(step);else{cancelCoverScroll();history.replaceState(null,'','#fragments')}}
  coverScrollFrame=requestAnimationFrame(step);
});

const sharedFilms=['呼啸山庄','巴黎夏日','奥德赛','给阿嬷的情书','重庆森林','生化危机：爆发夜'];
const filmDialog=document.querySelector('#filmDialog');let filmOpener=null;
document.querySelectorAll('.film-ticket').forEach((ticket,i)=>ticket.addEventListener('click',()=>{
 filmOpener=ticket;const number=String(i+1).padStart(2,'0');
 filmDialog.querySelector('.film-detail').className=`film-detail film-${i+1}`;
 document.querySelector('#filmTitle').textContent=sharedFilms[i];
 document.querySelector('#filmPoster').src=`assets/films/${i+1}.jpg`;document.querySelector('#filmPoster').alt=`${sharedFilms[i]}电影海报`;
 filmDialog.querySelector('.film-detail-number').textContent=number;
 filmDialog.querySelector('.film-version').textContent=i===0?'2026 年版':'';
 document.querySelector('#filmIndex').textContent=`${number} / 06`;
 filmDialog.showModal();document.body.style.overflow='hidden';
}));
filmDialog.querySelector('.film-close').onclick=()=>filmDialog.close();
filmDialog.addEventListener('click',e=>{if(e.target===filmDialog)filmDialog.close()});
filmDialog.addEventListener('close',()=>{document.body.style.overflow='';filmOpener?.focus({preventScroll:true})});

// Let the final sky fill the viewport; bring navigation back on upward scroll.
const skySection=document.querySelector('#celebration'),floatingNav=document.querySelector('main > header');
let skyNavPreviousY=scrollY,skyNavFrame=0;
function updateSkyNavigation(initial=false){
  skyNavFrame=0;
  const delta=scrollY-skyNavPreviousY,nearSky=skySection.getBoundingClientRect().top<innerHeight*.28;
  let hide=floatingNav.classList.contains('sky-nav-hidden');
  if(!nearSky||delta< -2)hide=false;
  else if(initial||delta>2)hide=true;
  floatingNav.classList.toggle('sky-nav-hidden',hide);
  floatingNav.inert=hide;
  if(Math.abs(delta)>2||initial)skyNavPreviousY=scrollY;
}
addEventListener('scroll',()=>{if(!skyNavFrame)skyNavFrame=requestAnimationFrame(()=>updateSkyNavigation())},{passive:true});
addEventListener('resize',()=>updateSkyNavigation(true));
addEventListener('load',()=>updateSkyNavigation(true));
updateSkyNavigation(true);
