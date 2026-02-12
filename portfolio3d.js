// --- Three.js Setup (Maintained from V2) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 100; }
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x667eea, transparent: true, opacity: 0.8 });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.TetrahedronGeometry(1),
    new THREE.OctahedronGeometry(1),
    new THREE.IcosahedronGeometry(1),
    new THREE.DodecahedronGeometry(1)
];
const material = new THREE.MeshBasicMaterial({ color: 0x667eea, wireframe: true, transparent: true, opacity: 0.3 });
const shapes = [];
const minDist = 3.5;
for (let i = 0; i < 20; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geometry, material);

    // Try to find a position that isn't too close to others
    let positionFound = false;
    let attempts = 0;
    while (!positionFound && attempts < 100) {
        mesh.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20 - 5
        );

        positionFound = true;
        for (const other of shapes) {
            if (mesh.position.distanceTo(other.position) < minDist) {
                positionFound = false;
                break;
            }
        }
        attempts++;
    }

    // Randomize scale
    const scale = Math.random() * 1.5 + 0.5;
    mesh.scale.set(scale, scale, scale);
    // Randomize initial rotation
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    // Add custom rotation speed
    mesh.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02
    };
    scene.add(mesh);
    shapes.push(mesh);
}
camera.position.z = 5;

let mouseX = 0, mouseY = 0, scrollY = 0;
document.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) * 2 - 1; mouseY = -(e.clientY / window.innerHeight) * 2 + 1; });
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    shapes.forEach((shape) => {
        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
    });
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
    camera.position.z = 5 + scrollY * 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Firebase Configuration & Real-time Tracking ---
const firebaseConfig = {
    apiKey: "AIzaSyBEn1IEegZNMmX4_4y8CTz6zFMchyeblRo",
    authDomain: "database-81148.firebaseapp.com",
    databaseURL: "https://database-81148-default-rtdb.firebaseio.com",
    projectId: "database-81148",
    storageBucket: "database-81148.firebasestorage.app",
    messagingSenderId: "967850095199",
    appId: "1:967850095199:web:c440ee7e66e341792361ea"
};

try {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().signInAnonymously();
    const database = firebase.database();
    const connectionsRef = database.ref('connections');
    const connectedRef = database.ref('.info/connected');

    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            const con = connectionsRef.push();
            con.onDisconnect().remove();
            con.set(true);
        }
    });

    connectionsRef.on('value', (snap) => {
        const el = document.getElementById('user-count');
        if (el) el.innerText = snap.numChildren();
    });
} catch (e) {
    const el = document.getElementById('user-count');
    if (el) el.innerText = "1";
}

// --- i18n Translations ---
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_education: "Education",
        nav_projects: "Projects",
        nav_skills: "Skills",
        nav_certifications: "Certifications",
        nav_contact: "Contact",
        hero_label: "✨ AI Engineering Student",
        hero_title: "Artificial Intelligence Engineer to be",
        hero_desc: "An AI & software engineer focused on intelligent system development, databases, and game development across diverse software projects.",
        hero_btn_work: "View My Projects",
        hero_btn_contact: "Contact Me",

        recruiter_title: "⚡ Quick Info",
        recruiter_name_label: "Name",
        recruiter_uni_label: "University",
        recruiter_uni_value: "UEMF (FES, Morocco)",
        recruiter_prog_label: "Program",
        recruiter_prog_value: "AI & CS Engineering",
        recruiter_year_label: "Year",
        recruiter_year_value: "1st year in AI",
        recruiter_langs_label: "Languages",
        recruiter_langs_value: "Arabic, English, French, Spanish",
        recruiter_avail_label: "Availability",
        recruiter_avail_value: "July 2026",

        stat_location_label: "Location",
        stat_location_value: "Fez, Morocco",
        stat_status_label: "Status",
        stat_status_value: "Open to Internships",
        stat_focus_label: "Focus",
        stat_focus_value: "AI & Full-Stack",

        section_about: "About Me",
        about_header: "My Journey",
        about_subheader: "From Mathematics to Machine Learning",
        about_p1: "As a 1st-year AI Engineering student at UEMF, I have a strong foundation in Machine Learning and a strong interest in building end-to-end applications. I work mainly with Python, Java, and C++, and I am motivated to connect intelligent models with backend systems and modern full-stack architectures to create practical, scalable solutions.",
        about_p2: "Driven by interests in cybersecurity, robotics, and strategy games, I combine technical curiosity with a strong mathematical foundation to solve complex problems. Familiar with common web vulnerabilities including SQL injection, phishing and whaling.",
        about_p3: "Highly autonomous and analytical, I bring adaptability and rigor to collaborative projects, focusing on turning theoretical concepts into practical applications.",

        stat_exp_num: "4+",
        stat_exp_label: "Years Coding",
        stat_proj_num: "5+",
        stat_proj_label: "Projects Built",
        stat_happy_num: "5",
        stat_happy_label: "Certifications",

        section_education: "Academic",
        education_header: "Education",
        education_subheader: "My academic journey and qualifications",

        edu_master_degree: "Master's Degree in Engineering, AI",
        edu_master_uni: "Euro-Mediterranean University of FES (UEMF)",
        edu_master_desc: "Specializing in Advanced Machine Learning, Deep Learning, and Intelligent Systems.",

        edu_prep_degree: "Integrated Preparatory Classes",
        edu_prep_uni: "Euro-Mediterranean University of FES (UEMF)",
        edu_prep_desc: "Intensive foundation in Mathematics, Physics, and Computer Science preparing for the engineering cycle.",

        edu_bac_degree: "Baccalaureate in Mathematical Sciences (Option B)",
        edu_bac_uni: "High School",
        edu_bac_desc: "Acquisition of solid theoretical foundations in Mathematics and Engineering Sciences.",
        edu_coursework: "Relevant Coursework: Linear Algebra, Calculus, Data Structures & Algorithms, Object-Oriented Programming (Java/C/C++/Python), Machine Learning Fundamentals, Database Management Systems (SQL), Software Engineering (UML).",

        section_portfolio: "Portfolio",
        projects_header: "Key Projects",
        projects_subheader: "Applying theory to build practical solutions",
        proj_sudoku_title: "Sudoku Game",
        proj_sudoku_desc: "A feature-rich Sudoku application with customizable themes.",
        proj_2_title: "Linear Algebra Matrix Library",
        proj_2_desc: "A manual implementation of linear algebra operations with a real-time GUI.",
        proj_3_title: "Classification Models Analysis",
        proj_3_desc: "A comparative study of classification models on real-world dataset.",
        proj_4_title: "Smart Parking System",
        proj_4_desc: "An Arduino-based parking management system with IR sensors and LCD display.",
        proj_5_title: "Evil Twin Attack Demo",
        proj_5_desc: "A cybersecurity demonstration of Man-in-the-Middle attacks using rogue WiFi access points.",

        section_expertise: "Expertise",
        skills_header: "Skills",
        skills_subheader: "Languages & Tools",
        cat_programming: "💻 Programming Languages",
        cat_ai: "🤖 AI & Machine Learning",
        cat_cybersecurity: "🔒 Cybersecurity",
        cat_software: "⚙️ Software Engineering",
        cat_tools: "🔧 Tools & Management",
        cat_soft_skills: "🧠 Soft Skills",
        skill_time: "Time Management",
        skill_adapt: "Adaptability (Fast Learning)",
        skill_lead: "Leadership",
        skill_team: "Team Collaboration",
        skill_problem: "Problem Solving",

        section_certs: "Learning",
        certs_header: "Certifications",
        certs_subheader: "Continuous professional development",

        section_contact: "Get In Touch",
        contact_header: "Let's Connect",
        contact_internship: "Seeking a one-month observational internship starting July 2026. I am a first-year AI Engineering student at UEMF with a solid foundation in Machine Learning and proficiency in Python, Java, and C++. I am particularly interested in developing end-to-end applications, managing and analyzing data, and integrating intelligent models into practical, real-world solutions.",
        cv_en: "Download CV (EN)",
        cv_fr: "Download CV (FR)",
        contact_email: "Email",
        contact_phone: "Phone",
        proj_view_code: "View Code",
        footer_online: "Online"
    },
    fr: {
        nav_home: "Accueil",
        nav_about: "À Propos",
        nav_education: "Éducation",
        nav_projects: "Projets",
        nav_skills: "Compétences",
        nav_certifications: "Certificats",
        nav_contact: "Contact",
        hero_label: "✨ Étudiant Ingénieur IA",
        hero_title: "Futur Ingénieur en Intelligence Artificielle",
        hero_desc: "Un ingénieur en IA & logiciel axé sur le développement de systèmes intelligents, les bases de données et le développement de jeux à travers divers projets logiciels.",
        hero_btn_work: "Voir mes projets",
        hero_btn_contact: "Me contacter",

        recruiter_title: "⚡ Infos Rapides",
        recruiter_name_label: "Nom",
        recruiter_uni_label: "Université",
        recruiter_uni_value: "UEMF (FES, Maroc)",
        recruiter_prog_label: "Programme",
        recruiter_prog_value: "Cycle Ingénieur en IA",
        recruiter_year_label: "Année",
        recruiter_year_value: "1ère année en IA",
        recruiter_langs_label: "Langues",
        recruiter_langs_value: "Arabe, Anglais, Français, Espagnol",
        recruiter_avail_label: "Disponibilité",
        recruiter_avail_value: "Juillet 2026",

        stat_location_label: "Localisation",
        stat_location_value: "Fès, Maroc",
        stat_status_label: "Statut",
        stat_status_value: "Ouvert aux Stages",
        stat_focus_label: "Focus",
        stat_focus_value: "IA & Full-Stack",

        section_about: "À Propos",
        about_header: "Mon Parcours",
        about_subheader: "Des Mathématiques au Machine Learning",
        about_p1: "En tant qu’étudiant en première année en IA cycle d’ingénierie à l’UEMF, je dispose d’une solide base en apprentissage automatique et d’un fort intérêt pour le développement d’applications de bout en bout. Je travaille principalement avec Python, Java et C++, et je suis motivé à connecter des modèles intelligents à des systèmes backend et à des architectures full-stack modernes afin de créer des solutions pratiques et évolutives.",
        about_p2: "Passionné par la cybersécurité, la robotique et les jeux de stratégie, j’allie curiosité technique et rigueur mathématique pour résoudre des problèmes complexes. Familiarisé avec les vulnérabilités web courantes, notamment l’injection SQL, le phishing et le whaling.",
        about_p3: "Reconnu pour mon autonomie et ma capacité d’analyse, je m’intègre avec adaptabilité dans des projets collaboratifs pour transformer des idées en solutions concrètes.",

        stat_exp_num: "4+",
        stat_exp_label: "Années de Code",
        stat_proj_num: "5+",
        stat_proj_label: "Projets Réalisés",
        stat_happy_num: "5",
        stat_happy_label: "Certificats",

        section_education: "Académique",
        education_header: "Éducation",
        education_subheader: "Mon parcours académique et qualifications",

        edu_master_degree: "Cycle Ingénieur en Intelligence Artificielle",
        edu_master_uni: "Université Euro-Méditerranéenne de FES (UEMF)",
        edu_master_desc: "Spécialisation en Machine Learning Avancé, Deep Learning et Systèmes Intelligents.",

        edu_prep_degree: "Classes Préparatoires Intégrées",
        edu_prep_uni: "Université Euro-Méditerranéenne de FES (UEMF)",
        edu_prep_desc: "Fondation intensive en Mathématiques, Physique et Informatique préparant au cycle ingénieur.",

        edu_bac_degree: "Baccalauréat Sciences Mathématiques (Option B)",
        edu_bac_uni: "Lycée",
        edu_bac_desc: "Acquisition de solides bases théoriques en mathématiques et Sciences de l'Ingénieur.",
        edu_coursework: "Cours Pertinents : Algèbre Linéaire, Calcul, Structures de Données & Algorithmes, POO (Java/C/C++/Python), Fondamentaux du Machine Learning, Gestion de Base de Données (SQL), Génie Logiciel (UML).",

        section_portfolio: "Portfolio",
        projects_header: "Projets Clés",
        projects_subheader: "Appliquer la théorie pour construire des solutions pratiques",
        proj_sudoku_title: "Jeu de Sudoku",
        proj_sudoku_desc: "Un jeu de Sudoku complet avec thèmes personnalisables.",
        proj_2_title: "Bibliothèque d'Algèbre Linéaire",
        proj_2_desc: "Une implémentation manuelle de l'algèbre linéaire avec interface en temps réel.",
        proj_3_title: "Analyse Comparative de Modèles",
        proj_3_desc: "Une étude comparative des modèles de classification sur des données cliniques.",
        proj_4_title: "Système de Parking Intelligent",
        proj_4_desc: "Un système de gestion de parking basé sur Arduino avec capteurs IR et écran LCD.",
        proj_5_title: "Démo Attaque Evil Twin",
        proj_5_desc: "Une démonstration de cybersécurité des attaques Man-in-the-Middle utilisant des points d'accès WiFi malveillants.",

        section_expertise: "Expertise",
        skills_header: "Compétences",
        skills_subheader: "Langages & Outils",
        cat_programming: "💻 Langages de Programmation",
        cat_ai: "🤖 IA & Machine Learning",
        cat_cybersecurity: "🔒 Cybersécurité",
        cat_software: "⚙️ Software Engineering",
        cat_tools: "🔧 Outils & Gestion",
        cat_soft_skills: "🧠 Soft Skills",
        skill_time: "Gestion du Temps",
        skill_adapt: "Adaptabilité (Apprentissage Rapide)",
        skill_lead: "Leadership",
        skill_team: "Travail d'Équipe",
        skill_problem: "Résolution de Problèmes",

        section_certs: "Apprentissage",
        certs_header: "Certificats",
        certs_subheader: "Développement professionnel continu",

        section_contact: "Contact",
        contact_header: "Connectons-nous",
        contact_internship: "Je recherche un stage d’observation d’un mois à partir de juillet 2026. Je suis étudiant en première année du cycle d’ingénieur en IA à l’UEMF, avec une solide formation en apprentissage automatique et une maîtrise de Python, Java et C++. Je m’intéresse particulièrement au développement d’applications de bout en bout, à la gestion et à l’analyse de données, ainsi qu’à l’intégration de modèles intelligents dans des solutions concrètes et pratiques.",
        cv_en: "Télécharger CV (EN)",
        cv_fr: "Télécharger CV (FR)",
        contact_email: "E-mail",
        contact_phone: "Téléphone",
        proj_view_code: "Voir le Code",
        footer_online: "En Ligne"
    }
};

const updateLanguage = (lang) => {
    localStorage.setItem('language', lang);
    const toggleText = document.getElementById('langToggle').querySelector('.lang-text');
    if (toggleText) toggleText.innerText = lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
};

document.getElementById('langToggle').addEventListener('click', () => {
    const current = localStorage.getItem('language') || 'en';
    updateLanguage(current === 'en' ? 'fr' : 'en');
});

updateLanguage(localStorage.getItem('language') || 'en');

// --- Theme Toggle ---
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const updateTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};
themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'dark';
    updateTheme(current === 'dark' ? 'light' : 'dark');
});
updateTheme(localStorage.getItem('theme') || 'dark');

// --- Live Clock ---
const updateClock = () => {
    const options = { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const moroccoTime = new Intl.DateTimeFormat('en-GB', options).format(new Date());
    const el = document.getElementById('live-clock');
    if (el) el.innerText = moroccoTime;
};
setInterval(updateClock, 1000);
updateClock();

// --- Certification Data ---
const certificationsData = {
    'github-foundations': {
        title: "GitHub Foundations", subtitle_en: "Digi Club (University)", subtitle_fr: "Digi Club (Université)",
        desc_en: "Certification covering core GitHub functionalities, including repository management and collaboration workflows.",
        desc_fr: "Certification couvrant les fonctionnalités essentielles de GitHub, notamment la gestion des dépôts et les flux de collaboration.",
        learnings_en: ["Git branching strategies", "Pull request workflows", "Repository security"],
        learnings_fr: ["Stratégies de branches Git", "Flux de pull requests", "Sécurité des dépôts"],
        image: "images/Certifications/certif1.jpeg"
    },
    'ethical-hacking': {
        title: "Ethical Hacking", subtitle_en: "SparkSec Club (University)", subtitle_fr: "SparkSec Club (Université)",
        desc_en: "Focused on identifying vulnerabilities responsibly. Covered penetration testing and security auditing tools.",
        desc_fr: "Axé sur l'identification responsable des vulnérabilités. A couvert les tests d'intrusion et les outils d'audit.",
        learnings_en: ["Malicious software types", "Encryption concepts", "Hash functions"],
        learnings_fr: ["Types de logiciels malveillants", "Concepts de chiffrement", "Fonctions de hachage"],
        image: "images/Certifications/certif2.jpeg"
    },
    'prompt-engineering': {
        title: "Prompt Engineering", subtitle_en: "IAMAI", subtitle_fr: "IAMAI",
        desc_en: "Crafting effective prompts for LLMs to generate precise outputs.",
        desc_fr: "Création de prompts efficaces pour les LLM afin de générer des résultats précis.",
        learnings_en: ["Zero-shot/Few-shot prompting", "Chain-of-thought", "Code generation"],
        learnings_fr: ["Prompting Zero-shot/Few-shot", "Chain-of-thought", "Génération de code"],
        image: "images/Certifications/certif3.jpeg"
    },
    'python-ds': {
        title: "Python for Data Structures", subtitle_en: "SoloLearn", subtitle_fr: "SoloLearn",
        desc_en: "Deep dive into fundamental data structures using Python.",
        desc_fr: "Plongée approfondie dans les structures de données fondamentales avec Python.",
        learnings_en: ["List/Tuples/Sets", "Stack/Queues", "Binary Trees"],
        learnings_fr: ["Listes/Tuples/Ensembles", "Piles/Files", "Arbres Binaires"],
        image: "images/Certifications/certif4.jpeg"
    },
    'python-beginners': {
        title: "Python for Beginners", subtitle_en: "SoloLearn", subtitle_fr: "SoloLearn",
        desc_en: "Foundational course covering Python syntax and control flow.",
        desc_fr: "Cours fondamental couvrant la syntaxe Python et le flux de contrôle.",
        learnings_en: ["Variables & Ops", "Control structures", "Functions"],
        learnings_fr: ["Variables & Opérateurs", "Structures de contrôle", "Fonctions"],
        image: "images/Certifications/certif5.jpeg"
    }
};

const certModal = document.getElementById('cert-modal');
const openCertModal = (id) => {
    const data = certificationsData[id];
    if (!data) return;
    const lang = localStorage.getItem('language') || 'en';
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-subtitle').innerText = lang === 'en' ? data.subtitle_en : data.subtitle_fr;
    document.getElementById('modal-desc').innerText = lang === 'en' ? data.desc_en : data.desc_fr;
    const learnings = lang === 'en' ? data.learnings_en : data.learnings_fr;
    const list = document.getElementById('modal-learnings');
    list.innerHTML = '';
    learnings.forEach(l => { const li = document.createElement('li'); li.innerText = l; list.appendChild(li); });
    document.getElementById('modal-img').src = data.image;
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

document.querySelectorAll('.cert-item').forEach(item => {
    item.addEventListener('click', () => openCertModal(item.getAttribute('data-cert')));
});

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Scroll to Top Logic ---
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { scrollTopBtn.classList.add('visible'); }
    else { scrollTopBtn.classList.remove('visible'); }
});
scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// --- CV Download ---
const downloadCV = (lang) => {
    const files = { en: 'CV/CV_Yassine_HAMDA__BENCHEKROUN_EN.pdf', fr: 'CV/CV_Yassine_HAMDA__BENCHEKROUN_FR.pdf' };
    const link = document.createElement('a');
    link.href = files[lang];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = files[lang].split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
window.downloadCV = downloadCV;

// --- Project Modal Logic ---
const projectsData = {
    'sudoku': {
        title: { en: 'Sudoku Game', fr: 'Jeu de Sudoku' },
        desc: {
            en: `
                <h3>Description</h3>
                <p>A desktop Sudoku application built with a focus on robust game logic, intuitive user experience, and scalable architecture. Designed to deliver a polished, feature-rich puzzle experience with room for future enhancements.</p>
                
                <h3>Challenges</h3>
                <ul>
                    <li><strong>Unique Puzzle Generation:</strong> Ensuring every generated Sudoku board is both valid and solvable while maintaining appropriate difficulty without repetition across playthroughs.</li>
                    <li><strong>State Management & Persistence:</strong> Managing complex game states including pencil marks, move history, and user progress while ensuring smooth save/load functionality without data loss.</li>
                    <li><strong>Extensible Architecture:</strong> Designing a scalable system that supports future features like coin systems and settings panels without requiring major refactoring of existing code.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Implemented a backtracking algorithm with validation checks for puzzle generation, ensuring uniqueness and solvability. Developed a centralized state management system with serialization capabilities for reliable save/load operations. Adopted a modular, component-based architecture with clear separation of concerns, allowing seamless integration of new features while maintaining code maintainability and scalability.</p>
                
                <h3>Improvements</h3>
                <ul>
                    <li>Coin-based progression system integration</li>
                    <li>Settings panel for customization options</li>
                    <li>Implement a full backend for the game</li>
                    <li>Online leaderboard and achievements system</li>
                </ul>
            `,
            fr: `
                <h3>Description</h3>
                <p>Une application Sudoku de bureau conçue avec un accent sur une logique de jeu robuste, une expérience utilisateur intuitive et une architecture évolutive. Conçue pour offrir une expérience de puzzle soignée et riche en fonctionnalités avec de la place pour de futures améliorations.</p>
                
                <h3>Défis</h3>
                <ul>
                    <li><strong>Génération de Puzzle Unique :</strong> S'assurer que chaque grille de Sudoku générée est à la fois valide et résoluble tout en maintenant une difficulté appropriée sans répétition entre les parties.</li>
                    <li><strong>Gestion d'État & Persistance :</strong> Gérer des états de jeu complexes, y compris les marques de crayon, l'historique des coups et la progression de l'utilisateur tout en assurant une fonctionnalité sauvegarde/chargement fluide sans perte de données.</li>
                    <li><strong>Architecture Extensible :</strong> Concevoir un système évolutif qui supporte de futures fonctionnalités comme des systèmes de pièces et des panneaux de paramètres sans nécessiter une refonte majeure du code existant.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Implémentation d'un algorithme de backtracking avec des vérifications de validation pour la génération de puzzles, assurant unicité et solvabilité. Développement d'un système de gestion d'état centralisé avec des capacités de sérialisation pour des opérations de sauvegarde/chargement fiables. Adoption d'une architecture modulaire basée sur des composants avec une séparation claire des préoccupations, permettant une intégration transparente de nouvelles fonctionnalités tout en maintenant la maintenabilité et l'évolutivité du code.</p>
                
                <h3>Améliorations</h3>
                <ul>
                    <li>Intégration d'un système de progression basé sur les pièces</li>
                    <li>Panneau de paramètres pour les options de personnalisation</li>
                    <li>Implémentation d'un backend complet pour le jeu</li>
                    <li>Classement en ligne et système de succès</li>
                </ul>
            `
        },
        tags: ['C++', 'SFML', 'Algorithms'],
        mainImg: 'images/Projects-Screenshot/sudoku/main_page.png',
        // Mixed array of objects for better control
        screenshots: [
            { type: 'image', src: 'images/Projects-Screenshot/sudoku/state_diagram.jpg' },
            { type: 'image', src: 'images/Projects-Screenshot/sudoku/dark_mode_first_page_with_language_menu.jpg' },
            { type: 'image', src: 'images/Projects-Screenshot/sudoku/first_page.jpg' },
            { type: 'image', src: 'images/Projects-Screenshot/sudoku/game_entrance.jpg' },
            { type: 'image', src: 'images/Projects-Screenshot/sudoku/game_screen.jpg' }
        ]
    },
    'matrix': {
        title: { en: 'Linear Algebra Matrix Library', fr: 'Bibliothèque d\'Algèbre Linéaire' },
        desc: {
            en: `
                <h3>Description</h3>
                <p>A desktop matrix calculator application designed to perform comprehensive linear algebra operations with an intuitive graphical interface. Built to handle both numerical and symbolic matrix computations efficiently using NumPy and SymPy libraries.</p>
                
                <h3>Challenges</h3>
                <ul>
                    <li><strong>Symbolic and Numerical Integration:</strong> Combining SymPy's symbolic computation capabilities with NumPy's numerical efficiency while maintaining accurate results across both modes and handling conversions between symbolic expressions (like 1/2, √2) and numerical values.</li>
                    <li><strong>Dynamic Input Parsing:</strong> Designing a robust parser that accepts and validates diverse input formats including fractions, radicals, variables, and standard decimals while preventing syntax errors and ensuring compatibility with matrix operations.</li>
                    <li><strong>Matrix Size Management:</strong> Handling variable matrix dimensions while maintaining a clean, usable interface and preventing display overflow or formatting issues with large matrices in text input fields.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Leveraged SymPy for parsing and evaluating symbolic expressions, then integrated seamlessly with NumPy for efficient numerical computations through automatic type conversion. Developed an intelligent input parser using SymPy's sympify function with error handling that validates expressions and provides clear feedback. Implemented fixed-size matrix input constraints with scrollable text areas, limiting matrices to manageable dimensions that balance computational performance with interface usability, while clearly communicating size restrictions to users during input.</p>
                
                <h3>Improvements</h3>
                <ul>
                    <li>Support for larger matrix dimensions with optimized rendering</li>
                    <li>Export results to LaTeX or PDF format</li>
                    <li>Step-by-step solution display for educational purposes</li>
                    <li>Matrix visualization with graphical representations</li>
                </ul>
            `,
            fr: `
                <h3>Description</h3>
                <p>Une application de calculatrice matricielle de bureau conçue pour effectuer des opérations d'algèbre linéaire complètes avec une interface graphique intuitive. Conçue pour gérer efficacement les calculs matriciels numériques et symboliques en utilisant les bibliothèques NumPy et SymPy.</p>
                
                <h3>Défis</h3>
                <ul>
                    <li><strong>Intégration Symbolique et Numérique :</strong> Combiner les capacités de calcul symbolique de SymPy avec l'efficacité numérique de NumPy tout en maintenant des résultats précis dans les deux modes et en gérant les conversions entre les expressions symboliques (comme 1/2, √2) et les valeurs numériques.</li>
                    <li><strong>Analyse d'Entrée Dynamique :</strong> Concevoir un analyseur robuste qui accepte et valide divers formats d'entrée, y compris les fractions, les radicaux, les variables et les décimales standard, tout en prévenant les erreurs de syntaxe et en assurant la compatibilité avec les opérations matricielles.</li>
                    <li><strong>Gestion de la Taille des Matrices :</strong> Gérer des dimensions de matrice variables tout en maintenant une interface propre et utilisable et en évitant les débordements d'affichage ou les problèmes de formatage avec de grandes matrices dans les champs de saisie de texte.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Exploitation de SymPy pour l'analyse et l'évaluation des expressions symboliques, puis intégration transparente avec NumPy pour des calculs numériques efficaces grâce à la conversion automatique de type. Développement d'un analyseur d'entrée intelligent utilisant la fonction sympify de SymPy avec gestion des erreurs qui valide les expressions et fournit un retour clair. Implémentation de contraintes d'entrée de matrice à taille fixe avec des zones de texte déroulantes, limitant les matrices à des dimensions gérables qui équilibrent la performance de calcul avec l'utilisabilité de l'interface, tout en communiquant clairement les restrictions de taille aux utilisateurs lors de la saisie.</p>
                
                <h3>Améliorations</h3>
                <ul>
                    <li>Support de dimensions de matrices plus grandes avec rendu optimisé</li>
                    <li>Export des résultats en format LaTeX ou PDF</li>
                    <li>Affichage de la solution étape par étape à des fins éducatives</li>
                    <li>Visualisation matricielle avec représentations graphiques</li>
                </ul>
            `
        },
        tags: ['Python', 'Algorithms', 'Math'],
        github: 'https://github.com/Yassine-Benchekroun/Matrix-Calculator-gui',
        mainImg: 'images/Projects-Screenshot/Matrix_gui/main_page.png',
        screenshots: [
            'images/Projects-Screenshot/Matrix_gui/Handling_Division_by_0.jpg',
            'images/Projects-Screenshot/Matrix_gui/Handling_complex_numbers.jpg',
            'images/Projects-Screenshot/Matrix_gui/Result_eigenvalue-sympy.jpg',
            'images/Projects-Screenshot/Matrix_gui/matrix_operations.jpg'
        ]
    },
    'ml': {
        title: { en: 'Classification Models Analysis', fr: 'Analyse de Modèles de Classification' },
        desc: {
            en: `
                <h3>Description</h3>
                <p>A machine learning classification comparison project that evaluates multiple algorithms (SVM with linear, polynomial, and RBF kernels, plus logistic regression) on a social network dataset. The system performs comprehensive performance analysis and ranks models based on ROC-AUC scores.</p>
                
                <h3>Challenges</h3>
                <ul>
                    <li><strong>Multi-Model Evaluation Framework:</strong> Designing a unified pipeline that trains multiple SVM variants with different kernels and logistic regression while ensuring fair comparison through consistent data preprocessing, standardized scaling, and uniform metric calculation across all models.</li>
                    <li><strong>Comprehensive Metrics Collection:</strong> Computing and organizing a complete set of binary classification metrics (accuracy, precision, sensitivity, specificity, F1-score, ROC-AUC) for each model, requiring probability predictions and proper confusion matrix extraction.</li>
                    <li><strong>Data Preprocessing Consistency:</strong> Handling categorical variables (gender mapping), feature scaling across train/test splits without data leakage, and ensuring all models receive identically preprocessed data for valid comparison.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Developed a modular pipeline with separate functions for each classifier, ensuring consistent probability prediction outputs for ROC-AUC calculation. Implemented StandardScaler with proper fit on training data and transform on test data to prevent leakage. Created a centralized collect_metrics function that extracts all four confusion matrix values (TP, TN, FP, FN) to compute sensitivity, specificity, and other metrics uniformly. Compiled results into a structured DataFrame sorted by ROC-AUC in descending order, enabling clear visualization of which algorithm performs best on the social network purchase prediction task.</p>
                
                <h3>Improvements</h3>
                <ul>
                    <li>Add more classification algorithms (Random Forest, XGBoost, Neural Networks)</li>
                    <li>Implement cross-validation for more robust performance estimates</li>
                    <li>Add hyperparameter tuning with GridSearchCV</li>
                    <li>Interactive visualization dashboard for model comparison</li>
                </ul>
            `,
            fr: `
                <h3>Description</h3>
                <p>Un projet de comparaison de classification par apprentissage automatique qui évalue plusieurs algorithmes (SVM avec noyaux linéaire, polynomial et RBF, plus la régression logistique) sur un jeu de données de réseau social. Le système effectue une analyse de performance complète et classe les modèles en fonction des scores ROC-AUC.</p>
                
                <h3>Défis</h3>
                <ul>
                    <li><strong>Cadre d'Évaluation Multi-Modèles :</strong> Concevoir un pipeline unifié qui entraîne plusieurs variantes de SVM avec différents noyaux et la régression logistique tout en assurant une comparaison équitable grâce à un prétraitement cohérent des données, une mise à l'échelle standardisée et un calcul uniforme des métriques pour tous les modèles.</li>
                    <li><strong>Collecte Complète des Métriques :</strong> Calculer et organiser un ensemble complet de métriques de classification binaire (exactitude, précision, sensibilité, spécificité, F1-score, ROC-AUC) pour chaque modèle, nécessitant des prédictions de probabilité et une extraction appropriée de la matrice de confusion.</li>
                    <li><strong>Cohérence du Prétraitement des Données :</strong> Gérer les variables catégorielles (mappage du genre), la mise à l'échelle des caractéristiques entre les ensembles d'entraînement et de test sans fuite de données, et s'assurer que tous les modèles reçoivent des données prétraitées de manière identique pour une comparaison valide.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Développement d'un pipeline modulaire avec des fonctions séparées pour chaque classificateur, assurant des sorties de prédiction de probabilité cohérentes pour le calcul du ROC-AUC. Implémentation de StandardScaler avec un ajustement approprié sur les données d'entraînement et une transformation sur les données de test pour prévenir les fuites. Création d'une fonction centralisée collect_metrics qui extrait les quatre valeurs de la matrice de confusion (VP, VN, FP, FN) pour calculer la sensibilité, la spécificité et d'autres métriques de manière uniforme. Compilation des résultats dans un DataFrame structuré trié par ROC-AUC dans l'ordre décroissant, permettant une visualisation claire de l'algorithme le plus performant pour la tâche de prédiction d'achat sur réseau social.</p>
                
                <h3>Améliorations</h3>
                <ul>
                    <li>Ajouter plus d'algorithmes de classification (Random Forest, XGBoost, réseaux de neurones)</li>
                    <li>Implémenter la validation croisée pour des estimations de performance plus robustes</li>
                    <li>Ajouter le réglage des hyperparamètres avec GridSearchCV</li>
                    <li>Tableau de bord de visualisation interactif pour la comparaison des modèles</li>
                </ul>
            `
        },
        tags: ['Python', 'Scikit-Learn', 'Data Science'],
        github: 'https://github.com/Yassine-Benchekroun/ClassiBench-ML-Comparison',
        mainImg: 'images/Projects-Screenshot/ml_comparaison/main_page.png',
        screenshots: [
            'images/Projects-Screenshot/ml_comparaison/Result.jpeg'
        ]
    },
    'parking': {
        title: { en: 'Smart Parking System', fr: 'Système de Parking Intelligent' },
        desc: {
            en: `
                <h3>Description</h3>
                <p>An embedded smart parking management system built using Arduino R3 that automates barrier control and tracks available parking slots in real time. The system relies on dual IR sensors to reliably detect vehicle entry and exit, with an LCD providing live slot availability feedback.</p>
                
                <h3>Challenges</h3>
                <ul>
                    <li>Preventing false triggers when vehicles stop or reverse near the entrance</li>
                    <li>Correctly identifying vehicle direction (entry vs exit)</li>
                    <li>Synchronizing sensor input with servo motor control and display updates</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Implemented a dual-IR, state-based validation logic where vehicle movement is confirmed only after a sequential trigger of both sensors. For entry, the entrance sensor opens the barrier via a servo motor, and slot count is updated only after the internal sensor confirms full entry. The process is reversed for exit. The LCD continuously displays remaining slots and locks the entrance automatically when parking capacity is reached.</p>
                
                <h3>Future Improvements</h3>
                <ul>
                    <li>Ultrasonic sensors for distance-based detection</li>
                    <li>Wireless monitoring (Wi-Fi / Bluetooth)</li>
                    <li>Per-slot LED indicators</li>
                    <li>Mobile application integration</li>
                </ul>
            `,
            fr: `
                <h3>Description</h3>
                <p>Un système de gestion de parking intelligent embarqué construit avec Arduino R3 qui automatise le contrôle des barrières et suit les places de parking disponibles en temps réel. Le système s'appuie sur deux capteurs IR pour détecter de manière fiable l'entrée et la sortie des véhicules, avec un écran LCD fournissant un retour en direct sur la disponibilité des places.</p>
                
                <h3>Défis</h3>
                <ul>
                    <li>Prévenir les faux déclenchements lorsque les véhicules s'arrêtent ou reculent près de l'entrée</li>
                    <li>Identifier correctement la direction du véhicule (entrée vs sortie)</li>
                    <li>Synchroniser les entrées des capteurs avec le contrôle du servomoteur et les mises à jour de l'affichage</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Implémentation d'une logique de validation basée sur l'état à double IR où le mouvement du véhicule n'est confirmé qu'après un déclenchement séquentiel des deux capteurs. Pour l'entrée, le capteur d'entrée ouvre la barrière via un servomoteur, et le nombre de places n'est mis à jour qu'après que le capteur interne confirme l'entrée complète. Le processus est inversé pour la sortie. L'écran LCD affiche en continu les places restantes et verrouille automatiquement l'entrée lorsque la capacité du parking est atteinte.</p>
                
                <h3>Améliorations Futures</h3>
                <ul>
                    <li>Capteurs ultrasoniques pour la détection basée sur la distance</li>
                    <li>Surveillance sans fil (Wi-Fi / Bluetooth)</li>
                    <li>Indicateurs LED par place</li>
                    <li>Intégration d'application mobile</li>
                </ul>
            `
        },
        tags: ['Arduino', 'C++', 'Embedded Systems', 'IoT'],
        mainImg: 'images/Projects-Screenshot/parking/main_page.png',
        screenshots: [
            'images/Projects-Screenshot/parking/parking_image.jpg'
        ]
    },
    'evil_twin': {
        title: { en: 'Evil Twin Attack Demo', fr: 'Démo Attaque Evil Twin' },
        desc: {
            en: `
                <h3>Description</h3>
                <p>A Man-in-the-Middle (MitM) attack demonstration that creates a rogue WiFi access point to intercept network traffic from unsuspecting users. This project showcases the severe security risks posed by rogue access points in public WiFi environments through practical implementation and traffic analysis.</p>
                
                <h3>Challenges</h3>
                <ul>
                    <li><strong>Monitor Mode Configuration:</strong> Configuring the wireless adapter to switch into monitor mode, which required disabling conflicting network manager services and using airmon-ng/iwconfig commands to ensure proper driver compatibility (nl80211).</li>
                    <li><strong>Access Point Authenticity:</strong> Creating a convincing fake access point that mimics legitimate networks while maintaining stability for connected clients.</li>
                    <li><strong>Traffic Interception:</strong> Capturing and analyzing network packets in real-time while filtering relevant data from the massive stream of network traffic.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Configured hostapd with optimized parameters (interface=wlan0, driver=nl80211, cloned SSID like "Free_High_Speed_WiFi", 2.4GHz legacy mode hw_mode=g, channel 6) to create the fake access point. Used Wireshark for real-time packet capture combined with custom Python scripts leveraging Scapy to parse, filter, and analyze captured network data. Demonstrated how unencrypted traffic such as DNS queries and HTTP requests can be exposed when users connect to rogue access points, highlighting the risk of credential leakage in insecure public WiFi environments.</p>
                
                <h3>Results</h3>
                <ul>
                    <li><strong>Image 1 (DNS Traffic Analysis):</strong> Displays intercepted DNS query history from a device connected to the rogue access point, including repeated requests to Google and Googlecast services. The traffic metadata and browser fingerprinting information indicate an Android 10 device, illustrating how device characteristics and browsing behavior can be inferred during an Evil Twin attack.</li>
                    <li><strong>Image 2 (MITM Traffic Evidence):</strong> Shows anonymized packet capture data collected from the rogue access point, including target device fingerprinting (Mobile/Linux), timestamps, source and destination IPs, protocols (ICMP, UDP, TCP), and packet sizes. This confirms successful traffic interception and analysis in a Man-in-the-Middle position.</li>
                </ul>
                
                <p><em>⚠️ This project was conducted in a controlled lab environment for educational and defensive security purposes only.</em></p>
            `,
            fr: `
                <h3>Description</h3>
                <p>Une démonstration d'attaque Man-in-the-Middle (MitM) qui crée un point d'accès WiFi malveillant pour intercepter le trafic réseau des utilisateurs non méfiants. Ce projet met en évidence les risques de sécurité graves posés par les points d'accès malveillants dans les environnements WiFi publics à travers une implémentation pratique et une analyse du trafic.</p>
                
                <h3>Défis</h3>
                <ul>
                    <li><strong>Configuration du Mode Moniteur :</strong> Configurer l'adaptateur sans fil pour passer en mode moniteur, ce qui nécessitait de désactiver les services de gestionnaire de réseau conflictuels et d'utiliser les commandes airmon-ng/iwconfig pour assurer la compatibilité du pilote (nl80211).</li>
                    <li><strong>Authenticité du Point d'Accès :</strong> Créer un faux point d'accès convaincant qui imite les réseaux légitimes tout en maintenant la stabilité pour les clients connectés.</li>
                    <li><strong>Interception du Trafic :</strong> Capturer et analyser les paquets réseau en temps réel tout en filtrant les données pertinentes du flux massif de trafic réseau.</li>
                </ul>
                
                <h3>Solution</h3>
                <p>Configuration de hostapd avec des paramètres optimisés (interface=wlan0, driver=nl80211, SSID cloné comme "Free_High_Speed_WiFi", mode legacy 2.4GHz hw_mode=g, canal 6) pour créer le faux point d'accès. Utilisation de Wireshark pour la capture de paquets en temps réel combinée avec des scripts Python personnalisés utilisant Scapy pour analyser, filtrer et traiter les données réseau capturées. Démontré comment le trafic non chiffré tel que les requêtes DNS et les requêtes HTTP peut être exposé lorsque les utilisateurs se connectent à des points d'accès malveillants, soulignant le risque de fuite d'informations d'identification dans les environnements WiFi publics non sécurisés.</p>
                
                <h3>Résultats</h3>
                <ul>
                    <li><strong>Image 1 (Analyse du Trafic DNS) :</strong> Affiche l'historique des requêtes DNS interceptées d'un appareil connecté au point d'accès malveillant, incluant des requêtes répétées vers les services Google et Googlecast. Les métadonnées du trafic et les informations d'empreinte du navigateur indiquent un appareil Android 10, illustrant comment les caractéristiques de l'appareil et le comportement de navigation peuvent être déduits lors d'une attaque Evil Twin.</li>
                    <li><strong>Image 2 (Preuve de Trafic MITM) :</strong> Montre les données de capture de paquets anonymisées collectées depuis le point d'accès malveillant, incluant l'empreinte de l'appareil cible (Mobile/Linux), les horodatages, les IP source et destination, les protocoles (ICMP, UDP, TCP), et les tailles de paquets. Cela confirme l'interception et l'analyse réussies du trafic en position Man-in-the-Middle.</li>
                </ul>
                
                <p><em>⚠️ Ce projet a été réalisé dans un environnement de laboratoire contrôlé à des fins éducatives et de sécurité défensive uniquement.</em></p>
            `
        },
        tags: ['Kali Linux', 'Python', 'Wireshark', 'Scapy', 'Cybersecurity'],
        mainImg: 'images/Projects-Screenshot/evil_twin/main_page.png',
        screenshots: [
            'images/Projects-Screenshot/evil_twin/history.jpeg',
            'images/Projects-Screenshot/evil_twin/evidence.png'
        ]
    }
};

const projectModal = document.getElementById('project-modal');
const openProjectModal = (id) => {
    const data = projectsData[id];
    if (!data) return;
    const lang = localStorage.getItem('language') || 'en';
    const mainDisplayImg = document.getElementById('project-modal-img');
    const mainDisplayVideo = document.getElementById('project-modal-video');

    document.getElementById('project-modal-title').innerText = data.title[lang];
    document.getElementById('project-modal-desc').innerHTML = data.desc[lang];
    mainDisplayImg.src = data.mainImg;

    // Populate Tags
    const tagsContainer = document.getElementById('project-modal-tags');
    tagsContainer.innerHTML = '';
    if (data.tags) {
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });
    }

    const grid = document.getElementById('project-modal-grid');
    grid.innerHTML = '';

    // Normalize data: string screenshots become objects
    const mediaItems = data.screenshots.map(item => {
        return typeof item === 'string' ? { type: 'image', src: item } : item;
    });

    // Function to set Main View
    const setMainView = (item) => {
        if (item.type === 'video') {
            mainDisplayImg.style.display = 'none';
            mainDisplayVideo.style.display = 'block';
            mainDisplayVideo.src = item.src;
            // mainDisplayVideo.play(); // Optional: autoplay
        } else {
            mainDisplayVideo.pause();
            mainDisplayVideo.style.display = 'none';
            mainDisplayImg.style.display = 'block';
            mainDisplayImg.src = item.src;
        }
    };

    // Initialize with Main Img (always an image for now) as default view
    setMainView({ type: 'image', src: data.mainImg });

    // --- Generate Grid ---
    // Add Main Image to the list of selectable items logic
    const allItems = [{ type: 'image', src: data.mainImg }, ...mediaItems];

    // Clicking main IMAGE opens lightbox (Video doesn't open lightbox for now)
    mainDisplayImg.onclick = () => {
        const currentSrc = mainDisplayImg.src;
        const index = allItems.findIndex(i => currentSrc.includes(i.src.split('/').pop()));

        // Filter only images for the lightbox
        const imageOnlyList = allItems.filter(i => i.type === 'image').map(i => i.src);

        // Find distinct index in the image-only list
        const imageIndex = imageOnlyList.findIndex(src => currentSrc.includes(src.split('/').pop()));

        if (imageIndex >= 0) openLightbox(imageIndex, imageOnlyList);
    };

    allItems.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'grid-item';

        // Create Thumbnail
        let thumb;
        if (item.type === 'video') {
            thumb = document.createElement('video');
            thumb.src = item.src;
            thumb.muted = true;
            thumb.preload = 'metadata'; // Load first frame
            // Optional: Play on hover? 
            // thumb.onmouseover = () => thumb.play();
            // thumb.onmouseout = () => thumb.pause();
        } else {
            thumb = document.createElement('img');
            thumb.src = item.src;
        }

        wrapper.appendChild(thumb);

        if (index === 0) wrapper.classList.add('selected'); // Select main image initially

        wrapper.onclick = () => {
            setMainView(item);
            document.querySelectorAll('.grid-item').forEach(i => i.classList.remove('selected'));
            wrapper.classList.add('selected');
        };
        grid.appendChild(wrapper);
    });

    // Populate GitHub Link
    const githubContainer = document.getElementById('project-modal-github');
    githubContainer.innerHTML = '';
    if (data.github) {
        const githubLink = document.createElement('a');
        githubLink.href = data.github;
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.className = 'project-github-btn';
        githubLink.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span data-i18n="proj_view_code">View Code</span>
        `;
        githubContainer.appendChild(githubLink);
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.project-link')) return;
        const projectId = card.getAttribute('data-project');
        openProjectModal(projectId);
    });
});

// --- Image Lightbox Logic ---
let currentLightboxImages = [];
let currentLightboxIndex = 0;

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxContainer = lightboxModal.querySelector('.lightbox-image-container');

const openLightbox = (index, images) => {
    currentLightboxImages = images;
    currentLightboxIndex = index;
    updateLightboxUI();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const updateLightboxUI = () => {
    lightboxImg.src = currentLightboxImages[currentLightboxIndex];
    lightboxContainer.classList.remove('zoomed');
    lightboxImg.style.transform = 'scale(1)';
};

const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxContainer.classList.remove('zoomed');
    if (!projectModal.classList.contains('active')) {
        document.body.style.overflow = 'auto';
    }
};

const nextLightboxImage = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxUI();
};

const prevLightboxImage = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxUI();
};

// Lightbox Event Listeners
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); nextLightboxImage(); });
document.getElementById('lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); prevLightboxImage(); });

lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
    }
});

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
});

// --- Modal Close Universal ---
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = 'auto';
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        // Only restore scroll if no other modal is active
        if (!document.querySelector('.modal.active')) {
            document.body.style.overflow = 'auto';
        }
    }
});
