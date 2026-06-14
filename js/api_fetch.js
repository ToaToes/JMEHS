const OJS_BASE = 'https://ojs.jmehs.org/index.php/jmehs';
const OJS_API = `${OJS_BASE}/api/v1`;

// ===========================
// Strip HTML tags from description
// ===========================
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// ===========================
// Load All Issues → Home Page
// ===========================
async function loadIssues() {
  const container = document.getElementById('issues-grid');
  const titleEl = document.getElementById('home-issues-title');
  if (!container) return;

  container.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Loading issues...</p>';

  try {
    const res = await fetch(`${OJS_API}/issues?isPublished=true&orderBy=datePublished&orderDirection=DESC`);
    const data = await res.json();
    const issues = data.items || [];

    if (issues.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);">No issues published yet.</p>';
      return;
    }

    // Update section title with count
    if (titleEl) {
      titleEl.textContent = `${issues.length} Issue${issues.length > 1 ? 's' : ''} Published`;
    }

    const latestId = issues[0].id;

    container.innerHTML = issues.map((issue, index) => {
      const coverUrl = issue.coverImageUrl?.en || null;
      const title = issue.title?.en || issue.identification || `Vol. ${issue.volume} No. ${issue.number}`;
      const date = issue.datePublished?.slice(0, 7) || '';
      const url = issue.publishedUrl;
      const isCurrent = issue.id === latestId;

      return `
        <a href="${url}" target="_blank" class="issue-cover-card">
          ${isCurrent ? '<div class="issue-current-badge">Current Issue</div>' : ''}
          ${coverUrl
            ? `<img src="${coverUrl}" alt="${title}" class="issue-cover-img">`
            : `<div class="issue-cover-placeholder">
                <div>
                  <div style="font-size:11px; margin-bottom:4px;">Vol. ${issue.volume}</div>
                  <div style="font-size:11px;">No. ${issue.number}</div>
                </div>
               </div>`
          }
          <div class="issue-cover-info">
            <div class="issue-cover-title">${title}</div>
            <div class="issue-cover-date">${date}</div>
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load issues:', err);
    container.innerHTML = '<p style="color:var(--text-muted);">Unable to load issues.</p>';
  }
}

// ===========================
// Load Current Issue Articles
// ===========================
async function loadCurrentIssue() {
  const container = document.getElementById('current-articles');
  const bannerTitle = document.getElementById('current-issue-title');
  const bannerMeta = document.getElementById('current-issue-meta');
  const bannerBadge = document.getElementById('current-issue-badge');
  const heroTag = document.getElementById('current-hero-tag');
  const descEl = document.getElementById('current-issue-description');
  if (!container) return;

  container.innerHTML = '<p style="color:var(--text-muted); font-size:14px;">Loading articles...</p>';

  try {
    // Step 1: Get latest published issue
    const issueRes = await fetch(`${OJS_API}/issues?isPublished=true&count=1&orderBy=datePublished&orderDirection=DESC`);
    const issueData = await issueRes.json();
    const issue = issueData.items?.[0];

    if (!issue) {
      container.innerHTML = '<p style="color:var(--text-muted);">No published issues found.</p>';
      return;
    }

    // Step 2: Update banner and hero
    const identification = issue.identification || `Vol. ${issue.volume} No. ${issue.number} (${issue.year})`;
    const date = issue.datePublished?.slice(0, 7) || '';

    if (heroTag) heroTag.textContent = identification;
    if (bannerTitle) bannerTitle.textContent = identification;
    if (bannerBadge) bannerBadge.textContent = `JMEHS Vol.${issue.volume} No.${issue.number}`;

    // Step 3: Show issue description
    if (descEl && issue.description?.en) {
      descEl.textContent = stripHtml(issue.description.en);
    }

    // Step 4: Get articles for this issue
    const subRes = await fetch(`${OJS_API}/submissions?issueIds[]=${issue.id}&status=3`);
    const subData = await subRes.json();
    const submissions = subData.items || [];

    if (bannerMeta) {
      bannerMeta.textContent = `Published ${date} · ${submissions.length} Article${submissions.length !== 1 ? 's' : ''} · Open Access`;
    }

    if (submissions.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);">No articles in this issue yet.</p>';
      return;
    }

    // Step 5: Render articles
    container.innerHTML = submissions.map(sub => {
      const pub = sub.publications?.[0];
      if (!pub) return '';

      const title = pub.fullTitle?.en || pub.title?.en || 'Untitled';
      const authors = pub.authorsString || pub.authorsStringShort || '';
      const doi = pub.doiObject?.doi || '';
      const url = sub.urlPublished;
      const pages = pub.pages || '';

      // Determine article type from section
      const sectionLabels = {
        1: 'Original Research',
        2: 'Review Article',
        3: 'Systematic Review',
        4: 'Case Study'
      };
      const articleType = sectionLabels[pub.sectionId] || 'Article';

      return `
        <a class="article-card" href="${url}" target="_blank">
          <div style="flex:1;">
            <div class="article-type">${articleType}</div>
            <div class="article-title">${title}</div>
            <div class="article-authors">${authors}</div>
            <div class="article-meta">
              ${pages ? `<span>pp. ${pages}</span>` : ''}
              ${doi ? `<span style="font-family:'DM Mono',monospace; font-size:11px;">${doi}</span>` : ''}
            </div>
          </div>
          <a href="${url}" target="_blank" class="pdf-btn" onclick="event.stopPropagation();">
            <svg class="pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            View
          </a>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load current issue:', err);
    container.innerHTML = '<p style="color:var(--text-muted);">Unable to load articles.</p>';
  }
}
