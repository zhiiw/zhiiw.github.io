const LETTER_UNLOCK_AT=Date.parse('2026-11-02T00:00:00+08:00');
function isLetterUnlocked(now) { return now>=LETTER_UNLOCK_AT; }
function letterCountdown(now){
 const seconds=Math.max(0,Math.ceil((LETTER_UNLOCK_AT-now)/1000));
 return [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
}
if(typeof module !== 'undefined') module.exports={isLetterUnlocked,letterCountdown};
if(typeof document !== 'undefined'){
 const seal=document.querySelector('.letter-seal'),content=document.querySelector('.letter-paper'),overlay=document.querySelector('.letter-lock'),digits=document.querySelectorAll('.lock-countdown b');
 function updateLetter(){
  const now=Date.now(),open=isLetterUnlocked(now);
  seal.classList.toggle('is-locked',!open);content.inert=!open;
  if(open)content.removeAttribute('aria-hidden');else content.setAttribute('aria-hidden','true');
  overlay.hidden=open;
  if(!open)letterCountdown(now).forEach((n,i)=>digits[i].textContent=String(n).padStart(2,'0'));
 }
 updateLetter();setInterval(updateLetter,1000);
 document.addEventListener('visibilitychange',updateLetter);
}
