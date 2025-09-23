//Run everything after loaded
document.addEventListener('DOMContentLoaded', function () {
  loadPartials().then(function () {
    setCurrentYear();
    highlightActivePage();
  });

  renderProjects();
  enableSmoothScroll();
  enableCopyEmail();
});

// Load navbar and footer
function loadPartials() {
  var p1 = loadPartial('navbar-placeholder', 'partials/navbar.html');
  var p2 = loadPartial('footer-placeholder', 'partials/footer.html');
  return Promise.all([p1, p2]);
}

function loadPartial(placeholderId, url) {
  var container = document.getElementById(placeholderId);
  if (!container) return Promise.resolve();
  return fetch(url)
    .then(function (response) { return response.text(); })
    .then(function (html) { container.innerHTML = html; })
    .catch(function (error) {
      console.error('Error loading partial:', url, error);
    });
}

function setCurrentYear() {
  var yearElement = document.getElementById('year');
  if (yearElement) {
    var year = new Date().getFullYear();
    yearElement.textContent = year;
  }
}

function highlightActivePage() {
  var filename = location.pathname.split('/').pop().toLowerCase();
  if (filename === '' || filename === '/') {
    filename = 'index.html';
  }

  //Links for inside the navbar-placeholder
  var navLinks = document.querySelectorAll('#navbar-placeholder a.nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    
    var hrefFile = href.split('/').pop().toLowerCase();
    if (hrefFile === filename) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

//Input work section projects
function renderProjects() {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  var projects = [
    { title: 'Analytics Dashboard', image: 'images/work-1.jpg', alt: 'Analytics Dashboard', link: 'work-project1.html' },
    { title: 'E-commerce App', image: 'images/work-1.jpg', alt: 'E-commerce App', link: 'work-project2.html' },
    { title: 'Design System', image: 'images/work-1.jpg', alt: 'Design System', link: 'work-project3.html' },
    { title: 'Marketing Site', image: 'images/work-1.jpg', alt: 'Marketing Site', link: 'work-project4.html' },
    { title: 'Portfolio Redesign', image: 'images/work-1.jpg', alt: 'Portfolio Redesign', link: 'work-project5.html' },
    { title: 'Mobile Prototype', image: 'images/work-1.jpg', alt: 'Mobile Prototype', link: 'work-project6.html' }
  ];

  var html = '';
  projects.forEach(function (p) {
    html +=
      '<div class="col-12 col-md-6 col-lg-4 mb-4">' +
        '<a class="project-thumb d-block position-relative rounded-3 overflow-hidden" href="' + p.link + '">' +
          '<img src="' + p.image + '" alt="' + (p.alt || p.title) + '" class="img-fluid w-100 h-100 object-fit-cover">' +
          '<div class="overlay d-flex align-items-center justify-content-center">' +
            '<h3 class="overlay-title m-0">' + p.title + '</h3>' +
          '</div>' +
        '</a>' +
      '</div>';
  });

  //Inject HTML
  grid.innerHTML = html;
}

//Smooth scrolling
function enableSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href').substring(1);
      var target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

//Copy email
function enableCopyEmail() {
  var btn = document.getElementById('connect-email-btn');
  if (!btn) return;
  var email = btn.dataset.email || 'hicamillacardoso@gmail.com';

  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(email).then(
      function () {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () {
          btn.textContent = original;
        }, 1200);
      },
      function () {
        var temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
    )
  })
}