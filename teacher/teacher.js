
const classForm = document.getElementById("classForm");
const classNameInput = document.getElementById("className");
const classTimeInput = document.getElementById("classTime");
const classList = document.getElementById("classList");
const message = document.getElementById("message");
const totalClasses = document.getElementById("totalClasses");
const classCount = document.getElementById("classCount");
const prepareBtn = document.getElementById("prepareBtn");
const prepareMessage = document.getElementById("prepareMessage");

const STORAGE_KEY = "classinoClasses";

let classes = [];

try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (Array.isArray(saved)) {
        classes = saved.filter(
            item => item && typeof item.name === "string"
        );
    }
} catch (error) {
    console.error("خطا در خواندن کلاس‌های ذخیره‌شده:", error);
}

function saveClasses() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
        return true;
    } catch (error) {
        console.error("خطا در ذخیره کلاس‌ها:", error);
        message.textContent = "ذخیره‌سازی انجام نشد.";
        return false;
    }
}

function renderClasses() {
    classList.replaceChildren();

    totalClasses.textContent = classes.length.toLocaleString("fa-IR");
    classCount.textContent =
        classes.length.toLocaleString("fa-IR") + " کلاس";

    if (classes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "هنوز کلاسی ایجاد نکرده‌اید.";
        classList.appendChild(empty);
        return;
    }

    classes.forEach(item => {
        const card = document.createElement("article");
        card.className = "class-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const time = document.createElement("p");

        if (item.time) {
            const date = new Date(item.time);

            time.textContent = Number.isNaN(date.getTime())
                ? "زمان کلاس نامعتبر است."
                : "زمان کلاس: " +
                  date.toLocaleString("fa-IR");
        } else {
            time.textContent = "زمان کلاس تعیین نشده است.";
        }

        const actions = document.createElement("div");
        actions.className = "class-actions";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-button";
        deleteBtn.textContent = "حذف کلاس";

        deleteBtn.addEventListener("click", () => {
            const confirmed = confirm(
                "آیا از حذف کلاس «" + item.name + "» مطمئن هستید؟"
            );

            if (!confirmed) return;

            const oldClasses = classes;

            classes = classes.filter(
                classItem => classItem.id !== item.id
            );

            if (saveClasses()) {
                renderClasses();
                message.textContent = "کلاس حذف شد.";
            } else {
                classes = oldClasses;
                renderClasses();
            }
        });

        actions.appendChild(deleteBtn);
        card.appendChild(title);
        card.appendChild(time);
        card.appendChild(actions);
        classList.appendChild(card);
    });
}

classForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = classNameInput.value.trim();
    const time = classTimeInput.value;

    if (!name) {
        message.textContent = "لطفاً نام کلاس را وارد کنید.";
        classNameInput.focus();
        return;
    }

    if (time && Number.isNaN(new Date(time).getTime())) {
        message.textContent = "زمان کلاس معتبر نیست.";
        return;
    }

    const newClass = {
        id: Date.now().toString() +
            Math.random().toString(16).slice(2),
        name: name,
        time: time
    };

    classes.push(newClass);

    if (!saveClasses()) {
        classes.pop();
        return;
    }

    renderClasses();
    classForm.reset();
    message.textContent = "کلاس با موفقیت ذخیره شد.";
});

prepareBtn.addEventListener("click", () => {
    prepareMessage.textContent =
        "پنل آماده است؛ برای تماس تصویری واقعی باید سامانه ویدئویی به سایت متصل شود.";
});

renderClasses();
