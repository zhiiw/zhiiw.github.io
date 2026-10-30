import * as T from '../vendor/three.module.min.js';
const backdropPreview=new URLSearchParams(location.search).has('backdrop');
if(backdropPreview)document.body.classList.add('backdrop-preview');
const canvas=document.querySelector('#world'),scene=new T.Scene();
scene.background=new T.Color('#cbd6c6');scene.fog=new T.Fog('#cbd6c6',28,65);
const renderer=new T.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const camera=new T.PerspectiveCamera(36,1,.1,100);let angle=.66,desiredAngle=.66;const look=new T.Vector3(0,1,0);
const hemi=new T.HemisphereLight('#fff1d2','#78896d',2.5);scene.add(hemi);
const sun=new T.DirectionalLight('#ffe1b2',3.4);sun.position.set(-6,12,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun);
const mats={};function mat(c){return mats[c]??=new T.MeshStandardMaterial({color:c,roughness:.83})}
function mesh(g,c,x=0,y=0,z=0,parent=scene){const m=new T.Mesh(g,typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(w,h,d,c,x,y,z,p=scene){return mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p)}
function ball(r,c,x,y,z,p=scene,s=[1,1,1]){const m=mesh(new T.SphereGeometry(r,20,14),c,x,y,z,p);m.scale.set(...s);return m}
function cyl(r,rt,h,c,x,y,z,p=scene){return mesh(new T.CylinderGeometry(r,rt,h,32),c,x,y,z,p)}
function round(w,h,d,c,x,y,z,p=scene,r=.12){const shape=new T.Shape(),a=w/2,b=h/2;shape.moveTo(-a+r,-b);shape.lineTo(a-r,-b);shape.quadraticCurveTo(a,-b,a,-b+r);shape.lineTo(a,b-r);shape.quadraticCurveTo(a,b,a-r,b);shape.lineTo(-a+r,b);shape.quadraticCurveTo(-a,b,-a,b-r);shape.lineTo(-a,-b+r);shape.quadraticCurveTo(-a,-b,-a+r,-b);const g=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:5});g.translate(0,0,-d/2);return mesh(g,c,x,y,z,p)}
const island=new T.Group();scene.add(island);
round(11,.65,9,'#acb498',0,-.42,0,island,.5);box(10.7,.12,8.7,'#a6b68e',0,-.06,0);
const ground=box(200,.12,200,'#cbd6c6',0,-.86,0);ground.castShadow=false;
// Open dollhouse: timber floor, plaster walls, exposed rafters.
box(7.7,.24,4.6,'#9f7a55',0,.06,-1.75);
for(let i=0;i<19;i++)box(.39,.055,4.5,i%3===0?'#cfac7b':'#d9b887',-3.6+i*.4,.21,-1.75);
box(7.8,3,.18,'#efe4cb',0,1.68,-4);box(.18,2.2,4.5,'#e0d9bd',-3.85,1.28,-1.8);
box(7.7,.13,.12,'#ae8157',0,.4,-3.86);box(.12,.13,4.5,'#ae8157',-3.72,.4,-1.8);
for(const x of [-3.8,3.8]){box(.19,3.15,.2,'#a87a51',x,1.7,-4);box(.2,.22,4.6,'#a87a51',x,3.2,-1.8)}box(7.8,.25,.24,'#b58b61',0,3.2,-4);
// Back window and softly lit panes.
round(2,1.6,.13,'#a17851',-.7,2,-3.84);round(1.74,1.35,.06,'#9eafb0',-.7,2,-3.74);
box(.065,1.35,.08,'#e7d7b4',-.7,2,-3.69);box(1.74,.07,.08,'#e7d7b4',-.7,2,-3.69);box(2.2,.12,.35,'#b18a61',-.7,1.25,-3.67);
for(const x of [-1.85,.45]){for(let k=0;k<4;k++)cyl(.06,.06,1.7,'#f4eedb',x+k*.09,2,-3.5)}
// Bunting and wall clock.
for(let i=0;i<12;i++){const x=-3.4+i*.59,y=2.85-.26*Math.sin(i/11*Math.PI);const g=new T.ConeGeometry(.16,.28,3);const f=mesh(g,['#c28872','#e6c175','#90a490'][i%3],x,y,-3.72);f.rotation.z=Math.PI}
const clock=cyl(.32,.32,.08,'#ac845a',2.55,2.5,-3.8);clock.rotation.x=Math.PI/2;const face=cyl(.27,.27,.09,'#f1e5c9',2.55,2.5,-3.73);face.rotation.x=Math.PI/2;box(.025,.2,.03,'#596452',2.55,2.58,-3.66);const hand=box(.15,.025,.03,'#596452',2.6,2.5,-3.65);hand.rotation.z=-.3;
// Sofa, cushions and woven rug.
round(2.7,.35,1,'#799384',-2,.56,-2.7);round(2.6,.8,.28,'#718c7c',-2,.95,-3.15);
for(const x of [-3.28,-.72])round(.27,.6,1,'#718c7c',x,.8,-2.7);
for(const x of [-2.65,-1.4]){round(1.05,.18,.73,'#91a695',x,.8,-2.65);round(.48,.45,.18,x< -2?'#e5cc96':'#c28d75',x,1.1,-3)}
const rug=cyl(1.55,1.55,.035,'#e4d5af',-.4,.255,-.8);rug.scale.z=.72;
for(let i=0;i<6;i++){const r=new T.Mesh(new T.TorusGeometry(1.25+i*.045,.009,4,80),mat('#bda986'));r.rotation.x=Math.PI/2;r.scale.y=.72;r.position.set(-.4,.28,-.8);scene.add(r)}
// Birthday table and cake.
const table=new T.Group();scene.add(table);table.position.set(-.35,0,-.85);
cyl(.82,.86,.13,'#ad8056',0,.92,0,table);for(const x of [-.5,.5])for(const z of [-.4,.4])box(.1,.68,.1,'#94704d',x,.55,z,table);
cyl(.39,.39,.045,'#faf2d8',0,1.01,0,table);cyl(.31,.32,.27,'#f3d8a8',0,1.16,0,table);cyl(.32,.32,.065,'#fff0d7',0,1.31,0,table);
for(let i=0;i<8;i++){let a=i*Math.PI/4;ball(.052,'#bf6b5a',Math.cos(a)*.24,1.37,Math.sin(a)*.24,table,[1,.8,1])}
const flames=[];for(let i=0;i<3;i++){cyl(.018,.018,.23,'#8da598',-.12+i*.12,1.45,0,table);flames.push(ball(.035,new T.MeshBasicMaterial({color:'#ffcb65'}),-.12+i*.12,1.59,0,table,[.75,1.7,.75]))}
const candleLight=new T.PointLight('#ffb752',2,4);candleLight.position.set(-.35,1.6,-.85);scene.add(candleLight);
// Turntable cabinet and records.
round(1.55,.9,.7,'#a57852',2.6,.7,-3.2);for(const x of [2.1,3.1])box(.1,.32,.1,'#72563d',x,.3,-3.2);box(1.35,.035,.73,'#d3ac74',2.6,1.2,-3.2);box(.9,.12,.55,'#554e3f',2.55,1.29,-3.2);const record=cyl(.23,.23,.025,'#282e2b',2.45,1.37,-3.2);cyl(.065,.065,.03,'#bb795b',2.45,1.39,-3.2);box(.03,.025,.34,'#cbbb92',2.85,1.4,-3.17);
for(let i=0;i<8;i++){const b=box(.075,.5,.32,['#8b9c8a','#e3c791','#c78b73'][i%3],2.08+i*.1,.72,-2.84);b.rotation.z=-.08}
// Floor lamp and greenery.
cyl(.24,.3,.08,'#776b4f',1.25,.29,-3);cyl(.025,.025,1.9,'#776b4f',1.25,1.25,-3);cyl(.34,.5,.45,'#f6deb0',1.25,2.12,-3);const lamp=new T.PointLight('#ffd194',7,8);lamp.position.set(1.25,1.95,-3);scene.add(lamp);
function plant(x,z,s=1){const p=new T.Group();p.position.set(x,.2,z);p.scale.setScalar(s);scene.add(p);cyl(.24,.17,.4,'#b97e61',0,.2,0,p);for(let i=0;i<7;i++){let a=i*2.4;const leaf=ball(.21,['#66816a','#819773','#9baa7e'][i%3],Math.sin(a)*.22,.55+i*.055,Math.cos(a)*.2,p,[.6,1.7,.55]);leaf.rotation.z=Math.sin(a)*.7}return p}
plant(-3.35,-.25,1.15);plant(3.2,-1.9,1.1);plant(-.7,-3.62,.5);
// Garden stepping stones, picket fence, bench, flowers.
for(let i=0;i<5;i++){let s=cyl(.34,.37,.07,'#d3ccb4',.5+Math.sin(i)*.12,.07,.8+i*.65);s.scale.x=1.3}
for(let i=0;i<13;i++){const x=-4.8+i*.8;round(.17,.65,.12,'#e9dfc5',x,.4,4.05,scene,.07)}box(10,.09,.1,'#d8ceb1',0,.47,4.08);
for(const x of [-4.9,4.9]){for(let i=0;i<8;i++)round(.14,.6,.14,'#e9dfc5',x,.38,-2.8+i*.85);box(.09,.09,6.6,'#d8ceb1',x,.45,.2)}
const bench=new T.Group();bench.position.set(2.8,0,2.55);bench.rotation.y=Math.PI;scene.add(bench);for(let i=0;i<3;i++)round(1.8,.095,.17,'#b98c5f',0,.55,-.18+i*.2,bench,.025);for(let i=0;i<2;i++)round(1.8,.15,.11,'#b98c5f',0,.86+i*.2,-.34,bench,.03);for(const x of [-.65,.65]){box(.12,.55,.15,'#677a66',x,.3,0,bench);box(.1,.85,.1,'#677a66',x,.65,-.37,bench)}
function tree(x,z,s){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);cyl(.13,.2,1.6,'#98704c',0,.8,0,g);for(let i=0;i<4;i++)ball(.73,['#7c946b','#8ba276'][i%2],Math.sin(i*2)*.35,1.7+i*.24,Math.cos(i*2)*.25,g,[1,.92,1]);return g}
tree(-4.2,2.2,1.1);tree(4.1,-3.1,1.12);
for(let i=0;i<35;i++){const x=-4.2+(i%7)*.23,z=2.9+Math.floor(i/7)*.17;const stem=cyl(.012,.012,.2,'#7b936c',x,.15,z);ball(.055,['#efc573','#e4b8a1','#ece1c0'][i%3],x,.28,z,scene)}
for(let i=0;i<9;i++){const x=1.5+i*.35;box(.03,.22,.03,'#81936c',x,.11,3.55);ball(.06,'#ece0b9',x,.24,3.55)}
// Two small residents.
function person(color,longHair){
 const root=new T.Group(),body=new T.Group();root.add(body);scene.add(root);
 const skin='#f1c8a4',hair=longHair?'#42342e':'#554036';
 cyl(.23,.28,.38,color,0,.62,0,body);
 // Oversized, softly rounded face, tiny nose, glossy eyes and blush.
 const head=new T.Group();head.position.y=1.12;body.add(head);
 ball(.36,skin,0,0,0,head,[1,.96,.89]);
 for(const x of [-.35,.35])ball(.07,skin,x,-.02,0,head,[.65,1,.65]);
 ball(.373,hair,0,.14,-.06,head,[1.02,.69,.98]);
 for(let i=0;i<5;i++){let x=-.26+i*.12;const fringe=ball(.105,hair,x,.23-Math.abs(x)*.24,.23,head,[.86,1.1,.65]);fringe.rotation.z=x*1.5}
 if(longHair){for(const x of [-.3,.3])ball(.16,hair,x,-.13,-.07,head,[.68,1.85,1]);ball(.3,hair,0,-.14,-.23,head,[1,1.15,.5]);
 const bow=new T.Group();bow.position.set(.29,.29,.05);head.add(bow);for(const x of [-.075,.075]){const b=ball(.085,'#d6a38b',x,0,0,bow,[1,.7,.45]);b.rotation.z=x>0?-.35:.35}ball(.035,'#edd4ad',0,0,.03,bow);
 }else{ball(.15,hair,-.18,.27,.1,head,[1,.5,.8]);}
 const eyes=[];for(const x of [-.12,.12]){const eye=ball(.052,'#302c29',x,.005,.302,head,[.8,1.18,.3]);eyes.push(eye);ball(.013,'#fff6e2',x-.012,.026,.32,head,[1,1,.3]);ball(.055,'#e6a18e',x*1.65,-.085,.272,head,[1,.55,.16])}
 ball(.035,'#e5b18d',0,-.06,.326,head,[.8,.6,.9]);const smile=mesh(new T.TorusGeometry(.04,.009,6,16,Math.PI), '#986b56',0,-.11,.306,head);smile.rotation.z=Math.PI;
 // Collar and two tiny wooden buttons.
 for(const x of [-.055,.055]){const collar=ball(.07,'#f2e6cd',x,.8,.19,body,[.7,.45,.45]);collar.rotation.z=x*4}for(const y of [.62,.5])ball(.017,'#e9d5b5',0,y,.254,body);
 const legs=[],arms=[];
 for(const x of [-.125,.125]){const leg=new T.Group();leg.position.set(x,.46,0);body.add(leg);cyl(.085,.075,.25,'#7b705d',0,-.125,0,leg);cyl(.065,.065,.09,'#efe4cb',0,-.28,0,leg);round(.18,.12,.26,'#eee0c4',0,-.34,.045,leg,.045);legs.push(leg);
 const arm=new T.Group();arm.position.set(x*2.15,.73,0);body.add(arm);cyl(.075,.065,.24,color,0,-.12,0,arm);ball(.07,skin,0,-.27,0,arm);arms.push(arm)}
 return{root,body,head,eyes,legs,arms,target:new T.Vector3(),sit:0,seated:false,path:[]};
}
const people=[person('#bd876f',true),person('#788f91',false)];people[0].root.position.set(.55,.22,.1);people[1].root.position.set(1.45,.22,.55);people.forEach(p=>p.target.copy(p.root.position));let active=0,following=true,benchMode=false,waitingForSeats=false;
const marker=mesh(new T.RingGeometry(.26,.3,48),new T.MeshBasicMaterial({color:'#f8e3aa',side:T.DoubleSide,transparent:true,opacity:.8}),.55,.25,.1);marker.rotation.x=-Math.PI/2;
const destination=mesh(new T.RingGeometry(.11,.15,32),new T.MeshBasicMaterial({color:'#fff4c9',side:T.DoubleSide,transparent:true,opacity:0}),0,.26,0);destination.rotation.x=-Math.PI/2;
const ray=new T.Raycaster(),pointer=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,1,0),-.23);let pointerStart=null;
const interactables=[{object:table,pos:new T.Vector3(-.35,.22,.55),action:()=>cakeAction()},{object:record.parent===scene?record:record,pos:new T.Vector3(2.6,.22,-2),action:()=>musicAction()},{object:bench,pos:new T.Vector3(2.8,.22,1.7),action:()=>fireworkAction()}];let pending=null;
function targetAt(v){standUp();const p=people[active];p.target.set(T.MathUtils.clamp(v.x,-3.55,4.35),.22,T.MathUtils.clamp(v.z,-3.5,3.65));destination.position.set(p.target.x,.27,p.target.z);destination.material.opacity=.8}
canvas.addEventListener('pointerdown',e=>pointerStart=[e.clientX,e.clientY]);canvas.addEventListener('pointerup',e=>{if(!pointerStart||Math.hypot(e.clientX-pointerStart[0],e.clientY-pointerStart[1])>12)return;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);for(const item of interactables){if(ray.intersectObject(item.object,true).length){targetAt(item.pos);pending=item.action;return}}const pos=new T.Vector3();if(ray.ray.intersectPlane(plane,pos)){pending=null;targetAt(pos)}});
const keys=new Set();addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key)){e.preventDefault();keys.add(e.key)}});addEventListener('keyup',e=>keys.delete(e.key));addEventListener('blur',()=>keys.clear());
function toast(s){document.querySelector('#toast').textContent=s;document.querySelector('#toast').style.opacity=1;clearTimeout(toast.timer);toast.timer=setTimeout(()=>document.querySelector('#toast').style.opacity=0,5000)}
document.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.person);pending=null;document.querySelectorAll('[data-person]').forEach(x=>x.classList.toggle('selected',x===b));toast(active===0?'现在是之之。':'换你来走。')});document.querySelector('#follow').onclick=e=>{following=!following;e.currentTarget.setAttribute('aria-pressed',following);e.currentTarget.textContent=following?'一起走':'各自走';toast(following?'会跟着你，慢慢走。':'两个人可以分别移动。')};
let candles=true;function cakeAction(){candles=!candles;flames.forEach(f=>f.visible=candles);candleLight.intensity=candles?2:0;toast(candles?'蜡烛点好了。':'生日快乐，之之。');if(!candles)for(let i=0;i<3;i++)setTimeout(()=>burst(-.35,2.1,-.85,45,.65),i*250)}
let playlist=[],track=0;const audio=new Audio();audio.volume=.55;fetch('../playlist.json').then(r=>r.json()).then(x=>playlist=x).catch(()=>{});async function musicAction(){if(!audio.paused){audio.pause();toast('音乐暂停了。');return}if(!audio.src){if(!playlist.length){toast('歌单还在加载，再试一下。');return}audio.src=new URL('../'+playlist[track].url,location.href).href}try{await audio.play();toast('正在播放 · '+playlist[track].title)}catch{toast('音乐暂时未能播放，再点一次试试。')}}audio.addEventListener('ended',()=>{track=(track+1)%playlist.length;audio.src=new URL('../'+playlist[track].url,location.href).href;audio.play().catch(()=>{})});
document.querySelector('#cake').onclick=cakeAction;document.querySelector('#music').onclick=musicAction;document.querySelector('#sound').onclick=musicAction;document.querySelector('#view').onclick=()=>{desiredAngle=desiredAngle>.4?-.45:.66};
let night=backdropPreview?1:0,nightTarget=backdropPreview?1:0,showUntil=0,nextLaunch=0;const particles=[],rockets=[];const particleMat=new T.PointsMaterial({size:.065,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending});const particleGeo=new T.BufferGeometry();const fireworks=new T.Points(particleGeo,particleMat);fireworks.frustumCulled=false;scene.add(fireworks);const flash=new T.PointLight('#ffd8a0',0,18);flash.position.set(0,4,0);scene.add(flash);
function burst(x,y,z,count=90,power=1.6){const color=new T.Color(['#ffe2a2','#e9bba9','#cfdbbd'][Math.floor(Math.random()*3)]);for(let i=0;i<count;i++){const v=new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(power*(.5+Math.random()*.5));particles.push({p:new T.Vector3(x,y,z),v,life:1.4+Math.random(),max:2.4,color})}flash.intensity=7}
function standUp(){if(!benchMode)return;benchMode=false;waitingForSeats=false;people.forEach(p=>{p.seated=false;p.path=[];p.target.copy(p.root.position);p.target.z=1.85});document.querySelector('#stand').hidden=true;}
function seatRoute(from,to){const step=.22,minX=-3.5,minZ=-3.45,W=36,H=33;const cell=v=>[Math.max(0,Math.min(W-1,Math.round((v.x-minX)/step))),Math.max(0,Math.min(H-1,Math.round((v.z-minZ)/step)))];const [sx,sz]=cell(from),[gx,gz]=cell(to),key=(x,z)=>z*W+x;const q=[[sx,sz]],seen=new Map([[key(sx,sz),null]]);let found=false;for(let i=0;i<q.length;i++){const [x,z]=q[i];if(x===gx&&z===gz){found=true;break}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(nx<0||nx>=W||nz<0||nz>=H||seen.has(k)||blocked(minX+nx*step,minZ+nz*step,true))continue;seen.set(k,key(x,z));q.push([nx,nz])}}if(!found)return[to.clone()];const path=[to.clone()];let k=key(gx,gz);while(seen.get(k)!=null){path.push(new T.Vector3(minX+(k%W)*step,.22,minZ+Math.floor(k/W)*step));k=seen.get(k)}return path.reverse()}
function fireworkAction(){if(waitingForSeats)return;if(benchMode&&people.every(p=>p.seated)){beginShow();return}benchMode=true;waitingForSeats=true;pending=null;document.querySelector('#stand').hidden=false;toast('先一起坐下来。');people.forEach((p,i)=>{p.seated=false;p.path=seatRoute(p.root.position,new T.Vector3(2.33+i*.94,.22,2.5));p.target.copy(p.path.shift())})}
function beginShow(){nightTarget=1;showUntil=performance.now()+24000;nextLaunch=0;toast('生日快乐，一起看烟花。');document.body.classList.add('night')}
document.querySelector('#stand').onclick=()=>{standUp();toast('起来走走。')};document.querySelector('#fireworks').onclick=fireworkAction;
function blocked(x,z,ignoreBench=false){return (x> -3.5&&x<-.55&&z< -2.05)||(Math.hypot(x+.35,z+.85)<1)||(x>1.7&&x<3.5&&z< -2.65)||(!ignoreBench&&x>1.7&&x<3.9&&z>2.15&&z<3.1)}
function move(p,dt,t){
 const delta=p.target.clone().sub(p.root.position);delta.y=0;const dist=delta.length();
 if(!p.seated&&dist>.045){delta.normalize();const step=Math.min(dist,dt*1.65),x=p.root.position.x+delta.x*step,z=p.root.position.z+delta.z*step;
 if(!blocked(x,z,benchMode||p.sit>.02)){p.root.position.x=x;p.root.position.z=z}else if(!blocked(x,p.root.position.z,benchMode))p.root.position.x=x;else if(!blocked(p.root.position.x,z,benchMode))p.root.position.z=z;else p.target.copy(p.root.position);
 const heading=Math.atan2(delta.x,delta.z);p.root.rotation.y+=Math.atan2(Math.sin(heading-p.root.rotation.y),Math.cos(heading-p.root.rotation.y))*Math.min(1,dt*12);
 p.body.position.y=Math.sin(t*13)*.024;p.legs.forEach((l,i)=>l.rotation.x=Math.sin(t*13+i*Math.PI)*.3);p.arms.forEach((a,i)=>a.rotation.x=Math.sin(t*13+i*Math.PI)*.4);
 }else{p.body.position.y=Math.sin(t*2)*.008;if(benchMode&&!p.seated){if(p.path.length)p.target.copy(p.path.shift());else p.seated=true}p.legs.forEach(l=>l.rotation.x*=.8);p.arms.forEach(a=>a.rotation.x*=.8)}
 p.sit=T.MathUtils.lerp(p.sit,p.seated?1:0,Math.min(1,dt*6));p.root.position.y=.22-p.sit*.07;
 if(p.sit>.01){p.legs.forEach((l,i)=>l.rotation.x=T.MathUtils.lerp(l.rotation.x,-Math.PI/2+Math.sin(t*2+i)*.04,p.sit));p.arms.forEach(a=>a.rotation.x=T.MathUtils.lerp(a.rotation.x,-.45,p.sit));p.root.rotation.y+=Math.atan2(Math.sin(Math.PI-p.root.rotation.y),Math.cos(Math.PI-p.root.rotation.y))*Math.min(1,dt*5);p.head.rotation.x=-.13*p.sit}else p.head.rotation.x=0;
 const blink=Math.sin(t*1.3)>.994?.15:1;p.eyes.forEach(e=>e.scale.y=1.18*blink);return dist;
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();let previous=performance.now();
function frame(now){requestAnimationFrame(frame);let dt=Math.min((now-previous)/1000,.04);previous=now;let t=now/1000;angle=T.MathUtils.lerp(angle,desiredAngle,dt*3);const fit=Math.max(1,.94/camera.aspect),distance=19*fit;scene.fog.near=28*fit;scene.fog.far=65*fit;camera.position.set(Math.sin(angle)*distance,16*fit,Math.cos(angle)*distance);camera.lookAt(look);
if(keys.size){pending=null;let dx=(keys.has('d')||keys.has('ArrowRight')?1:0)-(keys.has('a')||keys.has('ArrowLeft')?1:0),dz=(keys.has('s')||keys.has('ArrowDown')?1:0)-(keys.has('w')||keys.has('ArrowUp')?1:0);targetAt(people[active].root.position.clone().add(new T.Vector3(dx*Math.cos(angle)+dz*Math.sin(angle),0,-dx*Math.sin(angle)+dz*Math.cos(angle)).multiplyScalar(.3)))}
const dist=move(people[active],dt,t);const other=people[1-active];if(following&&!benchMode&&showUntil<now&&other.root.position.distanceTo(people[active].root.position)>1.3){other.target.copy(people[active].root.position).add(new T.Vector3(-.65,0,.6))}move(other,dt,t+.3);if(waitingForSeats&&people.every(p=>p.seated&&p.sit>.95)){waitingForSeats=false;beginShow()}if(pending&&dist<.1){pending();pending=null}marker.position.set(people[active].root.position.x,.265,people[active].root.position.z);destination.material.opacity*=.97;
flames.forEach((f,i)=>f.scale.y=1.6+Math.sin(t*9+i)*.3);if(!audio.paused)record.rotation.y+=dt*2;night=T.MathUtils.lerp(night,nightTarget,dt*.65);const bg=new T.Color('#cbd6c6').lerp(new T.Color('#354b51'),night);scene.background.copy(bg);scene.fog.color.copy(bg);ground.material.color.copy(bg);hemi.intensity=2.5-night*1.8;sun.intensity=3.4-night*3.05;renderer.toneMappingExposure=1.35-night*.15;
if(now<showUntil&&now>nextLaunch){rockets.push({p:new T.Vector3((Math.random()-.5)*7,.1,-4.8),v:4.5+Math.random()*2,top:4.2+Math.random()*2});nextLaunch=now+900+Math.random()*1000}if(showUntil&&now>showUntil){showUntil=0;nightTarget=0;document.body.classList.remove('night');toast('再坐一会儿。')}
for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.p.y+=r.v*dt;particles.push({p:r.p.clone(),v:new T.Vector3(0,-.15,0),life:.35,max:.4,color:new T.Color('#ffe7b3')});if(r.p.y>r.top){burst(r.p.x,r.p.y,r.p.z);rockets.splice(i,1)}}
const positions=[],colors=[];for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue}p.v.y-=dt*.45;p.p.addScaledVector(p.v,dt);p.v.multiplyScalar(1-dt*.4);positions.push(p.p.x,p.p.y,p.p.z);const fade=Math.min(1,p.life/.8);colors.push(p.color.r*fade,p.color.g*fade,p.color.b*fade)}particleGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));particleGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));flash.intensity*=.9;renderer.render(scene,camera)}
requestAnimationFrame(frame);document.querySelector('#loading').remove();setTimeout(()=>document.querySelector('#toast').style.opacity=0,6000);
