/* Menu Toggle */
    function menuToggle() {
        const menu = document.querySelector('.menu');
        const nav = document.querySelector('.nav');
        menu.classList.toggle('active');
        nav.classList.toggle('active');
    }

/* Smooth Scroll */
    function smoothScrollTo(id) {
        const target = document.getElementById(id);
        if (!target) return;

        // Close the nav after clicking
        document.querySelector('.menu').classList.remove('active');
        document.querySelector('.nav').classList.remove('active');

        // Offset by header height so content isn't hidden behind fixed header
        const headerHeight = document.querySelector('header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({ top, behavior: 'smooth' });

        return false;
    }

/* Image Change */

    function changeImage(name) {
        // Map the incoming name to the image class used in the HTML
        const map = {
            'redbull': 'bg-image-redbull',
            'mercedes': 'bg-image-mercedes',
            'mclaren': 'bg-image-mclaren',
            'ferrari': 'bg-image-ferrari'
        };

        const key = String(name).toLowerCase();
        const targetImgClass = map[key];

        // Switch background images
        const bgImages = document.querySelectorAll('.bg-image-list img');
        bgImages.forEach(img => {
            img.classList.remove('active');
            if (targetImgClass && img.classList.contains(targetImgClass)) {
                img.classList.add('active');
            }
        });

        // Switch the model headings (.model elements use class names like 'RedBull', 'Mercedes', 'McLaren')
        const models = document.querySelectorAll('.model');
        models.forEach(m => {
            m.classList.remove('active');
            if (m.classList.contains(name)) {
                m.classList.add('active');
            }
        });

        // Update paragraph text for the selected team (sample text)
        const paragraphs = {
            redbull: 'Red Bull Racing, officially Oracle Red Bull Racing, is a dominant F1 team based in Milton Keynes, UK. Founded in 2005, it has won multiple championships and is known for its innovative engineering and aggressive racing strategy.',
            mercedes: 'Mercedes-AMG Petronas F1 Team is a British motor racing team and constructor based in Brackley, UK. Known for technical excellence and multiple championship-winning seasons, it has been a major force in modern F1.',
            mclaren: 'McLaren F1 Team is a historic British racing team with a legacy of innovation and success. Founded in 1963, McLaren has produced multiple world champions and remains a core competitor in Formula 1.',
            ferrari: 'Scuderia Ferrari is the oldest and most successful team in Formula 1 history, founded in 1929 and based in Maranello, Italy. With over 200 race victories and 16 Constructors\' Championships, Ferrari is the most iconic name in motorsport.'
        };

        const p = document.querySelector('.content p');
        if (p) p.textContent = paragraphs[key] || '';
    }