// ============================================================================
// REVA CONNECT - TEACHER-STUDENT COMMUNICATION PORTAL
// MAIN APPLICATION LOGIC & CONTROLLER
// ============================================================================

(function () {
  // --- APPLICATION STATE ---
  let currentRole = "teacher"; // "teacher" | "student"
  let currentUser = window.MOCK_USERS[currentRole];
  let activeTab = "dashboard";
  let activeChannelId = "cs301-data-structures";
  let annFilter = "all";
  let doubtsFilter = "all";
  let resFilter = "all";

  // --- DOM ELEMENTS CACHE ---
  const elements = {
    // Nav & Controls
    navTabs: document.querySelectorAll(".nav-tab-btn"),
    sections: document.querySelectorAll(".portal-section"),
    roleTeacherBtn: document.getElementById("roleTeacherBtn"),
    roleStudentBtn: document.getElementById("roleStudentBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    supabaseStatusBtn: document.getElementById("supabaseStatusBtn"),
    supabaseStatusLabel: document.getElementById("supabaseStatusLabel"),
    userProfileBtn: document.getElementById("userProfileBtn"),
    headerUserAvatar: document.getElementById("headerUserAvatar"),
    headerUserName: document.getElementById("headerUserName"),
    headerUserRole: document.getElementById("headerUserRole"),
    welcomeUserHeading: document.getElementById("welcomeUserHeading"),
    annBadgeCount: document.getElementById("annBadgeCount"),
    urgentTicker: document.getElementById("urgentTicker"),
    tickerCloseBtn: document.getElementById("tickerCloseBtn"),

    // Dashboard
    dashboardActionPrimary: document.getElementById("dashboardActionPrimary"),
    dashboardPrimaryBtnText: document.getElementById("dashboardPrimaryBtnText"),
    openChatQuickBtn: document.getElementById("openChatQuickBtn"),
    dashboardAnnouncementsList: document.getElementById("dashboardAnnouncementsList"),
    dashboardDoubtsList: document.getElementById("dashboardDoubtsList"),
    statOpenDoubtsCount: document.getElementById("statOpenDoubtsCount"),
    statAnnouncementsCount: document.getElementById("statAnnouncementsCount"),

    // Announcements
    fullAnnouncementsList: document.getElementById("fullAnnouncementsList"),
    annSearchInput: document.getElementById("annSearchInput"),
    annFilterChips: document.getElementById("annFilterChips"),
    openNewAnnModalBtn: document.getElementById("openNewAnnModalBtn"),

    // Chat
    chatChannelsList: document.getElementById("chatChannelsList"),
    activeChannelTitle: document.getElementById("activeChannelTitle"),
    activeChannelDescription: document.getElementById("activeChannelDescription"),
    activeChannelCode: document.getElementById("activeChannelCode"),
    chatMessagesScroll: document.getElementById("chatMessagesScroll"),
    chatMessageInput: document.getElementById("chatMessageInput"),
    chatTagSelect: document.getElementById("chatTagSelect"),
    chatSendBtn: document.getElementById("chatSendBtn"),

    // Doubts
    doubtsList: document.getElementById("doubtsList"),
    doubtsSearchInput: document.getElementById("doubtsSearchInput"),
    doubtsFilterChips: document.getElementById("doubtsFilterChips"),
    openAskDoubtModalBtn: document.getElementById("openAskDoubtModalBtn"),

    // Resources
    resourcesGrid: document.getElementById("resourcesGrid"),
    resourcesSearchInput: document.getElementById("resourcesSearchInput"),
    resourcesFilterChips: document.getElementById("resourcesFilterChips"),
    openNewResourceModalBtn: document.getElementById("openNewResourceModalBtn"),

    // Assignments
    assignmentsList: document.getElementById("assignmentsList"),
    openNewAssignmentModalBtn: document.getElementById("openNewAssignmentModalBtn"),

    // Modals
    modalSupabaseConfig: document.getElementById("modalSupabaseConfig"),
    modalNewAnnouncement: document.getElementById("modalNewAnnouncement"),
    modalAskDoubt: document.getElementById("modalAskDoubt"),
    modalNewResource: document.getElementById("modalNewResource"),
    modalSubmitAssignment: document.getElementById("modalSubmitAssignment"),
    modalUserProfile: document.getElementById("modalUserProfile"),

    // Supabase config modal fields
    sbUrlInput: document.getElementById("sbUrlInput"),
    sbKeyInput: document.getElementById("sbKeyInput"),
    sbSaveBtn: document.getElementById("sbSaveBtn"),
    sbResetDemoBtn: document.getElementById("sbResetDemoBtn"),
    sbTestResultBox: document.getElementById("sbTestResultBox"),

    // Modal submit buttons
    annSubmitBtn: document.getElementById("annSubmitBtn"),
    doubtSubmitBtn: document.getElementById("doubtSubmitBtn"),
    resSubmitBtn: document.getElementById("resSubmitBtn"),
    subSubmitBtn: document.getElementById("subSubmitBtn"),

    // Toast container
    toastContainer: document.getElementById("toastContainer")
  };

  // --- INITIALIZATION ---
  function init() {
    setupTheme();
    setupEventListeners();
    updateUserRoleUI();
    renderAll();
    setupSupabaseUI();
  }

  // --- THEME SETUP ---
  function setupTheme() {
    const savedTheme = localStorage.getItem("reva_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("reva_theme", newTheme);
    showToast(`Switched to ${newTheme} mode`, "info");
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "info", duration = 3500) {
    const toast = document.createElement("div");
    toast.className = `toast-message ${type}`;

    let icon = "⚡";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";
    if (type === "info") icon = "ℹ️";

    toast.innerHTML = `
      <span style="font-size:1.1rem;">${icon}</span>
      <span style="flex:1;">${escapeHTML(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- UTILITY: FORMAT DATE ---
  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- ROLE MANAGEMENT & PERMISSION ENFORCEMENT ---
  function setRole(role) {
    currentRole = role;
    currentUser = window.MOCK_USERS[role];

    // Update buttons
    elements.roleTeacherBtn.classList.toggle("active", role === "teacher");
    elements.roleStudentBtn.classList.toggle("active", role === "student");

    updateUserRoleUI();
    renderAll();

    const title = role === "teacher" ? "Dr. Rajesh Sharma (Faculty)" : "Aanya Patel (Student)";
    showToast(`Active profile switched to: ${title}`, "success");
  }

  function updateUserRoleUI() {
    elements.headerUserName.textContent = currentUser.name;
    elements.headerUserRole.textContent = currentUser.role === "teacher" ? "Faculty" : "Student";
    elements.headerUserAvatar.src = currentUser.avatar;

    elements.welcomeUserHeading.textContent = `Welcome back, ${currentUser.name}`;

    // Toggle teacher-only actions
    const teacherOnlyElements = document.querySelectorAll(".teacher-only");
    teacherOnlyElements.forEach(el => {
      el.style.display = currentRole === "teacher" ? "inline-flex" : "none";
    });

    // Dashboard primary CTA label adapts
    if (currentRole === "teacher") {
      elements.dashboardPrimaryBtnText.textContent = "Post Announcement";
    } else {
      elements.dashboardPrimaryBtnText.textContent = "Ask a Doubt";
    }
  }

  // --- SUPABASE UI & MODAL ---
  function setupSupabaseUI() {
    updateSupabaseBadge();
    window.addEventListener("supabaseStatusChanged", updateSupabaseBadge);

    const creds = window.supabaseManager.getCredentials();
    if (creds.url) elements.sbUrlInput.value = creds.url;
    if (creds.anonKey) elements.sbKeyInput.value = creds.anonKey;
  }

  function updateSupabaseBadge() {
    if (window.supabaseManager && window.supabaseManager.isConnected) {
      elements.supabaseStatusBtn.className = "supabase-badge-btn";
      elements.supabaseStatusLabel.textContent = "🟢 Connected to Supabase";
    } else {
      elements.supabaseStatusBtn.className = "supabase-badge-btn demo-mode";
      elements.supabaseStatusLabel.textContent = "⚡ Demo Mode (Connect Supabase)";
    }
  }

  // --- MODAL CONTROLS ---
  function openModal(modal) {
    if (modal) modal.classList.add("active");
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove("active");
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Ticker dismiss
    elements.tickerCloseBtn.addEventListener("click", () => {
      elements.urgentTicker.style.display = "none";
    });

    // Theme toggle
    elements.themeToggleBtn.addEventListener("click", toggleTheme);

    // Role switcher
    elements.roleTeacherBtn.addEventListener("click", () => setRole("teacher"));
    elements.roleStudentBtn.addEventListener("click", () => setRole("student"));

    // User Profile button
    elements.userProfileBtn.addEventListener("click", showProfileModal);

    // Nav tabs
    elements.navTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });

    // Dashboard actions
    elements.dashboardActionPrimary.addEventListener("click", () => {
      if (currentRole === "teacher") {
        openModal(elements.modalNewAnnouncement);
      } else {
        openModal(elements.modalAskDoubt);
      }
    });

    elements.openChatQuickBtn.addEventListener("click", () => {
      switchTab("chat");
    });

    // Supabase button
    elements.supabaseStatusBtn.addEventListener("click", () => {
      elements.sbTestResultBox.style.display = "none";
      openModal(elements.modalSupabaseConfig);
    });

    elements.sbSaveBtn.addEventListener("click", async () => {
      const url = elements.sbUrlInput.value.trim();
      const key = elements.sbKeyInput.value.trim();
      if (!url || !key) {
        showToast("Please enter both Supabase Project URL and Anon Key", "error");
        return;
      }
      elements.sbSaveBtn.textContent = "Connecting...";
      const res = await window.supabaseManager.setCredentials(url, key);
      elements.sbSaveBtn.textContent = "Save & Connect";

      elements.sbTestResultBox.style.display = "block";
      if (res.success) {
        elements.sbTestResultBox.style.background = "rgba(16, 185, 129, 0.15)";
        elements.sbTestResultBox.style.color = "#10b981";
        elements.sbTestResultBox.textContent = res.message || res.warning || "Connected to Supabase!";
        showToast("Supabase configured successfully!", "success");
        setTimeout(() => closeModal(elements.modalSupabaseConfig), 1200);
      } else {
        elements.sbTestResultBox.style.background = "rgba(244, 63, 94, 0.15)";
        elements.sbTestResultBox.style.color = "#f43f5e";
        elements.sbTestResultBox.textContent = `Connection failed: ${res.error}`;
        showToast("Supabase connection check failed", "error");
      }
    });

    elements.sbResetDemoBtn.addEventListener("click", () => {
      window.supabaseManager.clearCredentials();
      elements.sbUrlInput.value = "";
      elements.sbKeyInput.value = "";
      elements.sbTestResultBox.style.display = "none";
      closeModal(elements.modalSupabaseConfig);
      showToast("Reset to interactive demo local database", "info");
      renderAll();
    });

    // Close buttons on all modals
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop");
        closeModal(modal);
      });
    });

    // Close modal when clicking outside
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });

    // Modals open buttons
    if (elements.openNewAnnModalBtn) {
      elements.openNewAnnModalBtn.addEventListener("click", () => openModal(elements.modalNewAnnouncement));
    }
    if (elements.openAskDoubtModalBtn) {
      elements.openAskDoubtModalBtn.addEventListener("click", () => openModal(elements.modalAskDoubt));
    }
    if (elements.openNewResourceModalBtn) {
      elements.openNewResourceModalBtn.addEventListener("click", () => openModal(elements.modalNewResource));
    }

    // Modal submit forms
    elements.annSubmitBtn.addEventListener("click", handleCreateAnnouncement);
    elements.doubtSubmitBtn.addEventListener("click", handleCreateDoubt);
    elements.resSubmitBtn.addEventListener("click", handleCreateResource);
    elements.subSubmitBtn.addEventListener("click", handleSubmitAssignment);

    // Announcements filters & search
    if (elements.annFilterChips) {
      elements.annFilterChips.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          elements.annFilterChips.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          annFilter = chip.dataset.filter;
          renderAnnouncements();
        });
      });
    }
    if (elements.annSearchInput) {
      elements.annSearchInput.addEventListener("input", renderAnnouncements);
    }

    // Doubts filters & search
    if (elements.doubtsFilterChips) {
      elements.doubtsFilterChips.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          elements.doubtsFilterChips.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          doubtsFilter = chip.dataset.filter;
          renderDoubts();
        });
      });
    }
    if (elements.doubtsSearchInput) {
      elements.doubtsSearchInput.addEventListener("input", renderDoubts);
    }

    // Resources filters & search
    if (elements.resourcesFilterChips) {
      elements.resourcesFilterChips.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          elements.resourcesFilterChips.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          resFilter = chip.dataset.filter;
          renderResources();
        });
      });
    }
    if (elements.resourcesSearchInput) {
      elements.resourcesSearchInput.addEventListener("input", renderResources);
    }

    // Chat send button & Enter key
    elements.chatSendBtn.addEventListener("click", handleSendMessage);
    elements.chatMessageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  // --- NAVIGATION TAB SWITCHER ---
  function switchTab(tabId) {
    activeTab = tabId;

    // Update tab buttons
    elements.navTabs.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });

    // Update visible section
    elements.sections.forEach(sec => {
      sec.classList.remove("active");
    });

    const targetSection = document.getElementById(`section${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Render corresponding section data
    if (tabId === "dashboard") renderDashboard();
    if (tabId === "announcements") renderAnnouncements();
    if (tabId === "chat") renderChat();
    if (tabId === "doubts") renderDoubts();
    if (tabId === "resources") renderResources();
    if (tabId === "assignments") renderAssignments();
  }

  // --- RENDER ALL SECTIONS ---
  async function renderAll() {
    await renderDashboard();
    await renderAnnouncements();
    await renderChat();
    await renderDoubts();
    await renderResources();
    await renderAssignments();
  }

  // ==========================================================================
  // SECTION 1: DASHBOARD
  // ==========================================================================
  async function renderDashboard() {
    const announcements = await window.supabaseManager.getAnnouncements();
    const doubts = await window.supabaseManager.getDoubts();

    // Stats
    const openDoubts = doubts.filter(d => d.status === "open").length;
    elements.statOpenDoubtsCount.textContent = openDoubts;
    elements.statAnnouncementsCount.textContent = announcements.length;
    elements.annBadgeCount.textContent = announcements.length;

    // Recent announcements (top 3)
    const recentAnn = announcements.slice(0, 3);
    elements.dashboardAnnouncementsList.innerHTML = recentAnn.map(ann => renderAnnouncementCardHTML(ann)).join("");

    // Recent doubts (top 3)
    const recentDoubts = doubts.slice(0, 3);
    elements.dashboardDoubtsList.innerHTML = recentDoubts.map(d => `
      <div style="background:var(--bg-surface-elevated); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="badge badge-course">${escapeHTML(d.course_code)}</span>
            <span style="font-size:0.75rem; color:${d.status === 'resolved' ? 'var(--status-success)' : 'var(--status-urgent)'}; font-weight:700; text-transform:uppercase;">
              ${d.status === 'resolved' ? '✅ Resolved' : '⭕ Unresolved'}
            </span>
          </div>
          <div style="font-size:0.9rem; font-weight:600; color:var(--text-primary);">${escapeHTML(d.title)}</div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="window.viewDoubtDetail('${d.id}')">View</button>
      </div>
    `).join("");

    attachAnnouncementCardHandlers();
  }

  // ==========================================================================
  // SECTION 2: ANNOUNCEMENTS
  // ==========================================================================
  async function renderAnnouncements() {
    let announcements = await window.supabaseManager.getAnnouncements();

    // Filter by category
    if (annFilter !== "all") {
      announcements = announcements.filter(a => a.category.toLowerCase() === annFilter.toLowerCase());
    }

    // Search query
    const query = elements.annSearchInput ? elements.annSearchInput.value.toLowerCase().trim() : "";
    if (query) {
      announcements = announcements.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.course_code.toLowerCase().includes(query)
      );
    }

    if (announcements.length === 0) {
      elements.fullAnnouncementsList.innerHTML = `
        <div style="text-align:center; padding:48px; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
          <div style="font-size:2rem; margin-bottom:8px;">📢</div>
          <div style="font-weight:600;">No announcements found matching criteria.</div>
        </div>
      `;
      return;
    }

    elements.fullAnnouncementsList.innerHTML = announcements.map(ann => renderAnnouncementCardHTML(ann)).join("");
    attachAnnouncementCardHandlers();
  }

  function renderAnnouncementCardHTML(ann) {
    const isPinned = ann.is_pinned;
    const cat = (ann.category || "general").toLowerCase();

    return `
      <div class="announcement-card ${isPinned ? 'pinned' : ''} ${cat}" data-id="${ann.id}">
        <div class="ann-top-row">
          <div class="ann-badges">
            <span class="badge badge-${cat}">${cat}</span>
            <span class="badge badge-course">${escapeHTML(ann.course_code || 'All Courses')}</span>
            ${isPinned ? '<span style="font-size:0.75rem; color:var(--accent-secondary); font-weight:600;">📌 Pinned</span>' : ''}
          </div>
          <span class="ann-time">${timeAgo(ann.created_at)}</span>
        </div>

        <h3 class="ann-title">${escapeHTML(ann.title)}</h3>
        <p class="ann-content">${escapeHTML(ann.content)}</p>

        ${ann.attachment_name ? `
          <a href="#" class="ann-attachment" onclick="window.downloadAttachment('${escapeHTML(ann.attachment_name)}'); return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            ${escapeHTML(ann.attachment_name)}
          </a>
        ` : ''}

        <div class="ann-footer">
          <div class="ann-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>${escapeHTML(ann.author_name)}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">(${escapeHTML(ann.author_role || 'Faculty')})</span>
          </div>
          <button class="ann-ack-btn" data-id="${ann.id}">
            ✓ Acknowledge (${ann.acknowledged_count || 0})
          </button>
        </div>
      </div>
    `;
  }

  function attachAnnouncementCardHandlers() {
    document.querySelectorAll(".ann-ack-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = btn.dataset.id;
        btn.disabled = true;
        const res = await window.supabaseManager.acknowledgeAnnouncement(id);
        if (res) {
          btn.innerHTML = `✓ Acknowledged (${res.acknowledged_count})`;
          showToast("Announcement acknowledged", "success");
        }
      });
    });
  }

  async function handleCreateAnnouncement() {
    const title = document.getElementById("annTitleInput").value.trim();
    const course = document.getElementById("annCourseSelect").value;
    const category = document.getElementById("annCategorySelect").value;
    const content = document.getElementById("annContentInput").value.trim();
    const attachment = document.getElementById("annAttachmentInput").value.trim();
    const isPinned = document.getElementById("annIsPinnedInput").checked;

    if (!title || !content) {
      showToast("Please provide both title and content.", "error");
      return;
    }

    elements.annSubmitBtn.disabled = true;
    await window.supabaseManager.createAnnouncement({
      title,
      course_code: course,
      category,
      content,
      attachment_name: attachment || null,
      attachment_url: attachment ? "#" : null,
      is_pinned: isPinned,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: currentUser.role
    });

    elements.annSubmitBtn.disabled = false;
    closeModal(elements.modalNewAnnouncement);

    // Reset form
    document.getElementById("annTitleInput").value = "";
    document.getElementById("annContentInput").value = "";
    document.getElementById("annAttachmentInput").value = "";
    document.getElementById("annIsPinnedInput").checked = false;

    showToast("Announcement broadcasted successfully!", "success");
    renderDashboard();
    renderAnnouncements();
  }

  // ==========================================================================
  // SECTION 3: LIVE ACADEMIC CHAT
  // ==========================================================================
  async function renderChat() {
    const channels = await window.supabaseManager.getChannels();
    const currentChannel = channels.find(c => c.id === activeChannelId) || channels[0];

    if (currentChannel) {
      activeChannelId = currentChannel.id;
      elements.activeChannelTitle.textContent = `#${currentChannel.id}`;
      elements.activeChannelDescription.textContent = currentChannel.description;
      elements.activeChannelCode.textContent = currentChannel.course_code;
    }

    // Render channels sidebar
    elements.chatChannelsList.innerHTML = channels.map(c => `
      <div class="channel-item ${c.id === activeChannelId ? 'active' : ''}" data-channel="${c.id}">
        <div class="channel-name-wrap">
          <span class="channel-hash">#</span>
          <span style="font-size:0.86rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(c.name)}</span>
        </div>
        ${c.unread ? `<span class="tab-badge">${c.unread}</span>` : ''}
      </div>
    `).join("");

    // Channel click events
    elements.chatChannelsList.querySelectorAll(".channel-item").forEach(item => {
      item.addEventListener("click", () => {
        activeChannelId = item.dataset.channel;
        renderChat();
      });
    });

    // Render messages
    await renderMessages();
  }

  async function renderMessages() {
    const messages = await window.supabaseManager.getMessages(activeChannelId);

    if (messages.length === 0) {
      elements.chatMessagesScroll.innerHTML = `
        <div style="text-align:center; padding:32px; color:var(--text-muted);">
          <p>No messages yet in this channel. Start the academic discussion!</p>
        </div>
      `;
      return;
    }

    elements.chatMessagesScroll.innerHTML = messages.map(msg => {
      const isMine = msg.sender_id === currentUser.id;
      const avatar = msg.sender_role === "teacher"
        ? window.MOCK_USERS.teacher.avatar
        : window.MOCK_USERS.student.avatar;

      return `
        <div class="message-item ${isMine ? 'mine' : ''}" data-id="${msg.id}">
          <img class="msg-avatar" src="${avatar}" alt="${escapeHTML(msg.sender_name)}">
          <div class="msg-body">
            <div class="msg-header">
              <span class="msg-sender">${escapeHTML(msg.sender_name)}</span>
              <span class="msg-role-tag ${msg.sender_role}">${msg.sender_role}</span>
              <span class="msg-time">${timeAgo(msg.created_at)}</span>
            </div>
            
            <div class="msg-bubble">
              ${msg.tag && msg.tag !== 'general' ? `<div class="msg-tag-badge msg-tag-${msg.tag}">${msg.tag}</div>` : ''}
              <div>${formatChatMessage(msg.content)}</div>
            </div>

            <div class="msg-reactions">
              ${(msg.reactions || []).map(r => `
                <button class="reaction-btn" onclick="window.reactMsg('${msg.id}', '${r.emoji}')">
                  ${r.emoji} ${r.count}
                </button>
              `).join("")}
              <button class="reaction-btn" onclick="window.promptReact('${msg.id}')" title="Add reaction">+</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Scroll to bottom
    elements.chatMessagesScroll.scrollTop = elements.chatMessagesScroll.scrollHeight;
  }

  function formatChatMessage(content) {
    if (!content) return "";
    // If contains code block
    if (content.includes("```")) {
      return content.replace(/```([a-z]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code>${escapeHTML(code.trim())}</code></pre>`;
      });
    }
    return escapeHTML(content);
  }

  async function handleSendMessage() {
    const text = elements.chatMessageInput.value.trim();
    if (!text) return;

    const tag = elements.chatTagSelect.value;
    elements.chatMessageInput.value = "";

    await window.supabaseManager.sendMessage(activeChannelId, {
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      content: text,
      tag: tag
    });

    renderMessages();
  }

  window.reactMsg = async function (msgId, emoji) {
    await window.supabaseManager.addReaction(activeChannelId, msgId, emoji);
    renderMessages();
  };

  window.promptReact = async function (msgId) {
    const emojis = ["👍", "❤️", "💡", "🔥", "❓", "🚀"];
    const chosen = emojis[Math.floor(Math.random() * emojis.length)];
    await window.supabaseManager.addReaction(activeChannelId, msgId, chosen);
    renderMessages();
  };

  // ==========================================================================
  // SECTION 4: DOUBTS & Q&A FORUM
  // ==========================================================================
  async function renderDoubts() {
    let doubts = await window.supabaseManager.getDoubts();

    if (doubtsFilter === "open") {
      doubts = doubts.filter(d => d.status === "open");
    } else if (doubtsFilter === "resolved") {
      doubts = doubts.filter(d => d.status === "resolved");
    }

    const query = elements.doubtsSearchInput ? elements.doubtsSearchInput.value.toLowerCase().trim() : "";
    if (query) {
      doubts = doubts.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.course_code.toLowerCase().includes(query)
      );
    }

    if (doubts.length === 0) {
      elements.doubtsList.innerHTML = `
        <div style="text-align:center; padding:48px; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
          <div style="font-size:2rem; margin-bottom:8px;">💡</div>
          <div style="font-weight:600;">No academic doubts found matching filter.</div>
        </div>
      `;
      return;
    }

    elements.doubtsList.innerHTML = doubts.map(d => `
      <div class="doubt-card" id="doubt_card_${d.id}">
        <div class="doubt-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge badge-course">${escapeHTML(d.course_code)}</span>
            <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:${d.status === 'resolved' ? 'var(--status-success)' : 'var(--status-urgent)'};">
              ${d.status === 'resolved' ? '✅ Teacher Verified Solution' : '⭕ Unresolved Query'}
            </span>
          </div>
          <span style="font-size:0.78rem; color:var(--text-muted);">${timeAgo(d.created_at)}</span>
        </div>

        <h3 class="doubt-title">${escapeHTML(d.title)}</h3>
        <p class="doubt-description">${escapeHTML(d.description)}</p>

        ${d.code_snippet ? `
          <div class="doubt-code-block">
            <pre><code>${escapeHTML(d.code_snippet)}</code></pre>
          </div>
        ` : ''}

        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">
          Asked by <strong style="color:var(--text-secondary);">${escapeHTML(d.student_name)}</strong>
        </div>

        <!-- Replies List -->
        <div class="doubt-replies-list">
          <div style="font-size:0.82rem; font-weight:700; color:var(--text-secondary); margin-bottom:4px;">
            Replies & Solutions (${(d.replies || []).length})
          </div>
          
          ${(d.replies && d.replies.length > 0) ? d.replies.map(r => `
            <div class="reply-item ${r.is_verified_by_teacher ? 'verified' : ''}">
              ${r.is_verified_by_teacher ? `
                <div class="verified-stamp">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Verified Faculty Solution
                </div>
              ` : ''}
              <div class="reply-author">${escapeHTML(r.author_name)} <span style="font-size:0.7rem; color:var(--text-muted);">(${escapeHTML(r.author_role)})</span></div>
              <div class="reply-content">${escapeHTML(r.content)}</div>
            </div>
          `).join("") : '<div style="font-size:0.82rem; color:var(--text-muted); font-style:italic;">No replies yet. Be the first to answer!</div>'}
        </div>

        <!-- Inline Reply Form -->
        <div style="display:flex; gap:8px; margin-top:14px;">
          <input type="text" id="reply_input_${d.id}" placeholder="${currentRole === 'teacher' ? 'Answer as Faculty (auto-verified)...' : 'Contribute a solution or hint...'}" style="flex:1; background:var(--bg-input); border:1px solid var(--border-subtle); padding:8px 12px; border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; outline:none;">
          <button class="btn btn-sm btn-primary" onclick="window.submitDoubtReply('${d.id}')">Reply</button>
        </div>

        <div class="doubt-footer">
          <button class="upvote-btn" onclick="window.upvoteDoubt('${d.id}')">
            ▲ Helpful (${d.upvotes || 0})
          </button>
          <span style="font-size:0.8rem; color:var(--text-muted);">${(d.replies || []).length} answers</span>
        </div>
      </div>
    `).join("");
  }

  async function handleCreateDoubt() {
    const title = document.getElementById("doubtTitleInput").value.trim();
    const course = document.getElementById("doubtCourseSelect").value;
    const desc = document.getElementById("doubtDescInput").value.trim();
    const code = document.getElementById("doubtCodeInput").value.trim();

    if (!title || !desc) {
      showToast("Please provide both title and description.", "error");
      return;
    }

    elements.doubtSubmitBtn.disabled = true;
    await window.supabaseManager.createDoubt({
      title,
      course_code: course,
      description: desc,
      code_snippet: code || null,
      student_id: currentUser.id,
      student_name: currentUser.name
    });

    elements.doubtSubmitBtn.disabled = false;
    closeModal(elements.modalAskDoubt);

    // Reset fields
    document.getElementById("doubtTitleInput").value = "";
    document.getElementById("doubtDescInput").value = "";
    document.getElementById("doubtCodeInput").value = "";

    showToast("Academic doubt submitted to faculty and peers!", "success");
    renderDashboard();
    renderDoubts();
  }

  window.submitDoubtReply = async function (doubtId) {
    const input = document.getElementById(`reply_input_${doubtId}`);
    if (!input) return;
    const content = input.value.trim();
    if (!content) return;

    input.value = "";
    await window.supabaseManager.replyToDoubt(doubtId, {
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: currentUser.role,
      content: content
    });

    showToast(currentRole === "teacher" ? "Faculty solution posted and verified!" : "Reply submitted!", "success");
    renderDoubts();
  };

  window.upvoteDoubt = async function (doubtId) {
    await window.supabaseManager.upvoteDoubt(doubtId);
    showToast("Marked as helpful!", "info");
    renderDoubts();
  };

  window.viewDoubtDetail = function (doubtId) {
    switchTab("doubts");
    setTimeout(() => {
      const el = document.getElementById(`doubt_card_${doubtId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.borderColor = "var(--accent-primary)";
        setTimeout(() => el.style.borderColor = "", 2000);
      }
    }, 150);
  };

  // ==========================================================================
  // SECTION 5: ACADEMIC RESOURCES
  // ==========================================================================
  async function renderResources() {
    let resources = await window.supabaseManager.getResources();

    if (resFilter !== "all") {
      resources = resources.filter(r => r.category.toLowerCase() === resFilter.toLowerCase());
    }

    const query = elements.resourcesSearchInput ? elements.resourcesSearchInput.value.toLowerCase().trim() : "";
    if (query) {
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.course_code.toLowerCase().includes(query)
      );
    }

    if (resources.length === 0) {
      elements.resourcesGrid.innerHTML = `
        <div style="text-align:center; padding:48px; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-subtle); grid-column:1/-1;">
          <div style="font-size:2rem; margin-bottom:8px;">📚</div>
          <div style="font-weight:600;">No resources found in this category.</div>
        </div>
      `;
      return;
    }

    elements.resourcesGrid.innerHTML = resources.map(res => `
      <div class="resource-card">
        <div>
          <div class="res-header">
            <span class="res-type-badge">${escapeHTML(res.file_type || 'PDF')}</span>
            <span class="badge badge-course">${escapeHTML(res.course_code)}</span>
          </div>

          <h3 class="res-title">${escapeHTML(res.title)}</h3>
          <p class="res-desc">${escapeHTML(res.description || '')}</p>
        </div>

        <div>
          <div class="res-meta">
            <span>By ${escapeHTML(res.uploaded_by)}</span>
            <span>${escapeHTML(res.file_size || '2.5 MB')} • ${res.downloads_count || 0} downloads</span>
          </div>

          <button class="btn btn-secondary" style="width:100%; margin-top:12px;" onclick="window.downloadResource('${res.id}', '${escapeHTML(res.title)}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Resource
          </button>
        </div>
      </div>
    `).join("");
  }

  async function handleCreateResource() {
    const title = document.getElementById("resTitleInput").value.trim();
    const course = document.getElementById("resCourseSelect").value;
    const category = document.getElementById("resCategorySelect").value;
    const desc = document.getElementById("resDescInput").value.trim();
    const type = document.getElementById("resFileTypeInput").value;
    const size = document.getElementById("resFileSizeInput").value.trim();

    if (!title) {
      showToast("Please enter a document title.", "error");
      return;
    }

    elements.resSubmitBtn.disabled = true;
    await window.supabaseManager.createResource({
      title,
      course_code: course,
      category,
      description: desc,
      file_type: type,
      file_size: size || "3.5 MB",
      uploaded_by: currentUser.name
    });

    elements.resSubmitBtn.disabled = false;
    closeModal(elements.modalNewResource);

    document.getElementById("resTitleInput").value = "";
    document.getElementById("resDescInput").value = "";

    showToast("Academic resource published to repository!", "success");
    renderResources();
  }

  window.downloadResource = async function (resId, title) {
    showToast(`Downloading: ${title}...`, "info", 2000);
    const count = await window.supabaseManager.incrementDownload(resId);
    setTimeout(() => {
      showToast(`Downloaded successfully! (Total: ${count})`, "success");
      renderResources();
    }, 1200);
  };

  window.downloadAttachment = function (filename) {
    showToast(`Downloading attachment: ${filename}`, "success");
  };

  // ==========================================================================
  // SECTION 6: ASSIGNMENTS & DEADLINES
  // ==========================================================================
  async function renderAssignments() {
    const assignments = await window.supabaseManager.getAssignments();

    if (assignments.length === 0) {
      elements.assignmentsList.innerHTML = `
        <div style="text-align:center; padding:48px; color:var(--text-muted); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
          <div style="font-size:2rem; margin-bottom:8px;">📝</div>
          <div style="font-weight:600;">No assignments currently scheduled.</div>
        </div>
      `;
      return;
    }

    elements.assignmentsList.innerHTML = assignments.map(asg => {
      const mySub = (asg.submissions || []).find(s => s.student_id === currentUser.id);
      const isDueSoon = new Date(asg.due_date) - new Date() < 86400000 * 3;

      return `
        <div class="assignment-card">
          <div class="asg-header">
            <span class="badge badge-course">${escapeHTML(asg.course_code)}</span>
            <div class="due-countdown ${isDueSoon ? 'urgent' : 'normal'}">
              ⏰ Due ${new Date(asg.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          <h3 class="asg-title">${escapeHTML(asg.title)}</h3>
          <p class="asg-desc">${escapeHTML(asg.description)}</p>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-top:1px solid var(--border-subtle); padding-top:14px;">
            <div style="font-size:0.82rem; color:var(--text-muted);">
              Points: <strong>${asg.total_points || 100}</strong> • Instructor: <strong>${escapeHTML(asg.created_by)}</strong>
            </div>

            <div>
              ${currentRole === "student" ? `
                ${mySub ? `
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.82rem; color:var(--status-success); font-weight:700;">
                      ✓ Submitted (${escapeHTML(mySub.grade)})
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="window.openSubmitModal('${asg.id}', '${escapeHTML(asg.title)}')">
                      Resubmit
                    </button>
                  </div>
                ` : `
                  <button class="btn btn-sm btn-primary" onclick="window.openSubmitModal('${asg.id}', '${escapeHTML(asg.title)}')">
                    Submit Work
                  </button>
                `}
              ` : `
                <span style="font-size:0.85rem; color:var(--accent-secondary); font-weight:600;">
                  ${(asg.submissions || []).length} Student Submissions Received
                </span>
              `}
            </div>
          </div>

          <!-- Submissions View for Teachers -->
          ${(currentRole === "teacher" && asg.submissions && asg.submissions.length > 0) ? `
            <div class="asg-submissions-box">
              <div style="font-size:0.85rem; font-weight:700; margin-bottom:8px;">Student Submissions (Faculty Review):</div>
              ${asg.submissions.map(sub => `
                <div style="background:var(--bg-surface-elevated); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:600; font-size:0.85rem;">${escapeHTML(sub.student_name)}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(sub.file_name)} • ${timeAgo(sub.submitted_at)}</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.8rem; font-weight:600; color:var(--accent-secondary);">${escapeHTML(sub.grade)}</span>
                    <button class="btn btn-sm btn-secondary" onclick="window.gradeStudentSub('${asg.id}', '${sub.id}')">Grade</button>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ''}

        </div>
      `;
    }).join("");
  }

  window.openSubmitModal = function (asgId, title) {
    document.getElementById("submitAsgId").value = asgId;
    document.getElementById("submitAsgTitle").textContent = title;
    openModal(elements.modalSubmitAssignment);
  };

  async function handleSubmitAssignment() {
    const asgId = document.getElementById("submitAsgId").value;
    const comment = document.getElementById("subCommentInput").value.trim();
    const fileName = document.getElementById("subFileNameInput").value.trim();

    if (!fileName) {
      showToast("Please provide the file or repository name.", "error");
      return;
    }

    elements.subSubmitBtn.disabled = true;
    await window.supabaseManager.submitAssignment(asgId, {
      student_id: currentUser.id,
      student_name: currentUser.name,
      submission_text: comment,
      file_name: fileName
    });

    elements.subSubmitBtn.disabled = false;
    closeModal(elements.modalSubmitAssignment);

    document.getElementById("subCommentInput").value = "";
    document.getElementById("subFileNameInput").value = "";

    showToast("Assignment submitted successfully!", "success");
    renderAssignments();
  }

  window.gradeStudentSub = async function (asgId, subId) {
    const grade = prompt("Enter Grade / Feedback (e.g. 95/100 or Verified):", "96/100 (Well documented)");
    if (grade) {
      await window.supabaseManager.gradeSubmission(asgId, subId, grade);
      showToast("Grade updated successfully!", "success");
      renderAssignments();
    }
  };

  // --- USER PROFILE MODAL ---
  function showProfileModal() {
    document.getElementById("profileModalAvatar").src = currentUser.avatar;
    document.getElementById("profileModalName").textContent = currentUser.name;
    document.getElementById("profileModalRole").textContent = currentUser.role === "teacher" ? "Faculty Member" : "B.Tech Student";
    document.getElementById("profileModalEmail").textContent = currentUser.email;
    document.getElementById("profileModalDept").textContent = currentUser.department;
    document.getElementById("profileModalId").textContent = currentUser.roll_or_faculty_id;
    document.getElementById("profileModalHours").textContent = currentUser.office_hours;
    document.getElementById("profileModalBio").textContent = currentUser.bio;

    openModal(elements.modalUserProfile);
  }

  // Run initial setup on DOM ready
  document.addEventListener("DOMContentLoaded", init);
})();
