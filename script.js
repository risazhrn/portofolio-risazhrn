 // Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-grid .project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        
        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lightbox Zoom Logic
    const lightbox = document.getElementById("imageZoomLightbox");
    const zoomedImg = document.getElementById("zoomedImage");

    document.addEventListener("click", function(e) {
      if (e.target.classList.contains("modal-cover") || e.target.classList.contains("modal-cert-image") || e.target.classList.contains("carousel-img")) {
        zoomedImg.src = e.target.src;
        lightbox.style.display = "flex";
        setTimeout(() => lightbox.classList.add("is-active"), 10);
        document.body.style.overflow = "hidden";
      }
    });

    lightbox.addEventListener("click", function() {
      lightbox.classList.remove("is-active");
      setTimeout(() => {
        lightbox.style.display = "none";
        zoomedImg.src = "";
        if (!document.getElementById("modalBackdrop").classList.contains("is-open")) {
          document.body.style.overflow = "";
        }
      }, 250);
    });

    // Carousel Global Functions for Modal
    window.nextSlide = function(btn) {
      const container = btn.closest('.carousel-container');
      const track = container.querySelector('.carousel-track');
      const slides = track.querySelectorAll('.carousel-slide');
      const dots = container.querySelectorAll('.carousel-dot');
      let index = parseInt(track.dataset.index || 0);
      index = (index + 1) % slides.length;
      updateCarousel(track, dots, index);
    };

    window.prevSlide = function(btn) {
      const container = btn.closest('.carousel-container');
      const track = container.querySelector('.carousel-track');
      const slides = track.querySelectorAll('.carousel-slide');
      const dots = container.querySelectorAll('.carousel-dot');
      let index = parseInt(track.dataset.index || 0);
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel(track, dots, index);
    };

    window.goToSlide = function(dot, index) {
      const container = dot.closest('.carousel-container');
      const track = container.querySelector('.carousel-track');
      const dots = container.querySelectorAll('.carousel-dot');
      updateCarousel(track, dots, index);
    };

    function updateCarousel(track, dots, index) {
      track.dataset.index = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }

    // Modal Data with Multiple Images Support (Carousel)
    const dummyImg = (text, bg="bfdbfe", color="0f172a") => `https://placehold.co/800x400/${bg}/${color}?text=${text}`;
    
    const modalData = {
    
    // Projects
    "proj-feedback": {
        images: ["assets/dashboard.png", "assets/feedback.png"],
        kicker: "RESEARCH / WEB APP • 2026",
        title: "Omnichannel Guest Feedback Dashboard",
        intro:
        "A research-driven web application concept combining sentiment analysis and generative AI to aggregate hotel reviews from multiple channels into a single monitoring dashboard.",

        sections: [
        {
            title: "Key Features",
            content: `
            <ul>
                <li>Presented at EECSI 2026.</li>
                <li>Integrates NLP for sentiment analysis.</li>
                <li>Provides comprehensive data visualization.</li>
                <li>
                <strong>AI / NLP Benchmark:</strong>
                <a
                    href="https://github.com/risazhrn/indo-hotel-nlp-benchmark"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View GitHub Repository ↗
                </a>
                </li>
                <li>
                <strong>Web Application:</strong>
                <a
                    href="https://github.com/risazhrn/omnichannel-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View GitHub Repository ↗
                </a>
                </li>
            </ul>
            `,
        },
        {
            title: "Tech Stack",
            content:
            "<p>Next.js, FastAPI, PostgreSQL, and AI / NLP techniques.</p>",
        },
        ],

        tags: ["Next.js", "FastAPI", "PostgreSQL", "AI / NLP"],
    },


    // Education
    "edu-bachelor": {
      kicker: "EDUCATION • 2024 - 2026",
      title: "Bachelor's in Informatics Engineering",
      intro:
        "Telkom University. Graduated with a GPA of 3.80 / 4.00, with a focus on software engineering, intelligent systems, and advanced computing.",
      sections: [
        {
          title: "Relevant Coursework",
          content:
            "<ul><li>Artificial Intelligence & Machine Learning</li><li>Cybersecurity</li><li>Cloud & Distributed Computing</li><li>Recommender Systems</li></ul>",
        },
      ],
      tags: ["Bachelor's Degree", "Cum Laude", "GPA 3.80 / 4.00"],
    },

    "edu-diploma": {
      kicker: "EDUCATION • 2021 - 2024",
      title: "Diploma in Application Software Engineering",
      intro:
        "Telkom University. Graduated Cum Laude with a GPA of 3.94 / 4.00, building a strong practical foundation in software development and engineering principles.",
      sections: [
        {
          title: "Relevant Coursework",
          content:
            "<ul><li>Web & Mobile Programming</li><li>Object-Oriented Programming</li><li>Database Systems & Software Design</li><li>Requirements Analysis</li></ul>",
        },
      ],
      tags: ["Diploma", "Cum Laude", "GPA 3.94 / 4.00"],
    },

    // Certifications
    "cert-ai": {
      img: "https://media.licdn.com/dms/image/v2/D562DAQHgP9JCcor7gQ/profile-treasury-document-images_1280/B56ZgqT0yiH0AU-/1/1753056498962?e=1793836800&v=beta&t=2_qrpzVGKzsU1kh_AnHP2qyf8O-cRzeJRoVkv2Dc4Ms",
      kicker: "CERTIFICATE OF COMPLETION • JUN 2025",
      title: "Preparation Course for Azure AI Fundamentals (AI-900)",
      intro:
        "Completed an online preparation course for Azure AI Fundamentals (AI-900), issued by ElevAIte on June 13, 2025.",
      sections: [],
      tags: ["Microsoft Azure", "Artificial Intelligence", "AI-900 Preparation"],
    },

  
    "cert-css": {
    img: "https://media.licdn.com/dms/image/v2/D562DAQHieDJAI4oilw/profile-treasury-document-images_1280/B56Zd3kXMTHoAc-/1/1750057711961?e=1793836800&v=beta&t=ZBZh3Ydh4Yh2XUqNG9Aj3YAXlgoh9MHuHCK0Drxk1aU",
    kicker: "CERTIFICATION • 2025",
    title: "CSS Dasar (Gold Tier)",
    intro:
        "Issued by Skilvul. Demonstrates foundational knowledge of CSS for styling web pages, including selectors, colors, typography, spacing, and layout to create responsive and visually appealing user interfaces.",
    sections: [],
    tags: ["Skilvul", "CSS", "Web Styling", "Responsive Design"],
    },


    "cert-js": {
      img: "https://media.licdn.com/dms/image/v2/D562DAQHNF0H0Ju-lnA/profile-treasury-document-cover-images_1280/B56Zd38oGhHQA0-/0/1750064072787?e=1793750400&v=beta&t=q69Xhwes0N6dUth9UR0V4e81zZjnAvMxcU97h5sIx70",
      kicker: "CERTIFICATION • 2025",
      title: "JavaScript Dasar (Gold Tier)",
      intro:
        "Issued by Skilvul. Comprehensive assessment of core JavaScript concepts and DOM manipulation.",
      sections: [],
      tags: ["Skilvul", "JavaScript"],
    },

    "cert-mobile": {
      img: "https://media.licdn.com/dms/image/v2/D562DAQH3fmVzaB2uLQ/profile-treasury-document-cover-images_1280/profile-treasury-document-cover-images_1280/0/1727383567555?e=1793750400&v=beta&t=d-ZPHjyoZyrz23m0bsvB59JkwGLdh7k2WoQ7MxPYmwk",
      kicker: "CERTIFICATION • 2023",
      title: "Junior Mobile Programmer",
      intro:
        "Issued by Digital Talent Scholarship, Kominfo. Practical training in mobile application development.",
      sections: [],
      tags: ["Kominfo", "Mobile Dev"],
    },


    "cert-cyber": {
      img: "https://media.licdn.com/dms/image/v2/D562DAQHEA-DYVrwlCw/profile-treasury-document-images_1280/profile-treasury-document-images_1280/1/1727384129771?e=1793836800&v=beta&t=P_EYKEhiCO170JjjbAtv1bkzTwZ7UFSyyVRN47T0tYE",
      kicker: "CERTIFICATION • 2022",
      title: "Cybersecurity Essentials",
      intro:
        "Issued by Cisco Networking Academy. Foundational knowledge in securing networks and protecting data.",
      sections: [],
      tags: ["Cisco", "Cybersecurity"],
    },
  };

    const modal = document.getElementById("modalBackdrop");
    const content = document.getElementById("modalContent");

    document.querySelectorAll("[data-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const d = modalData[btn.dataset.modal];
        if(!d) return;
        
        let sectionsHtml = '';
        if(d.sections && d.sections.length > 0) {
           sectionsHtml = d.sections.map(sec => `
             <div class="modal-section">
               <h3>✦ ${sec.title}</h3>
               ${sec.content}
             </div>
           `).join('');
        }
        
        const tags = d.tags.map(t => `<span>${t}</span>`).join('');
        
        // Check if item has multiple images (carousel) or single image
        let mediaHtml = '';
        if (d.images && d.images.length > 0) {
          const slides = d.images.map((imgSrc, idx) => `
            <div class="carousel-slide">
              <img src="${imgSrc}" alt="${d.title} preview ${idx + 1}" class="carousel-img" loading="lazy" />
            </div>
          `).join('');
          
          const dots = d.images.map((_, idx) => `
            <button class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(this, ${idx})" aria-label="Go to slide ${idx + 1}"></button>
          `).join('');

          mediaHtml = `
            <div class="carousel-container">
              <div class="carousel-track-wrapper">
                <div class="carousel-track" data-index="0">
                  ${slides}
                </div>
              </div>
              ${d.images.length > 1 ? `
                <button class="carousel-btn carousel-prev" onclick="prevSlide(this)" aria-label="Previous slide">‹</button>
                <button class="carousel-btn carousel-next" onclick="nextSlide(this)" aria-label="Next slide">›</button>
                <div class="carousel-dots">${dots}</div>
              ` : ''}
            </div>
          `;
        } else if (d.img) {
          mediaHtml = `<img src="${d.img}" alt="${d.title}" class="modal-cover" loading="lazy" />`;
        }
        
        content.innerHTML = `
          ${mediaHtml}
          <span class="kicker">${d.kicker}</span>
          <h2>${d.title}</h2>
          <p class="intro">${d.intro}</p>
          ${sectionsHtml}
          <div class="modal-tags">${tags}</div>
        `;
        
        modal.style.display = "flex";
        setTimeout(() => {
          modal.classList.add("is-open");
          document.body.classList.add("modal-open");
        }, 10);
      });
    });

    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    };

    document.getElementById("modalClose").addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });
    
    // Mobile Nav
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

    document.getElementById("year").textContent = new Date().getFullYear();
