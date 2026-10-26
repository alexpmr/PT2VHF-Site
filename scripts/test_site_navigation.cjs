"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const load=(f)=>fs.readFileSync(path.join(root,f),"utf8");
const pages=["index","aprs","prop","mesh","sat","prog","contato"];
for(const name of pages){
 const s=load(name+".html");
 assert(s.includes("/assets/js/contact-data.js"),name+": traducoes do menu nao foram carregadas");
 if(name==="contato")assert(!/(?:src|href)="assets\//.test(s),"Contato deve usar URLs absolutas para funcionar com barra final");
 assert(s.includes('href="/contato"'),name+": menu Contato ausente");
 assert(s.includes('class="site-nav-projects"'),name+": menu de projetos ausente");
 for(const project of ["aprs","prop","mesh","sat","prog"]){
   assert(s.includes('href="/'+project+'"'),name+": projeto ausente: "+project);
 }
 assert(s.includes('class="site-nav-home"'),name+": Inicio ausente");
}
const index=load("index.html");
assert(index.includes('/assets/img/pt2vhf-hero-banner.webp'),"Banner nao encontrado");
assert(!index.includes('id="instalacao"'),"Instalacao deve sair da homepage");
assert(!index.includes('id="sobre"'),"Sobre deve estar somente na pagina exclusiva");
assert(!index.includes('id="contato"'),"Contato deve estar somente na pagina exclusiva");
const contact=load("contato.html");
assert(contact.includes('class="contact-page"'));
assert(contact.includes('href="mailto:alexpmr@gmail.com"'));
assert(contact.includes('href="https://wa.me/5561984023634"'));
assert(contact.includes('/assets/img/alex-pt2vhf.webp'));
assert(contact.includes('aria-current="page"'));
const i18nContext={window:{}};
vm.runInNewContext(load("assets/js/contact-data.js"),i18nContext,{timeout:1000});
const data=i18nContext.window.PT2VHF_SITE_PAGE_I18N;
for(const lang of ["pt","en","es","fr","de","it","zh"]){
 for(const key of ["navHome","navProjects","navContact","aboutTitle","bio1","bio2","bio3","contactTitle","contactText","pageTitle"]){
  assert(data[lang]?.[key],lang+": faltando "+key);
 }
}
const ht=load(".htaccess");
assert(ht.includes("(aprs|prop|mesh|sat|prog|contato)/?"),"Falta rota /contato");
const siteJs=load("assets/js/main.js");
assert(siteJs.includes("contato(?:[?#]|$)"),"Idioma deve persistir ao navegar para /contato");
for(const name of ["pt2vhf-hero-banner.webp","alex-pt2vhf.webp"]){
 const buffer=fs.readFileSync(path.join(root,"assets/img",name));
 assert(buffer.length>10000,name+": imagem ausente");
 assert.equal(buffer.toString("ascii",0,4),"RIFF",name+": WebP invalido");
 assert.equal(buffer.toString("ascii",8,12),"WEBP",name+": WebP invalido");
}
console.log("Site header, menu dropdown, contato, imagens e 7 idiomas: OK");
