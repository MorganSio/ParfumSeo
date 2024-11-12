document.addEventListener('DOMContentLoaded', () => {
    const chose = document.querySelector('.burger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links li');

    chose.addEventListener('click', () => {
        nav.classList.toggle('active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        chose.classList.toggle('toggle');
    });

    const visitedPages = JSON.parse(localStorage.getItem('visitedPages')) || [];
    const currentPage = {
        title: document.title,
        url: window.location.href
    };

    if (!visitedPages.some(page => page.url === currentPage.url)) {
        visitedPages.push(currentPage);
        localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }

    const visitedPagesContainer = document.getElementById('visited-pages');
    if (visitedPagesContainer) {
        visitedPagesContainer.innerHTML = visitedPages
            .map(page => `<a href="${page.url}">${page.title}</a>`)
            .join('<br>');
    }

    $(document).ready(function(){
    $('#jw-slideshow').slick({
        dots: true,
        autoplay: true,
        autoplaySpeed: 7000,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    dots: false,
                    arrows: true
                }
            }
        ]
    });

    

    const sentences = document.querySelectorAll('[data-sentences-target="sentence"]');
    const sentenceScope = document.getElementById('sentencesBloc');
    let index = 0;
    let charIndex = 0;
    const typingSpeed = 50;
    const erasingSpeed = 50;
    const delayBetweenSentences = 2000;
    let currentSentence = sentences[index].textContent.trim();

    function typeSentenceFade() {
        if (charIndex < currentSentence.length) {
            sentenceScope.textContent = currentSentence.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeSentenceFade, typingSpeed);
        } else {
            setTimeout(eraseSentenceFade, delayBetweenSentences);
        }
    }

    function eraseSentenceFade() {
        if (charIndex > 0) {
            sentenceScope.textContent = currentSentence.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseSentenceFade, erasingSpeed);
        } else {
            index = (index + 1) % sentences.length;
            currentSentence = sentences[index].textContent.trim();
            charIndex = 0;
            setTimeout(typeSentenceFade, typingSpeed);
        }
    }

    typeSentenceFade();
});

var pathEls = $(".check");
for (var i = 0; i < pathEls.length; i++) {
  var pathEl = pathEls[i];
  var offset = anime.setDashoffset(pathEl);
  pathEl.setAttribute("stroke-dashoffset", offset);
}

basicTimeline
  .add({
    targets: ".text",
    duration: 1,
    opacity: "0"
  })
  .add({
    targets: ".button",
    duration: 1300,
    height: 10,
    width: 300,
    backgroundColor: "#2B2D2F",
    border: "0",
    borderRadius: 100
  })
  .add({
    targets: ".progress-bar",
    duration: 2000,
    width: 300,
    easing: "linear"
  })
  .add({
    targets: ".button",
    width: 0,
    duration: 1
  })
  .add({
    targets: ".progress-bar",
    width: 80,
    height: 80,
    delay: 500,
    duration: 750,
    borderRadius: 80,
    backgroundColor: "#71DFBE"
  })
  .add({
    targets: pathEl,
    strokeDashoffset: [offset, 0],
    duration: 200,
    easing: "easeInOutSine"
  });

$(".button").click(function() {
  basicTimeline.play();
});

$(".text").click(function() {
  basicTimeline.play();
});

const button = document.querySelector('.buttons');
const progressBar = document.querySelector('.progress-bar');
const svgprog = document.querySelector('.svgprog');
button.addEventListener('click', () => {
    const taskDuration = 2000; 
    progressBar.style.width = '0%';
    progressBar.style.height = '10px';
    svgprog.style.opacity = 0; 
    let progressInterval = setInterval(() => {
        let progress = (Date.now() - button.clickTime) / taskDuration * 100;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(progressInterval);
            svgprog.style.opacity = 1;
            svgprog.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }, 10);
    button.clickTime = Date.now();
    setTimeout(() => {
        button.style.display = 'none';
    },1);
});
});
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const resultContainer = document.getElementById('resultContainer');

  function displayResults(parfums) {
      resultContainer.innerHTML = '';
      if (parfums.length === 0) {
          resultContainer.innerHTML = '<p>Aucun parfum trouvé.</p>';
          return;
      }
      
      parfums.forEach(parfum => {
          const parfumCard = document.createElement('div');
          parfumCard.classList.add('col-lg-4', 'mb-4');

          parfumCard.innerHTML = `
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title">${parfum.nom}</h5>
                      <p class="card-text">${parfum.description}</p>
                      <h6>Prix selon les vendeurs :</h6>
                      <ul>
                          ${parfum.vendeurs.map(vendeur => `
                              <li>${vendeur.nom}: ${vendeur.prix} - 
                                  <a href="${vendeur.lien}" target="_blank">Acheter</a>
                              </li>
                          `).join('')}
                      </ul>
                  </div>
              </div>
          `;
          resultContainer.appendChild(parfumCard);
      });
  }

  async function searchParfum() {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
          resultContainer.innerHTML = '<p>Veuillez entrer un parfum à rechercher.</p>';
          return;
      }

      const apiUrl = `https://api.exemple.com/search?product=${query}`;
      
      try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('Erreur lors de la récupération des données');

          const data = await response.json();
          
          const parfums = data.results.map(item => ({
              nom: item.name,
              description: item.description || "Description non disponible",
              vendeurs: item.sellers.map(seller => ({
                  nom: seller.name,
                  prix: seller.price,
                  lien: seller.link
              }))
          }));

          displayResults(parfums);
      } catch (error) {
          console.error('Erreur:', error);
          resultContainer.innerHTML = '<p>Une erreur est survenue lors de la recherche.</p>';
      }
  }

  searchButton.addEventListener('click', searchParfum);

  searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          searchParfum();
      }
  });
});
