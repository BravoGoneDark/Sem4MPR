/* ─── drivers.js ─────────────────────────────────────────────────────────────
   Works exactly like changeImage() in mainpage.js but scoped to the
   #drivers-banner section.
──────────────────────────────────────────────────────────────────────────── */

// ── Driver data — edit these ──────────────────────────────────────────────
const driverData = {
    driver1: {
        name:  'Max Verstappen',
        color: '#ff0000',
        bio:   'Max Verstappen is a Dutch Formula One racing driver who currently races for Red Bull Racing. He is a four-time Formula One World Champion, having won the championship in 2021, 2022, 2023 and 2024.'
    },
    driver2: {
        name:  'George Russell',
        color: '#92ff00',
        bio:   'George Russell is a British Formula One racing driver who currently races for Mercedes. He is known for his exceptional performance in the F2 and F3 series before joining Mercedes.'
    },
    driver3: {
        name:  'Lando Norris',
        color: '#ff0015',
        bio:   'Lando Norris is a British Formula One racing driver who currently races for McLaren. He is known for his aggressive driving style and has been a consistent performer in F1.'
    },
    driver4: {
        name:  'Charles Leclerc',
        color: '#ff2800',
        bio:   'Charles Leclerc is a Monégasque Formula 1 driver and the lead driver for Scuderia Ferrari. A pole position specialist and race winner, Leclerc is considered one of the sport\'s brightest talents.'
    },
    driver5: {
        name:  'Alexander Albon',
        color: '#00A3E0',
        bio:   'Alexander Albon is a Thai-British Formula One racing driver currently competing for Williams Racing. Known for his smooth driving style and technical feedback, Albon has been a key figure in Williams\' development.'
    },
    driver6: {
        name:  'Esteban Ocon',
        color: '#E8002D',
        bio:   'Esteban Ocon is a French Formula One racing driver competing for Haas F1 Team. A race winner at the 2021 Hungarian Grand Prix, Ocon is known for his determination and technical racecraft.'
    },
    driver7: {
        name:  'Pierre Gasly',
        color: '#FF69B4',
        bio:   'Pierre Gasly is a French Formula One racing driver competing for BWT Alpine F1 Team. A former race winner and one of France\'s most exciting F1 talents, Gasly is known for his speed and racecraft.'
    }
};


// ── changeDriver — mirrors changeImage() pattern exactly ──────────────────
function changeDriver(key) {
    key = String(key).toLowerCase();
    const data = driverData[key];
    if (!data) return;

    // 1. Swap background image (scoped to drivers banner)
    const bgImages = document.querySelectorAll('.drivers-bg-image-list img');
    bgImages.forEach(img => {
        img.classList.remove('active');
        if (img.classList.contains('bg-image-' + key)) {
            img.classList.add('active');
        }
    });

    // 2. Swap driver name heading
    const models = document.querySelectorAll('.driver-model');
    models.forEach(m => {
        m.classList.remove('active');
        if (m.classList.contains(key)) {
            m.classList.add('active');
        }
    });

    // 3. Update bio paragraph
    const p = document.getElementById('drivers-desc');
    if (p) p.textContent = data.bio;
}

// ── Set driver 1 as default on load ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    changeDriver('driver1');
});