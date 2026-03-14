/* ─── circuits.js ────────────────────────────────────────────────────────────
   Works exactly like changeDriver() but scoped to #circuits-banner.

   HOW TO CUSTOMISE:
   • Update the keys to match your circuit class names (circuit1, circuit2 …)
   • Fill in the `name`, `color`, and `bio` for each circuit
   • Color controls the accent on the h3 heading for that circuit
──────────────────────────────────────────────────────────────────────────── */

const circuitData = {
    circuit1: {
        name:  'Grand Prix de Monaco',
        color: '#ff0000',
        bio:   'The Monaco Grand Prix is a prestigious Formula 1 race held annually on the streets of Monte Carlo. Known for its tight corners, elevation changes, and glamorous setting, it is one of the most iconic and challenging circuits in the F1 calendar.'
    },
    circuit2: {
        name:  'Belgian Grand Prix',
        color: 'darkgoldenrod',
        bio:   'The Belgian Grand Prix is held at the Circuit de Spa-Francorchamps, a legendary track in the Ardennes region of Belgium. Known for its long straights, fast corners, and challenging layout, it is one of the most demanding circuits on the F1 calendar.'
    },
    circuit3: {
        name:  'Italian Grand Prix',
        color: '#92ff00',
        bio:   'The Italian Grand Prix is held at Monza, a high-speed circuit known as the "Temple of Speed". The track features long straights and minimal cornering, making it one of the fastest circuits in Formula 1.'
    },
    circuit4: {
        name:  'British Grand Prix',
        color: '#00A3E0',
        bio:   'The British Grand Prix is held at Silverstone Circuit in Northamptonshire, the birthplace of Formula 1. Home to the very first World Championship race in 1950, Silverstone is known for its high-speed sweeping corners like Copse, Maggotts, and Becketts, beloved by drivers and fans alike.'
    },
    circuit5: {
        name:  'Japanese Grand Prix',
        color: '#ff0000',
        bio:   'The Japanese Grand Prix takes place at the legendary Suzuka Circuit, one of the few figure-of-eight tracks in motorsport. Built in 1962, Suzuka is renowned for its technical complexity, including the iconic 130R corner and the Esses section, and has been the scene of many iconic F1 championship deciders.'
    },
    circuit6: {
        name:  'Australian Grand Prix',
        color: '#00843D',
        bio:   'The Australian Grand Prix is held on the street circuit around Albert Park Lake in Melbourne, traditionally opening the Formula 1 season. The semi-permanent circuit is known for its smooth surface, fast flowing layout, and the electric atmosphere of 100,000+ fans welcoming F1 back each year.'
    },
    circuit7: {
        name:  'Abu Dhabi Grand Prix',
        color: '#c0a060',
        bio:   'The Abu Dhabi Grand Prix takes place at the Yas Marina Circuit on Yas Island, traditionally closing the Formula 1 season. The floodlit twilight race is known for its mix of high-speed straights, technical chicanes, and the spectacular setting around the Yas Marina, having hosted multiple championship-deciding finales.'
    }
};


function changeCircuit(key) {
    key = String(key).toLowerCase();
    const data = circuitData[key];
    if (!data) return;

    // 1. Swap background image (scoped to circuits banner only)
    const bgImages = document.querySelectorAll('.circuits-bg-image-list img');
    bgImages.forEach(img => {
        img.classList.remove('active');
        if (img.classList.contains('bg-image-' + key)) {
            img.classList.add('active');
        }
    });

    // 2. Swap circuit name heading
    const models = document.querySelectorAll('.circuit-model');
    models.forEach(m => {
        m.classList.remove('active');
        if (m.classList.contains(key)) {
            m.classList.add('active');
        }
    });

    // 3. Update description paragraph
    const p = document.getElementById('circuits-desc');
    if (p) p.textContent = data.bio;
}

// Set circuit1 as default on load
document.addEventListener('DOMContentLoaded', function () {
    changeCircuit('circuit1');
});