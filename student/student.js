
const classList = document.getElementById("classList");
const totalClasses = document.getElementById("totalClasses");
const message = document.getElementById("message");

function loadClasses() {
    let classes = [];

    try {
        classes = JSON.parse(
            localStorage.getItem("classinoClasses") || "[]"
        );

        if (!Array.isArray(classes)) {
            classes = [];
        }
    } catch (error) {
        classes = [];
    }

    totalClasses.textContent = classes.length;
    classList.innerHTML = "";

    if (classes.length === 0) {
        classList.innerHTML = `
            <p class="empty-state">
                هنوز کلاسی ثبت نشده است.
                بعد از ایجاد کلاس توسط معلم، اینجا نمایش داده می‌شود.
            </p>
        `;
        return;
    }

    classes.forEach((item) => {
        const card = document.createElement("div");
        card.className = "student-class-card";

        const name = document.createElement("h3");
        name.textContent = item.name || "کلاس بدون نام";

        const time = document.createElement("p");
        time.textContent = "زمان کلاس: " + (item.time || "تعیین نشده");

        const button = document.createElement("button");
        button.className = "join-button";
        button.textContent = "ورود به کلاس";

        button.addEventListener("click", () => {
            message.textContent =
                "اتاق تماس تصویری هنوز آماده نیست؛ این قابلیت را در مرحله بعد اضافه می‌کنیم.";
        });

        card.appendChild(name);
        card.appendChild(time);
        card.appendChild(button);

        classList.appendChild(card);
    });
}

loadClasses();
