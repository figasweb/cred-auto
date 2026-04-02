# Extraction Failure: BPI / eletrico

## URL: https://www.bancobpi.pt/particulares/credito/credito-automovel
## Failed fields: tan

## Current patterns
- tan: `TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%`

## HTML snippet
```html
<!DOCTYPE html><html lang="pt-PT" xmlns="http://www.w3.org/1999/xhtml"><head><script type="application/ld+json"> {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Banco BPI",
    "sameAs": ["https://www.facebook.com/bancobpi/", "https://twitter.com/banco_bpi", "https://www.linkedin.com/company/bancobpi/", "https://www.instagram.com/bancobpi/", "https://www.youtube.com/c/bancobpi"],
    "url": "https://www.bancobpi.pt/particulares/credito/credito-automovel",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "PT",
        "addressLocality": "Porto",
        "postalCode": "4100-129",
        "streetAddress": "Avenida da Boavista, 1117"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "[+351-217241700]"
    },
    "legalName": "Banco Português de Investimento",
    "logo": "https://www.bancobpi.pt/CW_SP_Common/img/x86_logo_bpi_caixabank.png"
} </script><script type="text/javascript" charset="UTF-8">
(function (global) {
    global.outsystems = global.outsystems || {};
    global.outsystems.internal = global.outsystems.internal || {};
})(this);
outsystems.internal.timerspolyfillResponseStart = new Date().getTime();
outsystems.internal.startInstant = new Date();
outsystems.internal.requestEventName = 'WebScreenClientExecuted';
outsystems.internal.beaconRESTURL = '/PerformanceProbe/rest/BeaconInternal/WebScreenClientExecutedEvent';
</script><title>Soluções Automóvel - Crédito e Renting | Banco BPI</title><meta name="title" content="Soluções Automóvel - Crédito e Renting | Banco BPI"><meta name="description" content="Escolha o seu carro onde quiser! Poderá pedir o seu Crédito Automóvel BPI com taxas fixas ou variáveis muito competitivas."><meta name="robots" content="index, follow"><meta http-equiv="content-language" content="pt-PT"><meta property="og:type" content="website"><meta property="og:title" content="Soluções Automóvel - Crédito e Renting"><meta property="og:url" content="https://www.bancobpi.pt/particulares/credito/credito-automovel"><meta property="og:image" content="https://www.bancobpi.pt/content/conn/UCM/uuid/dDocName:PR_WCS01_UCM01008576"><meta property="og:description" content="Peça o seu Crédito Automóvel BPI e escolha o seu novo carro onde quiser!"><meta name="twitter:title" content="Soluções Automóvel - Crédito e Renting"><meta name="twitter:description" content="Peça o seu Crédito Automóvel BPI e escolha o seu novo carro onde quiser!"><meta name="twitter:image" content="https://www.bancobpi.pt/content/conn/UCM/uuid/dDocName:PR_WCS01_UCM01008576"><meta name="twitter:card" content="summary"><meta name="twitter:site" content="@banco_bpi"><meta name="twitter:creator" content="@banco_bpi"><base href="/SitePublico_SiteBancoBPI/"><meta name="msapplication-tap-highlight" content="no"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, minimal-ui"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="format-detection" content="telephone=no"><link type="image/x-icon" rel="shortcut icon" href="/SitePublico_SiteBancoBPI/img/favicon.ico"><link rel="apple-touch-icon" href="/SitePublico_SiteBancoBPI/img/appletouchicon.png"><link rel="icon" href="/SitePublico_SiteBancoBPI/img/favicon32x32.png"><link rel="icon" href="/SitePublico_SiteBancoBPI/img/favicon16x16.png"><link rel="mask-icon" href="/SitePublico_SiteBancoBPI/img/safaripinnedtab.svg"><link rel="icon" href="/SitePublico_SiteBancoBPI/img/favicon48x48.png">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="Content-Script-Type" content="text/javascript"><meta http-equiv="Content-Style-Type" content="text/css">
<style>
.OSFillParent { 
 display: block;
 width: 100%;
}
table.OSFillParent {
 display: table;
}
input.OSFillParent,
button.OSFillParent,
select.OSFillParent,
textarea.OSFillParent {
 display: inline-block;
 box-sizing: border-box;
 -moz-box-sizing: border-box;
 -webkit-box-sizing: border-box;
}
.OSInline {
 display: inline-block;
 *zoom: 1;
 *display: inline;
 vertical-align: top;
}
table.OSInline {
 display: inline-table;
}
.OSAutoMarginTop {
 margin-top: 10px;
}
table[class*="ThemeGrid_Width"] {
 display: inline-table;
 vertical-align: top;
}
div[class*="ThemeGrid_Width"] {
 vertical-align: top;
}
th[class*="ThemeGrid_Width"],
td[class*="ThemeGrid_Width"] {
 display: table-cell;
}
[class*="ThemeGrid_Width"] {
 display: inline-block;
 box-sizing: border-box;
 -webkit-box-sizing: border-box;
 -moz-box-sizing: border-box;
 *zoom: 1;
 *display: inline;
}
.ThemeGrid_Container {
 box-sizing: border-box;
 -webkit-box-sizing: border-box;
 -moz-box-sizing: border-box;
}

</style>
<link href="/OutSystemsUIWeb/Blocks/OutSystemsUIWeb/Private/ServiceStudioPreview.css?12117" type="text/css" rel="stylesheet">
<link href="/RichWidgets/Blocks/RichWidgets/RichWidgets/Feedback_A
```

## Full HTML saved at: failures/html/bpi_eletrico.html

## Task
Analyze the HTML and provide corrected regex patterns for the failed fields.
Return JSON: { "fieldName": "new_regex_pattern" }
