var socket = io();

socket.on('notify', function(data) {
    document.getElementById('personnes').innerText = data;
});


function go() {
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;

    const data = { nom, prenom };

    fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('personnes').innerText = JSON.stringify(data);
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
}

document.getElementById('goButton').addEventListener('click', go);
