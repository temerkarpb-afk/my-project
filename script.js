// ==========================================
// 1. БАЗА ДАННЫХ (Твои картинки)
// ==========================================
const bookMap = {
    'math-1': 'img3.webp', 'math-2': 'img4.webp', 'math-3': 'img5.webp', 'math-4': 'img6.webp',
    'math-5': 'img7.webp', 'math-6': 'img8.webp', 'math-7': 'img9.webp', 'math-8': 'img10.webp',
    'math-9': 'img11.webp', 'math-10': 'img12.webp', 'math-11': 'img13.webp',
    'rus-1': 'img14.webp', 'rus-2': 'img15.webp', 'rus-3': 'img16.webp', 'rus-4': 'img17.webp',
    'rus-5': 'img18.webp', 'rus-6': 'img19.webp', 'rus-7': 'img20.webp', 'rus-8': 'img21.webp',
    'rus-9': 'img22.webp', 'rus-10': 'img23.webp', 'rus-11': 'img24.webp',
    'eng-1': 'img25.webp', 'eng-2': 'img26.webp', 'eng-3': 'img27.webp', 'eng-4': 'img28.webp',
    'eng-5': 'img29.webp', 'eng-6': 'img30.webp', 'eng-7': 'img31.webp', 'eng-8': 'img32.webp',
    'eng-9': 'img33.webp', 'eng-10': 'img34.webp', 'eng-11': 'img35.webp'
};

// Вопросы для тестирования
const QUESTIONS = [
    { q: "Сколько будет 15 × 3?", opts: ["35", "45", "55"], a: "45" },
    { q: "Как переводится слово 'Apple'?", opts: ["Груша", "Яблоко", "Абрикос"], a: "Яблоко" },
    { q: "Какая планета третья от Солнца?", opts: ["Марс", "Земля", "Венера"], a: "Земля" },
    { q: "7 + 8 * 2 = ?", opts: ["30", "23", "18"], a: "23" }
];

// ==========================================
// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ==========================================
let isLoggedIn = false;
const extraBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];

// ==========================================
// 3. ФУНКЦИОНАЛ ВЫБОРА УЧЕБНИКА
// ==========================================
document.querySelectorAll('.class-selector button').forEach(btn => {
    btn.onclick = () => {
        const id = btn.id;
        const viewer = document.getElementById('book-display');
        const img = document.getElementById('book-image');
        const title = document.getElementById('current-class-title');

        if (bookMap[id]) {
            img.src = bookMap[id];
            title.textContent = btn.dataset.class;
            viewer.style.display = 'block';
            
            // Плавный скролл к просмотру
            viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
});

// ==========================================
// 4. ПОИСК УЧЕБНИКОВ
// ==========================================
document.getElementById('searchInput').oninput = function() {
    let val = this.value.toLowerCase().trim();
    let cards = document.querySelectorAll('.subject-card');
    
    cards.forEach(card => {
        let text = card.querySelector('h3').innerText.toLowerCase();
        if (text.includes(val)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

// ==========================================
// 5. АВТОРИЗАЦИЯ И МОДАЛКИ
// ==========================================
const loginModal = document.getElementById('loginModal');

document.getElementById('loginTrigger').onclick = () => {
    if (!isLoggedIn) {
        loginModal.style.display = 'flex';
    } else {
        isLoggedIn = false;
        document.getElementById('loginTrigger').textContent = 'Войти';
        document.getElementById('adminPanel').classList.remove('active');
        alert('Вы вышли из системы');
    }
};

document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === 'admin' && p === '123') {
        isLoggedIn = true;
        document.getElementById('loginTrigger').textContent = 'Выйти (Админ)';
        loginModal.style.display = 'none';
        document.getElementById('loginForm').reset();
    } else {
        document.getElementById('errorMessage').textContent = 'Неверный логин или пароль!';
    }
};

// ==========================================
// 6. ТЕСТИРОВАНИЕ
// ==========================================
const testModal = document.getElementById('testModal');

document.getElementById('openTestModal').onclick = () => {
    testModal.style.display = 'flex';
    const container = document.getElementById('testContainer');
    
    container.innerHTML = QUESTIONS.map((q, i) => `
        <div class="test-question-box" style="margin-bottom:20px; padding:20px; background:#f8fafc; border-radius:15px; border:1px solid #e2e8f0;">
            <p style="font-weight:700; margin-bottom:12px; color:#1e293b;">${i+1}. ${q.q}</p>
            <div style="display:grid; gap:8px;">
                ${q.opts.map(opt => `
                    <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px; background:white; border-radius:8px; border:1px solid #eee;">
                        <input type="radio" name="q${i}" value="${opt}"> ${opt}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
};

document.getElementById('submitTest').onclick = () => {
    let score = 0;
    QUESTIONS.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.a) score++;
    });
    
    alert(`Результат: ${score} из ${QUESTIONS.length}. ${score === QUESTIONS.length ? 'Отлично!' : 'Попробуйте еще раз.'}`);
    testModal.style.display = 'none';
};

// ==========================================
// 7. АДМИН-ПАНЕЛЬ (ДОБАВЛЕНИЕ КНИГ)
// ==========================================
const adminPanel = document.getElementById('adminPanel');

document.getElementById('adminBurger').onclick = () => {
    if (isLoggedIn) {
        adminPanel.classList.toggle('active');
        renderAdminList();
    } else {
        alert('Доступ только для администратора. Пожалуйста, войдите.');
    }
};

document.getElementById('addBookBtn').onclick = () => {
    const name = document.getElementById('bookName').value;
    const imgUrl = document.getElementById('bookImg').value;

    if (name && imgUrl) {
        const newBook = { name, imgUrl, id: Date.now() };
        extraBooks.push(newBook);
        localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
        
        document.getElementById('bookName').value = '';
        document.getElementById('bookImg').value = '';
        
        renderAdminList();
        renderExtraBooks();
    } else {
        alert('Заполните все поля');
    }
};

function renderAdminList() {
    const list = document.getElementById('bookList');
    list.innerHTML = extraBooks.map(book => `
        <li style="display:flex; justify-content:space-between; margin-bottom:10px; background:#f1f5f9; padding:8px; border-radius:8px; font-size:14px;">
            <span>${book.name}</span>
            <button onclick="deleteBook(${book.id})" style="color:red; border:none; background:none; cursor:pointer;">Удалить</button>
        </li>
    `).join('');
}

function renderExtraBooks() {
    const container = document.getElementById('extraBooks');
    if (extraBooks.length > 0) {
        container.innerHTML = `
            <h2 class="section-title" style="margin-top:40px;">Дополнительные материалы</h2>
            <div class="subjects-grid">
                ${extraBooks.map(book => `
                    <div class="subject-card" onclick="showExtraBook('${book.name}', '${book.imgUrl}')">
                        <div class="card-header" style="margin-bottom:0;">
                            <div class="icon-box" style="background:#eef2ff; color:#4f46e5;"><i class='bx bx-book-add'></i></div>
                            <h3>${book.name}</h3>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// Удаление книги (из админки)
window.deleteBook = (id) => {
    const index = extraBooks.findIndex(b => b.id === id);
    if (index > -1) {
        extraBooks.splice(index, 1);
        localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
        renderAdminList();
        renderExtraBooks();
    }
};

// Просмотр добавленной книги
window.showExtraBook = (name, url) => {
    const viewer = document.getElementById('book-display');
    document.getElementById('book-image').src = url;
    document.getElementById('current-class-title').textContent = name;
    viewer.style.display = 'block';
    viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// ==========================================
// 8. ЗАКРЫТИЕ ВСЕХ ОКОН
// ==========================================
document.querySelectorAll('.close-modal, .close-test, .close-admin').forEach(btn => {
    btn.onclick = () => {
        loginModal.style.display = 'none';
        testModal.style.display = 'none';
        adminPanel.classList.remove('active');
    };
});

// Клик вне модалки закрывает её
window.onclick = (event) => {
    if (event.target == loginModal) loginModal.style.display = 'none';
    if (event.target == testModal) testModal.style.display = 'none';
};

// Инициализация при загрузке
renderExtraBooks();
