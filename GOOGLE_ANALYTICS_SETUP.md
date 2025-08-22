# 📊 Google Analytics 4 Setup for OnMedic

## ✅ Implementació Completada

L'implementació de Google Analytics 4 ja està **completa i llesta per usar**. Només necessites configurar el teu **Measurement ID** seguint aquests passos:

## 🚀 Passos per Activar Analytics

### 1. Crear Compte Google Analytics 4

1. **Ves a** [analytics.google.com](https://analytics.google.com)
2. **Crea un compte** nou o utilitza un existent
3. **Crea una Propietat** nova:
   - Nom: `onmedic`
   - Zona horària: Europa/Barcelona
   - Moneda: EUR
4. **Configura un Data Stream**:
   - Tipus: Web
   - URL: `https://onmedic.com`
   - Nom del stream: `onmedic website`

### 2. Obtenir el Measurement ID

Després de crear l'stream, obtindràs un **Measurement ID** amb format:
```
G-XXXXXXXXXX
```

### 3. Actualitzar el Codi

Edita el fitxer `/src/scripts/analytics.js` i canvia la línia:

```javascript
// ABANS:
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual ID

// DESPRÉS:
const GA_MEASUREMENT_ID = 'G-TU-CODI-REAL'; // El teu codi real
```

### 4. Regenerar Fitxer Minificat

Després de canviar el codi, actualitza també `/src/scripts/analytics.min.js` amb la versió minificada del codi nou.

## 🌍 Funcionalitats Implementades

### ✅ Detecció Automàtica d'Idioma
- **Català**: Detecta pàgines amb `lang="ca"`
- **Espanyol**: Detecta pàgines amb `lang="es"`
- **Anglès**: Detecta pàgines amb `lang="en"`

### ✅ Compliment GDPR/Privacitat
- **Consentiment obligatori**: Analytics només s'activa si l'usuari accepta "totes les cookies"
- **Dades anònimes**: IP anonimitzada automàticament
- **No personalització**: Sense personalització d'anuncis
- **Cookies segures**: Configuració SameSite=Lax;Secure

### ✅ Tracking Avançat
- **Pàgines per idioma**: Agrupa estadístiques per idioma
- **Tipus de pàgina**: Categoritza home, contact, privacy, etc.
- **Formularis**: Tracking de submissions
- **Navegació**: Clicks en enllaços interns
- **Errors**: Tracking d'excepcions

### ✅ Integració amb Cookies
- **Acceptar totes** → Analytics s'activa
- **Només essencials** → Analytics es desactiva
- **Canvis en temps real**: Respon a canvis de consentiment

## 📈 Informes que Veuràs

### 1. **Audiència per Idioma**
- Visitants catalans, espanyols, anglesos
- Comportament per idioma

### 2. **Pàgines Més Visitades**
- Per idioma i globalment
- Temps de permanència

### 3. **Formularis i Conversions**
- Enviaments de contacte
- Taxa de conversió per idioma

### 4. **Navegació d'Usuaris**
- Clicks en navigation
- Canvis d'idioma

## 🔧 Configuració Recomanada a GA4

### Custom Dimensions a Crear:
1. **Language** (custom_parameter_1)
2. **Page Type** (custom_parameter_2)

### Goals/Events a Configurar:
- `form_submit` - Enviaments de formularis
- `language_change` - Canvis d'idioma
- `page_view` - Vistes de pàgina amb context

## 🛠️ Verificar que Funciona

### 1. **Mode Desenvolupament**
Obre DevTools Console i hauries de veure:
```
🔍 Google Analytics initialized for language: ca
```

### 2. **Real-Time a GA4**
- Ves a Analytics → Reports → Realtime
- Navega pel teu lloc web
- Hauries de veure les sessions en temps real

### 3. **DebugView**
- Activa DebugView a GA4
- Veuràs events detallats en temps real

## ⚡ Optimitzacions Implementades

- **DNS Prefetch**: Accelera càrrega d'Analytics
- **Defer Loading**: No bloqueja renderitzat inicial
- **Condicional**: Només carrega si hi ha consentiment
- **Detecció Intel·ligent**: Language detection automàtic
- **Error Handling**: Robust davant errors

## 🚨 Notes Importants

1. **GitHub Pages**: Tot funcionarà perfectament en GitHub Pages
2. **Propagació**: Les dades triguen 24-48h en aparèixer completament
3. **Testing**: Utilitza mode Real-time per testing immediat
4. **Privacitat**: Compleix totalment amb GDPR i normatives

## 📞 Suport

Si necessites ajuda amb la configuració, obre un issue al repositori amb:
- El teu Measurement ID (només els últims 4 caràcters)
- Captures de la configuració de GA4
- Errors específics que vegis a la consola