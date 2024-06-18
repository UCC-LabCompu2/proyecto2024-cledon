let music = new Audio('Tetrismusic.mp3');
music.loop = true;
let isMusicPlaying = true; // Asumiendo que se iniciara la musica por defecto
let volumeLevel = parseFloat(localStorage.getItem('volumeLevel')) || 0.5; // Parsear el volumen como numero decimal
music.volume = volumeLevel;

/**
 * Guarda el nivel actual del volumen en el almacenamiento local.
 * @function saveVolumeToLocalStorage
 */

function saveVolumeToLocalStorage() {
    localStorage.setItem('volumeLevel', music.volume.toString()); // Guardar el volumen como cadena
}

document.getElementById('volume').addEventListener('input', (event) => {
    music.volume = event.target.value / 100;
    document.getElementById('volume-value').textContent = event.target.value;
    saveVolumeToLocalStorage();
});

document.getElementById('toggle-button').checked = isMusicPlaying;
document.getElementById('toggle-button').addEventListener('change', (event) => {
    isMusicPlaying = event.target.checked;
    if (isMusicPlaying) {
        music.play();
    } else {
        music.pause();
    }
    saveMusicStateToLocalStorage();
});

/**
 * Guarda el estado actual de reproducción de la música en el almacenamiento local.
 * @function saveMusicStateToLocalStorage
 */

function saveMusicStateToLocalStorage() {
    localStorage.setItem('isMusicPlaying', isMusicPlaying.toString()); // Guardar el estado como cadena
}

window.addEventListener('load', () => {
    // Recuperar y aplicar la configuracion guardada
    music.volume = parseFloat(localStorage.getItem('volumeLevel')) || 0.5; // Parsear el volumen como numero decimal
    document.getElementById('volume').value = music.volume * 100;
    document.getElementById('volume-value').textContent = music.volume * 100;
    isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';
    document.getElementById('toggle-button').checked = isMusicPlaying;
});
document.getElementById('difficulty').addEventListener('change', (event) => {
    const difficulty = event.target.value;
    switch (difficulty) {
        case 'easy':
            velocidadCaida = 800; // Ajuste 'easy'
            break;
        case 'medium':
            velocidadCaida = 500; // Ajuste 'medium'
            break;
        case 'hard':
            velocidadCaida = 300; // Ajuste 'hard'
            break;
        case 'professional':
            velocidadCaida = 100; // Ajuste 'professional'
            break;
        default:
            velocidadCaida = 500; // Velocidad predeterminada para casos no especificados
            break;
    }
});
