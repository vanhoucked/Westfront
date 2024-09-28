// Lijst van IP-adressen van de computers
const computers = [
    { name: "Computer 1", ip: "http://127.0.0.1:5000", mac: "00:1A:2B:3C:4D:5E" },
    { name: "Computer 2", ip: "http://192.168.1.102:5000", mac: "00:1A:2B:3C:4D:5E" },
    { name: "Computer 3", ip: "http://192.168.1.103:5000", mac: "00:1A:2B:3C:4D:5E" }
];

const token = "jouw_harde_gecodeerde_token"; // Vervang dit door de token die je wilt gebruiken

// Dynamisch knoppen genereren voor elke computer
const computersListDiv = document.getElementById('computers-list');

computers.forEach(computer => {
    const div = document.createElement('div');
    div.className = 'computer';
    div.innerHTML = `
        <h2>${computer.name}</h2>
        <div class="button-container">
            <button onclick="shutdownComputer('${computer.ip}/shutdown')">Afsluiten</button>
            <button onclick="rebootComputer('${computer.ip}/reboot')">Herstarten</button>
            <button onclick="wakeComputer('${computer.mac}')">Opstarten</button>
        </div>
        <div class="status-container">
            <span class="status-label">Aan/Uit Status:</span>
            <span id="${computer.name}-status" class="status offline"></span>
            <span class="status-label">Software Status:</span>
            <span id="${computer.name}-8080-status" class="status offline"></span>
        </div>
    `;
    computersListDiv.appendChild(div);
});

// Functie om een enkele computer af te sluiten
function shutdownComputer(url) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Voeg de token toe aan de Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Computer is shutting down.');
        } else {
            alert('Failed to shutdown the computer.');
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

// Functie om een enkele computer opnieuw op te starten
function rebootComputer(url) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Voeg de token toe aan de Authorization header
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Computer is rebooting.');
        } else {
            alert('Failed to reboot the computer.');
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

// Functie om alle computers af te sluiten
function shutdownAllComputers() {
    computers.forEach(computer => {
        fetch(`${computer.ip}/shutdown`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Voeg de token toe aan de Authorization header
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                alert(`Failed to shutdown ${computer.name}`);
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
    });

    alert('Shutting down all computers.');
}

// Functie om alle computers opnieuw op te starten
function rebootAllComputers() {
    computers.forEach(computer => {
        fetch(`${computer.ip}/reboot`, {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                alert(`Failed to reboot ${computer.name}`);
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
    });

    alert('Rebooting all computers.');
}

// Functie om de status van een computer te pingen
function pingComputer(computer) {
    fetch(`${computer.ip}/status`, {
        method: 'GET',
    })
    .then(response => {
        const statusElement = document.getElementById(`${computer.name}-status`);
        if (response.ok) {
            statusElement.classList.remove('offline');
            statusElement.classList.add('online');
        } else {
            statusElement.classList.remove('online');
            statusElement.classList.add('offline');
        }
    })
    .catch(() => {
        const statusElement = document.getElementById(`${computer.name}-status`);
        statusElement.classList.remove('online');
        statusElement.classList.add('offline');
    });

    checkPort8080(computer);
}

function checkPort8080(computer) {
    fetch(`${computer.ip}/check_port_8080`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Voeg de token toe aan de Authorization header
        }
    })
    .then(response => response.json())
    .then(data => {
        const portStatusElement = document.getElementById(`${computer.name}-8080-status`);
        if (data.status === 'running') {
            portStatusElement.classList.remove('offline');
            portStatusElement.classList.add('online');
        } else {
            portStatusElement.classList.remove('online');
            portStatusElement.classList.add('offline');
        }
    })
    .catch(() => {
        const portStatusElement = document.getElementById(`${computer.name}-8080-status`);
        portStatusElement.classList.remove('online');
        portStatusElement.classList.add('offline');
    });
}

function wakeComputer(mac) {
    fetch(`${computers[0].ip}/wake`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mac_address: mac })
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

function wakeAllComputers() {
    computers.forEach(computer => {
        fetch(`${computers[0].ip}/wake`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mac_address: computer.mac }) // Verstuur het MAC-adres van elke computer
        })
        .then(response => {
            if (response.ok) {
                console.log(`Wake-on-LAN signal sent to ${computer.name} (${computer.mac})`);
            } else {
                console.error(`Failed to send Wake-on-LAN signal to ${computer.name} (${computer.mac})`);
            }
        })
        .catch(error => {
            console.error(`Error sending Wake-on-LAN signal to ${computer.name}:`, error);
        });
    });

    alert('Wake-on-LAN signals have been sent to all computers.');
}

// Pingen van computers elke 5 seconden
setInterval(() => {
    computers.forEach(computer => {
        pingComputer(computer);
    });
}, 30000);