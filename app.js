// Splash Screen Animation
    let intro = document.querySelector('.intro');
    let logo = document.querySelector('.logo-header');
    let logoSpan = document.querySelectorAll('.logo');

    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        logoSpan.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.add('active');
          }, (idx + 1) * 500);
        });

        setTimeout(() => {
          logoSpan.forEach((span, idx) => {
            setTimeout(() => {
              span.classList.remove('active');
              span.classList.add('fade');
            }, (idx + 1) * 100);
          });
        }, 2400);

        setTimeout(() => {
          intro.style.top = '-100vh';
        }, 3000);
      });
    });

    // Page Transition Overlay
    const overlay = document.querySelector(".transition-overlay");
    const links = document.querySelectorAll("a"); 
    // all links and nav buttons

    links.forEach(link => {
      link.addEventListener("click", function (e) {
        const target = this.getAttribute("href");

        //  Skip transition for About Us
        if (target === "#about") {
          return; 
        }

        //  If it's not about, play transition
        e.preventDefault(); 
        overlay.classList.add("active");

        // after animation, navigate
        setTimeout(() => {
          window.location.href = target;
        }, 800); 
      });
    });
