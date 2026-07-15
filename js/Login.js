document.addEventListener("DOMContentLoaded", () => {
    let loginForm = document.querySelector("#login-form");
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); 

            let enteredUsername = usernameInput.value.trim();
            let enteredPassword = passwordInput.value.trim();

            if (!enteredUsername || !enteredPassword) {
                alert("برجاء ملء جميع الحقول المطلوبة");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];

            let matchedUser = users.find(u => 
                (u.username === enteredUsername || u.email === enteredUsername) && 
                u.password === enteredPassword
            );

            if (matchedUser) {
                alert("تم تسجيل الدخول بنجاح!");

                localStorage.setItem("username", matchedUser.username);

                setTimeout(function () {
                    window.location.href = "index.html";
                }, 500);
            } else {
                alert("اسم المستخدم/البريد الإلكتروني أو كلمة المرور غير صحيحة!");
            }
        });
    }
});