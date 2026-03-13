const GITHUB_USERNAME = "gad0sneh"; // Update if your GitHub handle differs

const FEATURED_REPOS = [
    {
        name: "PlatearIGR",
        url: "https://github.com/gad0sneh/PlatearIGR",
        description: "Revenue/tax automation platform (IGR) with dashboards and workflows.",
        language: "Full-stack",
        topics: ["Payments", "Dashboards", "Automation"]
    },
    {
        name: "SMS-Frontend",
        url: "https://github.com/gad0sneh/sms-frontend",
        description: "School/Student Management System UI with responsive dashboards.",
        language: "React",
        topics: ["UI", "Students", "Dashboard"]
    },
    {
        name: "SMS-Backend",
        url: "https://github.com/gad0sneh/sms-backend",
        description: "API + auth + data layer powering the SMS platform.",
        language: "Node",
        topics: ["API", "Auth", "PostgreSQL"]
    },
    {
        name: "Qorestack-Solution",
        url: "https://github.com/gad0sneh/qorestack-solution",
        description: "Business workflow solution with integrations and automation.",
        language: "Full-stack",
        topics: ["Integrations", "Automation", "Workflows"]
    }
];

const PRIORITY_NAMES = FEATURED_REPOS.map(r => r.name.toLowerCase());
const KEYWORDS = ["platear", "igr", "sms", "qorestack"]; // only show big projects

const projectsGrid = document.querySelector('[data-projects]');
const projectsStatus = document.querySelector('[data-projects-status]');
const navToggle = document.getElementById('nav-toggle');
const themeToggle = document.querySelector('[data-theme-toggle]');

function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    const isLight = document.body.classList.contains('light');
    icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved) {
        setTheme(saved);
    } else if (prefersLight) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

function priorityScore(name) {
    const idx = PRIORITY_NAMES.findIndex(p => p === name.toLowerCase());
    return idx === -1 ? 1000 : idx; // lower is higher priority
}

function matchesBigProject(name) {
    const lower = name.toLowerCase();
    return PRIORITY_NAMES.includes(lower) || KEYWORDS.some(k => lower.includes(k));
}

function renderRepos(list, labelText) {
    projectsGrid.innerHTML = list
        .map(repo => {
            const topics = repo.topics?.slice(0, 3) || [];
            return `
            <article class="card">
                <div class="card-top">
                    <p class="pill">${repo.language || 'Web'}</p>
                    <h4>${repo.name}</h4>
                    <p class="muted">${repo.description || 'No description added yet, just relentless building.'}</p>
                </div>
                <div class="card-bottom">
                    ${topics.map(t => `<span class="pill">${t}</span>`).join('')}
                    ${repo.stargazers_count !== undefined ? `<span class="pill">Stars: ${repo.stargazers_count}</span>` : ''}
                    ${repo.forks_count !== undefined ? `<span class="pill">Forks: ${repo.forks_count}</span>` : ''}
                    <a class="text-link" href="${repo.html_url || repo.url}" target="_blank" rel="noreferrer">View on GitHub -></a>
                </div>
            </article>`;
        })
        .join('');

    projectsStatus.textContent = labelText;
}

async function fetchGitHubRepos() {
    if (!projectsGrid || !projectsStatus) return;
    projectsStatus.textContent = 'Loading GitHub projects...';
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });
        if (!response.ok) throw new Error('GitHub request failed');
        const repos = await response.json();
        const bigRepos = repos
            .filter(repo => !repo.fork && !repo.private)
            .filter(repo => matchesBigProject(repo.name))
            .sort((a, b) => {
                const prio = priorityScore(a.name) - priorityScore(b.name);
                if (prio !== 0) return prio;
                const scoreA = (a.stargazers_count || 0) + (a.forks_count || 0);
                const scoreB = (b.stargazers_count || 0) + (b.forks_count || 0);
                if (scoreB !== scoreA) return scoreB - scoreA;
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

        if (!bigRepos.length) {
            renderRepos(FEATURED_REPOS, 'Showing highlighted projects only.');
            return;
        }

        renderRepos(bigRepos, `Showing ${bigRepos.length} highlighted projects.`);
    } catch (error) {
        console.error(error);
        renderRepos(FEATURED_REPOS, 'Showing highlighted projects only.');
    }
}

function closeNavOnNavigate() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => link.addEventListener('click', () => {
        if (navToggle) navToggle.checked = false;
    }));
}

function init() {
    document.body.classList.remove('preload');
    initTheme();
    fetchGitHubRepos();
    closeNavOnNavigate();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.body.classList.contains('light') ? 'dark' : 'light';
            setTheme(next);
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
