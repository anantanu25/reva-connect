// ============================================================================
// REVA CONNECT - SUPABASE CLIENT & DATA ADAPTER LAYER
// ============================================================================
// Seamlessly toggles between live Supabase backend and interactive LocalStorage mode.
// Enables instant out-of-the-box demo without requiring instant Supabase credentials,
// while providing 1-click connection to real Supabase database!
// ============================================================================

(function () {
  const STORAGE_KEY_URL = "reva_supabase_url";
  const STORAGE_KEY_ANON = "reva_supabase_anon_key";
  const STORAGE_KEY_DEMO_DATA = "reva_local_academic_db_v1";

  class SupabaseManager {
    constructor() {
      this.client = null;
      this.isConnected = false;
      this.connectionError = null;
      this.init();
    }

    init() {
      // 1. Check if user configured custom Supabase credentials
      const savedUrl = localStorage.getItem(STORAGE_KEY_URL) || window.SUPABASE_DEFAULT_URL || "";
      const savedKey = localStorage.getItem(STORAGE_KEY_ANON) || window.SUPABASE_DEFAULT_ANON_KEY || "";

      if (savedUrl && savedKey && window.supabase) {
        try {
          this.client = window.supabase.createClient(savedUrl, savedKey);
          this.testConnection(savedUrl, savedKey).then(res => {
            this.isConnected = res.success;
            this.connectionError = res.error || null;
            this.dispatchStatus();
          });
        } catch (err) {
          console.warn("Supabase init error, using interactive demo storage:", err);
          this.isConnected = false;
        }
      } else {
        this.isConnected = false;
      }

      // 2. Initialize interactive local state
      this.initLocalStorageDB();
    }

    initLocalStorageDB() {
      const existing = localStorage.getItem(STORAGE_KEY_DEMO_DATA);
      if (!existing) {
        const initialDB = {
          announcements: window.MOCK_ANNOUNCEMENTS || [],
          channels: window.MOCK_CHANNELS || [],
          messages: window.MOCK_MESSAGES || {},
          doubts: window.MOCK_DOUBTS || [],
          resources: window.MOCK_RESOURCES || [],
          assignments: window.MOCK_ASSIGNMENTS || [],
          users: window.MOCK_USERS || {}
        };
        localStorage.setItem(STORAGE_KEY_DEMO_DATA, JSON.stringify(initialDB));
      }
    }

    getLocalDB() {
      try {
        const data = localStorage.getItem(STORAGE_KEY_DEMO_DATA);
        return data ? JSON.parse(data) : {};
      } catch (e) {
        console.error("Error reading local db", e);
        return {};
      }
    }

    saveLocalDB(data) {
      localStorage.setItem(STORAGE_KEY_DEMO_DATA, JSON.stringify(data));
    }

    async testConnection(url, anonKey) {
      if (!window.supabase) {
        return { success: false, error: "Supabase JS library not loaded." };
      }
      try {
        const tempClient = window.supabase.createClient(url, anonKey);
        // Test query on channels or profiles table
        const { data, error } = await tempClient.from('channels').select('count', { count: 'exact', head: true });
        if (error) {
          // If table doesn't exist yet, it's still a valid client connection to Supabase project
          if (error.code === 'PGRST204' || error.message.includes('relation') || error.code === '42P01') {
            return { success: true, warning: "Connected to Supabase! Note: Please run supabase-schema.sql to create tables." };
          }
          return { success: false, error: error.message };
        }
        return { success: true, message: "Connected successfully to Supabase Project!" };
      } catch (err) {
        return { success: false, error: err.message || "Failed to reach Supabase server" };
      }
    }

    async setCredentials(url, anonKey) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
      this.init();
      const status = await this.testConnection(url.trim(), anonKey.trim());
      this.isConnected = status.success;
      this.connectionError = status.error || null;
      this.dispatchStatus();
      return status;
    }

    clearCredentials() {
      localStorage.removeItem(STORAGE_KEY_URL);
      localStorage.removeItem(STORAGE_KEY_ANON);
      this.client = null;
      this.isConnected = false;
      this.connectionError = null;
      this.dispatchStatus();
    }

    getCredentials() {
      return {
        url: localStorage.getItem(STORAGE_KEY_URL) || "",
        anonKey: localStorage.getItem(STORAGE_KEY_ANON) || ""
      };
    }

    dispatchStatus() {
      window.dispatchEvent(new CustomEvent("supabaseStatusChanged", {
        detail: {
          isConnected: this.isConnected,
          error: this.connectionError
        }
      }));
    }

    // ==========================================
    // UNIFIED DATA ACCESS METHODS (Hybrid)
    // ==========================================

    // --- ANNOUNCEMENTS ---
    async getAnnouncements() {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('announcements')
            .select('*')
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn("Supabase fetch failed, falling back to local data:", e);
        }
      }
      const db = this.getLocalDB();
      return (db.announcements || []).sort((a, b) => {
        if (a.is_pinned === b.is_pinned) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.is_pinned ? -1 : 1;
      });
    }

    async createAnnouncement(announcement) {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('announcements')
            .insert([announcement])
            .select();
          if (!error && data) return data[0];
        } catch (e) {
          console.warn("Supabase insert failed, saving locally:", e);
        }
      }
      const db = this.getLocalDB();
      const newAnn = {
        id: "ann_" + Date.now(),
        acknowledged_count: 0,
        created_at: new Date().toISOString(),
        ...announcement
      };
      db.announcements = [newAnn, ...(db.announcements || [])];
      this.saveLocalDB(db);
      return newAnn;
    }

    async acknowledgeAnnouncement(id) {
      const db = this.getLocalDB();
      if (db.announcements) {
        const item = db.announcements.find(a => a.id === id);
        if (item) {
          item.acknowledged_count = (item.acknowledged_count || 0) + 1;
          this.saveLocalDB(db);
          return item;
        }
      }
      return null;
    }

    // --- CHANNELS & MESSAGES ---
    async getChannels() {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client.from('channels').select('*');
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn("Supabase channels error, using local:", e);
        }
      }
      const db = this.getLocalDB();
      return db.channels || [];
    }

    async getMessages(channelId) {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('messages')
            .select('*')
            .eq('channel_id', channelId)
            .order('created_at', { ascending: true });
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn("Supabase messages error, using local:", e);
        }
      }
      const db = this.getLocalDB();
      return (db.messages && db.messages[channelId]) || [];
    }

    async sendMessage(channelId, message) {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('messages')
            .insert([{ channel_id: channelId, ...message }])
            .select();
          if (!error && data) return data[0];
        } catch (e) {
          console.warn("Supabase send error, using local:", e);
        }
      }
      const db = this.getLocalDB();
      if (!db.messages) db.messages = {};
      if (!db.messages[channelId]) db.messages[channelId] = [];

      const newMsg = {
        id: "msg_" + Date.now(),
        reactions: [],
        created_at: new Date().toISOString(),
        ...message
      };
      db.messages[channelId].push(newMsg);
      this.saveLocalDB(db);
      return newMsg;
    }

    async addReaction(channelId, messageId, emoji) {
      const db = this.getLocalDB();
      if (db.messages && db.messages[channelId]) {
        const msg = db.messages[channelId].find(m => m.id === messageId);
        if (msg) {
          if (!msg.reactions) msg.reactions = [];
          const r = msg.reactions.find(item => item.emoji === emoji);
          if (r) {
            r.count += 1;
          } else {
            msg.reactions.push({ emoji, count: 1 });
          }
          this.saveLocalDB(db);
          return msg;
        }
      }
      return null;
    }

    // --- ACADEMIC DOUBTS ---
    async getDoubts() {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('doubts')
            .select('*, replies:doubt_replies(*)')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn("Supabase doubts error, using local:", e);
        }
      }
      const db = this.getLocalDB();
      return db.doubts || [];
    }

    async createDoubt(doubt) {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('doubts')
            .insert([doubt])
            .select();
          if (!error && data) return data[0];
        } catch (e) {
          console.warn("Supabase create doubt error:", e);
        }
      }
      const db = this.getLocalDB();
      const newDoubt = {
        id: "dbt_" + Date.now(),
        status: "open",
        upvotes: 0,
        replies: [],
        created_at: new Date().toISOString(),
        ...doubt
      };
      db.doubts = [newDoubt, ...(db.doubts || [])];
      this.saveLocalDB(db);
      return newDoubt;
    }

    async replyToDoubt(doubtId, reply) {
      const db = this.getLocalDB();
      const doubt = (db.doubts || []).find(d => d.id === doubtId);
      if (doubt) {
        const newReply = {
          id: "rep_" + Date.now(),
          created_at: new Date().toISOString(),
          is_verified_by_teacher: reply.author_role === "teacher",
          ...reply
        };
        if (!doubt.replies) doubt.replies = [];
        doubt.replies.push(newReply);
        if (newReply.is_verified_by_teacher) {
          doubt.status = "resolved";
        }
        this.saveLocalDB(db);
        return newReply;
      }
      return null;
    }

    async upvoteDoubt(doubtId) {
      const db = this.getLocalDB();
      const doubt = (db.doubts || []).find(d => d.id === doubtId);
      if (doubt) {
        doubt.upvotes = (doubt.upvotes || 0) + 1;
        this.saveLocalDB(db);
        return doubt.upvotes;
      }
      return 0;
    }

    // --- ACADEMIC RESOURCES ---
    async getResources() {
      if (this.isConnected && this.client) {
        try {
          const { data, error } = await this.client
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) return data;
        } catch (e) {
          console.warn("Supabase resources error:", e);
        }
      }
      const db = this.getLocalDB();
      return db.resources || [];
    }

    async createResource(resource) {
      const db = this.getLocalDB();
      const newRes = {
        id: "res_" + Date.now(),
        downloads_count: 0,
        created_at: new Date().toISOString(),
        ...resource
      };
      db.resources = [newRes, ...(db.resources || [])];
      this.saveLocalDB(db);
      return newRes;
    }

    async incrementDownload(resId) {
      const db = this.getLocalDB();
      const res = (db.resources || []).find(r => r.id === resId);
      if (res) {
        res.downloads_count = (res.downloads_count || 0) + 1;
        this.saveLocalDB(db);
        return res.downloads_count;
      }
      return 0;
    }

    // --- ASSIGNMENTS & SUBMISSIONS ---
    async getAssignments() {
      const db = this.getLocalDB();
      return db.assignments || [];
    }

    async submitAssignment(assignmentId, submission) {
      const db = this.getLocalDB();
      const asg = (db.assignments || []).find(a => a.id === assignmentId);
      if (asg) {
        if (!asg.submissions) asg.submissions = [];
        const newSub = {
          id: "sub_" + Date.now(),
          status: "Submitted",
          grade: "Pending Review",
          submitted_at: new Date().toISOString(),
          ...submission
        };
        // Replace previous if same student
        const idx = asg.submissions.findIndex(s => s.student_id === submission.student_id);
        if (idx >= 0) {
          asg.submissions[idx] = newSub;
        } else {
          asg.submissions.push(newSub);
        }
        this.saveLocalDB(db);
        return newSub;
      }
      return null;
    }

    async gradeSubmission(assignmentId, submissionId, grade) {
      const db = this.getLocalDB();
      const asg = (db.assignments || []).find(a => a.id === assignmentId);
      if (asg && asg.submissions) {
        const sub = asg.submissions.find(s => s.id === submissionId);
        if (sub) {
          sub.grade = grade;
          sub.status = "Graded";
          this.saveLocalDB(db);
          return sub;
        }
      }
      return null;
    }
  }

  window.supabaseManager = new SupabaseManager();
})();
