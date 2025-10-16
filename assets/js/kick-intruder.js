import {bd, updateLocalStorage } from "./database.js";

// null es el valor por defecto al cargar la página
if (bd.currentUser == null) {
    bd.currentUser = -10; // código de error
    updateLocalStorage();

    // redirigir al login
    globalThis.location.replace("./index.html");
}