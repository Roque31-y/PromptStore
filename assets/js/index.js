// * i. Importar la base de datos
import {bd, updateLocalStorage} from "./datos.js";

// * ii. Obtener elementos HTML
const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");

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

// * v. Mostrar mensaje de éxito
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