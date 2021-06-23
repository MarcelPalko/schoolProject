// Enum for ActiveLayout
const Layouts = Object.freeze({
    "TwoCards": 1,
    "ThreeCards": 2
});

// Settings for page
let settings = {
    activeLayout: Layouts.ThreeCards,
    pageTitle: "",
    source: "",
    data: [],
    generatedNumbers: []
};

window.onload = () => {
    settings.source = "scripts/data.js";

    if(settings.source) {
        settings.pageTitle = PAGEDATA[0].pageTitle;
        settings.data = PAGEDATA[0].data;
    }

    generateNumbers();
    console.log(settings);
};

// Sets interval for changing layouts and cards content
setInterval(() => {
}, 3000);

const generateNumbers = () => {
    for (let i = 0; i < settings.activeLayout; i++) {
        const number = Math.floor(Math.random() * 5);
        settings.generatedNumbers.push(number);
    }
};

// Choose layout, it depends on the length of quote
const setLayout = () => {
    if(settings.data.filter(item => item.quote.length > 60)) {
        settings.activeLayout = Layouts.TwoCards;
    }
};