const {evalExpr}=require('./solution.js');
const R=Math.random, pick=a=>a[Math.floor(R()*a.length)];
function num(){ const t=R(); if(t<0.15) return (R()*10).toFixed(2); if(t<0.25) return '.'+Math.floor(R()*9+1); if(t<0.32) return Math.floor(R()*1000)+'e'+pick(['','-','+'])+Math.floor(R()*3); return String(Math.floor(R()*100)); }
function expr(d){ if(d<=0||R()<0.35) return (R()<0.15?'-':'')+num(); const o=pick(['+','-','*','/']); let s=expr(d-1)+o+expr(d-1); if(R()<0.4) s='('+s+')'; if(R()<0.1) s=' '+s+' '; return s; }
let bad=0, compared=0; const N=20000;
for(let k=0;k<N;k++){ const s=expr(3); let a,b; try{ a=evalExpr(s); }catch(e){ console.log('THREW on valid:',JSON.stringify(s),e); bad++; continue; } try{ b=eval(s); }catch(e){ continue; } compared++; if(!(a===b||(Number.isNaN(a)&&Number.isNaN(b)))){ console.log('MISMATCH:',JSON.stringify(s),'mine='+a,'eval='+b); if(++bad>10) break; } }
console.log(`fuzz done: ${N} generated, ${compared} compared vs native eval, ${bad} mismatches`);
