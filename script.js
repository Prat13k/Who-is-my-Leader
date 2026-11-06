// 1. Initialize empty variables
let questions = [];
let currentQuestionIndex = 0;
let scores = {
    progressive: 0, traditional: 0,
    libertarian: 0, authoritarian: 0,
    left: 0, right: 0,
    pragmatic: 0, ideological: 0
};

// 2. Fetch the data from the JSON file when the page loads
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        
        // Update the start button so users know it's ready
        document.querySelector('.start-btn').innerText = "Begin Assessment";
        document.querySelector('.start-btn').disabled = false;
    } catch (error) {
        console.error("Error loading questions:", error);
        document.querySelector('.start-btn').innerText = "Error loading data";
    }
}

// 3. Call the loader immediately
loadQuestions();

// =========================================
// QUIZ LOGIC (Exactly the same as before)
// =========================================
function startQuiz() {
    if (questions.length === 0) {
        alert("Questions are still loading. Please wait a second and try again.");
        return;
    }
    
    document.getElementById('landing-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    
    document.getElementById('question-counter').innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    document.getElementById('progress-fill').style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    document.getElementById('question-text').innerText = q.text;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; 
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span>${opt.text}</span>
            <span class="option-indicator">${String.fromCharCode(65 + index)}</span>
        `;
        btn.onclick = () => selectAnswer(opt.score);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(score) {
    for (const [key, value] of Object.entries(score)) {
        scores[key] += value;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        calculateResult();
    }
}

function calculateResult() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    let title, desc, econ, social, lead, auth;

    if (scores.traditional > scores.progressive && scores.authoritarian > scores.libertarian) {
        title = "The Traditionalist Guardian";
        desc = "You believe in the preservation of cultural values and the necessity of strong, centralized authority to maintain social cohesion and order.";
        econ = scores.right > scores.left ? "Center-Right" : "Center-Left";
        social = "Traditional / Conservative";
        lead = "Decisive & Protective";
        auth = "Centralized Authority";
    } 
    else if (scores.progressive > scores.traditional && scores.authoritarian > scores.libertarian) {
        title = "The Visionary Reformer";
        desc = "You believe in using state power to drive radical social progress, dismantle old systems, and engineer a better future through decisive leadership.";
        econ = scores.left > scores.right ? "Left-Leaning" : "Mixed Economy";
        social = "Progressive / Radical";
        lead = "Transformational & Visionary";
        auth = "Strong State Intervention";
    }
    else if (scores.libertarian > scores.authoritarian && scores.right > scores.left) {
        title = "The Libertarian Minimalist";
        desc = "You believe in maximizing individual freedom, minimizing state interference in both personal lives and the free market, and prioritizing personal responsibility.";
        econ = "Free Market / Deregulated";
        social = "Libertarian / Liberal";
        lead = "Hands-off & Pragmatic";
        auth = "Decentralized / Minimal";
    }
    else {
        title = "The Pragmatic Diplomat";
        desc = "You reject strict ideological extremes. You believe in evidence-based governance, compromise, and flexible leadership that adapts to the situation at hand.";
        econ = "Centrist / Mixed";
        social = "Moderate / Balanced";
        lead = "Consensus-Building & Pragmatic";
        auth = "Balanced Governance";
    }

    document.getElementById('result-title').innerText = title;
    document.getElementById('result-description').innerText = desc;
    document.getElementById('trait-economic').innerText = econ;
    document.getElementById('trait-social').innerText = social;
    document.getElementById('trait-leadership').innerText = lead;
    document.getElementById('trait-authority').innerText = auth;
}
