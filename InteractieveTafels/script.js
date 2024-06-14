let selectedLanguage = 'nl';
let currentSlideIndex = 0;

let lastChosenThema;

const titleStartDiv = document.getElementById('titleStart');
const slideshowContainerDiv = document.getElementById('slideshowContainer');

function resetTimer() {
    clearTimeout(inactiviteitTimer);
    inactiviteitTimer = setTimeout(toHome, 45000); // 0,75 minuten x 60 000 = 30000 milliseconden
}

function selectLanguage(language) {
    selectedLanguage = language;

    document.querySelectorAll('.languageSelection').forEach(element => {
        element.style.textDecoration = 'none';
    });
    document.getElementById(`selectLanguage${language.toUpperCase()}`).style.textDecoration = "underline";

    if (getComputedStyle(titleStartDiv).display === 'none') {
        showSlideshow(lastChosenThema);
    } else {
        showTitle();
    }    
}

async function showTitle() {
    changeBackground("primaryColor");

    try {
        const titleResponse = await fetch(`json/${selectedLanguage}.json`);
        if (!titleResponse.ok) {
            throw new Error(`HTTP error! status: ${titleResponse.status}`);
        }
        const jsonData = await titleResponse.json();

        titleStartDiv.innerHTML = "";
        slideshowContainerDiv.style.display = 'none';
        titleStartDiv.style.display = 'grid';

        jsonData.titels.forEach(item => {
            const h1Element = document.createElement('h1');
            h1Element.textContent = item.titel.toUpperCase();
            h1Element.id = item.thema;
            h1Element.setAttribute("onclick", `showSlideshow("${item.thema}")`);
            titleStartDiv.appendChild(h1Element);
        });
    } 
    
    catch (error) {
        console.error('Error fetching or processing JSON data:', error);
    }
}

async function showSlideshow(chosenThema) {
    changeBackground("secondaryColor");

    lastChosenThema = chosenThema;

    titleStartDiv.style.display = 'none';
    slideshowContainerDiv.style.display = 'flex';

    // Load JSON data for selected language and theme
    fetch(`json/${selectedLanguage}.json`)
    .then(response => response.json())
    .then(data => {

        const slideshowContainer = document.getElementById('slideshow');
        slideshowContainer.innerHTML = ''; // Clear previous content

        data[chosenThema].forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.classList.add('slide');

            const titleElement = document.createElement('h1');
            titleElement.textContent = slide.titel;
            slideElement.appendChild(titleElement);
            
            const imageElement = document.createElement('img');
            imageElement.src = `img/${slide.image}`;
            slideElement.appendChild(imageElement);
            
            const textElement = document.createElement('p');
            textElement.textContent = slide.text;
            slideElement.appendChild(textElement);
            
            slideshowContainer.appendChild(slideElement);

            if (index == currentSlideIndex) {
                slideElement.style.display = 'grid';
            } else {
                slideElement.style.display = 'none';
            }   
        });
    })
    .catch(error => console.error('Error loading slideshow data:', error));

    const allSlides = document.querySelectorAll(".slide");

    updateButtonsVisibility();

}

function updateButtonsVisibility() {
    const prevButton = document.getElementById('vorigeKnop');
    const nextButton = document.getElementById('volgendeKnop');

    // Hide prev button if current slide is the first one
    prevButton.style.display = currentSlideIndex === 0 ? 'none' : 'block';

    // Hide next button if current slide is the last one
    const slides = document.querySelectorAll('.slide');
    nextButton.style.display = currentSlideIndex === slides.length - 1 ? 'none' : 'block';
}

function volgendeSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].style.display = 'none';
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].style.display = 'grid';
    updateButtonsVisibility();
}

function vorigeSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlideIndex].style.display = 'none';
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    slides[currentSlideIndex].style.display = 'grid';
    updateButtonsVisibility();
}

function toHome() {
    showTitle();
    currentSlideIndex = 0;
    document.getElementById(`selectLanguage${selectedLanguage.toUpperCase()}`).style.textDecoration = "underline";

}

function changeBackground(color) {
    borderContainerDiv = document.getElementById("borderContainer");
    innerPageDiv = document.getElementById("innerPage");
    
    if (color == "primaryColor") {
        borderContainerDiv.style.borderColor = "var(--primaryColor)";
        innerPageDiv.style.backgroundColor = "var(--primaryColor)";

    } else if (color == "secondaryColor") {
        borderContainerDiv.style.borderColor = "var(--secondaryColor)";
        innerPageDiv.style.backgroundColor = "var(--secondaryColor)";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toHome();

    resetTimer();
    document.addEventListener('click', resetTimer);
});