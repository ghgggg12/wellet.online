const translations = {
  ru: {
    aka: "он же ZAZOR",
    proof: "Переводчик Lunar client",
    info: "Изучаю GLua, HTML, CSS и JS."
  },
  en: {
    aka: "a.k.a. ZAZOR",
    proof: "Proofreader Lunar Client",
    info: "Learning GLua, HTML, CSS and JS."
  },
  de: {
    aka: "a.k.a. ZAZOR",
    proof: "Übersetzer bei Lunar Client",
    info: "Lerne GLua, HTML, CSS und JS."
  }
};

let currentLanguage = 'en';
let translatableElements = null;

(function() {
    const text = "🤍Wellett info🤍";
    const LANGUAGES = ['en', 'ru', 'de'];
    const TYPING_SPEED = 150;
    const PAUSE_BEFORE_DELETE = 1000;
    const PAUSE_BEFORE_TYPE = 500;
    
    let index = 0;
    let isDeleting = false;
    let isPaused = false;
    let animationId = null;
    let lastUpdate = 0;
    
    function updateTitle() {
        if (isPaused) return;
        
        if (!isDeleting) {
            index++;
            if (index > text.length) {
                isDeleting = true;
                isPaused = true;
                setTimeout(() => {
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
                setTimeout(() => {
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
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animationId = requestAnimationFrame(() => {
            setTimeout(updateTitle, TYPING_SPEED);
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

function toggleLanguage() {
    const LANGUAGES = ['en', 'ru', 'de'];
    const currentIndex = LANGUAGES.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex]);
}

function updateLanguageIcon(locale) {
    const iconMap = {
        'en': 'icon/us.svg',
        'ru': 'icon/ru.svg',
        'de': 'icon/de.svg'
    };
    
    const langIcon = document.getElementById('langIcon');
    if (langIcon && iconMap[locale]) {
        const newSrc = iconMap[locale];
        if (langIcon.src !== newSrc) {
            langIcon.src = newSrc;
        }
        langIcon.alt = locale.toUpperCase();
        langIcon.title = locale.toUpperCase();
    }
}

function loadLanguage() {
    const savedLanguage = localStorage.getItem('preferred-language');
    setLanguage(savedLanguage || 'en');
}

document.addEventListener('DOMContentLoaded', loadLanguage);