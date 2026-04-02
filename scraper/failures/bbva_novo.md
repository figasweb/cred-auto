# Extraction Failure: BBVA / novo

## URL: https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html
## Failed fields: tan, taeg

## Current patterns
- tan: `TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%`
- taeg: `TAEG\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,2})\s*%`

## HTML snippet
```html
<!DOCTYPE html><html lang="pt-PT"><head>
  <meta charset="UTF-8">
  <title>Desculpe pela inconveniência | BBVA Portugal</title>
  <link rel="icon" type="image/png" sizes="16x16" href="/portugal/resources/favicon/16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/portugal/resources/favicon/32x32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="/portugal/resources/favicon/48x48.png">
  <link rel="apple-touch-icon" sizes="57x57" href="/portugal/resources/favicon/57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/portugal/resources/favicon/60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/portugal/resources/favicon/72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/portugal/resources/favicon/76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/portugal/resources/favicon/114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/portugal/resources/favicon/120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/portugal/resources/favicon/144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/portugal/resources/favicon/152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/portugal/resources/favicon/180x180.png">
  <link rel="icon" type="image/png" sizes="36x36" href="/portugal/resources/favicon/android-chrome-36x36.png">
  <link rel="icon" type="image/png" sizes="48x48" href="/portugal/resources/favicon/android-chrome-48x48.png">
  <link rel="icon" type="image/png" sizes="72x72" href="/portugal/resources/favicon/android-chrome-72x72.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/portugal/resources/favicon/android-chrome-96x96.png">
  <link rel="icon" type="image/png" sizes="144x144" href="/portugal/resources/favicon/android-chrome-144x144.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/portugal/resources/favicon/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="256x256" href="/portugal/resources/favicon/android-chrome-256x256.png">
  <link rel="stylesheet" type="text/css" href="/portugal/resources/css/styles.css">

  <!-- Analytics DataLayer -->
  <script type="text/javascript" id="www-widgetapi-script" src="https://www.youtube.com/s/player/4a6035e3/www-widgetapi.vflset/www-widgetapi.js" async=""></script><script src="https://www.youtube.com/iframe_api"></script><script type="text/javascript">
    window.digitalData = {"optimization":{"attributes":[],"event":[]},"user":{"userState":"","device":{"root":"","mobile":"","userAgent":""},"userID":"","prospectID":"","gender":"","country":"","civilStatus":"","educationLevel":"","segment":{"profile":"","global":""},"jobType":"","age":"","profileID":"","state":""},"application":{"transactionID":"","step":"","offer":"","fulfillmentModel":"","typology":"","programTypeHired":"","operationNumber":"","interactionLevel":"","isQualifiedVisits":"","earnings":"","expenses":"","customFields":"","globalApplication":"","process":"","errorType":"","application":{"name":"","type":""},"state":""},"products":{"attributes":[],"productPortfolio":[]},"page":{"pageInfo":{"pageSegment":"","area":"","sysEnv":"","businessUnit":"","pageName":"","errorPage":"","pageIntent":"","level1":"","level2":"","level3":"","level4":"","level5":"","level6":"","level7":"","level8":"","level9":"","level10":"","siteAppName":"","projectName":"","geoRegion":"","version":"","server":"","language":"","channel":""},"pageActivity":{"search":{"onSiteSearchResults":"","onSiteSearchTerm":"","onSiteSearchEnterTerm":""},"link":{"name":"","url":"","ext":"","aux1":"","aux2":"","aux3":""},"video":{"nameOfVideoDisplayed":""},"audio":{"nameOfPodcastDisplayed":""},"loginType":""}},"internalCampaign":{"event":{"eventInfo":{"siteActionName":"","eventName":""}},"attributes":[]},"versionDL":"20190718_4.0","pageInstanceID":""};
  </script>
  <!-- Launcher -->
  <script src="//assets.adobedtm.com/95c3e405673d/1d3a21d65df0/launch-9000eecc9f1a.min.js" async=""></script>
<script src="https://assets.adobedtm.com/extensions/EP31dbb9c60e404ba1aa6e746d49be6f29/AppMeasurement.min.js" async=""></script><script src="https://assets.adobedtm.com/extensions/EP31dbb9c60e404ba1aa6e746d49be6f29/AppMeasurement_Module_ActivityMap.min.js" async=""></script><script src="https://assets.adobedtm.com/95c3e405673d/1d3a21d65df0/e754c9c02ba9/RC505a6f1970b64a759cd763e02b262696-source.min.js" async=""></script></head>
<body class="general-wrapper body__base" itemscope="" itemtype="http://schema.org/WebPage">
<header class="header__base">
  <nav class="header__container">
    <div class="container-header">
      <div class="header__logo">
        <a href="#">
          <img src="/portugal/resources/logo/logo_bbva_blanco.svg" itemprop="logo" class="header__logo-img" alt="Home de BBVA">
        </a>
      </div>
    </div>
  </nav>
</header>
<main>
  <div class="banner__base">
    <div class="banner__container">
      <div class="container-full-width">
        <div class="banner__wra
```

## Full HTML saved at: failures/html/bbva_novo.html

## Task
Analyze the HTML and provide corrected regex patterns for the failed fields.
Return JSON: { "fieldName": "new_regex_pattern" }
