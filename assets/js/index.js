// * i. Importar la base de datos
import {bd, updateLocalStorage} from "./datos.js";

// * ii. Obtener elementos HTML
const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");
const buttonTogglePassword = document.getElementById("buttonTogglePassword");

// * iii. Generar evento en el formulario
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    // guardar los valores ingresados por el usuario
    const username = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    
    // buscar usuario existente en la bd
    const validUser = bd.users.find(
        (u) => u.username === username && u.password === password
    );

    if (validUser) {
        // actualizar el usuario actual en la bd
        bd.currentUser = validUser;
        updateLocalStorage();

        // redirigir al dashboard
        redirectUser(`Bienvenido, ${validUser.fullName}!`, "Iniciando sesión automáticamente...");
    } else {
        showFail("Lo sentimos!", "Usuario o contraseña no válidos...");
    }
})

// * iv. Mostrar alerta de error
function showFail(title, text) {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
        timer: 2000,
        timerProgressBar: true,
    });
}

// * v. Mostrar alerta de éxito y redirigir al usuario
function redirectUser(title, text) {
    Swal.fire({
        icon: "success",
        title: title,
        text: text,
        timer: 2000,
        timerProgressBar: true,
    }).then((result) => {
        // esto redirige al usuario cuando se termine la alerta
        if (result.dismiss) {
            window.location.href = "dashboard.html"
        }
    });
}

// * vi. Configurar el botón para mostrar/esconder la contraseña
buttonTogglePassword.addEventListener('click', () => {
    // si el input es tipo text, entonces està mostrando al contraseña
    const isShowing = inputPassword.type === 'text';

    // si se está mostrando, convierte el tipo a password
    inputPassword.type = isShowing ? 'password' : 'text';

    // modificar icono del botón de acuerdo al condicional
    const icon = buttonTogglePassword.querySelector('i');
    icon.classList.toggle('bi-eye', !isShowing);
    icon.classList.toggle('bi-eye-slash', isShowing);
});
