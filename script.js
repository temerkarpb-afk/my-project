// --- Селекторы ---
const loginModal = document.getElementById('loginModal');
const loginBtn = document.querySelector('.btn-login');
const closeBtn = document.querySelector('.close-btn');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const adminPanel = document.getElementById('adminPanel');
const adminBurger = document.getElementById('adminBurger');
const closeAdmin = document.querySelector('.close-admin');

// --- Состояние ---
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123';
let isLoggedIn = false;

// --- Авторизация ---
function updateLoginButton() {
    if (isLoggedIn) {
        loginBtn.textContent = "Выйти (Админ)";
        loginBtn.style.background = "#fee2e2";
        loginBtn.style.color = "#b91c1c";
        loginBtn.onclick = handleLogout;
    } else {
        loginBtn.textContent = "Войти";
        loginBtn.style.background = "white";
        loginBtn.style.color = "#1a73e8";
        loginBtn.onclick = () => loginModal.style.display = 'flex';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
        isLoggedIn = true;
        loginModal.style.display = 'none';
        updateLoginButton();
        loginForm.reset();
    } else {
        errorMessage.textContent = "Ошибка: Неверный логин";
    }
}

function handleLogout(e) {
    e.preventDefault();
    isLoggedIn = false;
    adminPanel.classList.remove('show');
    updateLoginButton();
}

// --- Управление учебниками ---
const bookMap = {
    'math-1': 'img3.webp', 'math-11': 'img13.webp', // ... твои ссылки
    'rus-1': 'img14.webp', 'rus-11': 'img24.webp',
    'eng-1': 'img25.webp', 'eng-11': 'img35.webp'
};

document.querySelector('.subjects').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const id = e.target.id;
    const display = document.getElementById('book-display');
    
    if (bookMap[id]) {
        document.getElementById('book-image').src = bookMap[id];
        document.getElementById('current-class-title').textContent = e.target.dataset.class;
        display.style.display = 'block';
        display.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// --- Тестирование ---
const QUESTIONS = [
    { q: "Сколько будет 15 × 3?", options:["35","45","15"], answer:"45" },
    { q: "Как переводится 'apple'?", options:["яблоко","банан","апельсин"], answer:"яблоко" }
    // Добавь остальные свои вопросы сюда
];

document.getElementById('openTestModal').onclick = () => {
    const container = document.getElementById('testContainer');
    container.innerHTML = QUESTIONS.map((q, i) => `
        <div class="test-question">
            <p><strong>${i+1}. ${q.q}</strong></p>
            ${q.options.map(opt => `
                <label class="option">
                    <input type="radio" name="q${i}" value="${opt}"> ${opt}
                </label>
            `).join('')}
        </div>
    `).join('');
    document.getElementById('testModal').style.display = 'flex';
};

document.getElementById('submitTest').onclick = () => {
    let score = 0;
    QUESTIONS.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.answer) score++;
    });

    const toast = document.getElementById('testToast');
    toast.textContent = `Твой результат: ${score} из ${QUESTIONS.length}`;
    toast.classList.add('show');
    document.getElementById('testModal').style.display = 'none';
    setTimeout(() => toast.classList.remove('show'), 4000);
};

// --- Админка ---
adminBurger.onclick = () => {
    if (isLoggedIn) adminPanel.classList.toggle('show');
    else alert("Сначала войдите в систему");
};

closeAdmin.onclick = () => adminPanel.classList.remove('show');
closeBtn.onclick = () => loginModal.style.display = 'none';
loginForm.onsubmit = handleLogin;
updateLoginButton();
