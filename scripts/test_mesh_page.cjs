/* Regressão do conteúdo e da ordem das seções em /mesh. */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/js/mesh-site-data.js"),"utf8");
const context={window:{}};
vm.runInNewContext(source,context,{filename:"mesh-site-data.js",timeout:1000});
const dict=context.window.PT2VHF_MESH_SITE;
assert(dict,"Catálogo multilíngue Mesh ausente");
for(const lang of ["pt","en","es","fr","de","it","zh"]){
 const info=dict[lang];
 assert(info,lang+": idioma ausente");
 assert(Array.isArray(info.description)&&info.description.length>=3,lang+": introdução incompleta");
 assert(Array.isArray(info.features)&&info.features.length>=8,lang+": recursos incompletos");
 assert(Array.isArray(info.changelog)&&info.changelog.length===5,lang+": histórico deve ter 5 versões");
 assert.deepEqual(Array.from(info.changelog,x=>x.version),["0.6.58","0.6.57","0.6.56","0.6.55","0.6.54"],lang+": ordem errada");
 for(const row of info.changelog){assert(row.title&&row.changes?.length,lang+": nota de versão incompleta");}
}
const html=fs.readFileSync(path.join(root,"mesh.html"),"utf8");
assert(html.indexOf("mesh-site-data.js")>0);
assert(html.indexOf("mesh-site-data.js")<html.indexOf("main.js"),"Carregar dados antes de renderizar");
const main=fs.readFileSync(path.join(root,"assets/js/main.js"),"utf8");
assert(main.includes('meshChangelog(p) +'),"Changelog não renderizado");
const download=main.indexOf("downloadTable(p) +");
const history=main.indexOf("meshChangelog(p) +");
assert(download>0&&history>download,"Histórico deve ficar após downloads");
assert(main.includes("slice(0,5)"),"Histórico deve limitar a 5 versões");
const ht=fs.readFileSync(path.join(root,".htaccess"),"utf8");
assert(ht.includes("downloads/mesh-analyzer/"),"Falta interceptação Mesh no Apache");
assert(ht.includes("pt2vhf_raw=1"),"Falta prevenção de contagem dupla");
console.log("Mesh site OK: introdução, recursos, traduções, cinco versões e contador roteado.");
