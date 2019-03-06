

function visualizePacket(packet) {
    const {
        country,
        email,
        first,
        last,
        password,
        username,
    } = packet;
    const output = `
        <br>
        <p><b>Form submit captured</b></p>
        <ul style="list-style-type:none;">
            <li>Country: ${country}</li>
            <li>First Name: ${first}</li>
            <li>Last Name: ${last}</li>
            <li>Display Name: ${username}</li>
            <li>Email: ${email}</li>
            <li>Password: ${password}</li>
        </ul>
        <br>
    `;

    document.querySelector('#showResult').innerHTML += output;
}

var ws = new WebSocket(`ws://${window.location.host}/websocket`);
ws.onopen = function() {
    console.log("ws open")
    ws.onmessage = function (event) {
        var received_msg = event.data;
        visualizePacket(JSON.parse(received_msg))
    };
};

