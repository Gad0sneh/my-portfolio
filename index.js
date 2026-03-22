const GITHUB_USERNAME = "gad0sneh"; // Update if your GitHub handle differs

const FEATURED_REPOS = [
    {
        name: "Real-Time-Chat",
        url: "https://github.com/gad0sneh/realtime-chat",
        description: "Live WebSocket chat with presence, history sync, and resilient reconnects.",
        problem: "Teams need instant communication without refresh or delays.",
        solution: "Built a WebSocket-based chat with presence signals and history sync.",
        technology: "Node, Express, WebSockets",
        role: "Full-stack development, realtime architecture, UI implementation.",
        challenge: "Maintain consistent state during reconnects and high message volume.",
        decision: "Used event-driven WebSocket flow with in-memory history for fast sync.",
        impact: "Instant collaboration and faster coordination.",
        result: "Smooth, real-time messaging across connected clients.",
        topics: ["WebSockets", "Real-time", "Chat"],
        language: "Full-stack"
    },
    {
        name: "Ops-Command-Center",
        url: "https://github.com/gad0sneh/ops-command-center",
        description: "Real-time operations dashboard with live incident flow and service health monitoring.",
        problem: "Operational teams lacked a single live view of incidents and system health.",
        solution: "Built a command center that streams metrics, incidents, and service status.",
        technology: "Node, SSE, Vanilla JS",
        role: "Backend streaming, dashboard UI, system modeling.",
        challenge: "Deliver live updates without polling overhead.",
        decision: "Used SSE for push-based updates and modular UI panels.",
        impact: "Faster incident visibility and clearer operational decisions.",
        result: "Unified command center for live operational signals.",
        topics: ["Real-time", "Operations", "Monitoring"],
        language: "Full-stack"
    },
    {
        name: "PlatearIGR",
        url: "https://github.com/gad0sneh/PlatearIGR",
        description: "Revenue and tax automation platform for IGR teams with dashboards and compliance workflows.",
        problem: "Manual revenue workflows caused delays and weak visibility.",
        solution: "Delivered role-based dashboards and automated reporting workflows.",
        technology: "React, Node, REST APIs",
        role: "System design, frontend dashboards, API integration.",
        challenge: "Ensure data integrity and audit-ready reporting.",
        decision: "Implemented validation layers and structured reporting flows.",
        impact: "Improved reporting speed and clearer operational oversight.",
        result: "Faster reporting and clearer oversight for revenue teams.",
        topics: ["Payments", "Dashboards", "Automation"],
        language: "Full-stack"
    },
    {
        name: "PayZamfara-Frontend",
        url: "https://github.com/gad0sneh/payzamfara-frontend",
        description: "Payment-facing frontend for state revenue services with responsive user flows.",
        problem: "Citizens needed a clear, trustworthy payment experience.",
        solution: "Built a validation-first UI with transaction feedback and error recovery.",
        technology: "React, CSS, REST",
        role: "Frontend implementation, UX flows, state handling.",
        challenge: "Reduce failed submissions and user confusion.",
        decision: "Designed guided flows with strong validation and feedback states.",
        impact: "Reduced user errors and improved completion flow for payments.",
        result: "Cleaner payment journeys and fewer failed submissions.",
        topics: ["Payments", "Frontend", "UX"],
        language: "React"
    },
    {
        name: "SMS-Backend",
        url: "https://github.com/gad0sneh/sms-backend",
        description: "Secure API and data layer powering the Student Management System.",
        problem: "Data entry, auth, and reporting needed a reliable backend.",
        solution: "Implemented REST services with validation, auth, and reporting endpoints.",
        technology: "Node, Express, PostgreSQL",
        role: "Backend APIs, auth, data modeling.",
        challenge: "Ensure stable data handling and consistent reporting.",
        decision: "Structured schemas with role-based access and validation.",
        impact: "Stable API with cleaner data workflows and reporting confidence.",
        result: "Reliable backend with structured data integrity.",
        topics: ["API", "Auth", "PostgreSQL"],
        language: "Node"
    },
    {
        name: "Scholatify-360",
        url: "https://github.com/gad0sneh/scholatify-360",
        description: "Education management platform focused on student progress and analytics.",
        problem: "Institutions lacked a unified view of student performance.",
        solution: "Built analytics-first dashboards to consolidate student insights.",
        technology: "React, Node, Charts",
        role: "Full-stack delivery, analytics UI, reporting views.",
        challenge: "Normalize performance data into actionable signals.",
        decision: "Designed dashboard-first reporting views with clear filters.",
        impact: "Actionable visibility into performance and engagement.",
        result: "Clearer views of student progress.",
        topics: ["Education", "Analytics", "Dashboard"],
        language: "Full-stack"
    },
    {
        name: "Sundlash",
        url: "https://github.com/gad0sneh/sundlash",
        description: "Operations-focused web system for managing workflows and requests.",
        problem: "Manual operations created delays and inconsistent tracking.",
        solution: "Delivered a structured workflow system with clear status states.",
        technology: "Full-stack, REST, Auth",
        role: "Workflow design, UI, and integration.",
        challenge: "Make status changes visible and accountable.",
        decision: "Added workflow states and activity tracking by role.",
        impact: "Faster turnaround times and clearer operational logs.",
        result: "More predictable operations and faster approvals.",
        topics: ["Workflows", "Operations", "Automation"],
        language: "Full-stack"
    },
    {
        name: "Qorestack-Solution",
        url: "https://github.com/gad0sneh/qorestack-solution",
        description: "Business workflow solution with integrations and automation.",
        problem: "Manual approvals slowed down core operations.",
        solution: "Integrated services with automated approval routes.",
        technology: "Full-stack, APIs, Automation",
        role: "Integration design, workflow automation, UI delivery.",
        challenge: "Coordinate multiple systems while keeping audit visibility.",
        decision: "Used routing rules and integration checkpoints.",
        impact: "Shorter turnaround time and clearer operational tracking.",
        result: "Smoother approvals and better operational visibility.",
        topics: ["Integrations", "Automation", "Workflows"],
        language: "Full-stack"
    }
];

const PRIORITY_NAMES = FEATURED_REPOS.map(r => r.name.toLowerCase());
const KEYWORDS = ["platear", "igr", "sms", "qorestack", "payzamfara", "scholatify", "sundlash", "ops", "command", "monitoring", "incident", "chat", "realtime", "websocket"];

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
    return idx === -1 ? 1000 : idx;
}

function matchesBigProject(name) {
    const lower = name.toLowerCase();
    return PRIORITY_NAMES.includes(lower) || KEYWORDS.some(k => lower.includes(k));
}

function buildDetails(repo) {
    return {
        problem: repo.problem || "Focused on removing manual steps and improving clarity.",
        solution: repo.solution || "Built a focused system that removes friction and improves speed.",
        technology: repo.technology || (repo.language ? repo.language : "Web stack"),
        role: repo.role || "Full-stack delivery and system integration.",
        challenge: repo.challenge || "Balance speed, clarity, and reliability under real usage.",
        decision: repo.decision || "Chose architecture that favors maintainability and auditability.",
        impact: repo.impact || "Improved visibility and operational confidence.",
        result: repo.result || "Delivered a reliable solution with measurable improvements."
    };
}

function renderRepos(list, labelText) {
    projectsGrid.innerHTML = list
        .map(repo => {
            const topics = repo.topics?.slice(0, 3) || [];
            const details = buildDetails(repo);
            const liveDemo = repo.homepage || repo.live_demo;
            return `
            <article class="card">
                <div class="card-top">
                    <p class="pill">${repo.language || 'Web'}</p>
                    <h4>${repo.name}</h4>
                    <p class="muted">${repo.description || 'No description added yet, just relentless building.'}</p>
                    <ul class="project-details">
                        <li><strong>Problem:</strong> ${details.problem}</li>
                        <li><strong>Solution:</strong> ${details.solution}</li>
                        <li><strong>Tech stack:</strong> ${details.technology}</li>
                        <li><strong>Role:</strong> ${details.role}</li>
                        <li><strong>Challenge:</strong> ${details.challenge}</li>
                        <li><strong>Decision:</strong> ${details.decision}</li>
                        <li><strong>Impact:</strong> ${details.impact}</li>
                        <li><strong>Result:</strong> ${details.result}</li>
                    </ul>
                </div>
                <div class="card-bottom">
                    ${topics.map(t => `<span class="pill">${t}</span>`).join('')}
                    ${liveDemo ? `<a class="text-link" href="${liveDemo}" target="_blank" rel="noreferrer">Live -></a>` : '<span class="text-link is-disabled">Live (coming soon)</span>'}
                    <a class="text-link" href="${repo.html_url || repo.url}" target="_blank" rel="noreferrer">GitHub -></a>
                </div>
            </article>`;
        })
        .join('');

    projectsStatus.textContent = labelText;
}

function fetchWithTimeout(resource, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(resource, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeout));
}

async function fetchGitHubRepos() {
    if (!projectsGrid || !projectsStatus) return;

    renderRepos(FEATURED_REPOS, 'Showing highlighted projects only (GitHub unavailable).');
    projectsStatus.textContent = 'Loading GitHub projects...';

    try {
        const response = await fetchWithTimeout(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
            { headers: { 'Accept': 'application/vnd.github+json' } },
            7000
        );
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
            projectsStatus.textContent = 'Showing highlighted projects only.';
            return;
        }

        renderRepos(bigRepos, `Showing ${bigRepos.length} highlighted projects.`);
    } catch (error) {
        projectsStatus.textContent = 'Showing highlighted projects only (GitHub unavailable).';
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
