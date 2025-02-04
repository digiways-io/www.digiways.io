// i18n-config.js

// Initialize translations
const translations = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        solutions: "Solutions",
        services: "Services",
        contact: "Contact",
        getStarted: "Get Started",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        about: "À propos",
        solutions: "Solutions",
        services: "Services",
        contact: "Contact",
        getStarted: "Commencer",
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        about: "عن الشركة",
        solutions: "الحلول",
        services: "الخدمات",
        contact: "اتصل بنا",
        getStarted: "ابدأ الآن",
      },
    },
  },
};

// Single DOMContentLoaded event listener for initialization
document.addEventListener("DOMContentLoaded", function () {
  // Make sure jQuery and i18next are loaded
  if (!window.jQuery || !window.i18next) {
    console.error("Required libraries not loaded");
    return;
  }

  // Initialize i18next with default translations
  i18next.init(
    {
      fallbackLng: "en",
      debug: true,
      resources: translations,
      interpolation: {
        escapeValue: false,
      },
    },
    function (err, t) {
      if (err) {
        console.error("Error initializing i18next:", err);
        return;
      }

      // Initialize jquery-i18next
      if (window.jqueryI18next) {
        jqueryI18next.init(i18next, $, {
          useOptionsAttr: true,
        });
      }

      // Load saved language or detect browser language
      const savedLang = localStorage.getItem("preferred-language");
      if (savedLang) {
        changeLanguage(savedLang);
      } else {
        const browserLang = navigator.language.split("-")[0];
        if (["en", "fr", "ar"].includes(browserLang)) {
          changeLanguage(browserLang);
        } else {
          changeLanguage("en");
        }
      }
    }
  );
});

// Function to load translations from file
function loadTranslations(lng) {
  return $.ajax({
    url: `assets/locales/${lng}/translation.json`,
    dataType: "json",
    success: function (data) {
      i18next.addResourceBundle(lng, "translation", data, true, true);
      updateContent();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(`Error loading translations for ${lng}:`, textStatus);
      // Fallback to default translations if file loading fails
      updateContent();
    },
  });
}

// Function to change language
function changeLanguage(lng) {
  i18next.changeLanguage(lng, (err, t) => {
    if (err) {
      console.error("Error changing language:", err);
      return;
    }

    // Update direction for RTL languages
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;

    // Update dropdown display
    const flagImg = document.getElementById("selected-lang-flag");
    const langText = document.getElementById("selected-lang-text");

    if (flagImg && langText) {
      flagImg.src = `assets/img/flags/${lng}.svg`;
      const langNames = {
        en: "English",
        fr: "Français",
        ar: "العربية",
      };
      langText.textContent = langNames[lng];
    }

    // Try to load additional translations from file
    loadTranslations(lng).always(() => {
      updateContent();
      localStorage.setItem("preferred-language", lng);
    });
  });
}

// Function to update content when language changes
function updateContent() {
  // Update all elements with data-i18n attribute
  $("[data-i18n]").each(function () {
    const $element = $(this);
    const key = $element.data("i18n");

    // Handle placeholder attributes
    if (key.startsWith("[placeholder]")) {
      const actualKey = key.replace("[placeholder]", "");
      $element.attr("placeholder", i18next.t(actualKey));
    } else {
      // Regular text content
      $element.text(i18next.t(key));
    }
  });

  // Update document title and meta descriptions
  document.title = i18next.t("page.title", "DigiWays");
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = i18next.t("page.description", "");
  }
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.content = i18next.t("page.keywords", "");
  }
}
