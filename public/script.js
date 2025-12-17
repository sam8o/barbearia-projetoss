// Efeito de Animação ao Scroll com Intersection Observer

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que devem ter animação
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    // Configurações para o observador
    const observerOptions = {
        root: null, // Observa dentro do viewport
        threshold: 0.15, // 15% do elemento visível para disparar
        rootMargin: '0px'
    };

    // Função que será chamada quando um elemento cruzar o threshold
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se o elemento estiver visível, adiciona a classe 'show'
                entry.target.classList.add('show');
                // Para de observar o elemento, pois ele já foi animado
                observer.unobserve(entry.target);
            }
        });
    };

    // Cria o Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observa cada elemento animado
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Animação Extra: Zoom suave na imagem de capa ao carregar
    const heroSection = document.querySelector('.hero-section');
    if(heroSection) {
        // Adiciona um estilo inicial que será alterado pelo CSS
        heroSection.style.backgroundSize = '110% 110%'; 
        heroSection.style.transition = 'background-size 10s ease-out';
        
        // Dispara a transição após um pequeno delay para carregar
        setTimeout(() => {
            heroSection.style.backgroundSize = '100% 100%';
        }, 100);
    }
});