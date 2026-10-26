/* Localized release highlights sourced from the canonical GitHub changelog. */
(function () {
  "use strict";
  var translations = {
    pt: {
      historyTitle: "Changelog — últimas 5 versões",
      historyIntro: "Evolução do Prop Tool com base no histórico oficial do projeto no GitHub.",
      changelog: [
        { version:"0.2.22", title:"OTA pelo site PT2VHF", changes:[
          "Atualizações passam a ser consultadas no domínio pt2vhf.com, independentemente do GitHub/GitLab.",
          "Verificação de versão, tipo de instalador, tamanho e SHA-256; testes para a edição portátil e recuperação de falhas."
        ]},
        { version:"0.2.21", title:"Aviso de novas versões", changes:[
          "Aviso permite atualizar imediatamente ou adiar a mesma versão por 24 horas.",
          "Diálogo não se sobrepõe a outras janelas, com textos traduzidos."
        ]},
        { version:"0.2.20", title:"Destaque visual e manual", changes:[
          "Melhoria do destaque dourado das melhores bandas, pulsos suaves e empates visíveis.",
          "Ajustes de dados NOAA ausentes e capturas do manual ilustrado."
        ]},
        { version:"0.2.19", title:"Medições solares confiáveis", changes:[
          "Kp ausente não é convertido artificialmente em zero; medições reais de zero são preservadas.",
          "Testes de regressão e melhorias no manual."
        ]},
        { version:"0.2.18", title:"Identificação da melhor banda", changes:[
          "Bordas e fundos dourados indicam bandas líderes, com três pulsos quando a liderança muda.",
          "Empates, ausência de dados, acessibilidade e movimento reduzido tratados corretamente."
        ]}
      ]
    },
    en: {
      historyTitle: "Changelog — last 5 versions",
      historyIntro: "Official project changes, based on the GitHub changelog.",
      changelog: [
        {version:"0.2.22",title:"OTA through the PT2VHF website",changes:["Update checks now use pt2vhf.com, without relying on GitHub or GitLab.","Strict version, package, size and SHA-256 checks; portable upgrade and rollback tests."]},
        {version:"0.2.21",title:"New update notification",changes:["Update immediately or postpone the same version for 24 hours.","Localized notifications never overlay another dialog."]},
        {version:"0.2.20",title:"Band highlights and documentation",changes:["Improved golden best-band highlight, gentle pulses and visible ties.","Missing NOAA fields and illustrated manual screenshots corrected."]},
        {version:"0.2.19",title:"Reliable solar measurements",changes:["Missing Kp readings are no longer incorrectly treated as zero.","Regression coverage and illustrated manual improvements."]},
        {version:"0.2.18",title:"Best-band identification",changes:["Golden borders and backgrounds identify leading bands, with three transition pulses.","Correct handling of ties, missing observations and reduced motion."]}
      ]
    },
    es: {
      historyTitle:"Historial de cambios — últimas 5 versiones",
      historyIntro:"Novedades confirmadas en el historial oficial de GitHub.",
      changelog:[
        {version:"0.2.22",title:"Actualizaciones OTA desde el sitio",changes:["La consulta de versiones utiliza pt2vhf.com en lugar de GitHub/GitLab.","Validación de versión, paquete, tamaño y SHA-256; pruebas de actualización portátil y recuperación."]},
        {version:"0.2.21",title:"Avisos de actualización",changes:["Actualizar ahora o posponer la versión durante 24 horas.","Avisos traducidos sin superponerse a otros diálogos."]},
        {version:"0.2.20",title:"Bandas y manual",changes:["Mejor destacado dorado de las bandas líderes, pulsos y empates.","Correcciones de datos NOAA ausentes y capturas del manual."]},
        {version:"0.2.19",title:"Datos solares fiables",changes:["Los valores Kp ausentes ya no se convierten artificialmente en cero.","Pruebas de regresión y manual mejorado."]},
        {version:"0.2.18",title:"Mejor banda",changes:["Indicadores dorados y tres pulsos al cambiar la banda líder.","Se respetan los empates, los datos ausentes y el movimiento reducido."]}
      ]
    },
    fr: {
      historyTitle:"Journal des modifications — 5 dernières versions",
      historyIntro:"Nouveautés vérifiées dans l’historique officiel GitHub.",
      changelog:[
        {version:"0.2.22",title:"Mise à jour OTA depuis le site",changes:["La recherche de versions utilise pt2vhf.com, sans GitHub ni GitLab.","Contrôles de version, format, taille et SHA-256 ; tests du mode portable et de restauration."]},
        {version:"0.2.21",title:"Notification des mises à jour",changes:["Installer immédiatement ou reporter la même version de 24 heures.","Messages traduits, sans recouvrir une autre boîte de dialogue."]},
        {version:"0.2.20",title:"Bandes et documentation",changes:["Meilleur surlignage doré des bandes, impulsions et égalités.","Corrections des champs NOAA manquants et des captures du manuel."]},
        {version:"0.2.19",title:"Mesures solaires fiables",changes:["Une valeur Kp absente n’est plus remplacée artificiellement par zéro.","Tests de régression et manuel amélioré."]},
        {version:"0.2.18",title:"Meilleure bande",changes:["Indicateurs dorés et trois impulsions lors du changement de bande dominante.","Gestion des égalités, données manquantes et mouvements réduits."]}
      ]
    },
    de: {
      historyTitle:"Änderungsprotokoll — letzte 5 Versionen",
      historyIntro:"Bestätigte Neuerungen aus dem offiziellen GitHub-Changelog.",
      changelog:[
        {version:"0.2.22",title:"OTA über die PT2VHF-Website",changes:["Die Update-Prüfung nutzt pt2vhf.com statt GitHub oder GitLab.","Prüfung von Version, Pakettyp, Größe und SHA-256 sowie Portable- und Rollback-Tests."]},
        {version:"0.2.21",title:"Update-Benachrichtigung",changes:["Sofort aktualisieren oder dieselbe Version 24 Stunden verschieben.","Übersetzte Hinweise verdecken keine anderen Dialoge."]},
        {version:"0.2.20",title:"Bänder und Handbuch",changes:["Verbesserte goldene Markierung der besten Bänder, sanfte Impulse und Gleichstände.","Korrekturen fehlender NOAA-Werte und der Handbuch-Abbildungen."]},
        {version:"0.2.19",title:"Zuverlässige Solardaten",changes:["Fehlende Kp-Werte werden nicht mehr künstlich als Null angezeigt.","Regressionstests und aktualisiertes Handbuch."]},
        {version:"0.2.18",title:"Bestes Band erkennen",changes:["Goldene Hervorhebung mit drei Impulsen bei Führungswechsel.","Gleichstände, fehlende Daten und reduzierte Bewegung berücksichtigt."]}
      ]
    },
    it: {
      historyTitle:"Registro modifiche — ultime 5 versioni",
      historyIntro:"Novità confermate dal changelog ufficiale su GitHub.",
      changelog:[
        {version:"0.2.22",title:"OTA dal sito PT2VHF",changes:["Il controllo aggiornamenti usa pt2vhf.com senza dipendere da GitHub o GitLab.","Verifica versione, pacchetto, dimensione e SHA-256; test portatile e ripristino."]},
        {version:"0.2.21",title:"Avviso di aggiornamento",changes:["Aggiornamento immediato oppure rinvio della stessa versione di 24 ore.","Messaggi tradotti senza sovrapposizioni ad altre finestre."]},
        {version:"0.2.20",title:"Bande e manuale",changes:["Migliorata l'evidenziazione dorata delle bande migliori e dei pareggi.","Corretti i campi NOAA mancanti e le schermate del manuale."]},
        {version:"0.2.19",title:"Misurazioni solari affidabili",changes:["I dati Kp mancanti non vengono più convertiti artificialmente in zero.","Test di regressione e aggiornamenti del manuale."]},
        {version:"0.2.18",title:"Banda migliore",changes:["Indicatori dorati e tre impulsi quando cambia la banda migliore.","Gestione di pareggi, assenza di dati e movimento ridotto."]}
      ]
    },
    zh: {
      historyTitle:"更新日志 — 最近 5 个版本",
      historyIntro:"根据 GitHub 官方更新日志整理的功能改进。",
      changelog:[
        {version:"0.2.22",title:"通过 PT2VHF 官网 OTA 更新",changes:["更新检查改用 pt2vhf.com，不再依赖 GitHub 或 GitLab。","严格验证版本、安装包类型、文件大小和 SHA-256，并测试便携版升级与回退。"]},
        {version:"0.2.21",title:"新版本通知",changes:["可以立即更新，也可以将同一版本推迟 24 小时。","多语言通知不会覆盖其他对话框。"]},
        {version:"0.2.20",title:"频段突出显示和手册",changes:["优化最佳频段金色高亮、柔和提示和并列结果。","修正 NOAA 缺失字段和图文手册截图。"]},
        {version:"0.2.19",title:"可靠的太阳活动数据",changes:["缺失的 Kp 数值不再被误当作零。","添加回归测试并更新手册。"]},
        {version:"0.2.18",title:"最佳频段识别",changes:["最佳频段以金色显示，切换领先频段时提示三次。","正确处理并列、缺失数据及减少动画设置。"]}
      ]
    }
  };
  window.PT2VHF_PROP_SITE = translations;
})();
