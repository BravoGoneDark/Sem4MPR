const driverData = {
    driver1: {
        name:  'Max Verstappen',
        color: '#ff0000',
        bio:   'Max Verstappen is the most dominant driver of his generation. The Dutch Red Bull ace became the youngest race winner in F1 history at the 2016 Spanish Grand Prix aged 18. He then delivered four consecutive World Championships from 2021–2024, including a record-breaking 19 wins in a single season in 2023. Widely regarded as one of the greatest drivers in the sport\'s history.',
        detail: 'Max Verstappen is the most complete racing driver of his generation and arguably the greatest of the modern era. Born in Belgium to former F1 driver Jos Verstappen, Max was destined for motorsport from birth, racing karts before graduating to single-seaters as a teenager. He made his F1 debut with Toro Rosso at just 17 years old, becoming the youngest driver ever to start a Grand Prix. Promoted to Red Bull mid-2016, he won on his very first race for the team — the Spanish Grand Prix — at 18, rewriting the record books immediately. After years of near-misses, Verstappen claimed the 2021 title in the most controversial finale in F1 history at Abu Dhabi, overtaking Lewis Hamilton on the final lap. He then dominated the sport completely: winning the championship with ease in 2022, breaking records with 19 wins from 22 races in 2023, and claiming a fourth consecutive crown in 2024. Only Lando Norris stopped a fifth in 2025.'
    },
    driver2: {
        name:  'George Russell',
        color: '#92ff00',
        bio:   'George Russell rose through the ranks via the Mercedes junior programme, spending three seasons putting Williams on his back before earning his factory seat in 2022. Known for his clinical qualifying pace and racecraft, Russell took his maiden win at the 2022 Brazilian Grand Prix. A consistent front-runner for Mercedes, he finished second in the 2025 Drivers\' Championship behind Lando Norris.',
        detail: 'George Russell is one of the most technically gifted drivers of his generation, combining exceptional one-lap pace with an analytical mind that has made him a favourite of engineers at every team he has driven for. A product of the Mercedes junior academy, Russell spent three seasons at Williams from 2019 to 2021, regularly outperforming the machinery and producing landmark results — most notably qualifying an astonishing second in wet conditions at the 2020 Sakhir Grand Prix before a pit stop error denied him a likely victory. Promoted to the Mercedes factory seat in 2022, Russell immediately delivered, winning the Brazilian Grand Prix in only his first season and proving he could match his illustrious teammate Lewis Hamilton. As Hamilton departed for Ferrari in 2025, Russell became the undisputed team leader, delivering consistently strong performances throughout the year and finishing second in the Drivers\' Championship — his best result to date — behind the dominant Lando Norris.'
    },
    driver3: {
        name:  'Lando Norris',
        color: '#ff0015',
        bio:   'Lando Norris claimed his maiden Formula 1 World Championship in 2025 after a dramatic title fight that went to the final race in Abu Dhabi. The British McLaren driver had long been regarded as one of the fastest on the grid, combining natural speed with fierce racecraft. His 2025 title ended McLaren\'s 27-year drought without a Drivers\' Championship and confirmed him among the sport\'s greats.',
        detail: 'Lando Norris is the 2025 Formula 1 World Champion and one of the most naturally gifted drivers the sport has produced in years. The Bristol-born Briton arrived in F1 with McLaren in 2019 aged just 19, immediately impressing with his raw speed and endearing personality. Years of strong performances without the machinery to challenge for victories slowly built his reputation, before McLaren\'s resurgence delivered him a genuine race-winning car. His first victory came at the 2024 Miami Grand Prix, and he followed it with multiple wins as McLaren swept to the 2024 Constructors\' title. The 2025 season was Norris at his absolute peak — trading wins and championship positions with Max Verstappen in a relentless battle that went to the final race in Abu Dhabi. Norris clinched the title by just two points, becoming World Champion for the first time and ending McLaren\'s 17-year wait for a Drivers\' crown. His 2025 triumph confirmed him as one of the defining drivers of his era.'
    },
    driver4: {
        name:  'Charles Leclerc',
        color: '#ff2800',
        bio:   'Charles Leclerc is Ferrari\'s lead driver and one of the most gifted qualifiers in modern Formula 1. The Monégasque driver burst onto the scene with back-to-back victories at Spa and Monza in 2019 and has been a consistent race winner since. Known for his exceptional one-lap pace and passionate racing style, Leclerc is widely regarded as a future World Champion driving for the most iconic team in the sport.',
        detail: 'Charles Leclerc is one of the most complete drivers on the Formula 1 grid and the man Ferrari have built their future around. Born in Monaco — the most glamorous address in motorsport — Leclerc lost his father and his mentor Jules Bianchi within years of reaching F1, channelling personal tragedy into fierce determination. After a standout debut season with Sauber in 2018, he was promoted to Ferrari and immediately delivered, winning back-to-back Grands Prix at Spa and Monza in 2019 — Monza coming in front of an emotional Tifosi crowd that will live long in memory. His 2022 season was arguably his finest: leading the championship for much of the year in a car capable of winning before reliability failures and strategic errors cost him the title. Famous for his extraordinary qualifying performances — producing laps that often exceed what the car theoretically should be capable of — Leclerc has won in Monaco, Bahrain, Austria, and multiple other venues, and remains the favourite to lead Ferrari back to championship glory.'
    },
    driver5: {
        name:  'Alexander Albon',
        color: '#00A3E0',
        bio:   'Alexander Albon is a Thai-British driver who has reinvented his career at Williams after a difficult stint as Red Bull\'s second driver in 2019–2020. Known for his smooth, tyre-friendly style and exceptional technical feedback, Albon became Williams\' talisman during their rebuilding years. His consistent points-scoring and two podiums in 2025 alongside Carlos Sainz marked Williams\' most competitive season in over a decade.',
        detail: 'Alexander Albon\'s Formula 1 career has been defined by remarkable resilience. The Thai-British driver rose through the Red Bull junior programme and was promoted to the senior team mid-2019 after Pierre Gasly\'s demotion, immediately impressing with his smooth, tyre-conserving style and natural overtaking ability. Despite regularly outperforming expectations, a lack of raw pace compared to Max Verstappen cost him his seat at the end of 2020 — a difficult pill given how competitive the car was. After a season as a Red Bull reserve, Albon joined Williams in 2022 and became the team\'s undisputed leader — frequently extracting results from a car that had no right to be in the points. His technical feedback and relentless professionalism transformed Williams\' development trajectory. The arrival of Carlos Sainz for 2025 formed one of the most respected driver pairings in the midfield, with Albon delivering podium finishes in a season that marked Williams\' genuine return to the upper midfield and beyond.'
    },
    driver6: {
        name:  'Esteban Ocon',
        color: '#E8002D',
        bio:   'Esteban Ocon is a French driver best remembered for a stunning victory at the 2021 Hungarian Grand Prix — his and Alpine\'s maiden win. A product of the Mercedes junior academy, Ocon spent years proving his worth in the midfield with Force India, Renault and Alpine before joining Haas for 2025. Known for his determination, technical racecraft, and ability to execute strategy under pressure.',
        detail: 'Esteban Ocon\'s Formula 1 journey has been one of perseverance against considerable odds. A product of the Mercedes junior academy, the Frenchman broke into the sport with Manor and Force India before losing his seat at the end of 2018 — spending a year on the sidelines as a Mercedes reserve before Renault handed him a lifeline. His greatest moment came at the 2021 Hungarian Grand Prix, where he won in chaotic conditions to deliver Alpine their maiden victory — an emotional triumph that silenced those who had doubted his place at the top level. Years with Alpine followed before a move to Haas for 2025, reuniting him with a team fighting to establish themselves in the midfield. Known throughout the paddock for his fierce determination, meticulous race preparation, and ability to execute strategy under pressure, Ocon represents exactly the kind of experienced, technical racing driver that midfield teams need to extract maximum performance from machinery that rarely gives them an easy day.'
    },
    driver7: {
        name:  'Pierre Gasly',
        color: '#FF69B4',
        bio:   'Pierre Gasly is a French driver who overcame one of F1\'s most dramatic career reversals. Demoted from Red Bull mid-2019, he responded with a fairytale victory at Monza 2020 for AlphaTauri — one of the most emotional wins in recent memory. He joined Alpine in 2023 and has been their sole points scorer through difficult seasons, proving himself a resilient and quick presence on the grid.',
        detail: 'Pierre Gasly\'s career is one of the most compelling redemption stories in modern Formula 1. After rising through the Red Bull junior programme, Gasly was promoted to the senior team for 2019 — but struggled to match Verstappen\'s pace and was demoted back to Toro Rosso mid-season in one of the most public and painful driver changes in recent memory. What followed was extraordinary. Gasly responded not with defeat but with some of the finest drives of his career. His victory at the 2020 Italian Grand Prix at Monza — crossing the line in tears after a race of immense pressure — stands as one of the most emotional moments in F1\'s recent history. Consistent performances at AlphaTauri earned him a move to Alpine for 2023, where he became the team\'s cornerstone through increasingly difficult seasons. A racer of genuine talent, exceptional car control, and fierce competitive spirit, Gasly has proven repeatedly that his place in Formula 1 is fully deserved, regardless of the machinery beneath him.'
    },
    driver8: {
        name:  'Valtteri Bottas',
        color: '#b0b8c1',
        bio:   'Valtteri Bottas is a Finnish driver who spent five seasons as Lewis Hamilton\'s teammate at Mercedes, winning 10 races and contributing to four Constructors\' Championships. Known for his raw pace on Saturdays and tireless team performance, Bottas moved to Alfa Romeo — later Sauber — in 2022. A consistent and highly respected presence on the grid, he remains one of the fastest drivers never to have won a World Championship.',
        detail: 'Valtteri Bottas is one of the most respected and underappreciated drivers in Formula 1 history. The calm, determined Finn joined the sport with Williams in 2013 and quickly established himself as one of the smoothest and most consistent performers on the grid. His move to Mercedes in 2017 — replacing the retiring Nico Rosberg — placed him alongside the most dominant driver of the era in Lewis Hamilton, a comparison that would define his public narrative despite consistently strong performances. In five seasons at Mercedes, Bottas won 10 Grands Prix, scored countless podiums, and contributed directly to four Constructors\' Championship victories. His Saturday pace was frequently world-class — producing qualifying laps that often matched or exceeded Hamilton. Moving to Alfa Romeo in 2022, he became team leader once more, bringing vital technical experience to a team rebuilding its identity through the Sauber transition. An Olympic-level cyclist and intensely private individual, Bottas has always let his driving speak for itself.'
    },
    driver9: {
        name:  'Fernando Alonso',
        color: '#00594f',
        bio:   'Fernando Alonso is widely regarded as one of the greatest Formula 1 drivers of all time. The Spaniard won back-to-back World Championships with Renault in 2005 and 2006, becoming the youngest champion in history at the time. Known for his tactical brilliance, adaptability, and relentless racecraft, Alonso has competed across five different decades in F1, delivering podiums for Aston Martin well into his 40s.',
        detail: 'Fernando Alonso is the most complete racing driver Formula 1 has ever produced — a two-time World Champion whose career spans five decades and whose competitive intensity has never dimmed. The Spaniard from Oviedo burst onto the scene in 2003, and in 2005 became the youngest World Champion in history at 24 — a record that stood until Sebastian Vettel broke it in 2010. His back-to-back championships with Renault in 2005 and 2006, defeating Michael Schumacher\'s Ferrari, announced the arrival of a new era. What followed was a career defined as much by near-misses as victories — fighting McLaren machinery, uncompetitive Ferraris, and unreliable Hondas — yet Alonso consistently extracted performances that defied the hardware. His 2012 season in an uncompetitive Ferrari is widely regarded as the finest individual campaign in F1 history. Returning to the sport with Alpine and then Aston Martin in his 40s, Alonso delivered multiple podiums, proving he remained one of the fastest drivers on any grid in the world.'
    },
    driver10: {
        name:  'Nico Hülkenberg',
        color: '#bb0a1e',
        bio:   'Nico Hülkenberg is one of the most respected and experienced drivers in the Formula 1 paddock, holding the record for the most race starts without a podium finish. The German is renowned for his blistering qualifying pace and consistency across stints at Williams, Force India, Sauber, Renault and Haas. He joined the Audi works team for their 2026 debut, finally earning a factory drive befitting his talent.',
        detail: 'Nico Hülkenberg occupies a unique and bittersweet place in Formula 1 history — widely regarded as one of the most talented drivers of his generation, yet the holder of an unwanted record: the most race starts in F1 history without a podium finish. The German from Emmerich am Rhein was a dominant force in the junior categories, winning the GP2 championship in 2009, and made his F1 debut with Williams before establishing himself as a benchmark midfield performer across stints with Force India, Sauber, Renault and Haas. His one-lap pace has always been extraordinary — capable of regularly out-qualifying better-resourced teammates — and his racecraft is meticulous. Beyond F1, Hülkenberg demonstrated his versatility by winning the Le Mans 24 Hours outright on his debut in 2015 — one of motorsport\'s most demanding events. His move to the Audi works team for their 2026 Formula 1 debut represents a deserved recognition of his ability, finally giving him factory backing and the resources to compete at the very front of the grid.'
    }
};

function changeDriver(key) {
    key = String(key).toLowerCase();
    const data = driverData[key];
    if (!data) return;

    const bgImages = document.querySelectorAll('.drivers-bg-image-list img');
    bgImages.forEach(img => {
        img.classList.remove('active');
        if (img.classList.contains('bg-image-' + key)) {
            img.classList.add('active');
        }
    });

    const models = document.querySelectorAll('.driver-model');
    models.forEach(m => {
        m.classList.remove('active');
        if (m.classList.contains(key)) {
            m.classList.add('active');
        }
    });

    const p = document.getElementById('drivers-desc');
    if (p) p.textContent = data.bio;
}

// DRIVER 1 DEFAULT
document.addEventListener('DOMContentLoaded', function () {
    changeDriver('driver1');
});