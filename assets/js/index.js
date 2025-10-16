// Imposrtar la base de datos
import {bd, updateLocalStorage} from "./datos.js";

//Traer datos del formulario
const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("inputEmail");
const inputPassword = document.getElementById("inputPassword");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guardar los valores del usurio
    const username = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    
    // Buscar Usuario valido
    const usuaioValido = bd.users.find(
        (u) => u.username === username && u.password === password
    );

    //Evaluar que el correo y la contraseña sean valido
    if(usuaioValido){
        bd.currentUser = usuaioValido;
        updateLocalStorage;

        // Redirigir al Dashboard
        window.location.href = "dashboard.html";
    } else {
        mostrarError("Usuario o contraseña no valido");
    }
})

// Funcion para mostrar mensaje de error
function mostrarError(mensaje){

    const alertaExistente = document.querySelector(".alert");
    if(alertaExistente) alertaExistente.remove();

    const alerta = document.createElement("div");
    alerta.classList.add("alert", "alert-danger", "mt-3");

    alerta.textContent = mensaje;
    formLogin.appendChild(alerta);

    setTimeout (() => alerta.remove(), 3000);
}
