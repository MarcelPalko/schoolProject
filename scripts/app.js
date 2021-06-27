// Inicializace obrázků pro rychlost
window.onload = () => {
    const profiles = document.getElementById("profiles");
    const creators = ["david.webp", "dan.webp", "marcel.webp", "dominik.webp"];

    Array.from(profiles.childNodes).filter(item => item.nodeName === "DIV").forEach((element, index) => {
        const imgSrc = `imgs/${creators[index]}`;

        new Image().src = imgSrc; 
        element.childNodes[1].src = imgSrc;
    });
};

// Zobrazí tvůrce stránky
const showInfo = () => {
    const wrapper = document.getElementById("infoWrapper");
    const profiles = document.getElementById("profiles");
    wrapper.style.display = "flex";
    wrapper.style.animation = "slide-down 800ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
    document.querySelector("body").style.overflowY = "hidden";

    setTimeout(() => {
        wrapper.firstElementChild.style.opacity = "1";

        // Nastaví na obrázky animace a efekty
        Array.from(profiles.childNodes).filter(item => item.nodeName === "DIV").forEach(element => {
            element.childNodes[1].style.opacity = "1";
            element.childNodes[3].style.opacity = "1";
            element.childNodes[1].style.animation = "profiles-slide-down 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both";
        });
    }, 400);
};

// Schování dialogu (tvůrců stránky)
const rollUp = () => {
    const wrapper = document.getElementById("infoWrapper");
    wrapper.style.animation = "slide-up 800ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";

    // Nastaví na obrázky animace a efekty
    Array.from(profiles.childNodes).filter(item => item.nodeName === "DIV").forEach(element => {
        element.childNodes[1].style.opacity = "0";
        element.childNodes[3].style.opacity = "0";
    });

    setTimeout(() => {
        wrapper.style.display = "none"
        document.querySelector("body").style.overflowY = "auto";
    }, 900);
};