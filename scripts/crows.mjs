import fs from 'node:fs';

function render(weeks, total){
  const MONO="'JetBrains Mono','SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";
  const S=13,G=3,P=S+G,X0=24,Y0=56,cols=weeks.length;
  const W=X0*2+cols*P-G,H=Y0+7*P-G+50;
  const EX=X0+(cols*P-G)/2,EY=Y0+(7*P-G)/2;
  const C=['#161b22','#4a0f12','#8b1a1d','#c92a2e','#ff4246'];
  const f=n=>(+n).toFixed(4);
  const cells=[];
  weeks.forEach((w,x)=>w.contributionDays.forEach(d=>cells.push({x,y:d.weekday,l:d.level,cx:X0+x*P+S/2,cy:Y0+d.weekday*P+S/2})));
  const food=cells.filter(c=>c.l>0).sort((a,b)=>Math.hypot(a.cx-EX,a.cy-EY)-Math.hypot(b.cx-EX,b.cy-EY));
  const start=1.2,travel=1.1,stag=food.length?Math.min(.22,6/food.length):0;
  const absorbEnd=start+food.length*stag+travel;
  const hold=2.2,release=1.4,T=absorbEnd+hold+release+.8;
  const relStart=absorbEnd+hold;
  food.forEach((c,i)=>{c.a=start+i*stag;c.b=c.a+travel;c.m=c.a+travel*.55;});
  const spl='keySplines="0 0 1 1;.55 0 1 .55;.3 .5 .7 1;0 0 1 1;.25 0 .2 1" calcMode="spline"';
  let rects='';
  for(const c of cells){
    const col=C[c.l];
    if(!c.l){rects+='<rect x="'+(c.cx-S/2)+'" y="'+(c.cy-S/2)+'" width="'+S+'" height="'+S+'" rx="2.5" fill="'+col+'"/>';continue;}
    const dx=EX-c.cx,dy=EY-c.cy,mx=dx*.45-dy*.28,my=dy*.45+dx*.28*.4;
    const kt='0;'+f(c.a/T)+';'+f(c.m/T)+';'+f(c.b/T)+';'+f(relStart/T)+';'+f((relStart+release)/T);
    const kt2=kt+';1';
    const an=(type,vals,add)=>'<animateTransform attributeName="transform" type="'+type+'" values="'+vals+';'+vals.split(';')[0]+'" keyTimes="'+kt2+'" dur="'+f(T)+'s" repeatCount="indefinite" '+spl.replace('" calcMode',';0 0 1 1" calcMode')+(add?' additive="sum"':'')+'/>';
    rects+='<g transform="translate('+c.cx+' '+c.cy+')"><g>'
      +an('translate','0 0;0 0;'+mx.toFixed(1)+' '+my.toFixed(1)+';'+dx.toFixed(1)+' '+dy.toFixed(1)+';'+dx.toFixed(1)+' '+dy.toFixed(1)+';0 0')
      +'<rect x="'+(-S/2)+'" y="'+(-S/2)+'" width="'+S+'" height="'+S+'" rx="2.5" fill="'+col+'">'
      +an('rotate','0;0;160;420;420;0')+an('scale','1;1;.75;.05;.05;1',true)
      +'<animate attributeName="opacity" values="1;1;1;0;0;1;1" keyTimes="'+kt2+'" dur="'+f(T)+'s" repeatCount="indefinite"/>'
      +'</rect></g></g>';
  }
  const blade=a=>'<path transform="rotate('+a+')" d="M-11 -5 C-14 -18 -8 -30 4 -36.5 C0 -30 0 -22 4 -15 C7 -10 10 -6 11 4 Z" fill="#000"/>';
  const eyeOp='<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;'+f(.2/T)+';'+f(1/T)+';'+f((relStart+release)/T)+';'+f((relStart+release+.6)/T)+';1" dur="'+f(T)+'s" repeatCount="indefinite"/>';
  const eyeScale='<animateTransform attributeName="transform" type="scale" values=".2;.2;1;1;1.12;1;1;.2;.2" keyTimes="0;'+f(.2/T)+';'+f(1/T)+';'+f(start/T)+';'+f(absorbEnd/T)+';'+f((absorbEnd+.5)/T)+';'+f((relStart+release)/T)+';'+f((relStart+release+.6)/T)+';1" dur="'+f(T)+'s" repeatCount="indefinite" additive="sum"/>';
  const eye='<g transform="translate('+EX+' '+EY+')">'+'<g>'+eyeOp+eyeScale
   +'<circle r="62" fill="url(#eg)"><animate attributeName="r" values="56;68;56" dur="1.4s" repeatCount="indefinite"/></circle>'
   +'<circle r="40" fill="#000"/>'
   +'<circle r="36" fill="url(#ir)"/>'
   
   +'<g>'+blade(0)+blade(120)+blade(240)+'<circle r="12.5" fill="#000"/><circle r="4" fill="#d4161c"/><animateTransform attributeName="transform" type="rotate" values="0;360" dur="3s" repeatCount="indefinite"/></g>'
   +'<circle r="36" fill="none" stroke="#000" stroke-width="2.5"/><circle cx="-12" cy="-14" r="4" fill="#fff" fill-opacity=".25"/>'
   +'<circle r="36" fill="none" stroke="#ff6a6a" stroke-width="1" stroke-opacity=".6"/>'
   +'</g></g>';
  const leg=C.map((c,i)=>'<rect x="'+(W-X0-80+i*16-30)+'" y="'+(H-27)+'" width="12" height="12" rx="2.5" fill="'+c+'"/>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'
   +'<defs><radialGradient id="eg"><stop offset=".45" stop-color="#ff2a2a" stop-opacity=".55"/><stop offset="1" stop-color="#ff2a2a" stop-opacity="0"/></radialGradient>'
   +'<radialGradient id="ir" cx=".45" cy=".4"><stop offset="0" stop-color="#ff5a4e"/><stop offset=".7" stop-color="#d4161c"/><stop offset="1" stop-color="#7a070b"/></radialGradient></defs>'
   +'<rect width="'+W+'" height="'+H+'" rx="10" fill="#010409" stroke="#30363d" stroke-width="2"/>'
   +'<path d="M1 34 V11 A10 10 0 0 1 11 1 H'+(W-11)+' A10 10 0 0 1 '+(W-1)+' 11 V34Z" fill="#161b22"/><rect y="34" width="'+W+'" height="1" fill="#30363d"/>'
   +'<circle cx="20" cy="17" r="6" fill="#ff5f57"/><circle cx="40" cy="17" r="6" fill="#febc2e"/><circle cx="60" cy="17" r="6" fill="#28c840"/>'
   +'<text x="'+W/2+'" y="22" text-anchor="middle" font-family="'+MONO+'" font-size="13" fill="#9198a1">❯ mangekyo --tsukuyomi contributions</text>'
   +rects+eye
   +'<text x="'+X0+'" y="'+(H-17)+'" font-family="'+MONO+'" font-size="12" fill="#9198a1">'+total+' contributions in the last year <tspan fill="#e5383b">· 足跡</tspan></text>'
   +'<text x="'+(W-X0-80-36)+'" y="'+(H-17)+'" text-anchor="end" font-family="'+MONO+'" font-size="12" fill="#9198a1">Less</text>'+leg
   +'<text x="'+(W-X0)+'" y="'+(H-17)+'" text-anchor="end" font-family="'+MONO+'" font-size="12" fill="#9198a1">More</text></svg>';
}

const user=process.env.GH_USER, token=process.env.GITHUB_TOKEN;
const query='query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{weekday contributionLevel}}}}}}';
const res=await fetch('https://api.github.com/graphql',{method:'POST',headers:{Authorization:'bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({query,variables:{l:user}})});
const json=await res.json();
if(!json.data) { console.error(JSON.stringify(json)); process.exit(1); }
const cal=json.data.user.contributionsCollection.contributionCalendar;
const L={NONE:0,FIRST_QUARTILE:1,SECOND_QUARTILE:2,THIRD_QUARTILE:3,FOURTH_QUARTILE:4};
const weeks=cal.weeks.map(w=>({contributionDays:w.contributionDays.map(d=>({weekday:d.weekday,level:L[d.contributionLevel]}))}));
fs.mkdirSync('assets',{recursive:true});
fs.writeFileSync('assets/crows.svg',render(weeks,cal.totalContributions));
console.log('crows.svg written');
