let selectedLanguage = 'nl';

let currentQuestionIndex = 0;
let userAnswers = [];

const startDiv = document.getElementById('startDiv');
const questionsDiv = document.getElementById('questionsDiv');
const answerDiv = document.getElementById('answerDiv');

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

    fetch(`json/questions.json`)
    .then(response => response.json())
    .then(data => {

        document.getElementById('titel').innerText = data[selectedLanguage].titel.toUpperCase();
        document.getElementById('startKnop').innerText = data[selectedLanguage].start.toUpperCase();
        document.getElementById('answerTask').innerText = data[selectedLanguage].welcome;
        document.getElementById('guideTask').innerText = data[selectedLanguage].welcome2;

    });
}

async function showQuestions() {

    startDiv.style.display = 'none';
    questionsDiv.style.display = 'flex';
    answerDiv.style.display = 'none';

    fetch(`json/questions.json`)
    .then(response => response.json())
    .then(data => {

        if (currentQuestionIndex < data[selectedLanguage].questions.length) {
            document.getElementById('question').innerText = data[selectedLanguage].questions[currentQuestionIndex];

            document.getElementById('answerA').innerText = data[selectedLanguage].answers[currentQuestionIndex][0];
            document.getElementById('answerB').innerText = data[selectedLanguage].answers[currentQuestionIndex][1];
            document.getElementById('answerC').innerText = data[selectedLanguage].answers[currentQuestionIndex][2];
        } else {
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

    const mostFrequentLetter = getMostFrequentLetter(userAnswers);

    fetch(`json/results.json`)
    .then(response => response.json())
    .then(results => {

        const naamGids = results[selectedLanguage][mostFrequentLetter].name;

        changeBackground(results[selectedLanguage][mostFrequentLetter].kleur)

        document.getElementById('text').innerText = results[selectedLanguage][mostFrequentLetter].text;
        document.getElementById('name').innerText = naamGids;
        document.getElementById('description').innerText = results[selectedLanguage][mostFrequentLetter].description;
        document.getElementById('task').innerText = results[selectedLanguage][mostFrequentLetter].task;

        document.getElementById('silhouet').setAttribute("src", `img/${naamGids}.gif`)

    });
}

function changeBackground(backgroundColor) {
    document.getElementById('innerPage').style.backgroundColor = backgroundColor;
}

function toHome() {
    currentQuestionIndex = 0;
    userAnswers = [];

    showStart();
    changeBackground("white");
    document.getElementById(`selectLanguage${selectedLanguage.toUpperCase()}`).style.textDecoration = "underline";
}

document.addEventListener('DOMContentLoaded', () => {
    toHome();
});