/* ─── drivers.js ─────────────────────────────────────────────────────────────
   Works exactly like changeImage() in mainpage.js but scoped to the
   #drivers-banner section.

   HOW TO CUSTOMISE:
   • Add / rename keys to match your driver class names (driver1, driver2 …)
   • Fill in the `bios` strings with real driver descriptions
   • The `color` value controls the accent colour of that driver's h3 heading
──────────────────────────────────────────────────────────────────────────── */

// ── Driver data — edit these ──────────────────────────────────────────────
const driverData = {
    driver1: {
        name:  'Max Verstappen',
        color: '#ff0000',
        bio:   'Max Verstappen is a Dutch Formula One racing driver who currently races for Red Bull Racing. He is a two-time Formula One World Champion, having won the championship in 2021 and 2022.'
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