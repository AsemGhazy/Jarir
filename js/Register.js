document.addEventListener("DOMContentLoaded", () => {
    let registerForm = document.querySelector("#register-form-submit"); // ربط الفورم نفسه
    let usernameInput = document.querySelector("#username");
    let emailInput = document.querySelector("#email");
    let passwordInput = document.querySelector("#password");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضية

            let usernameVal = usernameInput.value.trim();
            let emailVal = emailInput.value.trim();
            let passwordVal = passwordInput.value.trim();

            // 1. التحقق من عدم وجود حقول فارغة
            if (!usernameVal || !emailVal || !passwordVal) {
                alert("برجاء ملء جميع الحقول المطلوبة");
                return;
            }

            // 2. التحقق من صحة صيغة البريد الإلكتروني
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailVal)) {
                alert("برجاء إدخال بريد إلكتروني صحيح");
                return;
            }

            const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (!passwordPattern.test(passwordVal)) {
                alert("برجاء إدخال كلمه مرور افضل");
                return;
            }

            // جلب مصفوفة المستخدمين الحالية أو إنشاء واحدة جديدة
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // 3. التحقق من أن اسم المستخدم أو البريد الإلكتروني غير مكرر
            let usernameTaken = users.some(u => u.username === usernameVal);
            if (usernameTaken) {
                alert("اسم المستخدم هذا مسجل بالفعل!");
                return;
            }

            let emailTaken = users.some(u => u.email.toLowerCase() === emailVal.toLowerCase());
            if (emailTaken) {
                alert("هذا البريد الإلكتروني مسجل بالفعل!");
                return;
            }

            // إضافة المستخدم الجديد
            let newUser = {
                id: Date.now(),
                username: usernameVal,
                email: emailVal,
                password: passwordVal,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);

            // حفظ المصفوفة كاملة فقط -- لا نُسجّل دخول المستخدم تلقائياً هنا
            localStorage.setItem("users", JSON.stringify(users));

            alert("تم إنشاء الحساب بنجاح! سيتم تحويلك لصفحة تسجيل الدخول");

            setTimeout(function () {
                window.location.href = "login.html";
            }, 500);
        });
    }
});80.