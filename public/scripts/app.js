// Globalní proměnné
let profiles, infoWrapper, settingsPage;

// Enum for ActiveLayout
const Layouts = Object.freeze({
  TwoCards: 2,
  ThreeCards: 3,
});

// Settings for page
let settings = {
  activeLayout: Layouts.ThreeCards,
  pageTitle: "",
  source: "",
  data: [],
  generatedNumbers: [],
  cachedImages: [],
};

// Inicializace obrázků pro rychlost
window.onload = () => {
  settings.source = "scripts/data.json";

  fetch(settings.source)
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        settings.pageTitle = json.pageTitle;
        settings.data = json.data;
        [...document.querySelectorAll("#title")].map((title) => {
          title.textContent = "SPŠT - " + json.pageTitle.toUpperCase();
        });
      }
    });

  profiles = [...document.querySelector("#profiles").childNodes];
  infoWrapper = document.querySelector("#infoWrapper");
  settingsPage = document.querySelector("#settings");

  const pageImgs = [...document.querySelectorAll("img")];
  const creators = ["david.jpg", "dan.jpg", "marcel.jpg", "dominik.jpg"];

  // Načítání fotek u Info Wrapperu
  profiles
    .filter((item) => item.nodeName === "DIV")
    .forEach((element, index) => {
      const imgSrc = `imgs/${creators[index]}`;

      new Image().src = imgSrc;
      element.childNodes[1].src = imgSrc;
    });

  pageImgs
    .filter((img) => img.src.includes("profiles") || !img.alt)
    .forEach((img) => {
      if (img.src.includes("logo")) {
        img.style.animation = "spin 2s linear infinite";
      }
      img.parentElement.style.width = "259px";

      setTimeout(() => {
        img.parentElement.style.justifyContent = "normal";
        img.parentElement.style.alignItems = "normal";
        img.parentElement.style.width = "";
        img.style.display = img.src.includes("logo") ? "none" : "flex";

        if (img.src.includes("profiles")) {
          img.style.opacity = "1";
          img.style.visibility = "visible";
        }
      }, 1000);
    });
};

// Sets interval for changing layouts and cards content
setInterval(() => {
  const cardElements = document.querySelectorAll(".card, .card-reversed");

  setNumbersToSetting();
  suffleData();
  Array.from(cardElements).forEach((card, index) => {
    setCardData(card, index);
  });
}, 10000);

// Zobrazí tvůrce stránky
const showInfo = () => {
  infoWrapper.style.display = "flex";
  infoWrapper.style.animation =
    "slide-down 600ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
  document.querySelector("body").style.overflowY = "hidden";

  setTimeout(() => {
    // Zobrazení třídy
    Array.from(infoWrapper.childNodes[1].children).forEach((element) => {
      element.style.opacity = "1";
    });

    // Nastaví na obrázky animace a efekty
    profiles
      .filter((item) => item.nodeName === "DIV")
      .forEach((element) => {
        element.childNodes[1].style.opacity = "1";
        element.childNodes[3].style.opacity = "1";
        element.childNodes[1].style.animation =
          "profiles-slide-down 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both";
      });
  }, 300);
};

// Schování dialogu (tvůrců stránky)
const rollUp = () => {
  infoWrapper.style.animation =
    "slide-up 500ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both";

  // Nastaví na obrázky animace a efekty
  profiles
    .filter((item) => item.nodeName === "DIV")
    .forEach((element) => {
      element.childNodes[1].style.opacity = "0";
      element.childNodes[3].style.opacity = "0";
      element.childNodes[1].style.animation = "";
    });

  setTimeout(() => {
    infoWrapper.style.display = "none";
    document.querySelector("body").style.overflowY = "auto";
  }, 600);
};

const showCreationDialog = () => {
  settingsPage.style.display = "flex";
  settingsPage.style.animation = "fadeIn 320ms";
};

const hideCreationDialog = () => {
  settingsPage.style.animation = "fadeOut 280ms";
  clearForm();

  setTimeout(() => {
    settingsPage.style.display = "none";
  }, 250);
};

const setNumbersToSetting = () => {
  settings.generatedNumbers = [];
  settings.generatedNumbers = [
    ...generateNumbers(settings.activeLayout, 5).map((number) =>
      number === 0 ? 1 : number
    ),
  ];
};

const generateNumbers = (count, limit) => {
  const temp = [];

  for (let i = 0; i < (count ? count : 1); i++) {
    const number = Math.floor(Math.random() * limit);
    temp.push(number);
  }

  return temp.length > 1 ? temp : temp[0];
};

const getFileSuffix = (fileType) => {
  return fileType.split("/")[1];
};

// Nastavení obsahu karty
const setCardData = (card, cardIndex) => {
  Array.from(card.children).forEach((element, index) => {
    switch (index) {
      case 0: {
        const data = settings.data[cardIndex];
        const imageSrc = `imgs/profiles/${data.id}${
          data.multipleImages ? "-0" + settings.generatedNumbers[index] : "-01"
        }.${getFileSuffix(data.fileType)}`;
        let newImage = getCachedImage(imageSrc);
        element.children[1].style.animation = "fadeOut 250ms";

        setTimeout(() => {
          element.children[1].src = newImage.src;
          element.children[1].style.animation = "fadeIn 200ms";
        }, 220);
        break;
      }

      case 1: {
        const quoteElement = element.children[1];
        const studentInfoElement = element.children[2];
        const quoteNum = generateNumbers(
          null,
          settings.data[cardIndex]["quotes"].length
        );
        const quote = settings.data[cardIndex]["quotes"][+quoteNum];

        quoteElement.style.animation = "fadeOut 250ms";
        studentInfoElement.style.animation = "fadeOut 250ms";

        setTimeout(() => {
          quoteElement.innerText = quote;
          quoteElement.style.fontSize = setTextFontSize(quote);
          quoteElement.style.animation = "fadeIn 200ms";

          studentInfoElement.children[0].children[0].innerText =
            settings.data[cardIndex]["name"];
          studentInfoElement.children[0].children[1].innerText =
            settings.data[cardIndex]["class"];
          studentInfoElement.style.animation = "fadeIn 200ms";
        }, 220);
        break;
      }
    }
  });
};

// If quote is bigger, sets smaller font size
const setTextFontSize = (quote) => {
  if (quote.length > 110) {
    return `calc(10px + 0.8vw)`;
  } else {
    return "";
  }
};

// Fisher–Yates Shuffle (https://bost.ocks.org/mike/shuffle/)
const suffleData = () => {
  let currentIndex = settings.data.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [settings.data[currentIndex], settings.data[randomIndex]] = [
      settings.data[randomIndex],
      settings.data[currentIndex],
    ];
  }
};

// Getter for image
const getCachedImage = (url) => {
  return (
    settings.cachedImages.find((img) => img.src.includes(url)) ||
    editImageCache(url)
  );
};

// Controls Image Cache
const editImageCache = (url) => {
  if (settings.cachedImages.findIndex((img) => img.src.includes(url)) < 0) {
    let newImage = new Image();
    newImage.src = url;
    settings.cachedImages.push(newImage);

    return newImage;
  }
};

const copyImageId = (target) => {
  const active =
    [...document.querySelectorAll(".tooltip")].filter(
      (item) => item.style.left === target.x + "px"
    ).length > 0
      ? true
      : false;

  if (!active && !target.src.includes("logo")) {
    const imageURL = target.src.split("/").slice(-1)[0].split(".")[0];
    const ID = imageURL.slice(0, imageURL.length - 3);
    navigator.clipboard.writeText(ID);

    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.style.left = target.x;
    tooltip.style.top = target.y;
    tooltip.textContent = "ID COPIED !";

    document.body.appendChild(tooltip);
    tooltip.style.opacity = "1";

    setTimeout(() => {
      tooltip.opacity = 0;
      tooltip.remove();
    }, 3000);
  }
};

[...document.querySelectorAll(".card-img")].forEach((item) => {
  item.addEventListener("click", (e) => {
    copyImageId(e.target);
  });
});
