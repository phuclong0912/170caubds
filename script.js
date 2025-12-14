let currentQuestions = [];
let selectedAnswers = {};
let timeLeft = 45 * 60; // 45 phút

function loadQuestions(mode) {
  const container = mode === 'study' ? document.getElementById('questions-list') : document.getElementById('quiz-container');
  let qs = questions;
  if (mode === 'quiz') {
    // Random 50 câu
    qs = questions.sort(() => 0.5 - Math.random()).slice(0, 50);
    startTimer();
  }
  currentQuestions = qs;
  container.innerHTML = qs.map((q, idx) => {
    const fullIdx = mode === 'study' ? q.id : idx + 1;
    let html = `<div class="question">
      <h3>Câu ${fullIdx}: ${q.question}</h3>
      <ul class="options">`;
    q.options.forEach(opt => {
      const letter = opt[0];
      const text = opt.slice(3);
      html += mode === 'quiz' 
        ? `<li onclick="selectAnswer(${fullIdx}, '${letter}')">${opt}</li>`
        : `<li>${opt} ${letter === q.answer ? `<span class="answer">${letter} (Đúng)</span>` : ''}</li>`;
    });
    html += `</ul>
      ${mode === 'study' ? `<p class="explanation">${q.explanation}</p>` : ''}
    </div>`;
    return html;
  }).join('');
  
  if (mode === 'study') {
    // Search & filter
    document.getElementById('search').addEventListener('input', (e) => filterQuestions(e.target.value));
    // Filter tương tự nếu có tag
  }
}

function filterQuestions(query) {
  const filtered = questions.filter(q => q.question.toLowerCase().includes(query.toLowerCase()));
  // Reload với filtered
  loadQuestions('study'); // Simplified, expand if needed
}

function selectAnswer(qId, letter) {
  selectedAnswers[qId] = letter;
}

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').textContent = `${Math.floor(timeLeft/60)}:${timeLeft%60.toString().padStart(2,'0')}`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz() {
  let score = 0;
  currentQuestions.forEach(q => {
    if (selectedAnswers[q.id] === q.answer) score++;
  });
  document.getElementById('quiz-container').style.display = 'none';
  document.getElementById('submit-quiz').style.display = 'none';
  document.getElementById('result').innerHTML = `<h2>Kết quả: ${score}/${currentQuestions.length} (${Math.round(score/currentQuestions.length*100)}%)</h2>
    <p>Chi tiết: ${currentQuestions.map(q => `<br>Câu ${q.id}: Chọn ${selectedAnswers[q.id] || 'Không'} - Đúng: ${q.answer} (${q.explanation})`).join('')}</p>`;
  document.getElementById('result').style.display = 'block';
}

document.getElementById('submit-quiz').addEventListener('click', submitQuiz);
