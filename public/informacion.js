

const renderProfile = async () => {

    const response = await fetch(`http://localhost:8080/username`);
    const json = await response.json();

    let html = (`
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src="https://i.pinimg.com/236x/e9/57/2a/e9572a70726980ed5445c02e1058760b.jpg" class="card-img" alt="">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${json.usuario}</h5>
                    <p class="card-text">Email: ${json.email}</p>
                    <p class="card-text">Direccion: ${json.direccion}</p>
                    <p class="card-text"><small class="text-muted">Telefono: ${json.phone}</small></p>
                </div>
            </div>
        </div>`);
    document.getElementById('userInformation').innerHTML = html;

}

renderProfile()

// --------------------- CHAT ------------------------ //

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

    chatRender(denormalizedData)
});

const chatRender = (data) => {
    let html = data.mensajes.map(function (elem) {
        return (`<div>
            <strong style="color: blue">${elem.author.id} - <span style="color: brown">${elem.hora}</span></strong>: 
            <em style="color: green">${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('chat').innerHTML = html;
}
