// ============================================================================
// REVA CONNECT - DEFAULT ACADEMIC MOCK DATA
// ============================================================================
// Provides realistic initial academic data for instant testing and demonstration
// Data persists in LocalStorage and syncs seamlessly with Supabase when connected.
// ============================================================================

window.MOCK_USERS = {
  teacher: {
    id: "usr_teacher_01",
    name: "Dr. Rajesh Sharma",
    role: "teacher",
    email: "rajesh.sharma@reva.edu.in",
    department: "School of Computing & Information Technology",
    designation: "Associate Professor & Head of DSA Lab",
    roll_or_faculty_id: "FAC-CS-108",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    office_hours: "Mon & Thu: 3:00 PM – 5:00 PM (Room CS-304)",
    bio: "Researcher in Distributed Systems and Graph Algorithms. Guiding Capstone Projects 2026."
  },
  student: {
    id: "usr_student_01",
    name: "Aanya Patel",
    role: "student",
    email: "aanya.patel@student.reva.edu.in",
    department: "School of Computing & Information Technology",
    designation: "B.Tech Computer Science (Semester 6)",
    roll_or_faculty_id: "RV-2023-CS-084",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    office_hours: "Student (Seeking doubts on Algorithms & DB Systems)",
    bio: "Passionate about full-stack engineering and competitive programming. Vice-lead @ Coding Club."
  }
};

window.MOCK_ANNOUNCEMENTS = [
  {
    id: "ann_01",
    title: "Mid-Term Examination Schedule & Syllabus Breakdown [Semester 6]",
    content: "The mid-term examination for CS301 (Data Structures & Algorithms) and CS304 (DBMS) will commence from next Monday. Please review the official syllabus topics attached. Practical lab exams will be conducted prior in batch slots.",
    category: "exam",
    course_code: "CS301 / CS304",
    author_id: "usr_teacher_01",
    author_name: "Dr. Rajesh Sharma",
    author_role: "teacher",
    is_pinned: true,
    attachment_name: "Midterm_Schedule_Spring2026.pdf",
    attachment_url: "#",
    acknowledged_count: 84,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "ann_02",
    title: "URGENT: Cloud Lab Server Maintenance Tonight (10:00 PM - 2:00 AM)",
    content: "The central college GPU cluster and Kubernetes staging servers will be undergoing scheduled memory and OS upgrades tonight. Please save your remote Jupyter and Docker containers beforehand.",
    category: "urgent",
    course_code: "All Courses",
    author_id: "usr_teacher_01",
    author_name: "System Administrator",
    author_role: "teacher",
    is_pinned: true,
    attachment_name: null,
    attachment_url: null,
    acknowledged_count: 142,
    created_at: new Date(Date.now() - 3600000 * 7).toISOString()
  },
  {
    id: "ann_03",
    title: "CS308: Web Technologies Project Phase-1 Deadline Extended",
    content: "Based on student requests regarding the Hackathon overlap, Phase-1 wireframes and Supabase database schema submission deadline is extended by 48 hours to Friday midnight.",
    category: "assignment",
    course_code: "CS308",
    author_id: "usr_teacher_01",
    author_name: "Dr. Rajesh Sharma",
    author_role: "teacher",
    is_pinned: false,
    attachment_name: "Rubrics_Phase1_Evaluation.pdf",
    attachment_url: "#",
    acknowledged_count: 67,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString()
  },
  {
    id: "ann_04",
    title: "Guest Lecture on Generative AI & Cloud Architecture by Google DeepMind",
    content: "Special interactive academic seminar organized in Auditorium 2 on Thursday 11:00 AM. Attendance is mandatory for 5th and 6th semester Computer Science students.",
    category: "workshop",
    course_code: "General",
    author_id: "usr_teacher_01",
    author_name: "Dean of Academic Affairs",
    author_role: "teacher",
    is_pinned: false,
    attachment_name: "Guest_Lecture_Flyer.pdf",
    attachment_url: "#",
    acknowledged_count: 120,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

window.MOCK_CHANNELS = [
  {
    id: "cs301-data-structures",
    name: "CS301: Advanced Data Structures",
    course_code: "CS301",
    description: "Official discussion channel for B-Trees, Graph algorithms, Dynamic Programming, and weekly assignments.",
    faculty: "Dr. Rajesh Sharma",
    unread: 2
  },
  {
    id: "cs304-database-systems",
    name: "CS304: Database Management Systems",
    course_code: "CS304",
    description: "Relational algebra, SQL optimizations, Transaction ACID properties, and Supabase integration.",
    faculty: "Prof. Anita Roy",
    unread: 0
  },
  {
    id: "cs308-web-technologies",
    name: "CS308: Full-Stack Web Technologies",
    course_code: "CS308",
    description: "Modern frontend workflows, RESTful endpoints, Auth systems, and Vercel cloud deployments.",
    faculty: "Dr. Rajesh Sharma",
    unread: 1
  },
  {
    id: "general-academic-help",
    name: "General Academic Doubts & Queries",
    course_code: "GENERAL",
    description: "Cross-department academic support, peer discussions, and university announcements.",
    faculty: "Faculty Moderated",
    unread: 0
  }
];

window.MOCK_MESSAGES = {
  "cs301-data-structures": [
    {
      id: "msg_101",
      sender_id: "usr_teacher_01",
      sender_name: "Dr. Rajesh Sharma",
      sender_role: "teacher",
      content: "Good morning class. Please make sure you have reviewed Dijkstra's shortest path algorithm using a min-heap priority queue before today's 2:00 PM lab session.",
      tag: "official",
      reactions: [{ emoji: "👍", count: 18 }, { emoji: "🔥", count: 6 }],
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "msg_102",
      sender_id: "usr_student_02",
      sender_name: "Rohan Verma",
      sender_role: "student",
      content: "Sir, will the adjacency matrix or adjacency list representation be expected in the lab evaluation test cases?",
      tag: "doubt",
      reactions: [{ emoji: "❓", count: 4 }],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "msg_103",
      sender_id: "usr_teacher_01",
      sender_name: "Dr. Rajesh Sharma",
      sender_role: "teacher",
      content: "Adjacency List is expected because the sparse graph test cases have V = 100,000 vertices, which would cause an OutOfMemoryError with an adjacency matrix.",
      tag: "solution",
      reactions: [{ emoji: "💡", count: 12 }, { emoji: "🙌", count: 9 }],
      created_at: new Date(Date.now() - 3600000 * 3.5).toISOString()
    },
    {
      id: "msg_104",
      sender_id: "usr_student_01",
      sender_name: "Aanya Patel",
      sender_role: "student",
      content: "Thank you sir! Here is the custom MinHeap comparator template in C++ for anyone struggling with std::priority_queue:\n```cpp\nstruct CompareDist {\n    bool operator()(const pair<int, int>& a, const pair<int, int>& b) {\n        return a.second > b.second;\n    }\n};\n```",
      tag: "code",
      reactions: [{ emoji: "⭐", count: 15 }, { emoji: "❤️", count: 8 }],
      created_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
    }
  ],
  "cs304-database-systems": [
    {
      id: "msg_201",
      sender_id: "usr_teacher_02",
      sender_name: "Prof. Anita Roy",
      sender_role: "teacher",
      content: "Reminder: Chapter 5 B+ Trees and Indexing exercises are posted in the Resources tab. Please attempt questions 1 through 6.",
      tag: "official",
      reactions: [{ emoji: "👍", count: 11 }],
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: "msg_202",
      sender_id: "usr_student_01",
      sender_name: "Aanya Patel",
      sender_role: "student",
      content: "Professor, in question 4, should we assume secondary clustering index or unclustered hash index?",
      tag: "doubt",
      reactions: [{ emoji: "👍", count: 3 }],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  "cs308-web-technologies": [
    {
      id: "msg_301",
      sender_id: "usr_teacher_01",
      sender_name: "Dr. Rajesh Sharma",
      sender_role: "teacher",
      content: "For your Vercel deployments, ensure that `vercel.json` contains proper cleanUrls and routing rewrites so client-side navigation handles page reloads correctly.",
      tag: "official",
      reactions: [{ emoji: "🚀", count: 24 }, { emoji: "💡", count: 14 }],
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ],
  "general-academic-help": [
    {
      id: "msg_401",
      sender_id: "usr_student_03",
      sender_name: "Vikram Sengupta",
      sender_role: "student",
      content: "Are the university library reading halls open 24 hours during the upcoming mid-term week?",
      tag: "general",
      reactions: [{ emoji: "📚", count: 10 }],
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "msg_402",
      sender_id: "usr_teacher_01",
      sender_name: "Dr. Rajesh Sharma",
      sender_role: "teacher",
      content: "Yes, the Central Library Block B is approved for 24-hour access starting this Friday with valid student ID cards.",
      tag: "official",
      reactions: [{ emoji: "🎉", count: 22 }],
      created_at: new Date(Date.now() - 3600000 * 10).toISOString()
    }
  ]
};

window.MOCK_DOUBTS = [
  {
    id: "dbt_01",
    title: "How does Cycle Detection in Directed Graphs differ from Undirected Graphs?",
    description: "In undirected graphs, we can easily check if an adjacent node is visited and not the parent. But why does that fail for directed graphs, and why do we need a separate recursion stack array (or 3-color marking)?",
    course_code: "CS301",
    student_id: "usr_student_01",
    student_name: "Aanya Patel",
    status: "resolved",
    upvotes: 14,
    code_snippet: `// Is this sufficient for directed graphs?
bool dfs(int node, int parent, vector<bool>& vis) {
    vis[node] = true;
    for (int next : adj[node]) {
        if (!vis[next]) {
            if (dfs(next, node, vis)) return true;
        } else if (next != parent) return true;
    }
    return false;
}`,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    replies: [
      {
        id: "rep_01",
        author_name: "Dr. Rajesh Sharma",
        author_role: "teacher",
        content: "Excellent question Aanya! In directed graphs, cross-edges or forward edges can point to an already visited vertex without forming a cycle. For example: A -> B, A -> C, B -> C. Here C is visited twice from distinct paths, but there is NO cycle! You specifically need to detect **Back-Edges** (edges pointing to an ancestor currently in the active DFS call stack). That is why a `inRecursionStack` array or 3 colors (WHITE=unvisited, GRAY=in-progress, BLACK=done) is necessary.",
        is_verified_by_teacher: true,
        created_at: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  },
  {
    id: "dbt_02",
    title: "Supabase Row Level Security (RLS) policies for Student vs Teacher submissions",
    description: "I am writing RLS policies so that students can only see their own submitted assignments, but faculty can view all submissions for grading. What is the optimal SQL policy structure in Postgres?",
    course_code: "CS308",
    student_id: "usr_student_02",
    student_name: "Rohan Verma",
    status: "open",
    upvotes: 9,
    code_snippet: `CREATE POLICY "Submissions view" ON submissions
FOR SELECT USING (
  auth.uid() = student_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);`,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    replies: [
      {
        id: "rep_02",
        author_name: "Dr. Rajesh Sharma",
        author_role: "teacher",
        content: "Your snippet is on the right track! To prevent subquery latency on large datasets, you can either cache the user's role in the JWT custom claims or create a secure security-definer helper function `is_teacher()`. Check our portal's `supabase-schema.sql` file for the exact reference implementation.",
        is_verified_by_teacher: true,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ]
  },
  {
    id: "dbt_03",
    title: "Difference between 3NF and BCNF with functional dependencies",
    description: "If a relation is in 3NF, what specific condition violates BCNF? Can someone explain using an example with overlapping candidate keys?",
    course_code: "CS304",
    student_id: "usr_student_01",
    student_name: "Aanya Patel",
    status: "open",
    upvotes: 6,
    code_snippet: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: []
  }
];

window.MOCK_RESOURCES = [
  {
    id: "res_01",
    title: "CS301 Complete Lecture Handouts: Advanced Graph Algorithms",
    description: "Comprehensive notes covering Dijkstra, Bellman-Ford, Floyd-Warshall, Prim's, and Kruskal's algorithms with asymptotic analysis.",
    course_code: "CS301",
    category: "Lecture Notes",
    file_type: "PDF",
    file_size: "4.8 MB",
    uploaded_by: "Dr. Rajesh Sharma",
    downloads_count: 148,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: "res_02",
    title: "CS304 Database Lab Manual & PostgreSQL Cheat Sheet",
    description: "Lab setup instructions, triggers, stored procedures, indexing benchmarks, and query execution plan analysis.",
    course_code: "CS304",
    category: "Lab Manual",
    file_type: "PDF",
    file_size: "2.9 MB",
    uploaded_by: "Prof. Anita Roy",
    downloads_count: 112,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString()
  },
  {
    id: "res_03",
    title: "CS308 Web Tech Starter Boilerplate & API Guidelines",
    description: "Vercel deployment setup, Supabase authentication client, and REST API design best practices template.",
    course_code: "CS308",
    category: "Reference",
    file_type: "ZIP",
    file_size: "8.1 MB",
    uploaded_by: "Dr. Rajesh Sharma",
    downloads_count: 95,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    id: "res_04",
    title: "Previous 3-Year Midterm Question Papers with Answer Keys (2023-2025)",
    description: "Archived questions with solution breakdowns for CS301, CS304, and CS308 mid-term exams.",
    course_code: "CS301",
    category: "PYQ",
    file_type: "PDF",
    file_size: "6.2 MB",
    uploaded_by: "Department Academic Cell",
    downloads_count: 230,
    created_at: new Date(Date.now() - 3600000 * 120).toISOString()
  }
];

window.MOCK_ASSIGNMENTS = [
  {
    id: "asg_01",
    title: "Lab Assignment 4: Shortest Path in Network Routing",
    course_code: "CS301",
    description: "Implement Dijkstra's Algorithm with an indexed Fibonacci/Binary Heap to find minimum latency in a simulated router topology of 50,000 nodes.",
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    total_points: 50,
    created_by: "Dr. Rajesh Sharma",
    submissions: [
      {
        id: "sub_01",
        student_id: "usr_student_01",
        student_name: "Aanya Patel",
        status: "Submitted",
        submission_text: "Implemented in C++20 with custom min-heap. Test cases validated with 0.42s runtime.",
        file_name: "aanya_patel_asg4_dijkstra.cpp",
        grade: "Pending Review",
        submitted_at: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]
  },
  {
    id: "asg_02",
    title: "Term Project Phase-1: ER Modeling & Database Normalization",
    course_code: "CS304",
    description: "Submit complete Crow's Foot ER Diagram and BCNF normalized table structure for an e-commerce inventory and billing system.",
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    total_points: 100,
    created_by: "Prof. Anita Roy",
    submissions: []
  },
  {
    id: "asg_03",
    title: "Mini-Project: Secure Academic Portal with Supabase & Vercel",
    course_code: "CS308",
    description: "Build an interactive student-teacher portal featuring realtime notifications, role-based security, and cloud deployment on Vercel.",
    due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    total_points: 100,
    created_by: "Dr. Rajesh Sharma",
    submissions: [
      {
        id: "sub_02",
        student_id: "usr_student_01",
        student_name: "Aanya Patel",
        status: "Submitted",
        submission_text: "Live on Vercel with responsive glassmorphism UI, Supabase DB tables and RLS security.",
        file_name: "reva_connect_repo_link.txt",
        grade: "98/100 (Verified Excellent)",
        submitted_at: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  }
];
