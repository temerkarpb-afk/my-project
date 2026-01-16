// --- КАРТА КНИГ (ТВОИ ДАННЫЕ) ---
const bookMap = {
    'math-1': 'img3.webp','math-2':'img4.webp','math-3':'img5.webp','math-4':'img6.webp',
    'math-5':'img7.webp','math-6':'img8.webp','math-7':'img9.webp','math-8':'img10.webp',
    'math-9':'img11.webp','math-10':'img12.webp','math-11':'img13.webp',
    'rus-1':'img14.webp','rus-2':'img15.webp','rus-3':'img16.webp','rus-4':'img17.webp',
    'rus-5':'img18.webp','rus-6':'img19.webp','rus-7':'img20.webp','rus-8':'img21.webp',
    'rus-9':'img22.webp','rus-10':'img23.webp','rus-11':'img24.webp',
    'eng-1':'img25.webp','eng-2':'img26.webp','eng-3':'img27.webp','eng-4':'img28.webp',
    'eng-5':'img29.webp','eng-6':'img30.webp','eng-7':'img31.webp','eng-8':'img32.webp',
    'eng-9':'img33.webp','eng-10':'img34.webp','eng-11':'img35.webp'
};

// --- СОСТОЯНИЕ ---
let isLoggedIn = false;
const ADMIN = { user: 'admin', pass: '123' };

// --- ЭЛЕМЕНТЫ ---
const els = {
    loginModal: document.getElementById('loginModal'),
    testModal: document.getElementById('testModal'),
    adminPanel: document.getElementById('adminPanel'),
    bookImage: document.getElementById('book-image'),
    classTitle: document.getElementById('current-class-title'),
    viewer: document.getElementById('book-display'),
    extraContainer: document.getElementById('extraBooks')
};

// --- ЛОГИКА АВТОРИЗАЦИИ ---
document.getElementById('loginTrigger').onclick = () => {
    if(!isLoggedIn) els.loginModal.style.display = 'flex';
    else {
        isLoggedIn = false;
        document.getElementById('loginTrigger').textContent = 'Войти';
        els.adminPanel.classList.remove('active');
    }
};

document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(u === ADMIN.user && p === ADMIN.pass) {
        isLoggedIn = true;
        document.getElementById('loginTrigger').textContent = 'Выход';
        els.loginModal.style.display = 'none';
    } else {
        document.getElementById('errorMessage').textContent = 'Ошибка доступа';
    }
};

// --- ВЫБОР КНИГИ ---
document.querySelectorAll('.class-selector button').forEach(btn => {
    btn.onclick = () => {
        const id = btn.id;
        const name = btn.dataset.class;
        const subj = btn.parentElement.previousElementSibling.querySelector('h3').textContent;
        
        if(bookMap[id]) {
            els.bookImage.src = bookMap[id];
            els.classTitle.textContent = `${subj}, ${name}`;
            els.viewer.style.display = 'block';
            els.viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// --- АДМИНКА ---
document.getElementById('adminBurger').onclick = () => {
    if(isLoggedIn) els.adminPanel.classList.toggle('active');
    else alert('Сначала войдите как админ');
};

document.querySelector('.close-admin').onclick = () => els.adminPanel.classList.remove('active');

// --- ТЕСТЫ ---
const QUESTIONS = [
    { q: "Сколько будет 15 × 3?", opts: ["35","45","15"], a: "45" },
    { q: "Как переводится 'apple'?", opts: ["яблоко","банан","апельсин"], a: "яблоко" },
    { q: "Найдите корень: 81 = x²", opts: ["16","12","9"], a: "9" }
];

document.getElementById('openTestModal').onclick = () => {
    els.testModal.style.display = 'flex';
    const container = document.getElementById('testContainer');
    container.innerHTML = QUESTIONS.map((q, i) => `
        <div style="margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 12px;">
            <p style="font-weight:700; margin-bottom: 10px;">${i+1}. ${q.q}</p>
            ${q.opts.map(opt => `
                <label style="display:block; margin-bottom:5px; cursor:pointer;">
                    <input type="radio" name="q${i}" value="${opt}"> ${opt}
                </label>
            `).join('')}
        </div>
    `).join('');
};

document.getElementById('submitTest').onclick = () => {
    let score = 0;
    QUESTIONS.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if(sel && sel.value === q.a) score++;
    });
    alert(`Ваш результат: ${score} из ${QUESTIONS.length}`);
    els.testModal.style.display = 'none';
};

// Закрытие модалок
document.querySelectorAll('.close-btn, .close-test-btn').forEach(b => {
    b.onclick = () => {
        els.loginModal.style.display = 'none';
        els.testModal.style.display = 'none';
    }
});
