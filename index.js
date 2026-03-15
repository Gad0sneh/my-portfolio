const GITHUB_USERNAME = "gad0sneh"; // Update if your GitHub handle differs

const FEATURED_REPOS = [
    {
        name: "PlatearIGR",
        url: "https://github.com/gad0sneh/PlatearIGR",
        description: "Revenue and tax automation platform for IGR teams with dashboards and compliance workflows.",
        problem: "Manual revenue workflows caused delays and weak visibility.",
        method: "Modeled data flows, built role-based dashboards, and automated reporting.",
        technology: "React, Node, REST APIs",
        result: "Faster reporting and clearer oversight for revenue teams.",
        topics: ["Payments", "Dashboards", "Automation"],
        language: "Full-stack"
    },
    {
        name: "SMS-Frontend",
        url: "https://github.com/gad0sneh/sms-frontend",
        description: "Student Management System interface with responsive dashboards and role-based views.",
        problem: "Schools needed a consistent, modern UI for staff and students.",
        method: "Designed user flows, built reusable UI components, and optimized responsiveness.",
        technology: "React, CSS, REST",
        result: "Improved usability and faster navigation for daily school operations.",
        topics: ["UI", "Students", "Dashboard"],
        language: "React"
    },
    {
        name: "SMS-Backend",
        url: "https://github.com/gad0sneh/sms-backend",
        description: "Secure API and data layer powering the Student Management System.",
        problem: "Data entry, auth, and reporting needed a reliable backend.",
        method: "Built REST endpoints, validation, and role-based access control.",
        technology: "Node, Express, PostgreSQL",
        result: "Stable API with cleaner data workflows and audit-ready records.",
        topics: ["API", "Auth", "PostgreSQL"],
        language: "Node"
    },
    {
        name: "Qorestack-Solution",
        url: "https://github.com/gad0sneh/qorestack-solution",
        description: "Business workflow solution with integrations and automation.",
        problem: "Manual approvals slowed down core operations.",
        method: "Mapped workflows, integrated services, and automated approvals.",
        technology: "Full-stack, APIs, Automation",
        result: "Shorter turnaround time and clearer operational tracking.",
        topics: ["Integrations", "Automation", "Workflows"],
        language: "Full-stack"
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

function buildDetails(repo) {
    return {
        problem: repo.problem || "Focused on removing manual steps and improving clarity.",
        method: repo.method || "Defined requirements, built features, and validated outcomes.",
        technology: repo.technology || (repo.language ? repo.language : "Web stack"),
        result: repo.result || "Delivered a reliable solution with better usability."
    };
}

function renderRepos(list, labelText) {
    projectsGrid.innerHTML = list
        .map(repo => {
            const topics = repo.topics?.slice(0, 3) || [];
            const details = buildDetails(repo);
            return `
            <article class="card">
                <div class="card-top">
                    <p class="pill">${repo.language || 'Web'}</p>
                    <h4>${repo.name}</h4>
                    <p class="muted">${repo.description || 'No description added yet, just relentless building.'}</p>
                    <ul class="project-details">
                        <li><strong>Problem:</strong> ${details.problem}</li>
                        <li><strong>Method:</strong> ${details.method}</li>
                        <li><strong>Technology:</strong> ${details.technology}</li>
                        <li><strong>Result:</strong> ${details.result}</li>
                    </ul>
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
            })
            .map(repo => {
                const key = repo.name.toLowerCase();
                const match = FEATURED_REPOS.find(r => r.name.toLowerCase() === key);
                return match ? { ...repo, ...match } : repo;
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
