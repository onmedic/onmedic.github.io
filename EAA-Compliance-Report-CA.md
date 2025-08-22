# Informe de Compliment EAA (European Accessibility Act) - Web onmedic (Català)

**Data de l'avaluació:** 22 d'agost de 2025  
**Àmbit:** Carpeta `/ca/` (versió catalana del lloc web)  
**Estàndard evaluat:** WCAG 2.1 AA (base de l'EAA)  

## Resum Executiu

**Estat actual de compliment: PARCIAL ⚠️ (~65%)**

El lloc web té una base sòlida amb HTML semàntic correcte i formularis ben estructurats, però necessita millores significatives per complir completament amb l'European Accessibility Act (EAA). S'han identificat aspectes positius importants així com deficiències crítiques que requereixen atenció immediata.

---

## ✅ Aspectes Positius Identificats

### 1. Estructura HTML Semàntica Excel·lent
- **HTML5 Semàntic:** Ús correcte d'elements `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- **Jerarquia de Capçaleres:** Estructura H1 > H2 > H3 adequada en totes les pàgines
- **Idioma:** Atribut `lang="ca"` correctament especificat
- **Direccionalitat:** `dir="ltr"` adequat per català
- **DOCTYPE:** HTML5 vàlid

### 2. Formularis Accessibles (contacte.html)
- **Labels Associats:** Tots els camps tenen `<label>` amb `for` corresponent
- **Camps Obligatoris:** Marcats amb `required` i "*" visual
- **Placeholders Descriptius:** Text d'ajuda clar
- **Validació:** Validació HTML5 bàsica implementada
- **Agrupació:** Estructura lògica de camps relacionats

### 3. Navegació Bé Estructurada
- **Skip Links:** Enllaços de navegació interna (`#about`, `#expertise`)
- **Llistes per Menús:** Ús de `<ul><li>` per estructura de navegació
- **Text Descriptiu:** Enllaços amb text comprensible
- **Consistència:** Navegació coherent entre pàgines

### 4. Imatges amb Alt Text
- **Text Alternatiu:** `alt="onmedic - Building eHealth"` present
- **Formats Optimitzats:** Ús de `<picture>` amb WebP + fallback JPG
- **Dimensions:** Especificades per evitar reflow

### 5. Responsivitat i Mobilitat
- **Meta Viewport:** Configuració adequada
- **Media Queries:** Adaptació per dispositius mòbils
- **Escala Flexible:** `clamp()` per tipografies responsives

---

## ❌ Deficiències Crítiques per l'EAA

### 1. Landmarks i ARIA - **PRIORITAT ALTA 🔴**

#### Problemes identificats:
- Manca de rols ARIA per millorar navegació amb lectors de pantalla
- No s'utilitzen `role="main"`, `role="navigation"`, `role="banner"`
- Falta suport per `aria-label` en elements ambigus

#### Solucions requerides:
```html
<!-- ABANS -->
<header class="header" id="header">

<!-- DESPRÉS -->
<header class="header" id="header" role="banner" aria-label="Navegació principal">

<!-- ABANS -->
<nav class="main-nav">

<!-- DESPRÉS -->
<nav class="main-nav" role="navigation" aria-label="Menú principal">

<!-- ABANS -->
<main class="legal-content">

<!-- DESPRÉS -->
<main class="legal-content" role="main" aria-label="Contingut principal">
```

### 2. Accessibilitat de Teclat - **PRIORITAT ALTA 🔴**

#### Problemes identificats:
- Manca indicadors visuals de focus personalitzats
- No s'especifica ordre de tabulació amb `tabindex`
- Elements interactius sense suport per tecles (ESC, Enter, Fletxes)
- Skip links no visibles

#### Solucions requerides:
```css
/* Focus visible personalitzat */
.nav-link:focus,
.btn-primary:focus,
input:focus,
select:focus,
textarea:focus {
    outline: 3px solid #00D4FF;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #0A2342;
}

/* Skip link visible */
.skip-link {
    position: absolute;
    left: -9999px;
    z-index: 999999;
    padding: 8px 16px;
    background: #0A2342;
    color: white;
    text-decoration: none;
}

.skip-link:focus {
    left: 6px;
    top: 7px;
}
```

```html
<!-- Afegir skip link al principi del body -->
<a href="#main" class="skip-link">Saltar al contingut principal</a>
```

### 3. Colors i Contrast - **PRIORITAT ALTA 🔴**

#### Problemes identificats:
- Ràtios de contrast no verificats (requeriment mínim 4.5:1 per AA)
- Manca suport per mode d'alt contrast del sistema
- Colors com a única manera de transmetre informació

#### Solucions requerides:
```css
/* Suport per alt contrast */
@media (prefers-contrast: high) {
    :root {
        --color-primary: #000000;
        --color-accent: #0066CC;
        --color-text: #000000;
        --color-background: #FFFFFF;
        --color-secondary: #333333;
    }
    
    .btn-primary {
        border: 2px solid #000000;
    }
    
    .nav-link:hover {
        background: #000000;
        color: #FFFFFF;
    }
}

/* Verificar i corregir contrasts específics */
.hero-subtitle {
    color: rgba(255, 255, 255, 0.95); /* Augmentar opacitat per millor contrast */
}
```

### 4. Contingut Multimèdia - **PRIORITAT MITJANA 🟡**

#### Problemes identificats:
- Canvas `#hero-animation` sense descripció alternativa
- Icones SVG sense `<title>` o `aria-label`
- Preparació per contingut audiovisual futur (transcripcions/subtítols)

#### Solucions requerides:
```html
<!-- Canvas amb descripció -->
<canvas id="hero-animation" 
        aria-label="Animació decorativa de partícules en moviment"
        role="img">
    Animació decorativa que mostra partícules flotants representant innovació tecnològica
</canvas>

<!-- SVG amb títols -->
<svg width="48" height="48" viewBox="0 0 24 24" 
     role="img" aria-labelledby="ai-icon-title">
    <title id="ai-icon-title">Icona d'Intel·ligència Artificial</title>
    <!-- paths SVG -->
</svg>
```

### 5. Formularis Millorats - **PRIORITAT MITJANA 🟡**

#### Problemes identificats:
- Manca missatges d'error específics i accessibles
- No s'utilitza `aria-describedby` per ajuda contextual
- Validació en temps real poc accessible

#### Solucions requerides:
```html
<!-- Millores en formularis -->
<div class="form-group">
    <label for="email">Email *</label>
    <input type="email" 
           id="email" 
           name="email" 
           required 
           aria-describedby="email-help email-error"
           aria-invalid="false">
    <div id="email-help" class="help-text">
        Utilitzarem el vostre email només per respondre a la consulta
    </div>
    <div id="email-error" class="error-message" role="alert" aria-live="polite">
        <!-- Missatge d'error es mostra aquí -->
    </div>
</div>

<!-- Fieldsets per agrupació semàntica -->
<fieldset>
    <legend>Informació de Contacte</legend>
    <!-- camps de contacte -->
</fieldset>

<fieldset>
    <legend>Detalls del Projecte</legend>
    <!-- camps del projecte -->
</fieldset>
```

### 6. Tecnologies Assistives - **PRIORITAT MITJANA 🟡**

#### Problemes identificats:
- Manca regions `aria-live` per actualizacions dinàmiques
- No s'utilitza `aria-expanded` en elements col·lapsables
- Falta suport per comandaments de veu

#### Solucions requerides:
```html
<!-- Regions live per feedback dinàmic -->
<div id="form-status" aria-live="polite" role="status" class="sr-only">
    <!-- Missatges de confirmació/error -->
</div>

<!-- Menús amb estat expandit/col·lapsat -->
<button aria-expanded="false" 
        aria-controls="mobile-menu"
        aria-label="Obrir menú de navegació">
    ☰
</button>

<ul id="mobile-menu" aria-hidden="true">
    <!-- elements del menú -->
</ul>
```

---

## 📋 Pla d'Acció Prioritzat

### Fase 1 - Crític (1-2 setmanes) 🔴
1. **Afegir landmarks ARIA** a tots els elements estructurals
2. **Implementar focus visible** amb contrast adequat
3. **Verificar i corregir ràtios de contrast** de colors
4. **Afegir skip links visibles** per navegació per teclat
5. **Implementar descripcions alternatives** per SVG i Canvas

### Fase 2 - Important (3-4 setmanes) 🟡
1. **Millorar accessibilitat de formularis** amb ARIA
2. **Afegir suport per alt contrast** del sistema
3. **Implementar regions live** per feedback dinàmic
4. **Crear versió per dispositius amb moviment reduït**
5. **Optimitzar per lectors de pantalla**

### Fase 3 - Millores (1-2 mesos) 🟢
1. **Afegir shortcut keys** per navegació ràpida
2. **Implementar breadcrumbs accessibles** en pàgines profundes
3. **Millorar feedback auditiu** per accions completades
4. **Testing amb usuaris** amb discapacitats
5. **Documentació d'accessibilitat** per desenvolupadors

---

## 🔧 Exemples de Codi Específics

### Meta Tags d'Accessibilitat
```html
<!-- Afegir al <head> -->
<meta name="accessibility-features" content="keyboard-accessible,high-contrast-display">
<meta name="accessibility-hazard" content="none">
<meta name="accessibility-summary" content="Web accessible per usuaris amb discapacitats visuals, motores i cognitives">
```

### CSS per Moviment Reduït (ja implementat parcialment)
```css
/* Ampliar suport existent */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    /* Aturar animacions de canvas */
    #hero-animation {
        display: none;
    }
}
```

### JavaScript per Accessibilitat
```javascript
// Gestió de focus per modals/overlays
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            // Tancar modal/overlay
        }
    });
}

// Announcer per lectors de pantalla
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
    announcement.textContent = message;
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}
```

---

## 🧪 Testing i Validació Recomanats

### Eines de Testing
1. **axe DevTools** - Testing automatitzat d'accessibilitat
2. **WAVE** - Anàlisi visual d'accessibilitat
3. **Lighthouse** - Auditoria integrada de Chrome
4. **Screen Reader Testing** - NVDA (gratuït), JAWS, VoiceOver

### Testing Manual
1. **Navegació només per teclat** (sense ratolí)
2. **Alt contrast** (Configuració del sistema)
3. **Zoom fins 200%** sense pèrdua de funcionalitat
4. **Lectors de pantalla** amb contingut real

### Criteris d'Acceptació
- [ ] Tots els elements interactius accessibles per teclat
- [ ] Contrast mínim 4.5:1 per text normal
- [ ] Contrast mínim 3:1 per text gran i elements gràfics
- [ ] Formularis amb etiquetes i validació accessible
- [ ] Imatges amb text alternatiu apropiat
- [ ] Estructura de capçaleres lògica
- [ ] Navegació consistent i predictible

---

## 💡 Beneficis del Compliment EAA

### Beneficis Legals
- ✅ Compliment amb normativa europea (vigent des de juny 2025)
- ✅ Evitar sancions i problemes legals
- ✅ Preparació per auditoríes oficials

### Beneficis d'Usuari
- 🎯 Millor experiència per tots els usuaris
- 📱 Millor usabilitat en dispositius mòbils
- 🔍 Millor SEO i findabilitat
- 👥 Ampliació de l'audiència potencial

### Beneficis Tècnics
- 🚀 Millor rendiment general
- 🔧 Codi més mantenible i semàntic
- 📊 Millors mètriques de Core Web Vitals
- 🔒 Millor seguretat (estructura sòlida)

---

## 📅 Calendari Suggerit

| Setmana | Tasques |
|---------|---------|
| 1-2 | ARIA landmarks, focus visible, skip links |
| 3-4 | Contrast de colors, descripcions SVG/Canvas |
| 5-6 | Millores de formularis, regions live |
| 7-8 | Testing amb usuaris, ajustos finals |
| 9-10 | Documentació i formació de l'equip |

---

## 📚 Referències i Recursos

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [European Accessibility Act - Directiva Europea](https://ec.europa.eu/social/main.jsp?catId=1202)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Real de Decreto 1112/2018 (Espanya)](https://www.boe.es/eli/es/rd/2018/08/31/1112)

---

**Conclusió:** El lloc web té una excel·lent base tècnica, però necessita millores específiques per complir completament amb l'EAA. Amb les implementacions suggeri-des, es pot assolir un compliment del 95%+ dels criteris WCAG 2.1 AA.

**Estimació de temps total:** 6-8 setmanes de desenvolupament  
**Estimació de cost:** Mitjà (principalment temps de desenvolupament)  
**ROI:** Alt (compliment legal + millor UX per tots els usuaris)