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

let currentLanguage = 'en';
let translatableElements = null;
let themeIcon = null;
let langIcon = null;

const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
};

const THEME_ICONS = {
    [THEMES.DARK]: 'icon/dark.svg',
    [THEMES.LIGHT]: 'icon/white.svg'
};

const LANGUAGE_ICONS = {
    'en': 'icon/us.svg',
    'ru': 'icon/ru.svg',
    'de': 'icon/de.svg'
};

const ANIMATION = {
    DURATION: 600,
    EASING: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    ROTATION: '360deg',
    SCALE: 1.2,
    RESET_TRANSITION: 'transform 0.3s ease'
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

function setLanguage(locale) {
    currentLanguage = locale;
    const langTranslations = translations[locale];

    if (translatableElements === null) {
        translatableElements = document.querySelectorAll('[data-i18n]');
    }

    for (let i = translatableElements.length; i--;) {
        const element = translatableElements[i];
        const key = element.getAttribute('data-i18n');
        if (langTranslations[key]) {
            element.textContent = langTranslations[key];
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
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? THEMES.DARK : THEMES.LIGHT);
        return;
    }

    icon.style.transition = `transform ${ANIMATION.DURATION}ms ${ANIMATION.EASING}`;
    icon.style.transform = `rotate(${ANIMATION.ROTATION}) scale(${ANIMATION.SCALE})`;

    requestAnimationFrame(() => {
        setTimeout(() => {
            const isDark = body.classList.toggle('dark-theme');
            const theme = isDark ? THEMES.DARK : THEMES.LIGHT;

            icon.src = THEME_ICONS[theme];
            icon.alt = `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`;

            icon.style.transition = ANIMATION.RESET_TRANSITION;
            icon.style.transform = 'rotate(0deg) scale(1)';
            
            localStorage.setItem('theme', theme);
        }, ANIMATION.DURATION / 2);
    });
}

function toggleLanguage() {
    const LANGUAGES = ['en', 'ru', 'de'];
    const currentIndex = LANGUAGES.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex]);
}

function updateLanguageIcon(locale) {
    if (langIcon === null) {
        langIcon = document.getElementById('langIcon');
    }
    
    if (langIcon && LANGUAGE_ICONS[locale]) {
        const newSrc = LANGUAGE_ICONS[locale];
        if (langIcon.src !== newSrc) {
            langIcon.src = newSrc;
        }
        langIcon.alt = locale.toUpperCase();
        langIcon.title = locale.toUpperCase();
    }
}

function getThemeIcon() {
    if (themeIcon === null) {
        themeIcon = document.getElementById('tmIcon');
    }
    return themeIcon;
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || THEMES.LIGHT;
    const body = document.body;
    const icon = getThemeIcon();

    const isDark = savedTheme === THEMES.DARK;
    body.classList.toggle('dark-theme', isDark);
    
    if (icon) {
        icon.src = THEME_ICONS[savedTheme];
        icon.alt = `${savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1)} Theme`;
    }
}

function loadLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language');
    setLanguage(savedLanguage || 'en');
}

function init() {
    loadLanguage();
    loadTheme();
}

document.addEventListener('DOMContentLoaded', init);