// Globalní proměnné
let profiles, infoWrapper;

// Enum for ActiveLayout
const Layouts = Object.freeze({
    "TwoCards": 2,
    "ThreeCards": 3
});

// Settings for page
let settings = {
    activeLayout: Layouts.ThreeCards,
    pageTitle: "",
    source: "",
    data: [],
    generatedNumbers: [],
    cachedImages: []
};

// Inicializace obrázků pro rychlost
window.onload = () => {
    settings.source = "scripts/data.js";

    if(settings.source) {
        settings.pageTitle = PAGEDATA[0].pageTitle;
        settings.data = PAGEDATA[0].data;
    }

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

// Sets interval for changing layouts and cards content
setInterval(() => {
    const cardElements = document.querySelectorAll('.card, .card-reversed');

    setNumbersToSetting();
    Array.from(cardElements).forEach((card, index) => {
        setCardData(card, index);
    });
}, 9000);

const setNumbersToSetting = () => {
    settings.generatedNumbers = [];
    settings.generatedNumbers = [...generateNumbers(settings.activeLayout, 5).map((number) => number === 0 ? 1 : number)];
};

const generateNumbers = (count, limit) => {
    const temp = [];

    for (let i = 0; i < (count ? count : 1); i++) {
        const number = Math.floor(Math.random() * limit);
        temp.push(number);
    }

    return temp.length > 1 ? temp : temp[0];
};

// Choose layout, it depends on the length of quote
const setLayout = () => {
    if(settings.data.filter(item => item.quote.length > 60)) {
        settings.activeLayout = Layouts.TwoCards;
    }
};

// Nastavení obsahu karty
const setCardData = (card, cardIndex) => {
    Array.from(card.children).forEach((element, index) => {
        switch(index) {
            case 0: {
                const imageSrc = `imgs/profiles/${settings.data[cardIndex]['name'].toLowerCase()}-0${settings.generatedNumbers[index]}.jpg`;
                
                element.children[1].src = getCachedImage(imageSrc);
                break;
            }

            case 1: {                
                const quoteNum = generateNumbers(null, settings.data[cardIndex]['quotes'].length);

                element.children[1].innerText = settings.data[cardIndex]['quotes'][+quoteNum];
                element.children[2].children[0].innerText = settings.data[cardIndex]['name'];
                element.children[2].children[1].innerText = settings.data[cardIndex]['class'];
                break;
            }
        }
    });
};

// Getter for image
const getCachedImage = (url) => {
    return editImageCache(url) || settings.cachedImages.find((img) => img.src.includes(url)).src;
};

// Controls Image Cache
const editImageCache = (url) => {
    if(settings.cachedImages.findIndex((img) => img.src.includes(url)) < 0) {
        let newImage = new Image();
        newImage.src = url;
        settings.cachedImages.push(newImage);

        return newImage.src;
    }
};