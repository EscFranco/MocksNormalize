let listaCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalCompra = 0

const precioFinal = () => {
    let sumall = 0
    listaCarrito.forEach((valor) => {
        sumall = sumall + (valor.precio * valor.cantidad)
    })

    totalCompra = sumall
    document.getElementById('subtotal').innerHTML = `$${sumall}`;
}

const vaciarCarrito = () => {

    if (listaCarrito.length > 0) {
        listaCarrito = []
        localStorage.removeItem('carrito');

        document.getElementById('subtotal').innerHTML = `$0`
        listarCarrito()
    } else {
        alert("El carrito ya esta vacio")
    }

}

const listarCarrito = () => {
    let divCarrito = document.getElementById("tablaCarrito")
    let titCarrito = document.getElementById("titleCarrito")
    if (listaCarrito.length == 0) {
        divCarrito.style.display = "none"
        titCarrito.style.display = "block"
    } else {
        titCarrito.style.display = "none"
        let html = listaCarrito.map(function (elem, index) {
            return (`<tr>
                        <td class="align-middle">${elem.gusto}</td>
                        <td class="align-middle">${elem.cantidad}</td>
                        <td class="align-middle">$${elem.precio}</td>
                        <td> <button type="button" class="btn btn-danger" onclick="deleteFromCart(${elem.id})"">Borrar</button> </td>                    
                    </tr>`)
        }).join(" ");
        document.getElementById('listado').innerHTML = html;
    }
}

const deleteFromCart = (id) => {

    let index = listaCarrito.findIndex(borrar => borrar.id == id);
    listaCarrito.splice(index, 1);
    listarCarrito();
    precioFinal()
    localStorage.setItem("carrito", JSON.stringify(listaCarrito))
}


const finalizarPedido = async () => {

    let usuario = {}
    const response = await fetch(`https://coderbackend-31020.herokuapp.com/username`);
    const json = await response.json();

    usuario = json

    const date = new Date().toLocaleString()

    const ordenFinal = {
        carrito: listaCarrito,
        usuario: usuario,
        precioTotal : totalCompra,
        date: date
    }
    fetch("https://coderbackend-31020.herokuapp.com/compraFinal", {
        method: "POST",
        body: JSON.stringify(ordenFinal),
        headers: {
            'Content-Type': 'application/json'
        },        
    })

    .then((res) => res.json())
    .then((res => ticketID(res)))

}

const ticketID = (data) => {

    const mensaje = data.message

    localStorage.removeItem('carrito')
    let divCarrito = document.getElementById("tablaCarrito")
    divCarrito.style.display = "none"
    document.getElementById('ticketID').innerHTML = mensaje

}

precioFinal()
listarCarrito()
