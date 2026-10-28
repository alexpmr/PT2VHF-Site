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
 assert.deepEqual(Array.from(info.changelog,x=>x.version),["0.6.60","0.6.59","0.6.58","0.6.57","0.6.56"],lang+": ordem errada");
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

const gallerySource=fs.readFileSync(path.join(root,"assets/js/gallery.js"),"utf8");
const galleryContext={window:{}};
vm.runInNewContext(gallerySource,galleryContext,{filename:"gallery.js",timeout:1000});
const screenshots=galleryContext.window.PT2VHF_GALLERIES.mesh;
assert(screenshots.length===6,"Mesh deve exibir seis capturas reais");
assert.deepEqual(Array.from(screenshots,s=>s.captionId),["map","messages","nodes","connections","rf","chat"]);
for(const shot of screenshots){
 assert(shot.type==="screenshot");
 assert(shot.src.startsWith("/assets/screenshots/mesh/"));
 const imagePath=path.join(root,shot.src.slice(1));
 const bytes=fs.readFileSync(imagePath);
 assert(bytes.length>=1200,shot.src+": imagem vazia");
 assert.equal(bytes.toString("ascii",0,4),"RIFF",shot.src+": WebP RIFF invalido");
 assert.equal(bytes.toString("ascii",8,12),"WEBP",shot.src+": assinatura WebP invalida");
 for(const lang of ["pt","en","es","fr","de","it","zh"]){
  assert(dict[lang].captions?.[shot.captionId],lang+": legenda ausente "+shot.captionId);
 }
}
console.log("Mesh gallery OK: seis fotos reais em WebP e legendas nos sete idiomas.");

assert(main.includes('button type="button" class="screenshot-open"'),"Captura deve abrir modal, não nova aba");
assert(main.includes('meshGalleryDialog.showModal()'),"Lightbox não abre dentro da página");
assert(main.includes('meshGalleryDialog.close()'),"Lightbox não fecha na página");
assert(main.includes('shot.full||shot.src'),"Original separado de miniatura não configurado");
assert(main.includes('e.key==="ArrowLeft"||e.key==="ArrowRight"'),"Navegação por teclado ausente");
assert(!main.includes('"<a href=" + esc(shot.src)'),"Galeria não deve abrir link externo");
console.log("Lightbox Mesh OK: modal interno, fechar, teclado e fonte full/thumbnail.");

// Resolução original deve ser PNG nativo, não miniatura 340px.
// A existência é verificada quando o pacote de screenshots estiver importado.
const {readFileSync: readBytes}=require("node:fs");
for(const shot of screenshots){
 assert(/\/original\/[a-z0-9-]+\.png$/.test(shot.full),shot.captionId+": caminho do original ausente");
 const fullPath=path.join(root,shot.full.slice(1));
 if(fs.existsSync(fullPath)){
  const bytes=readBytes(fullPath);
  assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
  assert(bytes.readUInt32BE(16)>=1000,shot.captionId+": imagem ampliada ainda é thumbnail");
  assert(bytes.readUInt32BE(20)>=500,shot.captionId+": imagem original tem altura inválida");
 }
}
assert(main.includes("large.src=shot.full||shot.src"),"Lightbox deve exibir PNG original quando houver");
console.log("Full-size gallery links OK. Original PNGs serão validados no importador.");
