let selectedLanguage = '';
let selectedTheme = '';
let inactiviteitTimer;

function resetTimer() {
    clearTimeout(inactiviteitTimer);
    inactiviteitTimer = setTimeout(toHome, 60000); // 1 minuten x 60 000 = 30000 milliseconden
}

function updateLanguageText() {
    const themeSelectionHeader = document.querySelector('#theme-selection h2');
    themeSelectionHeader.textContent = languageText[selectedLanguage].selectTheme;
    
    const themeButtons = document.querySelectorAll('#theme-selection button');
    themeButtons.forEach((button, index) => {
        button.textContent = languageText[selectedLanguage].themes[index];
    });
}

const languageText = {
    'nl': {
        'selectTheme': 'Selecteer Thema:',
        'themes': ['Thema 1', 'Thema 2', 'Thema 3', 'Thema 4']
    },
    'fr': {
        'selectTheme': 'Sélectionnez le thème:',
        'themes': ['Thème 1', 'Thème 2', 'Thème 3', 'Thème 4']
    },
    'de': {
        'selectTheme': 'Wählen Sie ein Thema aus:',
        'themes': ['Thema 1', 'Thema 2', 'Thema 3', 'Thema 4']
    },
    'en': {
        'selectTheme': 'Select Theme:',
        'themes': ['Theme 1', 'Theme 2', 'Theme 3', 'Theme 4']
    }
};

function selectLanguage(language) {
    selectedLanguage = language;
    updateLanguageText();
    showThemeSelection();
}

function selectTheme(theme) {
    selectedTheme = theme;
    showSlideshow();
}

function showThemeSelection() {
    document.getElementById('language-selection').style.display = 'none';
    document.getElementById('theme-selection').style.display = 'flex';
}

function showSlideshow() {
    document.getElementById('theme-selection').style.display = 'none';
    document.getElementById('slideshow').style.display = 'flex';
    
    // Load JSON data for selected language and theme
    fetch(`JSON/${selectedLanguage}/${selectedTheme}.json`)
        .then(response => response.json())
        .then(data => {
            const slideshowContainer = document.getElementById('slideshow-container');
            slideshowContainer.innerHTML = ''; // Clear previous content
            
            data.slides.forEach((slide, index) => {
                const slideElement = document.createElement('div');
                slideElement.classList.add('slide');
                
                const imageElement = document.createElement('img');
                imageElement.src = `img/${selectedTheme}/${slide.image}`;
                slideElement.appendChild(imageElement);
                
                const textElement = document.createElement('p');
                textElement.textContent = slide.text;
                slideElement.appendChild(textElement);
                
                slideshowContainer.appendChild(slideElement);

                if (index !== 0) {
                    slideElement.style.display = 'none';
                } else {
                    slideElement.style.display = 'flex';
                }
            });
        })
        .catch(error => console.error('Error loading slideshow data:', error));

    updateButtonsVisibility();
}

let currentSlideIndex = 0;

function updateButtonsVisibility() {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    // Hide prev button if current slide is the first one
    prevButton.style.display = currentSlideIndex === 0 ? 'none' : 'block';

    // Hide next button if current slide is the last one
    const slides = document.querySelectorAll('.slide');
    nextButton.style.display = currentSlideIndex === slides.length - 1 ? 'none' : 'block';
}

function showNextSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].style.display = 'none';
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].style.display = 'flex';
    updateButtonsVisibility();
}

function showPrevSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].style.display = 'none';
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    slides[currentSlideIndex].style.display = 'flex';
    updateButtonsVisibility();
}

function toHome() {
    document.getElementById('language-selection').style.display = 'flex';
    document.getElementById('theme-selection').style.display = 'none';
    document.getElementById('slideshow').style.display = 'none';

    currentSlideIndex = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // Hide theme selection and slideshow initially
    document.getElementById('theme-selection').style.display = 'none';
    document.getElementById('slideshow').style.display = 'none';

    resetTimer();
    document.addEventListener('click', resetTimer);
});