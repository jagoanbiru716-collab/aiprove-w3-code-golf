const fs=require('fs');
const pub=JSON.parse(fs.readFileSync('/tmp/aiprove-spec/challenges/code-golf-expr/cases.json','utf8'));
const edge=[
 ["-5",-5],["2*-3",-6],["(-5)",-5],[".5",0.5],["5.",5],["0.1+0.2",0.1+0.2],
 [" 1 + 2 ",3],["\t2\n*\n3\t",6],["((2+3)*4)",20],["1/0",Infinity],["0/0",NaN],["-1/0",-Infinity],
 ["10-2*3",4],["2.5*4",10],["100/10/2",5],["3-(2-5)",6],["--5",5],["+5",5],["5--3",8],
 ["2*--3",6],["---5",-5],["-(2+3)",-5],["2+-3",-1],["2-+3",-1],["1e3",1000],["2.5e-1",0.25],
 ["1E3",1000],["((((1))))",1],["0.5*0.5",0.25],["9/3/3",1],["123456*789",123456*789],
 ["1+2+3+4+5",15],["(2+3)*(4+5)",45],["7/2",3.5],["1.5+1.5",3],[".5e2",50],["3*(2+1)/2",4.5],
 ["0",0],["0.0",0],["10-10",0],["2/3",2/3],["1+2*3-4/2",5],["(1)",1],["(((((5)))))",5],
 ["1e-3",0.001],["1000000*1000000",1e12],["2.5e+2",250],["5*(4-2*(3-1))",0],
];
const close=(a,b)=>(Number.isNaN(a)&&Number.isNaN(b))||a===b;
for(const f of process.argv.slice(2)){
  delete require.cache[require.resolve('./'+f)];
  const {evalExpr}=require('./'+f);
  let p=0,e=0; const fails=[];
  for(const c of pub){ try{ if(close(evalExpr(c.in),c.out)) p++; else fails.push('PUB '+c.in+' got '+evalExpr(c.in)+' want '+c.out); }catch(err){ fails.push('PUB '+c.in+' THREW '+err.constructor.name+': '+err.message); } }
  for(const [inp,want] of edge){ try{ if(close(evalExpr(inp),want)) e++; else fails.push('EDGE '+JSON.stringify(inp)+' got '+evalExpr(inp)+' want '+want); }catch(err){ fails.push('EDGE '+JSON.stringify(inp)+' THREW '+err.constructor.name+': '+err.message); } }
  console.log(`${f} (${fs.statSync(f).size} bytes): public ${p}/${pub.length}, edge ${e}/${edge.length}`);
  for(const x of fails) console.log('  FAIL: '+x);
  // injection probes: must throw, never execute
  for(const bad of ['1+process.exit(9)','require("fs").writeFileSync("/tmp/pwned","x")','10%3','1+2)','((1','abc','1..2','']) {
    try{ const r=evalExpr(bad); console.log(`  INJECT ${JSON.stringify(bad)} -> returned ${r} (NO THROW)`); }
    catch(err){ console.log(`  INJECT ${JSON.stringify(bad)} -> throws ${err.constructor.name} OK`); }
  }
  let deep='1'; for(let i=0;i<500;i++) deep='('+deep+'+1)';
  console.log('  deep-500-nesting:', evalExpr(deep), '(want 501)');
  console.log('  child-process alive after probes: yes');
}
