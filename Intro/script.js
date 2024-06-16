let selectedLanguage = 'nl';

let currentQuestionIndex = 0;
let userAnswers = [];
let mostFrequentLetter;

let inactiviteitTimer;

const startDiv = document.getElementById('startDiv');
const questionsDiv = document.getElementById('questionsDiv');
const answerDiv = document.getElementById('answerDiv');

function resetTimer() {
    clearTimeout(inactiviteitTimer);
    inactiviteitTimer = setTimeout(timerVerlopen, 45000); // 0,75 minuten x 60 000 = 45000 milliseconden
}

function selectLanguage(language) {
    selectedLanguage = language;

    document.querySelectorAll('.languageSelection').forEach(element => {
        element.style.textDecoration = 'none';
    });
    document.getElementById(`selectLanguage${language.toUpperCase()}`).style.textDecoration = "underline";

    if (getComputedStyle(startDiv).display === 'flex') {
        showStart();
    } else if (getComputedStyle(questionsDiv).display === 'flex') {
        showQuestions();
    } else {
        showResult();
    }
}

async function showStart() {

    startDiv.style.display = 'flex';
    questionsDiv.style.display = 'none';
    answerDiv.style.display = 'none';

    changeBackground('rgb(191,198,190)', 'rgb(150,170,159)', 'white');

    fetch(`json/questions.json`)
    .then(response => response.json())
    .then(data => {

        document.getElementById('titel').innerText = data[selectedLanguage].titel.toUpperCase();
        document.getElementById('startText').innerText = data[selectedLanguage].start.toUpperCase();
        document.getElementById('guideTask').innerText = data[selectedLanguage].welcome;

    });
}

async function showQuestions() {

    startDiv.style.display = 'none';
    questionsDiv.style.display = 'flex';
    answerDiv.style.display = 'none';

    changeBackground('white', 'white', 'white');

    fetch(`json/questions.json`)
    .then(response => response.json())
    .then(data => {

        if (currentQuestionIndex < data[selectedLanguage].questions.length) {
            document.getElementById('question').innerText = data[selectedLanguage].questions[currentQuestionIndex];

            document.getElementById('answerA').innerText = data[selectedLanguage].answers[currentQuestionIndex][0];
            document.getElementById('answerB').innerText = data[selectedLanguage].answers[currentQuestionIndex][1];
            document.getElementById('answerC').innerText = data[selectedLanguage].answers[currentQuestionIndex][2];
        } else {
            mostFrequentLetter = getMostFrequentLetter(userAnswers);
            showResult();
        }

    });
}

function submitAnswer(answer) {
    userAnswers.push(answer);
    currentQuestionIndex += 1;
    showQuestions();
}
function getMostFrequentLetter(answers) {
    const counts = { A: 0, B: 0, C: 0 };
    answers.forEach(answer => counts[answer]++);

    const maxCount = Math.max(counts.A, counts.B, counts.C);
    const mostFrequent = Object.keys(counts).filter(letter => counts[letter] === maxCount);

    if (mostFrequent.length > 1) {
        return mostFrequent[Math.floor(Math.random() * mostFrequent.length)];
    }
    
    return mostFrequent[0];
}

async function showResult() {

    startDiv.style.display = 'none';
    questionsDiv.style.display = 'none';
    answerDiv.style.display = 'flex';

    fetch(`json/results.json`)
    .then(response => response.json())
    .then(results => {

        characterColor = results[selectedLanguage][mostFrequentLetter].kleur
        changeBackground('rgb(191,198,190)', `${characterColor}`, `${characterColor}`);

        const naamGids = results[selectedLanguage][mostFrequentLetter].name;

        document.getElementById('text').innerText = results[selectedLanguage][mostFrequentLetter].text;
        document.getElementById('name').innerText = naamGids;
        document.getElementById('description').innerText = results[selectedLanguage][mostFrequentLetter].description;
        document.getElementById('task').innerText = results[selectedLanguage][mostFrequentLetter].task;

        document.getElementById('silhouet').setAttribute("src", `img/${naamGids}.gif`)

    });
}

function changeBackground(bodyColor, borderColor, containerColor) {
    document.body.style.backgroundColor = bodyColor;
    document.getElementById('borderContainer').style.borderColor = borderColor;
    document.getElementById('innerPage').style.backgroundColor = containerColor;
}

function timerVerlopen() {
    document.querySelectorAll('.languageSelection').forEach(element => {
        element.style.textDecoration = 'none';
    });
    
    selectedLanguage = 'nl';
    toHome();
}

function toHome() {
    currentQuestionIndex = 0;
    userAnswers = [];

    showStart();
    document.getElementById(`selectLanguage${selectedLanguage.toUpperCase()}`).style.textDecoration = "underline";
}

document.addEventListener('DOMContentLoaded', () => {
    toHome();

    resetTimer();
    document.addEventListener('click', resetTimer);
});