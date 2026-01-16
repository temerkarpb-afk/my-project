// База данных учебников
const bookMap = {
    'math-1': 'img3.webp', 'math-2': 'img4.webp', 'math-3': 'img5.webp', 'math-4': 'img6.webp', 'math-5': 'img7.webp', 'math-6': 'img8.webp', 'math-7': 'img9.webp', 'math-8': 'img10.webp', 'math-9': 'img11.webp', 'math-10': 'img12.webp', 'math-11': 'img13.webp',
    'rus-1': 'img14.webp', 'rus-2': 'img15.webp', 'rus-3': 'img16.webp', 'rus-4': 'img17.webp', 'rus-5': 'img18.webp', 'rus-6': 'img19.webp', 'rus-7': 'img20.webp', 'rus-8': 'img21.webp', 'rus-9': 'img22.webp', 'rus-10': 'img23.webp', 'rus-11': 'img24.webp',
    'eng-1': 'img25.webp', 'eng-2': 'img26.webp', 'eng-3': 'img27.webp', 'eng-4': 'img28.webp', 'eng-5': 'img29.webp', 'eng-6': 'img30.webp', 'eng-7': 'img31.webp', 'eng-8': 'img32.webp', 'eng-9': 'img33.webp', 'eng-10': 'img34.webp', 'eng-11': 'img35.webp'
};

const QUESTIONS = [
    { q: "Сколько будет 15 × 3?", opts: ["35", "45", "55"], a: "45" },
    { q: "Как переводится слово 'Apple'?", opts: ["Груша", "Яблоко", "Слива"], a: "Яблоко" },
    { q: "Какая планета третья от Солнца?", opts: ["Марс", "Земля", "Юпитер"], a: "Земля" }
];

let isLoggedIn = false;
let extraBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];

// 1. Выбор учебника
document.querySelectorAll('.class-selector button').forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation(); // Чтобы не срабатывал клик по карточке
        const id = btn.id;
        const viewer = document.getElementById('book-display');
        if (bookMap[id]) {
            document.getElementById('book-image').src = bookMap[id];
            document.getElementById('current-class-title').textContent = btn.dataset.class;
            viewer.style.display = 'block';
            viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
});

// 2. Живой поиск
document.getElementById('searchInput').oninput = function() {
    let val = this.value.toLowerCase().trim();
    document.querySelectorAll('.subject-card').forEach(card => {
        let text = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = text.includes(val) ? "block" : "none";
    });
};

// 3. Авторизация
const loginModal = document.getElementById('loginModal');
document.getElementById('loginTrigger').onclick = () => {
    if (!isLoggedIn) loginModal.style.display = 'flex';
    else {
        isLoggedIn = false;
        document.getElementById('loginTrigger').innerHTML = "<i class='bx bx-user-circle'></i> <span>Войти</span>";
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
        document.getElementById('loginTrigger').innerHTML = "<i class='bx bx-log-out-circle'></i> <span>Выйти</span>";
        loginModal.style.display = 'none';
        document.getElementById('loginForm').reset();
    } else {
        document.getElementById('errorMessage').textContent = 'Ошибка доступа!';
    }
};

// 4. Тестирование
document.getElementById('openTestModal').onclick = () => {
    document.getElementById('testModal').style.display = 'flex';
    const container = document.getElementById('testContainer');
    container.innerHTML = QUESTIONS.map((q, i) => `
        <div style="margin-bottom:15px; padding:15px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
            <p style="font-weight:700; margin-bottom:10px;">${i+1}. ${q.q}</p>
            ${q.opts.map(o => `<label style="display:block; margin:5px 0; cursor:pointer;"><input type="radio" name="q${i}" value="${o}"> ${o}</label>`).join('')}
        </div>
    `).join('');
};

document.getElementById('submitTest').onclick = () => {
    let score = 0;
    QUESTIONS.forEach((q, i) => {
        const sel = document.querySelector(`input[name="q${i}"]:checked`);
        if (sel && sel.value === q.a) score++;
    });
    alert(`Ваш результат: ${score} из ${QUESTIONS.length}`);
    document.getElementById('testModal').style.display = 'none';
};

// 5. Админка
const adminPanel = document.getElementById('adminPanel');
document.getElementById('adminBurger').onclick = () => {
    if (isLoggedIn) {
        adminPanel.classList.toggle('active');
        renderAdminList();
    } else alert('Войдите как админ (admin / 123)');
};

document.getElementById('addBookBtn').onclick = () => {
    const name = document.getElementById('bookName').value;
    const imgUrl = document.getElementById('bookImg').value;
    if (name && imgUrl) {
        extraBooks.push({ name, imgUrl, id: Date.now() });
        localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
        document.getElementById('bookName').value = '';
        document.getElementById('bookImg').value = '';
        renderAdminList();
        renderExtraBooks();
    }
};

function renderAdminList() {
    document.getElementById('bookList').innerHTML = extraBooks.map(book => `
        <li style="display:flex; justify-content:space-between; margin-bottom:8px; background:#f8fafc; padding:10px; border-radius:10px; border:1px solid #eee;">
            <span style="font-size:14px; font-weight:500;">${book.name}</span>
            <button onclick="deleteBook(${book.id})" style="color:var(--error); border:none; background:none; cursor:pointer;"><i class='bx bx-trash'></i></button>
        </li>
    `).join('');
}

function renderExtraBooks() {
    const container = document.getElementById('extraBooks');
    if (extraBooks.length > 0) {
        container.innerHTML = `<h2 class="section-title" style="margin-top:40px;">Дополнительно</h2><div class="subjects-grid">` + 
            extraBooks.map(book => `
                <div class="subject-card" onclick="showExtra('${book.name}', '${book.imgUrl}')">
                    <div class="card-header"><div class="icon-box" style="background:#eef2ff; color:#4f46e5;"><i class='bx bx-book-add'></i></div>
                    <h3>${book.name}</h3></div>
                </div>`).join('') + `</div>`;
    } else container.innerHTML = '';
}

window.deleteBook = (id) => {
    extraBooks = extraBooks.filter(b => b.id !== id);
    localStorage.setItem('addedBooks', JSON.stringify(extraBooks));
    renderAdminList(); renderExtraBooks();
};

window.showExtra = (name, url) => {
    const viewer = document.getElementById('book-display');
    document.getElementById('book-image').src = url;
    document.getElementById('current-class-title').textContent = name;
    viewer.style.display = 'block';
    viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// 6. Закрытие окон
document.querySelectorAll('.close-modal, .close-test, .close-admin').forEach(btn => {
    btn.onclick = () => {
        loginModal.style.display = 'none';
        document.getElementById('testModal').style.display = 'none';
        adminPanel.classList.remove('active');
    }
});

// Инициализация
renderExtraBooks();
