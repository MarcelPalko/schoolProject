// Globalní proměnné
let profiles, infoWrapper;

// Inicializace obrázků pro rychlost
window.onload = () => {
    profiles = Array.from(document.getElementById("profiles").childNodes);
    infoWrapper = document.getElementById("infoWrapper");

    const pageImgs = Array.from(document.querySelectorAll("img"));
    const creators = ["david.jpg", "dan.jpg", "marcel.jpg", "dominik.jpg"];

    // Načítání fotek u Info Wrapperu
    profiles.filter(item => item.nodeName === "DIV").forEach((element, index) => {
        const imgSrc = `imgs/${creators[index]}`;

        new Image().src = imgSrc; 
        element.childNodes[1].src = imgSrc;
    });

    pageImgs.filter(img => img.src.includes("profiles") || !img.alt).forEach(img => {
        
        if(img.src.includes("logo")) {
           img.style.animation = "spin 2s linear infinite";
        }

        setTimeout(() => {
            img.parentElement.style.justifyContent = "normal";
            img.parentElement.style.alignItems = "normal";
            img.style.display = img.src.includes("logo") ? "none" : "flex";

            if(img.src.includes("profiles")) {
                img.style.opacity = "1";
                img.style.visibility = "visible";
            }
        }, 1000);
    });
};

// Zobrazí tvůrce stránky
const showInfo = () => {
    infoWrapper.style.display = "flex";
    infoWrapper.style.animation = "slide-down 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
    document.querySelector("body").style.overflowY = "hidden";

    setTimeout(() => {
        // Zobrazení třídy
        Array.from(infoWrapper.childNodes[1].children).forEach(element => {
            element.style.opacity = "1";
        });

        // Nastaví na obrázky animace a efekty
        profiles.filter(item => item.nodeName === "DIV").forEach(element => {
            element.childNodes[1].style.opacity = "1";
            element.childNodes[3].style.opacity = "1";
            element.childNodes[1].style.animation = "profiles-slide-down 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both";
        });
    }, 300);
};

// Schování dialogu (tvůrců stránky)
const rollUp = () => {
    infoWrapper.style.animation = "slide-up 500ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";

    // Nastaví na obrázky animace a efekty
    profiles.filter(item => item.nodeName === "DIV").forEach(element => {
        element.childNodes[1].style.opacity = "0";
        element.childNodes[3].style.opacity = "0";
    });

    setTimeout(() => {
        infoWrapper.style.display = "none"
        document.querySelector("body").style.overflowY = "auto";
    }, 600);
};