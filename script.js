const translations = {
  ru: {
    aka:   "он же ZAZOR",
    proof: "Переводчик Lunar client",
    info:  "Изучаю GLua, HTML, CSS и JS."
  },
  en: {
    aka:   "a.k.a. ZAZOR",
    proof: "Proofreader Lunar Client",
    info:  "Learning GLua, HTML, CSS and JS."
  },
  de: {
    aka:   "a.k.a. ZAZOR",
    proof: "Übersetzer bei Lunar Client",
    info:  "Lerne GLua, HTML, CSS und JS."
  }
};

const state = {
    currentLanguage: 'en',
    translatableElements: null,
    themeIcon: null,
    langIcon: null,
    themeBtn: null,
    langBtn: null
};

const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
};

const THEME_ICONS = {
    [THEMES.DARK]:  'assets/icon/dark.svg',
    [THEMES.LIGHT]: 'assets/icon/white.svg'
};

const LANGUAGE_ICONS = {
    'en': 'assets/icon/us.svg',
    'ru': 'assets/icon/ru.svg',
    'de': 'assets/icon/de.svg'
};

const LANGUAGES = ['en', 'ru', 'de'];

const ANIMATION = {
    DURATION: 600,
    EASING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    ROTATION: '360deg',
    SCALE: 1.2,
    RESET_TRANSITION: 'transform 0.3s ease'
};

const CSS = {
    TRANSITION: 'transition',
    TRANSFORM: 'transform',
    ROTATE_ZERO: 'rotate(0deg) scale(1)'
};

(function() {
    const text = "🤍Wellett info🤍";
    const TYPING_SPEED = 150;
    const PAUSE_BEFORE_DELETE = 1000;
    const PAUSE_BEFORE_TYPE = 500;
    
    let index = 0;
    let isDeleting = false;
    let isPaused = false;
    let animationId = null;
    let timeoutId = null;
    
    function updateTitle() {
        if (isPaused) return;
        
        if (!isDeleting) {
            index++;
            if (index > text.length) {
                isDeleting = true;
                isPaused = true;
                timeoutId = setTimeout(() => {
                    isPaused = false;
                    scheduleNextUpdate();
                }, PAUSE_BEFORE_DELETE);
                return;
            }
        } else {
            index--;
            if (index < 1) {
                isDeleting = false;
                index = 0;
                isPaused = true;
                timeoutId = setTimeout(() => {
                    isPaused = false;
                    scheduleNextUpdate();
                }, PAUSE_BEFORE_TYPE);
                return;
            }
        }

        document.title = text.substring(0, Math.max(index, 1));
        scheduleNextUpdate();
    }
    
    function scheduleNextUpdate() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animationId = requestAnimationFrame(() => {
            timeoutId = setTimeout(updateTitle, TYPING_SPEED);
        });
    }

    scheduleNextUpdate();
})();

function getElement(id, cache) {
    if (cache === null) {
        return document.getElementById(id);
    }
    return cache;
}

function getThemeIcon() {
    if (state.themeIcon === null) {
        state.themeIcon = document.getElementById('tmIcon');
    }
    return state.themeIcon;
}

function getLangIcon() {
    if (state.langIcon === null) {
        state.langIcon = document.getElementById('langIcon');
    }
    return state.langIcon;
}

function updateIcon(element, src, alt, title) {
    if (!element) return;

    if (element.src !== src) {
        element.src = src;
    }
    if (alt && element.alt !== alt) {
        element.alt = alt;
    }
    if (title && element.title !== title) {
        element.title = title;
    }
}

function updateLanguageIcon(locale) {
    const icon = getLangIcon();
    const src = LANGUAGE_ICONS[locale];
    if (src) {
        updateIcon(icon, src, locale.toUpperCase(), locale.toUpperCase());
    }
}

function updateThemeIcon(theme) {
    const icon = getThemeIcon();
    const src = THEME_ICONS[theme];
    if (src) {
        const label = theme.charAt(0).toUpperCase() + theme.slice(1);
        updateIcon(icon, src, `${label} Theme`, `${label} Theme`);
    }
}

function setLanguage(locale) {
    state.currentLanguage = locale;
    const langTranslations = translations[locale];

    if (state.translatableElements === null) {
        state.translatableElements = document.querySelectorAll('[data-i18n]');
    }

    const elements = state.translatableElements;
    for (let i = elements.length; i--;) {
        const element = elements[i];
        const key = element.getAttribute('data-i18n');
        const translation = langTranslations[key];
        if (translation && element.textContent !== translation) {
            element.textContent = translation;
        }
    }
    
    document.documentElement.lang = locale;
    localStorage.setItem('preferred-language', locale);
    
    updateLanguageIcon(locale);
}

function toggleTheme() {
    const body = document.body;
    const icon = getThemeIcon();

    if (!icon) {
        const isDark = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? THEMES.DARK : THEMES.LIGHT);
        return;
    }

    icon.style[CSS.TRANSITION] = `transform ${ANIMATION.DURATION}ms ${ANIMATION.EASING}`;
    icon.style[CSS.TRANSFORM] = `rotate(${ANIMATION.ROTATION}) scale(${ANIMATION.SCALE})`;

    requestAnimationFrame(() => {
        setTimeout(() => {
            const isDark = body.classList.toggle('dark-theme');
            const theme = isDark ? THEMES.DARK : THEMES.LIGHT;

            updateThemeIcon(theme);

            icon.style[CSS.TRANSITION] = ANIMATION.RESET_TRANSITION;
            icon.style[CSS.TRANSFORM] = CSS.ROTATE_ZERO;
            
            localStorage.setItem('theme', theme);
        }, ANIMATION.DURATION / 2);
    });
}

function toggleLanguage() {
    const currentIndex = LANGUAGES.indexOf(state.currentLanguage);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex]);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || THEMES.LIGHT;
    const body = document.body;

    body.classList.toggle('dark-theme', savedTheme === THEMES.DARK);

    updateThemeIcon(savedTheme);
}

function loadLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language');
    setLanguage(savedLanguage || 'en');
}

function init() {
    state.themeBtn = document.getElementById('themeBtn');
    state.langBtn = document.getElementById('langBtn');

    if (state.themeBtn) {
        state.themeBtn.addEventListener('click', toggleTheme);
    }
    
    if (state.langBtn) {
        state.langBtn.addEventListener('click', toggleLanguage);
    }

    loadLanguage();
    loadTheme();
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', function() {
    if (window.timeoutId) {
        clearTimeout(window.timeoutId);
    }
    if (window.animationId) {
        cancelAnimationFrame(window.animationId);
    }
});