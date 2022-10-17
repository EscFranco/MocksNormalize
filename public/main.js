// --------------------- PRODUCTOS ------------------------ //

let productos = []

const getItems = () => {
    // fetch("http://localhost:8080/api/productos-test", {
    fetch("https://coderbackend-31020.herokuapp.com/api/productos-test", {
        method: "GET"
    })
        .then((res) => res.json())
        .then(data => productos = data)
        .then(() => renderProductos())
}

const renderProductos = () => {
    let html = productos.map(function (elem, index) {
        return (`<tr>
                    <td class="align-middle">${elem.gusto}</td>
                    <td class="align-middle">$${elem.precio}</td>
                    <td class="align-middle"><img src=${elem.img} alt="imagen del producto" style="width: 100px" /></td>
                    <td> <button type="button" class="btn btn-success" onclick="addToCart(${elem.id})"">Pedir</button> </td>                    
                </tr>`)
    }).join(" ");
    document.getElementById('tabla').innerHTML = html;
}


getItems()

// --------------------- CARRITO ------------------------ //

let listaCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

const addToCart = (id) => {

    if (listaCarrito.some((item) => item.id === id)) {
    
        listaCarrito = listaCarrito.map ((item) => {
            let cantidad = item.cantidad
            cantidad++

        return {
            ...item,
            cantidad
        }
        })
        
    } else {
        const item = productos.find((product) => product.id === id)
        listaCarrito.push({
            ...item,
            cantidad : 1
        })
    }

    localStorage.setItem("carrito",JSON.stringify(listaCarrito))
}

// --------------------- USUARIO ------------------------ //

const getUser = () => {
    fetch("https://coderbackend-31020.herokuapp.com/username", {
    // fetch("https://coderbackend-31020.herokuapp.com/username", {
        method: "GET"
    })
        .then((res) => res.json())
        .then(json => userRender(json))
}

const userRender = (data) => {
    let html = data.usuario
    document.getElementById('welcome').innerHTML = `Bienvenido a la pagina ${html}`;
}

getUser()
