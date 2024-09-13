export const navigation = [
  {
    title: "Dashboard",
    href: "/jobportal/starter",
    icon: "bi bi-speedometer2", // Speedometer icon for dashboard
  },
  {
    title: "Job",
    icon: "bi bi-briefcase", // Briefcase icon for job
    children: [
      {
        title: "Category",
        href: "/jobportal/job-category",
        icon: "bi bi-tags", // Tags icon for job category
      },
      {
        title: "List Job",
        href: "/jobportal/job",
        icon: "bi bi-list-ul", // List icon for job list
      },
    ],
  },
  {
    title: "Blog",
    icon: "bi bi-journal", // Journal icon for blog
    children: [
      {
        title: "Category",
        href: "/jobportal/blog-category",
        icon: "bi bi-tags", // Tags icon for blog category
      },
      {
        title: "List",
        href: "/jobportal/blog",
        icon: "bi bi-list-ol", // Ordered list icon for blog list
      },
      {
        title: "Archive",
        href: "/jobportal/blog/archive",
        icon: "bi bi-archive", // Ordered list icon for blog list
      },
    ],
  },
  {
    title: "Quiz",
    icon: "bi bi-question-circle", // Question circle icon for quiz
    children: [
      {
        title: "Category",
        href: "/jobportal/quiz-category",
        icon: "bi bi-tags", // Tags icon for quiz category
      },
      {
        title: "Quiz&Question",
        href: "/jobportal/quiz",
        icon: "bi bi-card-list", // Card list icon for quiz and questions
      },
    ],
  },
  {
    title: "Cv management",
    icon: "bi bi-file-earmark-person", // File person icon for CV management
    href: "/jobportal/cv-management",
  },
  {
    title: "User",
    icon: "bi bi-people", // People icon for user
    href: "/jobportal/user",
  },
  {
    title: "Employer",
    icon: "bi bi-building", // Building icon for employer
    href: "/jobportal/employer",
  },
  {
    title: "Contact",
    icon: "bi bi-envelope", // Envelope icon for contact
    href: "/jobportal/contact",
  },
  {
    title: "Settings",
    href: "/jobportal/settings",
    icon: "bi bi-gear", // Gear icon for settings
  },
];
