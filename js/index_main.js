
// ===========================
// Articles Database
// ===========================
/*
const articles = [
  {
    type: "Original Research",
    title: "Effects of Resistance Training Frequency on Muscle Hypertrophy in Untrained Young Adults: A Randomized Controlled Trial",
    authors: "Zhang, W., Li, M., Chen, X.",
    affiliation: "Department of Kinesiology, [University]",
    pages: "1–14",
    doi: "10.xxxxx/jmehs.2025.001",
    pdf: "papers/zhang-et-al-2025.pdf"
  },
  {
    type: "Systematic Review",
    title: "Proprioceptive Training Interventions and Ankle Sprain Prevention in Athletes - A Systematic Review and Meta-Analysis",
    authors: "Wang, J., Liu, Y., Park, S.",
    affiliation: "[University]",
    pages: "15–29",
    doi: "10.xxxxx/jmehs.2025.002",
    pdf: "papers/wang-et-al-2025.pdf"
  },
  {
    type: "Original Research",
    title: "Gait Asymmetry Patterns Following Anterior Cruciate Ligament Reconstruction - A Six-Month Longitudinal Analysis",
    authors: "Chen, R., Thompson, A.",
    affiliation: "School of Health Sciences, [University]",
    pages: "30–41",
    doi: "10.xxxxx/jmehs.2025.003",
    pdf: "papers/chen-thompson-2025.pdf"
  },
  {
    type: "Narrative Review",
    title: "Physical Activity Promotion Strategies Among University Students - Evidence Synthesis and Practical Recommendations",
    authors: "Liu, S., Huang, T., Zhao, Q.",
    affiliation: "[University]",
    pages: "42–55",
    doi: "10.xxxxx/jmehs.2025.004",
    pdf: "papers/liu-et-al-2025.pdf"
  },
  {
    type: "Case Study",
    title: "Return-to-Sport Protocol Following Hamstring Grade III Tear in a Competitive Sprinter - A Case Report",
    authors: "Kim, J., Nakamura, H.",
    affiliation: "Department of Sports Medicine, [University]",
    pages: "56–63",
    doi: "10.xxxxx/jmehs.2025.005",
    pdf: "papers/kim-nakamura-2025.pdf"
  }
];


// ===========================
// Render Articles
// ===========================


function renderArticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = articles.map(a => `
    <a class="article-card" href="${a.pdf}" target="_blank" onclick="event.stopPropagation();" style="cursor:default; text-decoration:none;">
      <div>
        <div class="article-type">${a.type}</div>
        <div class="article-title">${a.title}</div>
        <div class="article-authors">${a.authors}</div>
        <div class="article-meta">

          <span>
            pp. ${a.pages}
          </span>

          <span style="font-family:'DM Mono',monospace; font-size:11px;">
            ${a.doi}
          </span>
        </div>
      </div>

      <a href="${a.pdf}" target="_blank" class="pdf-btn" onclick="event.stopPropagation();">
        <svg class="pdf-icon" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        PDF
      </a>
    </a>
  `).join('');
}

*/

// ===========================
// Navigation
// ===========================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  document.getElementById('nav-' + name)?.classList.add('active');
  const cta = document.getElementById('cta-section');
  cta.style.display = (name === 'home' || name === 'current') ? '' : 'none';
  window.scrollTo(0, 0);
}

// ===========================
// Initialize
// ===========================
window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    showPage(hash);
  }

  loadIssues();
  loadCurrentIssue();
});


// ===========================
// Mobile Menu
// ===========================
function toggleMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('mobile-open');
  hamburger.classList.toggle('open');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.remove('mobile-open');
  hamburger.classList.remove('open');
}

// 點擊頁面其他地方關閉選單
document.addEventListener('click', (e) => {
  const nav = document.querySelector('nav');
  if (!nav.contains(e.target)) {
    closeMobileMenu();
  }
});
