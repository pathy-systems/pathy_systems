const projects = document.querySelectorAll(".project");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // adiciona a classe que dispara a sequência de animação
            entry.target.classList.add("is-active");
        } else {
            // remove a classe quando a seção sai da viewport — reverte animação
            entry.target.classList.remove("is-active");
        }
    });
}, {
    threshold: 0.6
});

projects.forEach(project => observer.observe(project));
