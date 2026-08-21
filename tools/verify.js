const fs=require("fs"),cp=require("child_process");
const F=process.argv[2]||"/Users/leonlin/ghostty-装修器.html";
let h=fs.readFileSync(F,"utf8");
let fail=0; const bad=m=>{console.log("  ❌ "+m);fail++;}, ok=m=>console.log("  ✅ "+m);

// 1) 重复 ID
const ids=[...h.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
dup.length?bad("重复 ID: "+[...new Set(dup)]):ok("无重复 ID ("+ids.length+" 个)");

// 2) JS 语法
const js=h.match(/<script>([\s\S]*)<\/script>/)[1];
fs.writeFileSync(SH_TMP(),js);
try{cp.execSync("node --check "+SH_TMP(),{stdio:"pipe"});ok("JS 语法 OK");}catch(e){bad("JS 语法: "+e.stderr);}
function SH_TMP(){return "/tmp/_ck.js";}

// 3) 控件接线:JS 里 $("#id") 引用的 id 是否都存在于 HTML(排除动态生成的)
const refs=[...new Set([...js.matchAll(/\$\("#([a-zA-Z0-9_]+)"\)/g)].map(m=>m[1]))];
const htmlIds=new Set(ids);
const dynamic=new Set(["cfg"]); // #cfg 等确认存在
const missing=refs.filter(r=>!htmlIds.has(r));
missing.length?bad("JS 引用但 HTML 不存在的 id: "+missing):ok("所有 $(\"#id\") 引用都能命中 ("+refs.length+")");

// 4) headless 运行 buildCfg + 多分支,校验导出配置
function makeEl(){return new Proxy({value:"",checked:false,textContent:"",innerHTML:"",style:new Proxy({},{get:()=>"",set:()=>true}),classList:{add(){},remove(){},toggle(){}},addEventListener(){},select(){},querySelectorAll:()=>[]},{get(t,k){return k in t?t[k]:(k==="dataset"?{}:undefined);}});}
function harness(mutator){
  const cfgObj=makeEl();
  global.document={querySelector:s=>s==="#cfg"?cfgObj:makeEl(),querySelectorAll:()=>[]};
  global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
  global.navigator={clipboard:{writeText(){}}};global.location={reload(){}};
  global.Blob=function(){};global.URL={createObjectURL:()=>""};
  try{ eval(js); if(mutator)mutator(global.__state); buildCfg(); return cfgObj.value; }
  catch(e){ return "__ERR__"+e.message; }
}
// 需要暴露 state:在 js 里 state 是 const,无法外部改。改用 eval 后直接调 buildCfg(默认态)
let def=harness();
if(def.startsWith("__ERR__"))bad("buildCfg 运行时错误: "+def.slice(7));
else{
  fs.writeFileSync("/tmp/_gen.config",def);
  try{cp.execSync('/Applications/Ghostty.app/Contents/MacOS/ghostty +validate-config --config-file=/tmp/_gen.config',{stdio:"pipe"});ok("默认导出过 Ghostty 校验 ("+def.split("\n").length+" 行)");}
  catch(e){bad("默认导出校验失败: "+(e.stdout||e.stderr));}
}

// 5) state 字段 vs 控件/buildCfg 使用一致性(粗查:state 里每个 key 是否在 js 别处出现)
const sm=js.match(/const state=\{([^;]*)\};/);
if(sm){
  const keys=[...sm[1].matchAll(/([a-zA-Z0-9_]+):/g)].map(m=>m[1]);
  const orphan=keys.filter(k=>{const re=new RegExp("state\\."+k+"\\b");return !re.test(js);});
  orphan.length?bad("state 里定义但从未 state.X 使用的字段: "+orphan):ok("所有 state 字段都有被使用 ("+keys.length+")");
}
console.log(fail?("\n发现 "+fail+" 个问题"):"\n全部通过 ✅");
process.exit(fail?1:0);
