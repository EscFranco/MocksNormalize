let socket = io.connect();

socket.on('mensaje', function (data) {
    const author = new normalizr.schema.Entity(
        'authors',
        {},
        { idAttribute: 'id' }
    );

    const mensaje = new normalizr.schema.Entity(
        'mensaje',
        {
            author: author,
        },
        { idAttribute: 'hora' }
    );

    const mensajes = new normalizr.schema.Entity(
        'mensajes',
        {
            mensajes: [mensaje],
        },
        { idAttribute: 'id' }
    )

    const denormalizedData = normalizr.denormalize(
        data.result,
        mensajes,
        data.entities
    );

    const porcentajeDeCompresion =
        (JSON.stringify(data).length * 100) /
        JSON.stringify(denormalizedData).length;

    console.log(`Esta es la data normalizada ${JSON.stringify(data).length}`)
    console.log(`Esta es la data desnormalizada ${JSON.stringify(denormalizedData).length}`)

    document.getElementById('porcentaje').innerHTML = `El porcentaje de comprension es ${porcentajeDeCompresion}`

    chatRender(denormalizedData)
});

const getItems = () => {
    fetch("http://localhost:8080/api/productos-test", {
        method: "GET"
    })
        .then((res) => res.json())
        .then(json => render(json))
}

const render = (data) => {
    let html = data.map(function (elem, index) {
        return (`<tr>
                    <td class="align-middle">${elem.producto}</td>
                    <td class="align-middle">$${elem.precio}</td>
                    <td class="align-middle"><img src=${elem.imagen} alt="imagen del producto" style="width: 100px" /></td>
                </tr>`)
    }).join(" ");
    document.getElementById('tabla').innerHTML = html;
}

getItems()

const getUser = () => {
    fetch("http://localhost:8080/username", {
        method: "GET"
    })
        .then((res) => res.json())
        .then(json => userRender(json))
}

const userRender = (data) => {
    let html = data
    document.getElementById('welcome').innerHTML = html;
}

getUser()

const chatRender = (data) => {
    let html = data.mensajes.map(function (elem) {
        return (`<div>
            <strong style="color: blue">${elem.author.id} - <span style="color: brown">${elem.hora}</span></strong>: 
            <em style="color: green">${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('chat').innerHTML = html;
}

const addMessage = (event) => {

    event.preventDefault();

    let mensaje = {
        author: {
            id: event.target.email.value,
            nombre: event.target.nombre.value,
            apellido: event.target.apellido.value,
            alias: event.target.alias.value,
            edad: event.target.edad.value,
        },
        text: event.target.texto.value,
        hora: new Date().toLocaleString('es-AR')
    };

    socket.emit('new-message', mensaje); // new-message es el nombre del evento (recordatorio)

    document.getElementById('texto').value = ''
    document.getElementById('texto').focus()
}

const logout = () => {
    fetch("http://localhost:8080/logout", {
        method: "GET"
    })
        .then((res) => res.json())
        .then (json => (
            document.getElementById('welcome').innerHTML = json,
            document.getElementById('main').style.display = 'none',
            document.getElementById('logout').style.display = 'none'
            )
        )
        .then( setTimeout(function(){
            
            window.location.reload();
        }, 2000))
}
