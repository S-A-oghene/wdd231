// Dynamic Year
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Last Modified Date
document.getElementById("lastModified").textContent = `Last Update: ${document.lastModified}`;

// Course Data
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
    technology: ["HTML", "CSS"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

// Function to display course work
function displayCourseWork() {
    const container = document.querySelector('.coursework');
    
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course-item');
        
        courseElement.innerHTML = `
            <h3>${course.subject} ${course.number}: ${course.title}</h3>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Certificate:</strong> ${course.certificate}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <p><strong>Technologies:</strong> ${course.technology.join(', ')}</p>
            <p><strong>Status:</strong> ${course.completed ? 'Completed' : 'In Progress'}</p>
        `;
        
        container.appendChild(courseElement);
    });
}

// Rendering Course Cards
function renderCourses(filter = "all") {
  const courseContainer = document.querySelector(".course-cards");
  courseContainer.innerHTML = "";

  const filteredCourses =
    filter === "all" ? courses : courses.filter((c) => c.subject === filter);

  filteredCourses.forEach((course) => {
    const courseButton = document.createElement("button");
    courseButton.textContent = `${course.subject} ${course.number}`;
    courseButton.classList.add("course-card");

    if (course.completed) {
      courseButton.classList.add("completed");
    }

    courseButton.addEventListener("click", () => {
      alert(
        `${course.title}\n\nCredits: ${course.credits}\n\n${course.description}`
      );
    });

    courseContainer.appendChild(courseButton);
  });
}

// Total Credits Calculation
const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
document.getElementById("total-credits").textContent = totalCredits;

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
    displayCourseWork();
    renderCourses();

    // Filter Buttons
    document.getElementById("filter-all").addEventListener("click", () => renderCourses("all"));
    document.getElementById("filter-cse").addEventListener("click", () => renderCourses("CSE"));
    document.getElementById("filter-wdd").addEventListener("click", () => renderCourses("WDD"));

    // Toggle Navigation for small screens
    document.querySelector(".nav-toggle").addEventListener("click", function () {
      const navMenu = document.querySelector(".nav-menu");
      const menuButton = document.getElementById("menu");

      navMenu.classList.toggle("nav-menu-visible");
      menuButton.classList.toggle("open");
    });

    // Close menu when a link is clicked (optional, but improves UX)
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        const navMenu = document.querySelector(".nav-menu");
        const menuButton = document.getElementById("menu");
        navMenu.classList.remove("nav-menu-visible");
        menuButton.classList.remove("open");
      });
    });
});
