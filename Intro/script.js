let texts;
let selectedLanguage;
let currentQuestionIndex = 0;
let userAnswers = [];

let inactiviteitTimer;

function resetTimer() {
    clearTimeout(inactiviteitTimer);
    inactiviteitTimer = setTimeout(toHome, 60000); // 1 minuten x 60 000 = 60000 milliseconden
}

// Load questions and answers from JSON file
fetch('JSON/questions.json')
    .then(response => response.json())
    .then(data => texts = data);

fetch('JSON/results.json')
    .then(response => response.json())
    .then(data => results = data);

function selectLanguage(language) {
    selectedLanguage = language;
    
    // Reset button styles
    document.querySelectorAll('#language-selection button').forEach(button => {
        button.classList.remove('selected');
    });

    // Highlight selected button
    document.getElementById(language).classList.add('selected');
    
    // Display welcome text in the selected language
    document.getElementById('welcome-text').innerText = texts[selectedLanguage].welcome;
    document.getElementById('welcome-text2').innerText = texts[selectedLanguage].welcome2;
    
    // Show the start button
    const startButton = document.getElementById('start-button');
    startButton.innerText = texts[selectedLanguage].start;
    startButton.style.display = 'inline-block';
}

function startQuiz() {
    document.getElementById('language-selection').style.display = 'none';
    document.getElementById('quiz').style.display = 'flex';
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < texts[selectedLanguage].questions.length) {
        document.getElementById('question-text').innerText = texts[selectedLanguage].questions[currentQuestionIndex];
        document.getElementById('answerA').innerText = texts[selectedLanguage].answers[currentQuestionIndex][0];
        document.getElementById('answerB').innerText = texts[selectedLanguage].answers[currentQuestionIndex][1];
        document.getElementById('answerC').innerText = texts[selectedLanguage].answers[currentQuestionIndex][2];

        document.getElementById('progress').innerText = `Vraag ${currentQuestionIndex + 1} van 5`
    } else {
        showResults();
    }
}

function submitAnswer(answer) {
    userAnswers.push(answer);
    currentQuestionIndex++;
    showQuestion();
}

function showResults() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'flex';
    
    const mostFrequentLetter = getMostFrequentLetter(userAnswers);

    const resultText = results[selectedLanguage][mostFrequentLetter].text;
    const resultDescription = results[selectedLanguage][mostFrequentLetter].description;
    const resultTask = results[selectedLanguage][mostFrequentLetter].task;
    const resultGif = results[selectedLanguage][mostFrequentLetter].gif;

    document.getElementById('rightResult').innerHTML = `<h1>${resultText}</h1>`;
    document.getElementById('rightResult').innerHTML += `<h2>${resultDescription}</h2>`;
    document.getElementById('rightResult').innerHTML += `<h2>${resultTask}</h2>`;
    document.getElementById('leftResult').innerHTML = `<img id="silhouet" src="${resultGif}">`;
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

function toHome() {
    document.getElementById('language-selection').style.display = 'block';
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';

    document.getElementById('welcome-text').innerText = "";
    document.getElementById('welcome-text2').innerText = "";

    currentQuestionIndex = 0;
    userAnswers = [];
}

document.addEventListener('DOMContentLoaded', () => {
    toHome();

    resetTimer();
    document.addEventListener('click', resetTimer);
});