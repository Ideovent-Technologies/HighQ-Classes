export const serviceTabs = [
  { id: "foundation", label: "Foundation Courses", icon: "📚" },
  { id: "classroom", label: "Offline Classroom", icon: "🏫" },
  { id: "online", label: "Online Courses", icon: "💻" },
  { id: "doubt", label: "Doubt Solving", icon: "❓" },
  { id: "testprep", label: "Test Prep Programs", icon: "📝" },
  { id: "crashcourse", label: "Crash Courses", icon: "⚡" },
  { id: "mentorship", label: "Mentorship & Strategy", icon: "🎯" },
  { id: "parent", label: "Parent Connect", icon: "👨‍👩‍👧" },
  // Add to serviceTabs
  {
    id: "career",
    label: "Career Counseling",
    icon: "🧭",
  },
  {
    id: "workshops",
    label: "Skill Workshops",
    icon: "🛠️",
  },
];

export const serviceDescriptions = {
  foundation: {
    title: "Foundation Courses",
    subtitle: "Build strong basics for lifelong learning",
    description:
      "Our Foundation Courses are structured to create a strong conceptual base in Maths and Science from an early age. Ideal for students aiming for competitive exams in the future.",
    benefits: [
      "Early exposure to Olympiad-level problems",
      "Interactive experiments & practical examples",
      "Strong conceptual foundation for future success",
    ],
    whatYouLearn: [
      "NTSE, Olympiad preparation",
      "Hands-on problem solving",
      "Conceptual clarity in Math & Science",
      "Mental aptitude training",
    ],
    forWhom: ["Class 6–10 students", "Early competitive aspirants"],
    mode: ["Online", "Offline"],
    duration: "Annual",
    level: "Beginner to Intermediate",
    highlights: ["Strong Basics", "Olympiad Edge"],
    bannerImage:
      "https://media.istockphoto.com/id/1339090427/photo/young-girl-laying-on-her-bed-and-study-at-home-using-laptop.jpg?s=612x612&w=0&k=20&c=lUL46GnlPdGJfIa6p_KM0IG0gGTnblVKG7HSIP_LXSM=",
    quote: "A strong foundation today builds a smarter tomorrow.",
    testimonials: [
      {
        name: "Aditya Sharma (Class 9)",
        comment:
          "After joining the foundation program, I started loving math. Now I score full marks!",
      },
    ],
    gallery: [
      "/images/services/foundation1.jpg",
      "/images/services/foundation2.jpg",
    ],
    enquiryLink: "/contact",
  },

  classroom: {
    title: "Offline Classroom Programs",
    subtitle: "Learn in a competitive and focused classroom environment",
    description:
      "In-centre classes designed to offer the best of face-to-face mentorship, peer learning, doubt-solving, and monitored practice in a disciplined space.",
    benefits: [
      "Face-to-face teaching",
      "Printed study material",
      "Real-time feedback from faculty",
    ],
    whatYouLearn: [
      "Concept clarity through live board sessions",
      "Daily assignments and discussions",
      "Personal mentorship and performance feedback",
    ],
    forWhom: ["Class 6–12 students", "Students preferring physical classes"],
    mode: ["Offline only"],
    duration: "Full Academic Year / Crash Mode",
    level: "Intermediate to Advanced",
    highlights: ["High Discipline", "Interactive Learning"],
    bannerImage: "/images/services/classroom.jpg",
    quote: "Classroom learning that keeps you focused and accountable.",
    testimonials: [
      {
        name: "Neha B.",
        comment:
          "Classroom sessions helped me stay disciplined and the teachers were very motivating.",
      },
    ],
    gallery: [
      "/images/services/classroom1.jpg",
      "/images/services/classroom2.jpg",
    ],
    enquiryLink: "/contact",
  },

  online: {
    title: "Online Learning Programs",
    subtitle: "Flexibility and quality from home",
    description:
      "Live and recorded sessions designed for students who prefer digital-first education. Structured modules, doubt resolution, and weekly tracking included.",
    benefits: [
      "Live interactive sessions",
      "24/7 access to recordings",
      "Personal doubt mentors",
    ],
    whatYouLearn: [
      "Topic-wise modules with tests",
      "Live doubt solving on Zoom",
      "Recorded sessions for revision",
      "AI-based analytics on progress",
    ],
    forWhom: ["Remote learners", "Class 6–12 students"],
    mode: ["Online only"],
    duration: "Modular / Full Year",
    level: "Beginner to Advanced",
    highlights: ["Flexible", "Recorded Access", "Top Rated"],
    bannerImage: "/images/services/online.jpg",
    quote: "Learn from anywhere, anytime, without compromise.",
    testimonials: [
      {
        name: "Sara Malik (Class 11)",
        comment:
          "The online sessions were so clear and helpful. I didn't miss a thing, even from home.",
      },
    ],
    gallery: ["/images/services/online1.jpg", "/images/services/online2.jpg"],
    enquiryLink: "/contact",
  },

  doubt: {
    title: "Doubt Solving Support",
    subtitle: "Instant and accurate doubt resolution",
    description:
      "Dedicated doubt-solving via chat, Zoom, and classroom sessions to ensure no student falls behind. Get help exactly when you need it.",
    benefits: [
      "Dedicated mentor chat groups",
      "Daily 2-hour Zoom doubt rooms",
      "Offline classroom doubt corners",
    ],
    whatYouLearn: [
      "Improve conceptual gaps",
      "Boost speed & accuracy",
      "One-to-one clarification support",
    ],
    forWhom: ["All enrolled students", "Need-based learners"],
    mode: ["Online + Offline"],
    duration: "Ongoing (as per course)",
    level: "All Levels",
    highlights: ["Instant Help", "1-on-1 Mentorship"],
    bannerImage: "/images/services/doubt-solving.jpg",
    quote: "No doubt is too small — clear it, master it.",
    testimonials: [
      {
        name: "Ravi T.",
        comment:
          "The doubt teachers on WhatsApp clear my questions late at night too. Super helpful!",
      },
    ],
    gallery: ["/images/services/doubt1.jpg", "/images/services/doubt2.jpg"],
    enquiryLink: "/contact",
  },

  testprep: {
    title: "Test Preparation Series",
    subtitle: "Be exam-ready with focused practice",
    description:
      "Weekly mock tests, test series with analysis, and revision plans to sharpen your exam temperament and accuracy.",
    benefits: [
      "Weekly full syllabus tests",
      "Detailed performance analytics",
      "Exam temperament training",
    ],
    whatYouLearn: [
      "Time management under pressure",
      "Pattern-based question solving",
      "Gap-finding from analytics",
    ],
    forWhom: ["Board & Competitive exam aspirants"],
    mode: ["Online + Offline"],
    duration: "Short Term (2–3 months)",
    level: "Advanced",
    highlights: ["Most Popular", "Analytics-Driven"],
    bannerImage: "/images/services/testprep.jpg",
    quote: "Prepare smart, practice harder, perform best.",
    testimonials: [
      {
        name: "Anushka Jain",
        comment:
          "I improved from 68% to 89% in just 2 months of the test prep series. So accurate!",
      },
    ],
    gallery: ["/images/services/testprep1.jpg"],
    enquiryLink: "/contact",
  },

  crashcourse: {
    title: "Crash Courses",
    subtitle: "Quick revision with sharp strategies",
    description:
      "Condensed power-packed modules to revise the entire syllabus quickly before exams. Ideal for fast learners and last-minute boosters.",
    benefits: [
      "90-min rapid revision classes",
      "Formula & trick booklets",
      "Mock tests with solutions",
    ],
    whatYouLearn: [
      "Revision of key formulas & concepts",
      "Selective high-yield topics",
      "Last-minute tricks and scoring hacks",
    ],
    forWhom: ["Class 10 & 12 students", "Repeaters"],
    mode: ["Offline + Online"],
    duration: "1–2 Months",
    level: "Intermediate to Advanced",
    highlights: ["High Impact", "Exam Special"],
    bannerImage: "/images/services/crashcourse.jpg",
    quote: "Revise smart. Score higher. No panic.",
    testimonials: [
      {
        name: "Harshit Sinha",
        comment:
          "I joined a 1-month crash and covered everything I missed in the year. Highly recommend.",
      },
    ],
    gallery: ["/images/services/crash1.jpg"],
    enquiryLink: "/contact",
  },

  career: {
    title: "Career Counseling & Roadmaps",
    subtitle: "Helping students choose wisely, early",
    description:
      "Expert-led career guidance sessions to help students understand their aptitude, explore options, and build a realistic roadmap to success.",
    benefits: [
      "Psychometric testing & counseling",
      "Career path visualization sessions",
      "College & course selection help",
    ],
    whatYouLearn: [
      "Goal setting & stream selection",
      "Realistic planning for college entrance",
      "Overcoming confusion through clarity",
    ],
    forWhom: ["Class 9–12 students", "Undecided career paths"],
    mode: ["Online", "Offline (1:1 available)"],
    duration: "3–5 sessions / On-demand",
    level: "All Levels",
    highlights: ["Clarity-Focused", "Expert-Led"],
    bannerImage: "/images/services/career.jpg",
    quote: "Choosing the right path is half the journey.",
    testimonials: [
      {
        name: "Riya M.",
        comment:
          "The sessions cleared all my confusion about science vs commerce. I'm now confident about my direction!",
      },
      {
        name: "Manav G.",
        comment:
          "They broke down every career in terms of my interests. I was amazed by how personalized it was.",
      },
    ],
    gallery: ["/images/services/career1.jpg"],
    enquiryLink: "/contact",
  },

  workshops: {
    title: "Skill Development Workshops",
    subtitle: "Hands-on training to sharpen your edge",
    description:
      "Short-term weekend workshops that focus on practical skills — from coding and communication to Vedic math and productivity hacks.",
    benefits: [
      "Learn from industry mentors",
      "Projects, portfolios & presentations",
      "Fun, hands-on learning",
    ],
    whatYouLearn: [
      "Vedic Math and calculation speed",
      "Public speaking & debating",
      "Intro to coding (HTML, Python)",
      "Productivity & time management",
    ],
    forWhom: ["Class 6–12 students", "Skill-focused learners"],
    mode: ["Offline weekend", "Online live"],
    duration: "2–4 weekends / Workshop-based",
    level: "Beginner Friendly",
    highlights: ["Skill-Oriented", "Project-Based"],
    bannerImage: "/images/services/workshops.jpg",
    quote: "Skills build confidence, not just marks.",
    testimonials: [
      {
        name: "Samar A.",
        comment:
          "I gave a speech in front of 50 students after the workshop. Never imagined I could!",
      },
      {
        name: "Meghna K.",
        comment:
          "Their coding bootcamp was better than some paid online ones. So clear and fun!",
      },
    ],
    gallery: ["/images/services/workshop1.jpg"],
    enquiryLink: "/contact",
  },
};
