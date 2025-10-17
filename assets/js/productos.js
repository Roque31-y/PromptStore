// Importar la base de datos
import { bd, updateLocalStorage } from './database.js';

// Elementos del DOM
const contenedorProductos = document.getElementById('contenedorProductos');
const inputBusqueda = document.getElementById('inputBusqueda');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');
const btnFiltrar = document.getElementById('btnFiltrar');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

// Variable para guardar todos los productos
let todosLosProductos = [];

// Función para cargar y mostrar todos los productos
function cargarProductos() {
    todosLosProductos = bd.products;
    mostrarProductos(todosLosProductos);
}

// Función para mostrar productos en el HTML
function mostrarProductos(productos) {
    contenedorProductos.innerHTML = '';

    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<div class="col-12"><p class="text-center text-muted">No hay productos disponibles</p></div>';
        return;
    }

    productos.forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        contenedorProductos.innerHTML += tarjetaProducto;
    });

    // Agregar eventos a los botones después de crear las cards
    agregarEventos();
}

// Función para crear el HTML de una card de producto
function crearTarjetaProducto(producto) {
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm">
                <img src="${producto.imageUrl || 'https://via.placeholder.com/280x200/6f42c1/ffffff?text=Sin+Imagen'}" 
                     class="card-img-top" 
                     alt="${producto.name}" 
                     style="object-fit: cover; height: 200px;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.name}</h5>
                    <span class="badge bg-secondary rounded-pill mb-2 align-self-start">${producto.category}</span>
                    <p class="card-text text-muted fw-bold fs-5">$${producto.price.toFixed(2)} MXN</p>
                    <p class="card-text text-muted small">Stock: ${producto.stock} unidades</p>
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-primary btn-sm flex-fill btn-agregar-carrito" data-id="${producto.id}" style="background-color: #6f42c1; border-color: #6f42c1;">
                            <i class="bi bi-cart-plus"></i>
                            Añadir
                        </button>
                        <button class="btn btn-outline-secondary btn-sm btn-editar" data-id="${producto.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para agregar eventos a los botones de las cards
function agregarEventos() {
    // Botones de añadir al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            const idProducto = parseInt(btn.getAttribute('data-id'));
            agregarAlCarrito(idProducto);
        });
    });

    // Botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
            const idProducto = parseInt(btn.getAttribute('data-id'));
            editarProducto(idProducto);
        });
    });

    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const idProducto = parseInt(btn.getAttribute('data-id'));
            eliminarProducto(idProducto);
        });
    });
}

// Función para buscar productos
function buscarProductos() {
    const terminoBusqueda = inputBusqueda.value.toLowerCase();
    const productosFiltrados = todosLosProductos.filter(producto => 
        producto.name.toLowerCase().includes(terminoBusqueda) ||
        producto.category.toLowerCase().includes(terminoBusqueda)
    );
    mostrarProductos(productosFiltrados);
}

// Función para filtrar/ordenar productos
function filtrarProductos() {
    Swal.fire({
        title: 'Ordenar Productos',
        text: 'Selecciona cómo deseas ordenar los productos',
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Por Precio (Mayor a Menor)',
        denyButtonText: 'Por Stock (Mayor a Menor)',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#6f42c1',
        denyButtonColor: '#059669',
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            // Ordenar por precio de mayor a menor
            const productosOrdenados = [...todosLosProductos].sort((a, b) => b.price - a.price);
            mostrarProductos(productosOrdenados);
            Swal.fire({
                icon: 'success',
                title: 'Ordenado por Precio',
                text: 'Productos ordenados de mayor a menor precio',
                timer: 1500,
                showConfirmButton: false
            });
        } else if (resultado.isDenied) {
            // Ordenar por stock de mayor a menor
            const productosOrdenados = [...todosLosProductos].sort((a, b) => b.stock - a.stock);
            mostrarProductos(productosOrdenados);
            Swal.fire({
                icon: 'success',
                title: 'Ordenado por Stock',
                text: 'Productos ordenados de mayor a menor stock',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

// Función para añadir producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = bd.products.find(p => p.id === idProducto);
    
    if (!producto) {
        Swal.fire('Error', 'Producto no encontrado', 'error');
        return;
    }

    if (producto.stock <= 0) {
        Swal.fire('Sin stock', 'Este producto no está disponible', 'warning');
        return;
    }

    // Buscar si el producto ya está en el carrito
    let itemCarrito = bd.carts.find(item => item.productId === idProducto);

    if (itemCarrito) {
        itemCarrito.quantity += 1;
    } else {
        bd.carts.push({
            id: bd.carts.length,
            productId: idProducto,
            quantity: 1
        });
    }

    updateLocalStorage();
    Swal.fire({
        icon: 'success',
        title: 'Añadido al carrito',
        text: `${producto.name} agregado exitosamente`,
        timer: 1500,
        showConfirmButton: false
    });
}

// Función para editar producto
function editarProducto(idProducto) {
    const producto = bd.products.find(p => p.id === idProducto);
    
    if (!producto) return;

    Swal.fire({
        title: 'Editar Producto',
        html: `
            <input id="editar-nombre" class="swal2-input" placeholder="Nombre" value="${producto.name}">
            <input id="editar-categoria" class="swal2-input" placeholder="Categoría" value="${producto.category}">
            <input id="editar-precio" class="swal2-input" type="number" placeholder="Precio" value="${producto.price}">
            <input id="editar-stock" class="swal2-input" type="number" placeholder="Stock" value="${producto.stock}">
            <input id="editar-imagen" class="swal2-input" placeholder="URL de imagen" value="${producto.imageUrl}">
        `,
        confirmButtonText: 'Guardar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                name: document.getElementById('editar-nombre').value,
                category: document.getElementById('editar-categoria').value,
                price: parseFloat(document.getElementById('editar-precio').value),
                stock: parseInt(document.getElementById('editar-stock').value),
                imageUrl: document.getElementById('editar-imagen').value
            };
        }
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            producto.name = resultado.value.name;
            producto.category = resultado.value.category;
            producto.price = resultado.value.price;
            producto.stock = resultado.value.stock;
            producto.imageUrl = resultado.value.imageUrl;
            
            updateLocalStorage();
            cargarProductos();
            Swal.fire('Actualizado', 'Producto actualizado exitosamente', 'success');
        }
    });
}

// Función para eliminar producto
function eliminarProducto(idProducto) {
    const producto = bd.products.find(p => p.id === idProducto);
    
    if (!producto) return;

    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar "${producto.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const indice = bd.products.findIndex(p => p.id === idProducto);
            bd.products.splice(indice, 1);
            
            updateLocalStorage();
            cargarProductos();
            Swal.fire('Eliminado', 'Producto eliminado exitosamente', 'success');
        }
    });
}

// Función para agregar nuevo producto
function agregarNuevoProducto() {
    Swal.fire({
        title: 'Nuevo Producto',
        html: `
            <input id="nuevo-nombre" class="swal2-input" placeholder="Nombre del producto">
            <input id="nuevo-categoria" class="swal2-input" placeholder="Categoría">
            <input id="nuevo-precio" class="swal2-input" type="number" placeholder="Precio" step="0.01">
            <input id="nuevo-stock" class="swal2-input" type="number" placeholder="Stock">
            <input id="nuevo-imagen" class="swal2-input" placeholder="URL de imagen">
        `,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('nuevo-nombre').value;
            const categoria = document.getElementById('nuevo-categoria').value;
            const precio = parseFloat(document.getElementById('nuevo-precio').value);
            const stock = parseInt(document.getElementById('nuevo-stock').value);
            const imagen = document.getElementById('nuevo-imagen').value;

            if (!nombre || !categoria || !precio || !stock) {
                Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
                return false;
            }

            return { nombre, categoria, precio, stock, imagen };
        }
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            const nuevoId = bd.products.length > 0 ? Math.max(...bd.products.map(p => p.id)) + 1 : 0;
            
            bd.products.push({
                id: nuevoId,
                name: resultado.value.nombre,
                category: resultado.value.categoria,
                price: resultado.value.precio,
                stock: resultado.value.stock,
                imageUrl: resultado.value.imagen || 'https://via.placeholder.com/280x200/6f42c1/ffffff?text=Sin+Imagen'
            });

            updateLocalStorage();
            cargarProductos();
            Swal.fire('Creado', 'Producto agregado exitosamente', 'success');
        }
    });
}

// Función para cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar Sesión?',
        text: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            // Borrar el usuario activo
            bd.currentUser = null;
            updateLocalStorage();
            
            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Hasta pronto!',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Redirigir al index después de cerrar sesión
                window.location.href = 'index.html';
            });
        }
    });
}

// Event Listeners
inputBusqueda.addEventListener('input', buscarProductos);
btnAgregarProducto.addEventListener('click', agregarNuevoProducto);
btnFiltrar.addEventListener('click', filtrarProductos);
btnCerrarSesion.addEventListener('click', cerrarSesion);

// Cargar productos al iniciar
cargarProductos();
