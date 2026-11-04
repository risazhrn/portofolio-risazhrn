    document.addEventListener("DOMContentLoaded", () => {
      // 1. SPARKLE CURSOR EFFECT
      const emojis = ['✨', '💖', '⭐', '🌸', '💫'];
      let lastTime = 0;
      
      document.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(pointer: coarse)').matches) return;
        const currentTime = Date.now();
        if (currentTime - lastTime < 70) return;
        lastTime = currentTime;

        const spark = document.createElement('div');
        spark.className = 'sparkle';
        spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const x = e.clientX;
        const y = e.clientY;
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const dx = (Math.random() - 0.5) * 60;
        const dy = (Math.random() - 0.5) * 60 - 20;
        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
      });

      // Home shows the full profile on mobile; other tabs prioritize their content.
      document.body.classList.add('view-home');

      // 2. TAB SWITCHING LOGIC (No Page Scroll)
      const navBtns = document.querySelectorAll('.nav-btn');
      const tabSections = document.querySelectorAll('.tab-section');
      const mainScroll = document.getElementById('mainScroll');

      navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.target;
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            tabSections.forEach(sec => sec.classList.remove('active'));
            targetElement.classList.add('active');
            document.body.classList.toggle('view-home', targetId === 'home');
            
            if (mainScroll) mainScroll.scrollTop = 0;
            // On smaller screens the document itself is scrollable.
            if (window.innerWidth <= 1024) window.scrollTo({ top: 0, behavior: 'instant' });

            navBtns.forEach(b => {
              b.classList.remove('active');
              b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
          }
        });
      });

      // Keyboard activation for CTA and interactive cards
      document.querySelectorAll('[role="button"][tabindex="0"]').forEach(el => {
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
      });

      // 3. PROJECT FILTERING
      const filterBtns = document.querySelectorAll(".filter-btn");
      const projectCards = document.querySelectorAll("#projects .project-card");

      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach(b => { b.classList.remove("active"); b.setAttribute('aria-pressed', 'false'); });
          btn.classList.add("active");
          btn.setAttribute('aria-pressed', 'true');
          const filter = btn.dataset.filter;
          
          projectCards.forEach((card) => {
            const matches = filter === "all" || card.dataset.category === filter;
            card.style.display = matches ? "flex" : "none";
          });
          const rail = document.getElementById("projectRail");
          if (rail) rail.scrollLeft = 0;
        });
      });


      // HYBRID: Skill cards remain small until visitor asks to view every technology.
      document.querySelectorAll('.skill-expand').forEach(button => {
        button.addEventListener('click', () => {
          const card = button.closest('.skill-card');
          const expanded = card.classList.toggle('is-expanded');
          button.setAttribute('aria-expanded', String(expanded));
          button.innerHTML = expanded ? 'Show less <span aria-hidden="true">+</span>' : 'Show all skills <span aria-hidden="true">+</span>';
        });
      });

      // Accessible horizontal rails on phone/tablet. Native touch swipe stays enabled.
      const railControllers = [];
      ['projectRail', 'certRail'].forEach(id => {
        const rail = document.getElementById(id);
        const controls = document.querySelector(`[data-rail-controls="${id}"]`);
        if (!rail || !controls) return;
        const prev = controls.querySelector('[data-dir="prev"]');
        const next = controls.querySelector('[data-dir="next"]');
        const progress = controls.querySelector('.rail-progress');
        const visibleCards = () => [...rail.children].filter(card => getComputedStyle(card).display !== 'none');
        const currentIndex = () => {
          const cards = visibleCards();
          if (!cards.length) return 0;
          return cards.reduce((best, card, i) =>
            Math.abs(card.offsetLeft - rail.offsetLeft - rail.scrollLeft) <
            Math.abs(cards[best].offsetLeft - rail.offsetLeft - rail.scrollLeft) ? i : best, 0);
        };
        const refresh = () => {
          const cards = visibleCards();
          const i = currentIndex();
          progress.textContent = `${String(cards.length ? i + 1 : 0).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
          prev.disabled = !cards.length || i === 0;
          next.disabled = !cards.length || i === cards.length - 1;
        };
        const move = delta => {
          const cards = visibleCards();
          const i = Math.max(0, Math.min(cards.length - 1, currentIndex() + delta));
          cards[i]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'nearest', inline:'start' });
          setTimeout(refresh, 350);
        };
        prev.addEventListener('click', () => move(-1));
        next.addEventListener('click', () => move(1));
        rail.addEventListener('scroll', () => requestAnimationFrame(refresh), { passive:true });
        window.addEventListener('resize', refresh, { passive:true });
        railControllers.push(refresh);
        refresh();
      });
      // Refresh indicators after project filtering and when switching tabs.
      document.querySelectorAll('.filter-btn, .nav-btn').forEach(btn => btn.addEventListener('click', () => {
        setTimeout(() => railControllers.forEach(refresh => refresh()), 60);
      }));

      // Career tabs + single-card pager for smaller screens. Original 8 entries retained.
      const careerColumns = [...document.querySelectorAll('#experience .exp-column')];
      const careerTabs = [...document.querySelectorAll('.career-tab')];
      const careerProgress = document.querySelector('.career-progress');
      const careerPrev = document.querySelector('.career-prev');
      const careerNext = document.querySelector('.career-next');
      let careerCategory = 0;
      const careerIndices = [0, 0];
      const renderCareer = () => {
        careerColumns.forEach((column, col) => {
          column.classList.toggle('is-career-active', col === careerCategory);
          [...column.querySelectorAll('.exp-timeline-item')].forEach((item, i) =>
            item.classList.toggle('is-career-current', i === careerIndices[col]));
        });
        careerTabs.forEach((tab,i) => {
          tab.classList.toggle('is-selected',i===careerCategory);
          tab.setAttribute('aria-selected',String(i===careerCategory));
          tab.tabIndex = i === careerCategory ? 0 : -1;
        });
        const count = careerColumns[careerCategory]?.querySelectorAll('.exp-timeline-item').length || 0;
        const index = careerIndices[careerCategory];
        if (careerProgress) careerProgress.textContent = `${String(index+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
        if (careerPrev) careerPrev.disabled = index===0;
        if (careerNext) careerNext.disabled = index>=count-1;
      };
      careerTabs.forEach((tab,i) => tab.addEventListener('click', () => { careerCategory=i; renderCareer(); }));
      const moveCareer = delta => {
        const count = careerColumns[careerCategory].querySelectorAll('.exp-timeline-item').length;
        careerIndices[careerCategory] = Math.min(count-1, Math.max(0,careerIndices[careerCategory]+delta));
        renderCareer();
      };
      careerPrev?.addEventListener('click',()=>moveCareer(-1));
      careerNext?.addEventListener('click',()=>moveCareer(1));
      const careerLayout = document.querySelector('#experience .exp-layout');
      let touchStartX = null, touchStartY = null;
      careerLayout?.addEventListener('touchstart', e => {
        touchStartX=e.touches[0].clientX; touchStartY=e.touches[0].clientY;
      }, {passive:true});
      careerLayout?.addEventListener('touchend', e => {
        if (window.innerWidth > 1024 || touchStartX===null) return;
        const dx=e.changedTouches[0].clientX-touchStartX;
        const dy=e.changedTouches[0].clientY-touchStartY;
        if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.3) moveCareer(dx<0?1:-1);
        touchStartX=null;
      },{passive:true});
      renderCareer();

      // 4. MODAL DATA
      const dummyImg = (text) => `https://placehold.co/800x500/e0f2fe/1e293b?text=${text}`;

      const modalData = {
        // Selected Work: verified live sites, stack based on provided package.json files.
        "proj-findurspark": {
          images: [],
          kicker: "COMMUNITY PLATFORM • LIVE WEBSITE",
          title: "Find ur Spark",
          intro: "A Bandung-based community website where visitors can explore sports and creative activities, discover events, and find registration information.",
          sections: [
            {title: "Project Overview", content: "<p>Find ur Spark brings together people through activities including pickleball, badminton, running, and community meetups.</p>"},
            {title: "Technology", content: "<p>React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7, Supabase, Lucide React, and Vitest.</p>"}
          ],
          tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "React Router"],
          liveUrl: "https://www.findurspark.space/"
        },
        "proj-rahmania": {
          images: [],
          kicker: "NONPROFIT / EDUCATION • LIVE WEBSITE",
          title: "Rahmania Foundation",
          intro: "An informational website for a nonprofit foundation focused on improving access to education and social support for underserved communities.",
          sections: [
            {title: "Project Overview", content: "<p>The site introduces the foundation's mission, highlights education and social programs, showcases activity documentation, and offers collaboration and contact paths.</p>"},
            {title: "Technology", content: "<p>Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Supabase JavaScript and Supabase SSR.</p>"}
          ],
          tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
          liveUrl: "https://www.rahmaniafoundation.or.id/"
        },
        // Certs
        "cert-ai": { images: ["https://media.licdn.com/dms/image/v2/D562DAQHgP9JCcor7gQ/profile-treasury-document-images_1280/B56ZgqT0yiH0AU-/1/1753056498962?e=1793836800&v=beta&t=2_qrpzVGKzsU1kh_AnHP2qyf8O-cRzeJRoVkv2Dc4Ms"], kicker: "CERTIFICATE • 2025", title: "Azure AI Fundamentals (AI-900)", intro: "Completed online preparation course and certified by ElevAIte Ltd.", tags: ["Microsoft Azure", "AI", "AI-900"] },
        "cert-js": { images: ["https://media.licdn.com/dms/image/v2/D562DAQHNF0H0Ju-lnA/profile-treasury-document-cover-images_1280/B56Zd38oGhHQA0-/0/1750064072787?e=1793750400&v=beta&t=q69Xhwes0N6dUth9UR0V4e81zZjnAvMxcU97h5sIx70"], kicker: "CERTIFICATION • 2025", title: "JavaScript Dasar (Gold Tier)", intro: "Issued by Skilvul. Comprehensive assessment of core JavaScript concepts and DOM manipulation.", tags: ["Skilvul", "JavaScript"] },
        "cert-backend": { images: [dummyImg("Backend+Certificate")], kicker: "CERTIFICATION • 2023", title: "Back-End Web Development", intro: "Issued by Dicoding Indonesia. Practical implementation of RESTful APIs and server-side logic.", tags: ["Dicoding", "Backend Dev"] },
        "cert-mobile": { images: ["https://media.licdn.com/dms/image/v2/D562DAQH3fmVzaB2uLQ/profile-treasury-document-cover-images_1280/profile-treasury-document-cover-images_1280/0/1727383567555?e=1793750400&v=beta&t=d-ZPHjyoZyrz23m0bsvB59JkwGLdh7k2WoQ7MxPYmwk"], kicker: "CERTIFICATION • 2023", title: "Junior Mobile Programmer", intro: "Issued by Digital Talent Scholarship, Kominfo. Practical training in mobile application development.", tags: ["Kominfo", "Mobile Dev"] },
        "cert-aws": { images: [dummyImg("AWS+Certificate")], kicker: "CERTIFICATION • 2023", title: "AWS Cloud Practitioner Essentials", intro: "Issued by Dicoding Indonesia. Fundamental understanding of AWS Cloud concepts and architecture.", tags: ["AWS", "Cloud"] },
        "cert-cyber": { images: ["https://media.licdn.com/dms/image/v2/D562DAQHEA-DYVrwlCw/profile-treasury-document-images_1280/profile-treasury-document-images_1280/1/1727384129771?e=1793836800&v=beta&t=P_EYKEhiCO170JjjbAtv1bkzTwZ7UFSyyVRN47T0tYE"], kicker: "CERTIFICATION • 2022", title: "Cybersecurity Essentials", intro: "Issued by Cisco Networking Academy. Foundational knowledge in securing networks and protecting data.", tags: ["Cisco", "Cybersecurity"] }
      };

      // 5. MODAL & CAROUSEL LOGIC
      const modal = document.getElementById("modalBackdrop");
      const content = document.getElementById("modalContent");

      const openModal = (data) => {
        if (!modal || !content || !data) return;
        let sectionsHtml = (data.sections || []).map(sec => `<div class="modal-section"><h3>✦ ${sec.title}</h3>${sec.content}</div>`).join('');
        let tagsHtml = (data.tags || []).map(t => `<span>${t}</span>`).join('');
        
        let images = data.images || [];
        let carouselHtml = '';
        if (images.length > 0) {
          if (images.length === 1) {
            carouselHtml = `<div class="carousel-container"><img src="${images[0]}" alt="${data.title}" class="modal-cover modal-carousel-img" /></div>`;
          } else {
            let slidesHtml = images.map((img, idx) => `<div class="carousel-slide ${idx === 0 ? 'active' : ''}"><img src="${img}" alt="${data.title} slide ${idx+1}" class="modal-cover modal-carousel-img" /></div>`).join('');
            let dotsHtml = images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`).join('');
            carouselHtml = `
              <div class="carousel-container" style="position:relative; margin-bottom:20px;">
                <div class="carousel-track">${slidesHtml}</div>
                <button class="carousel-btn prev-btn" aria-label="Previous image">‹</button>
                <button class="carousel-btn next-btn" aria-label="Next image">›</button>
                <div class="carousel-dots">${dotsHtml}</div>
              </div>
            `;
          }
        }

        content.innerHTML = `
          ${carouselHtml}
          <span class="kicker">${data.kicker}</span>
          <h2>${data.title}</h2>
          <p class="intro">${data.intro}</p>
          ${sectionsHtml}
          <div class="modal-tags">${tagsHtml}</div>
          ${data.liveUrl ? `<a class="modal-live-link" href="${data.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Website ↗</a>` : ''}
        `;

        // Carousel Event Handlers
        if (images.length > 1) {
          const track = content.querySelector('.carousel-track');
          const slides = content.querySelectorAll('.carousel-slide');
          const dots = content.querySelectorAll('.carousel-dot');
          const prevBtn = content.querySelector('.prev-btn');
          const nextBtn = content.querySelector('.next-btn');
          let currentIndex = 0;

          const updateCarousel = (index) => {
            currentIndex = index;
            slides.forEach((slide, i) => {
              slide.classList.toggle('active', i === currentIndex);
            });
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === currentIndex);
            });
          };

          prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIdx = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(newIdx);
          });

          nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let newIdx = (currentIndex + 1) % slides.length;
            updateCarousel(newIdx);
          });

          dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
              e.stopPropagation();
              let idx = parseInt(dot.dataset.index);
              updateCarousel(idx);
            });
          });
        }

        modal.style.display = "flex";
        setTimeout(() => modal.classList.add("is-open"), 10);
        document.body.style.overflow = "hidden";
      };

      const closeModal = () => {
        modal.classList.remove("is-open");
        setTimeout(() => {
          modal.style.display = "none";
          document.body.style.overflow = "";
        }, 300);
      };

      document.querySelectorAll("[data-modal]").forEach(btn => {
        btn.addEventListener("click", (event) => {
          if (event.target.closest("a")) return;
          openModal(modalData[btn.dataset.modal]);
        });
      });

      document.getElementById("modalClose").addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

      // 6. IMAGE ZOOM LIGHTBOX
      const lightbox = document.getElementById("imageZoomLightbox");
      const zoomedImg = document.getElementById("zoomedImage");

      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-carousel-img")) {
          zoomedImg.src = e.target.src;
          lightbox.classList.add("is-active");
        }
      });

      lightbox.addEventListener("click", () => {
        lightbox.classList.remove("is-active");
        zoomedImg.src = "";
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeModal();
          lightbox.classList.remove("is-active");
        }
      });
    });