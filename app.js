// Game settings
let settings = {
    rechenart: 'addition',
    geschwindigkeit: 3000,
    zahlenbereich: [1, 10],
    anzahl: 3,
    multiplicationLevel: 1,
    digitRange: '1-5',
    divisionLevel: 1,
    digitRangeDiv: '1-5'
};

// Sound settings
let soundEnabled = true;
let audioContext = null;

// Initialize audio context
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play beep sound
function playBeep() {
    if (!soundEnabled) return;

    initAudioContext();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Play success sound
function playSuccessSound() {
    if (!soundEnabled) return;

    initAudioContext();

    const notes = [523.25, 659.25, 783.99];
    const startTime = audioContext.currentTime;

    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const noteStart = startTime + (index * 0.15);
        const noteEnd = noteStart + 0.2;

        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.3, noteStart + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, noteEnd);

        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
    });
}

// Create confetti explosion
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        container.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;

    const button = document.getElementById('soundIconButton');
    const icon = document.getElementById('soundIconHome');

    if (soundEnabled) {
        button.classList.remove('muted');
        icon.textContent = '🔊';
    } else {
        button.classList.add('muted');
        icon.textContent = '🔇';
    }

    localStorage.setItem('anzanSoundEnabled', soundEnabled);
}

// Load sound preference
function loadSoundPreference() {
    const saved = localStorage.getItem('anzanSoundEnabled');
    if (saved !== null) {
        soundEnabled = saved === 'true';

        const button = document.getElementById('soundIconButton');
        const icon = document.getElementById('soundIconHome');

        if (button && icon) {
            if (!soundEnabled) {
                button.classList.add('muted');
                icon.textContent = '🔇';
            }
        }
    }
}

// Game state
let currentNumbers = [];
let correctAnswer = 0;
let userAnswerString = '';
let isCustomTask = false;

// Task management
let savedTasks = [];
let selectedTasksQueue = [];
let currentTaskIndex = 0;

// Load tasks from localStorage on page load
function loadTasksFromStorage() {
    const stored = localStorage.getItem('anzanTasks');
    if (stored) {
        savedTasks = JSON.parse(stored);
    }
}

// Save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem('anzanTasks', JSON.stringify(savedTasks));
}

// Show Meine Aufgaben screen
function showMeineAufgaben() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('meineAufgabenScreen').classList.add('active');
    renderTasksList();
}

// Render tasks list
function renderTasksList() {
    const container = document.getElementById('tasksList');

    if (savedTasks.length === 0) {
        container.innerHTML = '<div class="empty-tasks-message">Noch keine Aufgaben. Erstelle deine erste Aufgabe!</div>';
        return;
    }

    container.innerHTML = '';
    savedTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-index="${index}">
            <div class="task-text">${task.displayText}</div>
            <button class="task-play-button" onclick="playSingleTask(${index})">▶️</button>
            <button class="task-delete-button" onclick="deleteTask(${index})">🗑️</button>
        `;
        container.appendChild(taskItem);
    });
}

// Show add task modal
function showAddTaskModal() {
    document.getElementById('addTaskModal').classList.add('active');
    document.getElementById('taskInput').value = '';
    document.getElementById('taskInput').focus();
}

// Close add task modal
function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('active');
}

// Save task
function saveTask() {
    const input = document.getElementById('taskInput').value.trim();

    if (!input) {
        alert('Bitte gib mindestens eine Zahl ein!');
        return;
    }

    const elements = [];
    let currentNumber = '';

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char === '+' || char === '-' || char === '*' || char === '/' || char === '×' || char === '÷') {
            if (currentNumber) {
                elements.push(parseInt(currentNumber.trim()));
                currentNumber = '';
            }
            let operator = char;
            if (char === '×') operator = '*';
            if (char === '÷') operator = '/';
            elements.push(operator);
        } else if (char >= '0' && char <= '9') {
            currentNumber += char;
        } else if (char !== ' ' && char !== ',') {
            continue;
        }
    }

    if (currentNumber) {
        elements.push(parseInt(currentNumber.trim()));
    }

    if (elements.length === 0 || typeof elements[0] !== 'number' || typeof elements[elements.length - 1] !== 'number') {
        alert('Bitte gib eine gültige Aufgabe ein! (z.B. 6+4-2)');
        return;
    }

    let answer;
    try {
        let expression = elements.join('');
        answer = eval(expression);
        answer = Math.round(answer * 100) / 100;
    } catch (e) {
        alert('Fehler beim Berechnen der Aufgabe!');
        return;
    }

    let displayText = '';
    for (let i = 0; i < elements.length; i++) {
        if (typeof elements[i] === 'number') {
            displayText += elements[i];
        } else {
            displayText += ' ' + elements[i] + ' ';
        }
    }
    displayText += ' = ?';

    const task = {
        elements: elements,
        displayText: displayText,
        answer: answer
    };

    savedTasks.push(task);
    saveTasksToStorage();

    closeAddTaskModal();
    renderTasksList();
}

// Play single task
function playSingleTask(index) {
    const task = savedTasks[index];

    if (task.elements) {
        currentNumbers = task.elements;
    } else {
        currentNumbers = task.numbers || [];
    }

    correctAnswer = task.answer;
    isCustomTask = true;
    userAnswerString = '';

    startCountdown();
}

// Delete task
function deleteTask(index) {
    if (confirm('Diese Aufgabe löschen?')) {
        savedTasks.splice(index, 1);
        saveTasksToStorage();
        renderTasksList();
    }
}

// Delete all tasks
function deleteAllTasks() {
    if (savedTasks.length === 0) {
        alert('Keine Aufgaben zum Löschen!');
        return;
    }

    if (confirm(`Alle ${savedTasks.length} Aufgaben löschen?`)) {
        savedTasks = [];
        saveTasksToStorage();
        renderTasksList();
    }
}

// Play selected tasks
function playSelectedTasks() {
    const checkboxes = document.querySelectorAll('.task-checkbox:checked');

    if (checkboxes.length === 0) {
        alert('Bitte wähle mindestens eine Aufgabe aus!');
        return;
    }

    selectedTasksQueue = [];
    checkboxes.forEach(cb => {
        const index = parseInt(cb.dataset.index);
        selectedTasksQueue.push(savedTasks[index]);
    });

    currentTaskIndex = 0;
    playNextTaskFromQueue();
}

// Play next task from queue
function playNextTaskFromQueue() {
    if (currentTaskIndex >= selectedTasksQueue.length) {
        alert('🎉 Alle ausgewählten Aufgaben abgeschlossen!');
        showMeineAufgaben();
        return;
    }

    const task = selectedTasksQueue[currentTaskIndex];

    if (task.elements) {
        currentNumbers = task.elements;
    } else {
        currentNumbers = task.numbers || [];
    }

    correctAnswer = task.answer;
    isCustomTask = true;
    userAnswerString = '';

    startCountdown();
}

function openCustomTaskModal() {
    document.getElementById('customTaskModal').classList.add('active');
    document.getElementById('customTaskInput').value = '';
    document.getElementById('customTaskInput').focus();
}

function closeCustomTaskModal() {
    document.getElementById('customTaskModal').classList.remove('active');
}

function startCustomTask() {
    const input = document.getElementById('customTaskInput').value.trim();

    if (!input) {
        alert('Bitte gib mindestens eine Zahl ein!');
        return;
    }

    const numbersString = input.replace(/\+/g, ',').replace(/\s+/g, ',');
    const numbers = numbersString.split(',')
        .map(n => n.trim())
        .filter(n => n !== '')
        .map(n => parseInt(n))
        .filter(n => !isNaN(n));

    if (numbers.length === 0) {
        alert('Bitte gib gültige Zahlen ein!');
        return;
    }

    isCustomTask = true;
    currentNumbers = numbers;

    if (settings.rechenart === 'addition') {
        correctAnswer = currentNumbers.reduce((sum, num) => sum + num, 0);
    }

    closeCustomTaskModal();
    userAnswerString = '';

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('answerSection').style.display = 'none';
    updateAnswerDisplay();

    displayNumbers();
}

function addDigit(digit) {
    userAnswerString += digit.toString();
    updateAnswerDisplay();
}

function deleteDigit() {
    userAnswerString = userAnswerString.slice(0, -1);
    updateAnswerDisplay();
}

function updateAnswerDisplay() {
    const display = document.getElementById('answerDisplay');
    if (userAnswerString === '') {
        display.innerHTML = '<span class="placeholder">?</span>';
    } else {
        display.innerHTML = userAnswerString;
    }
}

function selectOption(category, value, element) {
    const siblings = element.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sib => sib.classList.remove('selected'));

    element.classList.add('selected');

    settings[category] = value;

    if (category === 'zahlenbereich' && element.dataset.range !== 'custom') {
        document.getElementById('customRangeInputs').style.display = 'none';
    }

    if (category === 'rechenart') {
        const geschwindigkeitSection = document.getElementById('geschwindigkeitSection');
        const standardZahlenbereich = document.getElementById('standardZahlenbereich');
        const multiplikationOptions = document.getElementById('multiplikationOptions');
        const divisionOptions = document.getElementById('divisionOptions');
        const anzahlSection = document.getElementById('anzahlSection');

        if (value === 'multiplikation') {
            geschwindigkeitSection.style.display = 'none';
            anzahlSection.style.display = 'none';
            standardZahlenbereich.style.display = 'none';
            multiplikationOptions.style.display = 'block';
            divisionOptions.style.display = 'none';
        } else if (value === 'division') {
            geschwindigkeitSection.style.display = 'none';
            anzahlSection.style.display = 'none';
            standardZahlenbereich.style.display = 'none';
            multiplikationOptions.style.display = 'none';
            divisionOptions.style.display = 'block';
        } else {
            geschwindigkeitSection.style.display = 'block';
            anzahlSection.style.display = 'block';
            standardZahlenbereich.style.display = 'block';
            multiplikationOptions.style.display = 'none';
            divisionOptions.style.display = 'none';
        }
    }
}

function selectMultiplicationLevel(level, element) {
    settings.multiplicationLevel = level;

    const siblings = element.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sib => sib.classList.remove('selected'));
    element.classList.add('selected');
}

function selectDigitRange(range, element) {
    settings.digitRange = range;

    const siblings = element.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sib => sib.classList.remove('selected'));
    element.classList.add('selected');
}

function selectDivisionLevel(level, element) {
    settings.divisionLevel = level;

    const siblings = element.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sib => sib.classList.remove('selected'));
    element.classList.add('selected');
}

function selectDigitRangeDiv(range, element) {
    settings.digitRangeDiv = range;

    const siblings = element.parentElement.querySelectorAll('.option-card');
    siblings.forEach(sib => sib.classList.remove('selected'));
    element.classList.add('selected');
}

function generateNumberWithDigits(numDigits, digitRange) {
    const [minDigit, maxDigit] = digitRange.split('-').map(Number);
    let number = '';

    for (let i = 0; i < numDigits; i++) {
        const digit = Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;
        if (i === 0 && digit === 0) {
            number += '1';
        } else {
            number += digit;
        }
    }

    return parseInt(number);
}

function toggleCustomRange(element) {
    const customInputs = document.getElementById('customRangeInputs');
    const siblings = element.closest('.settings-section').querySelectorAll('.option-card');

    siblings.forEach(sib => sib.classList.remove('selected'));

    element.classList.add('selected');

    if (customInputs.style.display === 'none') {
        customInputs.style.display = 'flex';
        updateCustomRange();
    } else {
        customInputs.style.display = 'none';
    }
}

function updateCustomRange() {
    const min = parseInt(document.getElementById('customMin').value) || 1;
    const max = parseInt(document.getElementById('customMax').value) || 100;

    if (min >= max) {
        document.getElementById('customMax').value = min + 1;
    }

    settings.zahlenbereich = [min, max];
}

document.addEventListener('DOMContentLoaded', function() {
    const customMin = document.getElementById('customMin');
    const customMax = document.getElementById('customMax');

    if (customMin && customMax) {
        customMin.addEventListener('input', updateCustomRange);
        customMax.addEventListener('input', updateCustomRange);
    }

    const customTaskInput = document.getElementById('customTaskInput');
    if (customTaskInput) {
        customTaskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startCustomTask();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCustomTaskModal();
        }
    });
});

function showSettings() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('settingsScreen').classList.add('active');
}

function goHome() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('homeScreen').classList.add('active');
}

function startGame() {
    if (!isCustomTask) {
        currentNumbers = [];
        const [min, max] = settings.zahlenbereich;

        if (settings.rechenart === 'addition') {
            for (let i = 0; i < settings.anzahl; i++) {
                let num;
                do {
                    num = Math.floor(Math.random() * (max - min + 1)) + min;
                } while (i > 0 && num === currentNumbers[i - 1]);

                currentNumbers.push(num);
            }

            correctAnswer = currentNumbers.reduce((sum, num) => sum + num, 0);

        } else if (settings.rechenart === 'subtraktion') {
            const maxPossibleSum = (settings.anzahl - 1) * max;
            const safeMax = Math.min(max, maxPossibleSum + max);
            const firstNumber = Math.floor(Math.random() * (safeMax - max + 1)) + max;
            currentNumbers.push(firstNumber);

            let runningTotal = firstNumber;

            for (let i = 1; i < settings.anzahl; i++) {
                let num;
                const remainingNumbers = settings.anzahl - i - 1;
                const minNeeded = remainingNumbers * min;
                const maxCanSubtract = runningTotal - minNeeded;

                if (maxCanSubtract < min) {
                    num = min;
                } else {
                    const safeMaxForThis = Math.min(max, maxCanSubtract);
                    do {
                        num = Math.floor(Math.random() * (safeMaxForThis - min + 1)) + min;
                    } while (num === currentNumbers[i - 1]);
                }

                currentNumbers.push(num);
                runningTotal -= num;
            }

            correctAnswer = currentNumbers[0];
            for (let i = 1; i < currentNumbers.length; i++) {
                correctAnswer -= currentNumbers[i];
            }

            if (correctAnswer < 0) {
                return startGame();
            }

        } else if (settings.rechenart === 'multiplikation') {
            const level = settings.multiplicationLevel;
            const digitRange = settings.digitRange;

            let num1, num2;

            switch(level) {
                case 1:
                    num1 = generateNumberWithDigits(1, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 11:
                    num1 = generateNumberWithDigits(1, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 2:
                    num1 = generateNumberWithDigits(2, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 3:
                    num1 = generateNumberWithDigits(3, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 4:
                    num1 = generateNumberWithDigits(4, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 5:
                    num1 = generateNumberWithDigits(2, digitRange);
                    num2 = generateNumberWithDigits(2, digitRange);
                    break;
                case 6:
                    num1 = generateNumberWithDigits(3, digitRange);
                    num2 = generateNumberWithDigits(2, digitRange);
                    break;
                case 7:
                    num1 = generateNumberWithDigits(2, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 9:
                    num1 = generateNumberWithDigits(3, digitRange);
                    num2 = generateNumberWithDigits(1, digitRange);
                    break;
                case 10:
                    num1 = generateNumberWithDigits(2, digitRange);
                    num2 = generateNumberWithDigits(2, digitRange);
                    break;
            }

            currentNumbers = [num1, num2];
            correctAnswer = num1 * num2;

        } else if (settings.rechenart === 'division') {
            const level = settings.divisionLevel;
            const digitRange = settings.digitRangeDiv;

            let result, divisor, dividend;

            switch(level) {
                case 1:
                    result = generateNumberWithDigits(1, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 2:
                    result = generateNumberWithDigits(1, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 3:
                    result = generateNumberWithDigits(2, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 4:
                    result = generateNumberWithDigits(3, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 5:
                    result = generateNumberWithDigits(4, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 6:
                    result = generateNumberWithDigits(5, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 7:
                    result = generateNumberWithDigits(6, digitRange);
                    divisor = generateNumberWithDigits(1, digitRange);
                    break;
                case 8:
                    result = generateNumberWithDigits(2, digitRange);
                    divisor = generateNumberWithDigits(2, digitRange);
                    break;
                case 9:
                    result = generateNumberWithDigits(3, digitRange);
                    divisor = generateNumberWithDigits(2, digitRange);
                    break;
                case 10:
                    result = generateNumberWithDigits(2, digitRange);
                    divisor = generateNumberWithDigits(3, digitRange);
                    break;
            }

            dividend = result * divisor;

            currentNumbers = [dividend, divisor];
            correctAnswer = result;
        }
    }

    isCustomTask = false;
    userAnswerString = '';

    startCountdown();
}

function startCountdown() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('countdownScreen').classList.add('active');

    const countdownProgress = document.getElementById('countdownProgress');
    const countdownLogo = document.getElementById('countdownLogo');
    const countdownLos = document.getElementById('countdownLos');

    countdownLogo.classList.remove('hide');
    countdownLogo.style.display = 'block';
    countdownLos.style.display = 'none';

    countdownProgress.style.strokeDashoffset = '565.5';

    const duration = 3000;
    const start = performance.now();
    const startOffset = 565.5;

    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const currentOffset = startOffset - (startOffset * easeProgress);
        countdownProgress.style.strokeDashoffset = currentOffset;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            countdownLogo.classList.add('hide');
            setTimeout(() => {
                countdownLogo.style.display = 'none';
                countdownLos.style.display = 'block';
            }, 300);

            setTimeout(() => {
                showGameScreen();
            }, 1500);
        }
    }

    requestAnimationFrame(animate);
}

function showGameScreen() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('answerSection').style.display = 'none';
    updateAnswerDisplay();

    displayNumbers();
}

function displayNumbers() {
    const display = document.getElementById('numberDisplay');
    let index = 0;

    if (settings.rechenart === 'multiplikation') {
        display.textContent = `${currentNumbers[0]} • ${currentNumbers[1]} = ?`;
        playBeep();
        document.getElementById('answerSection').style.display = 'block';
        return;
    }

    if (settings.rechenart === 'division') {
        display.textContent = `${currentNumbers[0]} : ${currentNumbers[1]} = ?`;
        playBeep();
        document.getElementById('answerSection').style.display = 'block';
        return;
    }

    const displayElements = [];

    if (settings.rechenart === 'addition' || settings.rechenart === 'subtraktion') {
        for (let i = 0; i < currentNumbers.length; i++) {
            if (i === 0) {
                displayElements.push(currentNumbers[i].toString());
            } else {
                const operator = settings.rechenart === 'addition' ? '+' : '-';
                displayElements.push(operator + currentNumbers[i]);
            }
        }
    } else if (typeof currentNumbers[0] === 'number' && typeof currentNumbers[1] === 'string') {
        for (let i = 0; i < currentNumbers.length; i++) {
            if (typeof currentNumbers[i] === 'number') {
                if (i > 0 && typeof currentNumbers[i-1] === 'string') {
                    displayElements.push(currentNumbers[i-1] + currentNumbers[i]);
                } else if (i === 0 || typeof currentNumbers[i-1] === 'number') {
                    displayElements.push(currentNumbers[i].toString());
                }
            }
        }
    } else {
        for (let i = 0; i < currentNumbers.length; i++) {
            displayElements.push(currentNumbers[i].toString());
        }
    }

    function showNext() {
        if (index < displayElements.length) {
            display.textContent = displayElements[index];

            playBeep();

            display.style.animation = 'none';
            setTimeout(() => {
                display.style.animation = 'pulse 0.3s ease-in-out';
            }, 10);
            index++;
            setTimeout(showNext, settings.geschwindigkeit);
        } else {
            display.textContent = '?';
            document.getElementById('answerSection').style.display = 'block';
        }
    }

    showNext();
}

function checkAnswer() {
    const userAnswer = parseInt(userAnswerString) || 0;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('resultScreen').classList.add('active');

    const resultMessage = document.getElementById('resultMessage');
    if (userAnswer === correctAnswer) {
        const correctMessages = [
            '🎉 SUPER! 🎉',
            '⭐ TOLL! ⭐',
            '🏆 FANTASTISCH! 🏆',
            '🌟 PERFEKT! 🌟',
            '💪 STARK! 💪',
            '🎊 SPITZE! 🎊',
            '✨ WUNDERBAR! ✨',
            '🚀 HAMMER! 🚀'
        ];
        resultMessage.textContent = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        resultMessage.className = 'result-message correct';

        playSuccessSound();
        createConfetti();
    } else {
        const wrongMessages = [
            '💪 Weiter üben!',
            '🌈 Nächstes Mal!',
            '⭐ Fast geschafft!',
            '🎯 Probier nochmal!',
            '💫 Du schaffst das!'
        ];
        resultMessage.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        resultMessage.className = 'result-message wrong';
    }

    let questionText = '';
    if (settings.rechenart === 'addition' || settings.rechenart === 'subtraktion') {
        questionText = currentNumbers[0].toString();
        for (let i = 1; i < currentNumbers.length; i++) {
            const operator = settings.rechenart === 'addition' ? ' + ' : ' - ';
            questionText += operator + currentNumbers[i];
        }
    } else if (settings.rechenart === 'multiplikation') {
        questionText = `${currentNumbers[0]} • ${currentNumbers[1]}`;
    } else if (settings.rechenart === 'division') {
        questionText = `${currentNumbers[0]} : ${currentNumbers[1]}`;
    } else {
        for (let i = 0; i < currentNumbers.length; i++) {
            if (typeof currentNumbers[i] === 'number') {
                questionText += currentNumbers[i];
            } else {
                questionText += ' ' + currentNumbers[i] + ' ';
            }
        }
    }
    document.getElementById('questionText').textContent = questionText;
    document.getElementById('correctAnswer').textContent = correctAnswer;
    document.getElementById('userAnswer').textContent = userAnswer;

    const restartButton = document.querySelector('.restart-button');
    if (selectedTasksQueue.length > 0 && currentTaskIndex < selectedTasksQueue.length) {
        currentTaskIndex++;
        if (currentTaskIndex < selectedTasksQueue.length) {
            restartButton.textContent = '➡️ Nächste Aufgabe';
            restartButton.onclick = playNextTaskFromQueue;
        } else {
            restartButton.textContent = '🔄 Nochmal';
            restartButton.onclick = startGame;
            selectedTasksQueue = [];
            currentTaskIndex = 0;
        }
    } else {
        restartButton.textContent = '🔄 Nochmal';
        restartButton.onclick = startGame;
    }
}

loadTasksFromStorage();

window.addEventListener('DOMContentLoaded', loadSoundPreference);

// PWA Installation
let deferredPrompt;
const pwaPopup = document.getElementById('pwaInstallPopup');
const pwaInstallBtn = document.getElementById('pwaInstallButton');
const pwaDismissBtn = document.getElementById('pwaDismissButton');
const pwaCloseBtn = document.getElementById('pwaCloseButton');

const pwaInstallDismissed = localStorage.getItem('pwaInstallDismissed');
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (!pwaInstallDismissed && !isStandalone) {
        setTimeout(() => {
            pwaPopup.classList.add('show');
        }, 3000);
    }
});

pwaInstallBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    deferredPrompt = null;
    pwaPopup.classList.remove('show');
});

pwaDismissBtn.addEventListener('click', () => {
    pwaPopup.classList.remove('show');
    localStorage.setItem('pwaInstallDismissed', 'true');
});

pwaCloseBtn.addEventListener('click', () => {
    pwaPopup.classList.remove('show');
    localStorage.setItem('pwaInstallDismissed', 'true');
});
