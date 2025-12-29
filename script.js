const loginModal = document.getElementById('loginModal');
const loginBtn = document.querySelector('.btn-login');
const closeBtn = document.querySelector('.close-btn');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123';
let isLoggedIn = false;

function updateLoginButton() {
    if (isLoggedIn) {
        loginBtn.textContent = `Привет, ${ADMIN_USERNAME} (Выход)`;
        loginBtn.onclick = handleLogout;
    } else {
        loginBtn.textContent = "Войти";
        loginBtn.onclick = openLoginModal;
    }
}

function openLoginModal(e) {
    e.preventDefault();
    loginModal.style.display = 'flex';
}
function closeLoginModal() { loginModal.style.display = 'none'; }

function handleLogin(e) {
    e.preventDefault();
    const u = username.value;
    const p = password.value;

    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
        isLoggedIn = true;
        closeLoginModal();
        updateLoginButton();
    } else errorMessage.textContent = "Неверный логин или пароль";
}
function handleLogout(e) {
    e.preventDefault();
    isLoggedIn = false;
    updateLoginButton();
}

closeBtn.onclick = closeLoginModal;
window.onclick = e => { if (e.target === loginModal) closeLoginModal(); };
loginForm.addEventListener('submit', handleLogin);
updateLoginButton();

const bookDisplay = document.getElementById('book-display');
const bookImage = document.getElementById('book-image');
const classTitle = document.getElementById('current-class-title');
const subjectsSection = document.querySelector('.subjects');

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

function handleClassButtonClick(event) {
    if (event.target.tagName !== 'BUTTON') return;

    const id = event.target.id;
    const cls = event.target.dataset.class;

    if (bookMap[id]) {
        bookImage.src = bookMap[id];
        classTitle.textContent = cls;
        bookDisplay.style.display = "block";
        bookDisplay.scrollIntoView({ behavior: "smooth" });
    }
}

subjectsSection.addEventListener('click', handleClassButtonClick);

const testModal = document.getElementById("testModal");
const openTestModal = document.getElementById("openTestModal");
const closeTestBtn = document.querySelector(".close-test-btn");
const testContainer = document.getElementById("testContainer");

openTestModal.onclick = () => {
    testModal.style.display = "flex";
    loadTest();
};
closeTestBtn.onclick = () => testModal.style.display = "none";
window.addEventListener("click", e => {
    if (e.target === testModal) testModal.style.display = "none";
});

const QUESTIONS = [
    { q: "Сколько будет 15 × 3?", type:"choice", options:["35","45","15"], answer:"45" },
    { q: "Укажите правильное написание:", type:"choice", options:["жыть","жить","жыд"], answer:"жить" },
    { q: "Как переводится слово 'apple'?", type:"choice", options:["яблоко","банан","апельсин"], answer:"яблоко" },
    { q: "Найдите корень: 81 = x²", type:"choice", options:["16","12","9"], answer:"9" },
    { q: "Где ошибка?", type:"choice", options:["идти","ехать","ложить"], answer:"ложить" },
    { q: "Сколько будет √49?", type:"choice",options:["7","13","9"], answer:"7" },
    { q: "Как перевести слово 'cat'?", type:"choice", options:["кот","корова","птица"], answer:"кот" },
    { q: "Продолжи: 2, 4, 6, 8, ...", type:"choice",options:["20","10","9"], answer:"10" },
    { q: "Где пишется И?", type:"choice", options:["жи-", "ши-", "ца-"], answer:"жи-" },
    { q: "Сколько будет 120 ÷ 10?", type:"choice",options:["2","16","12"], answer:"12" }
];

function loadTest() {
    testContainer.innerHTML = "";
    QUESTIONS.forEach((q, i) => {
        const box = document.createElement("div");
        box.className = "test-question";

        let html = `<h3>${i+1}. ${q.q}</h3>`;
        q.options.forEach(opt => {
            html += `
            <label class="option">
                <input type="radio" name="q${i}" value="${opt}">
                ${opt}
            </label>`;
        });

        box.innerHTML = html;
        testContainer.appendChild(box);
    });
}

document.getElementById("submitTest").onclick = function() {
    let correct = 0;

    QUESTIONS.forEach((q, i) => {
        const chosen = document.querySelector(`input[name="q${i}"]:checked`);
        if (chosen && chosen.value === q.answer) correct++;
    });

    const toast = document.getElementById("testToast");
    toast.textContent = `Правильных ответов: ${correct} из 10`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
};


const adminBurger = document.getElementById("adminBurger");
const adminPanel = document.getElementById("adminPanel");
const closeAdmin = document.querySelector(".close-admin");

adminBurger.onclick = () => {
    if (isLoggedIn) adminPanel.classList.toggle("show");
    else alert("Войдите в админ-панель");
};
closeAdmin.onclick = () => adminPanel.classList.remove("show");


const addBookForm = document.getElementById("addBookForm");
const bookList = document.getElementById("bookList");
const extraBooks = document.getElementById("extraBooks");

function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    bookList.innerHTML = "";
    extraBooks.innerHTML = "";

    books.forEach(book => {
        addBookToAdminList(book);
        addBookToExtraBlock(book);
    });
}

function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}

function addBookToAdminList(book) {
    const li = document.createElement("li");

    li.dataset.name = book.name;
    li.dataset.img = book.img;
    li.dataset.category = book.category;

    li.innerHTML = `
        <span>${book.name} (${book.category})</span>
        <img src="${book.img}" style="width:40px;margin-left:10px;border-radius:4px;">
        <button class="delete-book" style="margin-left:10px;">Удалить</button>
    `;

    li.querySelector(".delete-book").onclick = () => {
        li.remove();
        const books = [...document.querySelectorAll("#bookList li")].map(li => ({
            name: li.dataset.name,
            img: li.dataset.img,
            category: li.dataset.category
        }));
        saveBooks(books);
        loadBooks();
    };

    bookList.appendChild(li);
}

function addBookToExtraBlock(book) {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "10px";
    wrap.style.marginBottom = "8px";
    wrap.style.alignItems = "center";

    const img = document.createElement("img");
    img.src = book.img;
    img.style.width = "50px";
    img.style.borderRadius = "5px";

    const btn = document.createElement("button");
    btn.textContent = book.name;

    btn.onclick = () => {
        bookImage.src = book.img;
        classTitle.textContent = book.name;
        bookDisplay.style.display = "block";
        bookDisplay.scrollIntoView({ behavior: "smooth" });
    };

    wrap.appendChild(img);
    wrap.appendChild(btn);
    extraBooks.appendChild(wrap);
}

addBookForm.onsubmit = function(e) {
    e.preventDefault();

    const name = document.getElementById("bookName").value.trim();
    const img = document.getElementById("bookImg").value.trim();
    const category = document.getElementById("bookCategory").value;

    if (!name || !img || !category) return;

    const newBook = { name, img, category };

    const books = JSON.parse(localStorage.getItem("books") || "[]");
    books.push(newBook);
    saveBooks(books);

    addBookToAdminList(newBook);
    addBookToExtraBlock(newBook);

    addBookForm.reset();
};

loadBooks();
