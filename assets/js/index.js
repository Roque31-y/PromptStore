// * i. Importar la base de datos
import {bd, updateLocalStorage} from "./database.js";

// * ii. Mostrar modal para usuarios anónimos
if (Number.isInteger(bd.currentUser)) {
    showFail("Acceso denegado", "Por favor, inicie sesión...");
    bd.currentUser = null;
    updateLocalStorage();
}

// * iii. Configurar eventos para el formulario de Log In
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginTogglePassword = document.getElementById("loginTogglePassword");

// evento de mostrar/esconder contraseña
addEventTogglePassword(loginTogglePassword, loginPassword);

// evento al enviar el formulario
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // si ya hay un usuario logueado, redirigir al dashboard
    if (bd.currentUser) {
        redirectUser(`Bienvenido de vuelta, ${bd.currentUser.fullName}!`, "Iniciando sesión automáticamente...");
        return;
    }

    // guardar los valores ingresados por el usuario
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    // validar campos vacíos
    if (!username || !password) {
        showFail("Oops!", "Por favor, llene todos los campos del formulario...")
        return;
    }

    // buscar usuario existente en la bd
    const validUser = bd.users.find(
        (u) => u.username === username && u.password === password
    );

    if (validUser) {
        // actualizar el usuario actual en la bd
        bd.currentUser = validUser;
        updateLocalStorage();

        // redirigir al dashboard
        redirectUser(`Bienvenido de vuelta, ${validUser.fullName}!`, "Iniciando sesión automáticamente...");
    } else {
        showFail("Lo sentimos!", "Usuario o contraseña no válidos...");
    }
});

// * iv. Configurar eventos para el formulario de Registro
const registerForm = document.getElementById("registerForm");
const registerFullName = document.getElementById("registerFullName");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById("registerConfirmPassword");
const registerTogglePassword = document.getElementById("registerTogglePassword");
const registerToggleConfirmPassword = document.getElementById("registerToggleConfirmPassword");

// evento de mostrar/esconder contraseña
addEventTogglePassword(registerTogglePassword, registerPassword);
addEventTogglePassword(registerToggleConfirmPassword, registerConfirmPassword);

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // guardar los valores ingresados por el usuario
    const fullName = registerFullName.value.trim();
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();
    const confirmPassword = registerConfirmPassword.value.trim();

    // validar campos vacíos
    if (!fullName || !username || !password || !confirmPassword) {
        showFail("Oops!", "Por favor, llene todos los campos del formulario...")
        return;
    }

    // buscar usuario existente en la bd
    const foundUser = bd.users.find(
        (u) => u.username === username
    );

    // si el usuario ya existe, tirar alerta
    if (foundUser) {
        showFail("Oops!", "Este usuario ya existe, por favor inicie sesión...")
        return;
    }

    // si la contraseña coincide, crear nuevo usuario en el sistema
    if (password === confirmPassword) {
        const newUser = {
            id: bd.users.length,
            fullName: fullName,
            username: username,
            password: password
        };

        bd.users.push(newUser);
        bd.currentUser = newUser;
        updateLocalStorage();

        redirectUser(`Bienvenido, ${newUser.fullName}!`, "Iniciando sesión automáticamente...");
    } else {
        showFail("Oops!", "Las contraseñas ingresadas no coinciden...");
    }
});

// * v. Mostrar alerta de error
function showFail(title, text) {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
        timer: 2000,
        timerProgressBar: true,
    });
}

// * vi. Mostrar alerta de éxito y redirigir al usuario
function redirectUser(title, text) {
    Swal.fire({
        icon: "success",
        title: title,
        text: text,
        timer: 2000,
        timerProgressBar: true,
    }).then((result) => {
        if (result.isDismissed) {
            globalThis.location.href = "dashboard.html";
        }
    });
}

// * vii. Configurar el botón para mostrar/esconder la contraseña
function addEventTogglePassword(toggleButton, passwordInput) {
    const icon = toggleButton.querySelector('i');

    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        // si el input es tipo text, entonces està mostrando al contraseña
        const isShowing = passwordInput.type === 'text';

        // si se está mostrando, convierte el tipo a password
        passwordInput.type = isShowing ? 'password' : 'text';

        // modificar icono del botón de acuerdo al condicional
        icon.classList.toggle('bi-eye', !isShowing);
        icon.classList.toggle('bi-eye-slash', isShowing);
    });
}

// * viii. Switch entre card de Log In y Registro
const loginCard = document.getElementById("loginCard");
const registerCard = document.getElementById("registerCard");
const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");

addEventCardToggle(loginToggle);
addEventCardToggle(registerToggle);

// intercambiar los estilos de display
function addEventCardToggle(toggleAnchor) {
    toggleAnchor.addEventListener('click', (e) => {
        e.preventDefault();

        const loginVisible = loginCard.classList.contains('d-block');

        if (loginVisible) {
            // esconder login, mostrar registro
            loginCard.classList.remove('d-block');
            loginCard.classList.add('d-none');

            registerCard.classList.remove('d-none');
            registerCard.classList.add('d-block');
        } else {
            // esconder registro, mostrar login
            registerCard.classList.remove('d-block');
            registerCard.classList.add('d-none');

            loginCard.classList.remove('d-none');
            loginCard.classList.add('d-block');
        }
    });
}
