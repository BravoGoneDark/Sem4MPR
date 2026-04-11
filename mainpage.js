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

    document.querySelector('.menu').classList.remove('active');
    document.querySelector('.nav').classList.remove('active');

    const top = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({ top, behavior: 'smooth' });

    return false;
}

        // Update paragraph text for the selected team
const paragraphs = {
    redbull: {
        bio:    'Founded in 2005 from the Jaguar Racing entry, Red Bull rose to dominance through Adrian Newey\'s engineering brilliance. Sebastian Vettel delivered four consecutive championship doubles from 2010–2013, before Max Verstappen revived the dynasty with four straight Drivers\' titles from 2021–2024. One of the most successful teams in modern F1 history, Red Bull holds 6 Constructors\' Championships and 8 Drivers\' titles.',
        detail: 'Oracle Red Bull Racing was born in 2005 when energy drink giant Red Bull purchased the struggling Jaguar Racing entry for a symbolic $1, installing the then-unknown Christian Horner as team principal. Early years were modest, but the arrival of Adrian Newey — widely regarded as the greatest aerodynamicist in motorsport history — changed everything. Sebastian Vettel delivered four consecutive Drivers\' and Constructors\' Championship doubles from 2010 to 2013, with the 2011 and 2013 seasons representing near-total domination of the sport. A difficult hybrid transition followed before Max Verstappen, promoted from Toro Rosso in 2016 at just 18, won his debut race and began reshaping the team\'s identity. After years of near-misses, Verstappen claimed the 2021 title in the most controversial finale in F1 history, then went on to win four consecutive championships through 2024. The 2023 season saw Verstappen win a staggering 19 of 22 races — a record that may never be broken. Red Bull holds 6 Constructors\' and 8 Drivers\' Championships.'
    },
    mercedes: {
        bio:    'Tracing roots through Tyrrell, BAR, Honda and Brawn GP, Mercedes became the Silver Arrows in 2010 and immediately rewrote the record books. Eight consecutive Constructors\' titles from 2014–2021, powered by Lewis Hamilton\'s seven world championships and Nico Rosberg\'s 2016 crown, represent the most dominant era in F1 history. They hold 8 Constructors\' Championships.',
        detail: 'Mercedes-AMG Petronas F1 Team carries one of the most complex lineages in motorsport, tracing through Tyrrell, British American Racing, Honda, and the legendary Brawn GP — which won the 2009 championship in its only season of existence before being purchased by Mercedes. From 2010, the Silver Arrows steadily built towards dominance, unleashing an unprecedented era when the hybrid regulations arrived in 2014. What followed was eight consecutive Constructors\' Championships — a record that may stand forever. Lewis Hamilton anchored the dynasty, claiming six of his seven world titles with the team and becoming the most decorated driver in F1 history. Nico Rosberg claimed the 2016 crown before his shock retirement. The team\'s technical infrastructure in Brackley and Brixworth became the benchmark for the sport. George Russell and Kimi Antonelli now carry the Silver Arrows forward into a new regulatory era, with Mercedes hungry to reclaim their position at the summit of Formula 1.'
    },
    mclaren: {
        bio:    'Founded by Bruce McLaren in 1963, McLaren\'s golden era saw Senna and Prost win four consecutive Constructors\' titles from 1988–1991. Häkkinen added back-to-back crowns in 1998–99, and Hamilton claimed his maiden title in 2008. After a long drought, McLaren returned to the summit with back-to-back Constructors\' Championships in 2024 and 2025, Norris claiming his first Drivers\' title. They hold 10 Constructors\' titles.',
        detail: 'McLaren is one of the most storied and beloved constructors in Formula 1 history, founded in 1963 by New Zealander Bruce McLaren, who tragically died testing a Can-Am car at Goodwood in 1970. The team\'s first golden era arrived in the turbo age with Niki Lauda winning in 1984, before Alain Prost and Ayrton Senna turned the team into a dominant force from 1988 to 1991 — winning four consecutive Constructors\' titles in a rivalry that captivated the world. Mika Häkkinen delivered back-to-back Drivers\' crowns in 1998 and 1999, and Lewis Hamilton won his maiden title in 2008. A long and painful drought followed, but McLaren rebuilt methodically with Lando Norris and Oscar Piastri. Their 2024 Constructors\' title ended a 26-year wait, and a dominant 2025 season with Norris claiming his first Drivers\' Championship sealed back-to-back titles for the first time since 1991. McLaren now holds 10 Constructors\' Championships.'
    },
    ferrari: {
        bio:    'The oldest and most successful constructor in F1 history, Ferrari has competed since 1950 and holds a record 16 Constructors\' Championships. Schumacher\'s five consecutive titles from 2000–2004 defined their peak dominance. Lauda, Prost, Scheckter, and Räikkönen have all won in red. With over 240 race victories and Lewis Hamilton joining for 2025, the Scuderia remains the most iconic name in motorsport.',
        detail: 'Scuderia Ferrari is the soul of Formula 1. Founded by Enzo Ferrari and the only constructor to have competed in every season since the World Championship began in 1950, the Prancing Horse carries a weight of history no other team can match. Their record 16 Constructors\' Championships span seven decades, from the early dominance of Alberto Ascari to the Michael Schumacher era — five consecutive titles from 2000 to 2004 representing the most sustained period of Ferrari dominance in the sport\'s history. Niki Lauda\'s 1975 and 1977 championships, Jody Scheckter\'s 1979 crown, Alain Prost\'s 1990 title and Kimi Räikkönen\'s dramatic 2007 championship all belong to Ferrari\'s extraordinary canon. With over 240 race victories — more than any other constructor — and an army of passionate Tifosi at every circuit, Ferrari transcends sport. Lewis Hamilton\'s arrival in 2025 representing one of the most anticipated partnerships in motorsport history.'
    },
    williams: {
        bio:    'Founded by Sir Frank Williams in 1977, Williams dominated the 1980s and 1990s with 9 Constructors\' Championships. Mansell, Piquet, Prost, Hill and Villeneuve all won Drivers\' titles with the team. The FW14B of 1992 is regarded as one of the greatest F1 cars ever built. After years in the midfield, Carlos Sainz and Alex Albon delivered podiums in 2025, signalling a strong revival.',
        detail: 'Williams Racing is the greatest privateer constructor in Formula 1 history, built from nothing by Sir Frank Williams — a man who nearly died in a road accident in 1986 yet continued to run his team from a wheelchair for decades. From their first championship in 1980 with Alan Jones, Williams became the dominant force of the late 1980s and 1990s, winning nine Constructors\' titles and producing cars driven by some of the greatest names in the sport. Nigel Mansell\'s 1992 season in the FW14B — widely regarded as one of the most technically advanced cars ever built — produced nine wins from the first ten races. Nelson Piquet, Alain Prost, Damon Hill and Jacques Villeneuve all became World Champions with the team. Ayrton Senna tragically lost his life in a Williams at Imola in 1994. After difficult years in the midfield, the team has rebuilt steadily, with Carlos Sainz and Alex Albon delivering podium finishes in 2025.'
    },
    haas: {
        bio:    'The only American-owned constructor on the grid, Haas made its debut in 2016 under Gene Haas and immediately impressed with a points finish on day one. Their best result remains fifth in the 2018 Constructors\' Championship. Grosjean and Magnussen were long-time cornerstones before Bearman and Ocon formed a new line-up for 2025, continuing the team\'s rise through the midfield.',
        detail: 'Haas F1 Team made its debut at the 2016 Australian Grand Prix and immediately stunned the paddock by scoring points on their very first race day — an almost unheard-of achievement for a new constructor. Founded by American machining entrepreneur Gene Haas and run by the colourful Guenther Steiner, the team operated on a unique model: manufacturing in the United States while using Ferrari power units and technical collaboration to accelerate development. Romain Grosjean and Kevin Magnussen formed one of F1\'s most combative driver pairings, and the team peaked with fifth in the 2018 Constructors\' Championship. A difficult period followed before a restructure brought renewed competitiveness. Oliver Bearman — who had already impressed with a shock points finish as a Ferrari stand-in in 2024 — stepped up to a full-time seat alongside Esteban Ocon for 2025, delivering consistent results. Haas remains the only constructor on the grid headquartered in the United States, carrying the flag for American motorsport.'
    },
    alpine: {
        bio:    'Alpine\'s lineage runs through Toleman, Benetton, Renault and Lotus. Benetton gave Schumacher his first two titles in 1994–95, and Renault dominated the mid-2000s with Alonso\'s back-to-back championships in 2005–06. Rebranded as Alpine in 2021, the team has claimed six podiums since. For 2026 they switched to Mercedes customer power, beginning a new chapter after Renault\'s exit as an engine supplier.',
        detail: 'The team currently known as Alpine carries perhaps the most complex identity in Formula 1, tracing its lineage through Toleman, Benetton, Renault, and Lotus across five decades of racing. Toleman brought Ayrton Senna to the sport in 1984. Benetton delivered Michael Schumacher\'s first two World Championships in 1994 and 1995, with controversial genius Flavio Briatore at the helm. Renault returned as a works team and produced one of F1\'s most celebrated eras — Fernando Alonso\'s back-to-back Drivers\' and Constructors\' Championships in 2005 and 2006. Rebranded as Lotus in 2012, the team produced brilliant flashes of pace before reverting to the Renault name and eventually becoming Alpine in 2021. Alonso returned to the team and delivered multiple podiums in 2023 before moving to Aston Martin. Despite a difficult 2025 season, Alpine enters 2026 with renewed ambition, switching to Mercedes customer power and restructuring around a younger driver lineup with fresh championship aspirations.'
    },
    cadillac: {
        bio:    'Cadillac made its Formula 1 debut in 2026 as the grid\'s eleventh constructor, backed by General Motors and TWG Global. With a base in Silverstone and facilities across the United States, the team runs Ferrari customer power with ambitions to develop their own engine by 2029. Their arrival brings a bold American identity to F1 at a time of unprecedented US fanbase growth.',
        detail: 'Cadillac F1 Team represents one of the most significant new entries in Formula 1 history, arriving on the grid in 2026 as the sport\'s eleventh constructor and the first American-built team to join since Haas in 2016. Backed by General Motors — one of the largest automotive manufacturers in the world — and TWG Global, the project received final FIA approval in early 2025 after a prolonged and high-profile lobbying effort. The team established a technical base in Silverstone alongside multiple facilities across the United States, reflecting their dual identity as both an American brand and a competitor in the global circus of Formula 1. Running Ferrari customer power units in their debut season, Cadillac has outlined ambitions to develop a fully proprietary power unit by 2029. Their entry coincides with Formula 1\'s explosive growth in the United States, driven by the Las Vegas and Miami Grands Prix and an entirely new generation of American fans drawn to the sport.'
    },
    astonmartin: {
        bio:    'Carrying a lineage through Jordan, Force India and Racing Point, Aston Martin returned to F1 in 2021 after a 61-year absence under Lawrence Stroll\'s ownership. Vettel drove for the team before retiring in 2022, with Alonso delivering multiple podiums from 2023. The signing of legendary designer Adrian Newey as technical lead in 2024 made Aston Martin one of the most anticipated forces of the 2026 era.',
        detail: 'Aston Martin Aramco F1 Team carries a rich lineage through Jordan Grand Prix — Eddie Jordan\'s beloved team that launched the careers of Michael Schumacher and Rubens Barrichello — through Midland, Spyker, Force India, and Racing Point. Lawrence Stroll\'s consortium purchased the team in 2020 and secured the Aston Martin name for 2021, marking the iconic British marque\'s return to Formula 1 after 61 years. Four-time World Champion Sebastian Vettel drove for the team in 2021 and 2022, bringing leadership and experience before his retirement. Fernando Alonso joined in 2023 and immediately delivered multiple podium finishes, injecting renewed excitement. The team\'s most seismic moment came in 2024 when Adrian Newey — the most celebrated car designer in F1 history, architect of Red Bull\'s dominance — signed as a shareholder and technical director. His presence transformed Aston Martin into one of the most anticipated forces of the 2026 regulatory reset, with genuine championship ambitions for the first time in the team\'s history.'
    },
    audi: {
        bio:    'Audi entered F1 in 2026 as a full works constructor, taking over the Sauber entry — a team with roots back to 1993 that also ran as BMW Sauber and Alfa Romeo over the decades. Developing their own power unit from the outset, Audi brings a motorsport legacy that includes 13 Le Mans victories. Nico Hülkenberg and rookie Gabriel Bortoleto lead their maiden season on the grid.',
        detail: 'Audi\'s arrival in Formula 1 in 2026 represents one of the most significant manufacturer entries the sport has seen in a generation. The German marque took over the Sauber entry — a Swiss constructor with roots stretching back to 1993 that also competed as BMW Sauber, winning the 2008 Canadian Grand Prix, and later as Alfa Romeo Racing. Audi\'s motorsport pedigree is extraordinary: 13 victories at the Le Mans 24 Hours, dominance of the World Endurance Championship, and a legacy of engineering excellence that spans multiple disciplines. Unlike most new entrants who rely on customer power, Audi committed from the outset to developing a fully proprietary power unit under the 2026 regulations — a statement of serious long-term intent. Nico Hülkenberg, one of the most experienced drivers on the grid, leads the team alongside Brazilian rookie Gabriel Bortoleto. With the full weight of the Volkswagen Group behind them, Audi\'s Formula 1 project carries enormous expectation and resource.'
    }
}; 

/* Image Change */

    function changeImage(name) {
        // Map the incoming name to the image class used in the HTML
        const map = {
            'redbull':  'bg-image-redbull',
            'mercedes': 'bg-image-mercedes',
            'mclaren':  'bg-image-mclaren',
            'ferrari':  'bg-image-ferrari',
            'williams': 'bg-image-williams',
            'haas':     'bg-image-haas',
            'alpine':   'bg-image-alpine',
            'cadillac':    'bg-image-cadillac',
            'astonmartin': 'bg-image-astonmartin',
            'audi':        'bg-image-audi'
        };

        const key = String(name).toLowerCase();
        const targetImgClass = map[key];

        // Switch background images
        // Switch background images — CHANGE THIS LINE:
        const bgImages = document.querySelectorAll('#constructors-banner .bg-image-list img');
        bgImages.forEach(img => {
            img.classList.remove('active');
            if (targetImgClass && img.classList.contains(targetImgClass)) {
                img.classList.add('active');
            }
        });

        // Switch the model headings
        const models = document.querySelectorAll('.model');
        models.forEach(m => {
            m.classList.remove('active');
            if (m.classList.contains(name)) {
                m.classList.add('active');
            }
        });
        const p = document.querySelector('#constructors-content p');
        if (p) p.textContent = paragraphs[key] ? paragraphs[key].bio : '';
    }

/* ── PADDOCK CARD EXPANSION ── */
(function() {
    function expandCard(id) {
        var grid = document.getElementById('cardsGrid');
        var target = document.getElementById('card-' + id);
        if (!target || target.classList.contains('active')) return;
        document.querySelectorAll('.p-card').forEach(function(c) {
            c.classList.remove('active');
        });
        grid.classList.add('has-active');
        target.classList.add('active');
        setTimeout(function() {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    }

    function collapseCards() {
        var grid = document.getElementById('cardsGrid');
        if (!grid) return;
        grid.classList.remove('has-active');
        document.querySelectorAll('.p-card').forEach(function(c) {
            c.classList.remove('active');
        });
    }

    // Wire up after DOM ready — bypasses Materialize event interference
    document.addEventListener('DOMContentLoaded', function() {

        // Card clicks
        ['pitwall', 'models', 'replay'].forEach(function(id) {
            var card = document.getElementById('card-' + id);
            if (!card) return;
            card.addEventListener('click', function(e) {
                // Don't expand if clicking the close button
                if (e.target.closest('.card-btn-close')) return;
                expandCard(id);
            });
        });

        // Close buttons
        document.querySelectorAll('.card-btn-close').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                collapseCards();
            });
        });

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') collapseCards();
        });
    });

    // expose collapseCards globally in case inline onclick still exists anywhere
    window.collapseCards = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        collapseCards();
    };
    window.expandCard = expandCard;
})();

/* ── INFO POPUP ── */
(function () {

    // Inject popup HTML once
    const overlay = document.createElement('div');
    overlay.className = 'info-overlay';
    // Add logo element to the injected HTML — replace the innerHTML line:
overlay.innerHTML = `
    <div class="info-popup" id="infoPopup">
        <button class="info-popup-close" id="infoPopupClose">✕ Close</button>
        <div class="info-popup-topright" id="infoPopupTopRight">
            <img class="info-popup-logo" id="infoPopupLogo" src="" alt="">
        </div>
        <div class="info-popup-section" id="infoPopupSection"></div>
        <div class="info-popup-title" id="infoPopupTitle"></div>
        <div class="info-popup-divider"></div>
        <div class="info-popup-text" id="infoPopupText"></div>
    </div>
`;
    document.body.appendChild(overlay);

    const popup     = document.getElementById('infoPopup');
    const labelEl   = document.getElementById('infoPopupLabel');
    const sectionEl = document.getElementById('infoPopupSection');
    const titleEl   = document.getElementById('infoPopupTitle');
    const textEl    = document.getElementById('infoPopupText');
    const closeBtn  = document.getElementById('infoPopupClose');

    let locked    = false;
    let hoverTimer = null;

    function openPopup(sectionName, itemName, bodyText, imgSrc) {
    sectionEl.textContent = sectionName;
    titleEl.textContent   = itemName;
    textEl.textContent    = bodyText;
    const logoEl = document.getElementById('infoPopupLogo');
    if (logoEl) {
        logoEl.src = imgSrc || '';
        logoEl.style.display = imgSrc ? 'block' : 'none';
    }
    overlay.classList.add('visible');
    locked = true;
}

    function closePopup() {
        overlay.classList.remove('visible');
        locked = false;
    }

    // Close button
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closePopup();
    });

    // Click outside popup closes it when locked
    overlay.addEventListener('click', function (e) {
        if (!popup.contains(e.target)) closePopup();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePopup();
    });

    /* ── Wire up each banner button ── */

    // Helper: get currently active text from a banner
    function getActive(selector) {
        const el = document.querySelector(selector + '.active');
        return el ? el.textContent.trim() : '';
    }

    // CONSTRUCTORS — "Enquire" button
    // CONSTRUCTORS — "Enquire" button
const constructorBtn = document.querySelector('#constructors-content a');
if (constructorBtn) {
    constructorBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const name = getActive('#constructors-content .model');
        const keyMap = {
            'redbull': 'redbull', 'mercedesamg': 'mercedes', 'mercedes': 'mercedes',
            'mclaren': 'mclaren', 'ferrari': 'ferrari', 'williams': 'williams',
            'haas': 'haas', 'alpine': 'alpine', 'cadillac': 'cadillac',
            'astonmartin': 'astonmartin', 'audi': 'audi'
        };
        const resolved = Object.keys(keyMap).find(k => name.toLowerCase().replace(/\s+/g,'').includes(k));
        const bio = resolved && typeof paragraphs !== 'undefined' ? paragraphs[keyMap[resolved]].detail : '';
        // get active bg image src for logo
        const activeImg = document.querySelector('#constructors-banner .bg-image-list img.active');
        openPopup('Constructor', name, bio, activeImg ? activeImg.src : '');
    });
}

// DRIVERS — "Profile" button
const driverBtn = document.querySelector('#drivers-content a');
if (driverBtn) {
    driverBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const name = getActive('#drivers-content .driver-model');
        const key  = Object.keys(driverData).find(k => driverData[k].name === name);
        const bio = key ? driverData[key].detail : '';
        const activeImg = document.querySelector('.drivers-bg-image-list img.active');
        openPopup('Driver', name, bio, activeImg ? activeImg.src : '');
    });
}

// CIRCUITS — "Explore" button
const circuitBtn = document.querySelector('#circuits-content a');
if (circuitBtn) {
    circuitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const name = getActive('#circuits-content .circuit-model');
        const key  = Object.keys(circuitData).find(k => circuitData[k].name === name);
        const bio = key ? circuitData[key].detail : '';
        const activeImg = document.querySelector('.circuits-bg-image-list img.active');
        openPopup('Circuit', name, bio, activeImg ? activeImg.src : '');
    });
}

})();