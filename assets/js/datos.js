// * i. Datos a exportar al resto del sistema
export const bd = {
    users: [],
    products: [],
    sales: [],
    carts: [],
    currentUser: null
}

// * ii. Obtención de datos
for (const key in bd) {
    // las llaves del objeto “bd” y el localStorage son equivalentes
    const data = localStorage.getItem(key);

    if (data) {
        console.log(`Cargando '${key}' desde localStorage...`);
        console.log(`Datos obtenidos: ${data}`)
        bd[key] = JSON.parse(data);
    } else {
        // si algún dato no existe, cargar los valores por defecto
        console.log(`No existe '${key}' en localStorage, cargando datos iniciales....`);
        loadDefaults()
        updateLocalStorage()
    }
}

// * iii. Función para actualizar datos en localStorage
export function updateLocalStorage() {
    for (const key in bd) {
        localStorage.setItem(key, JSON.stringify(bd[key]));
    }
    console.log("Estado guardado en localStorage.");
    console.table(bd)
}

// * iv. Lista de datos iniciales
function loadDefaults() {
    // usuario(s)
    bd.users.push({
        id: 1,
        fullName: "Manager P.S.",
        username: "manager",
        password: "password"
    })

    // producto(s)
    bd.products.push({
        id: 1,
        name: "Smart Watch",
        category: "Accesorios",
        price: 2499.99,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
    })
}