const addLine = () => {
  const tableDataset = document.querySelectorAll("table")[0];
  const firstCell = document.createElement("td");
  const secondCell = document.createElement("td");
  const index = tableDataset.rows.length - 1;

  if (tableDataset.rows.length == 3) {
    document.getElementsByClassName("plus")[0].style.display = "none";
  }

  // FIRST CELL
  const divCard = document.createElement("div");
  const divInput = document.createElement("input");

  divInput.setAttribute("type", "text");
  divInput.setAttribute("name", "quote");
  divInput.addEventListener("input", (event) => {
    expandQuoteInput(event);
    validateUploadForm();
  });
  divCard.classList.add("material-card");
  divCard.appendChild(divInput);
  firstCell.appendChild(divCard);

  // SECOND CELL
  const divButton = document.createElement("div");
  const divI = document.createElement("i");

  secondCell.style.textAlign = "-webkit-right";
  divI.classList.add("fas", "fa-minus");
  divButton.classList.add("circle-button", "minus");
  divButton.style.pointerEvents = "auto";
  divButton.appendChild(divI);
  secondCell.appendChild(divButton);

  // NEW LINE
  const newLineElement = tableDataset.insertRow(index);
  divButton.addEventListener("click", () => {
    removeLine(newLineElement);
  });
  newLineElement.appendChild(firstCell);
  newLineElement.appendChild(secondCell);
  validateUploadForm();
};

const removeLine = (target) => {
  const rows = document.querySelectorAll("table")[0].rows;
  target = target || rows[0];

  if (rows.length > 2) {
    document.getElementsByClassName("plus")[0].style.display = "flex";
    target.remove();
  }

  validateUploadForm();
};

const validateImageFormat = (fileType) => {
  return fileType === "image/jpeg" || fileType === "image/png";
};

const validateUploadForm = () => {
  const image = !document.querySelector("#discardButton").disabled;
  const quotes = [...document.querySelectorAll('input[name="quote"]')]
    .map((input) => input.value)
    .filter((quote) => quote.length > 0);
  const name = document.querySelector('input[name="name"]').value;
  const className = document.querySelector('input[name="class"]').value;
  const uploadButton = document.querySelector("#uploadButton");
  const removeLineButtons = [...document.querySelectorAll(".minus")];

  if (removeLineButtons.length > 1) {
    removeLineButtons.map((button) => (button.style.pointerEvents = "auto"));
  } else {
    removeLineButtons[0].style.pointerEvents = "none";
  }

  uploadButton.disabled = !(
    image &&
    quotes.length > 0 &&
    className.length > 0 &&
    name.length > 0
  );
};

const readImage = (file) => {
  const reader = new FileReader();
  const dragArea = document.querySelector("#dragArea");
  const discardButton = document.querySelector("#discardButton");

  reader.addEventListener("load", (event) => {
    const uploadedImage = event.target.result;
    dragArea.style.backgroundImage = `url(${uploadedImage})`;
    dragArea.style.backgroundSize = "cover";
    discardButton.disabled = false;
    validateUploadForm();
  });

  reader.readAsDataURL(file);
};

const loadFile = (event) => {
  const file = (event.target.files || event.dataTransfer.files)[0];
  const dragArea = document.querySelector("#dragArea");

  dragArea.classList.remove("file-message--wrong", "file-message--success");
  dragArea.classList.add("file-message--default");

  if (!validateImageFormat(file?.type)) {
    dragArea.classList.remove("file-message--default");
    dragArea.classList.add("file-message--wrong");
    discardImage();
    return;
  }

  dragArea.classList.remove("file-message--default");
  dragArea.classList.add("file-message--success");
  event.stopPropagation();
  event.preventDefault();
  readImage(file);
};

const expandQuoteInput = (input) => {
  const textAreaElement =
    input.target.parentElement.children[1] ||
    document.createElement("textarea");
  const INPUT_VISIBLE_LENGTH =
    Math.ceil(input.target.scrollWidth / 20 + 20) -
    (Math.ceil(input.target.scrollWidth / 20 + 20) % 10);

  if (
    input.target.value.length >= INPUT_VISIBLE_LENGTH &&
    textAreaElement.name != "expanded-input"
  ) {
    textAreaElement.setAttribute("name", "expanded-input");
    textAreaElement.classList.add("matetial-textarea");
    textAreaElement.rows = 3;
    textAreaElement.cols = 40;
    textAreaElement.style.resize = "none";
    textAreaElement.value = input.target.value;

    input.target.parentElement.appendChild(textAreaElement);
    textAreaElement.focus();
    textAreaElement.selectionEnd += 7;

    input.target.addEventListener("click", () => {
      textAreaElement.style.display = "block";
      textAreaElement.value = input.target.value;
      textAreaElement.style.animation = "fadeIn 320ms";

      textAreaElement.focus();
      textAreaElement.selectionEnd += 7;
    });
  }

  textAreaElement.addEventListener("focusout", () => {
    input.target.value = textAreaElement.value;
    setTimeout(() => (textAreaElement.style.display = "none"), 250);
    textAreaElement.style.animation = "fadeOut 280ms";
  });
};

const discardImage = () => {
  const dragArea = document.querySelector("#dragArea");
  const imageInput = document.querySelector("#imageInput");
  const discardButton = document.querySelector("#discardButton");
  const uploadButton = document.querySelector("#uploadButton");

  dragArea.style.backgroundImage = "";
  imageInput.files = null;
  imageInput.value = "";

  dragArea.classList.remove("file-message--success");
  dragArea.classList.add("file-message--default");
  discardButton.disabled = true;
  uploadButton.disabled = true;
};

const clearForm = () => {
  const quotes = Array.from(document.querySelectorAll("table")[0].rows);
  document.querySelector('input[name="name"]').value = "";
  document.querySelector('input[name="class"]').value = "";
  discardImage();

  Array.from(document.querySelectorAll('input[name="quote"]')).map((input) => {
    input.value = "";
    input.nextElementSibling?.remove();
  });
  quotes.slice(0, quotes.length - 2).forEach((line) => {
    removeLine(line);
  });
  validateUploadForm();
};

const uploadEntity = (target) => {
  const imageUrl = document.querySelector("#dragArea").style.backgroundImage;
  let studentName = document.querySelector('input[name="name"]');
  const sutdentClass = document.querySelector('input[name="class"]').value;
  const file = dataURLtoFile(imageUrl.slice(4, imageUrl.length - 2));
  const quotes = Array.from(document.querySelectorAll('input[name="quote"]'))
    .map((input) => input.value)
    .filter((quote) => quote.length > 0);
  const formData = new FormData();
  const spinner = document.createElement("i");
  spinner.classList.add("fas", "fa-spinner", "fa-spin");
  spinner.style.display = "inline-block";

  if (studentName.title.length > 0) {
    formData.append("id", studentName.title);
    studentName.title = "";
    const index = settings.cachedImages.findIndex((img) =>
      img.src.includes(studentName.title)
    );

    if (index > -1) {
      settings.cachedImages.splice(index, 1);
    }
  }

  formData.append("myFile", file);
  formData.append("name", studentName.value);
  formData.append("class", sutdentClass);
  formData.append("quotes", JSON.stringify(quotes));

  target.innerText = "UPLOAD\u00A0\u00A0";
  target.appendChild(spinner);

  fetch(`/uploadImage`, {
    method: "POST",
    body: formData,
  })
    .then(
      (result) =>
        new Promise((resolve) => setTimeout(() => resolve(result), 1000))
    )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        target.innerText = "UPLOAD";
        spinner.style.display = "none";
        settings.data = settings.data.filter((item) => item.id != data.id);
        settings.data.push(data);
        clearForm();
        hideCreationDialog();
      }
    })
    .catch((error) => {
      console.error(
        "NASTALA CHYBA PROGRAMU !!!\nKONTAKTUJTE PROGRAMÁTORA S TOUTO CHYBOU !!\n[UPLOAD FORM]: ",
        error
      );
    });
};

const dataURLtoFile = (dataurl) => {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], "." + mime.split("/")[1], { type: mime });
};

/** EVENT LISTENERS **/
document.querySelector("#dragArea").addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();

  event.dataTransfer.dropEffect = "copy";
});

document
  .querySelector("#dragArea")
  .addEventListener("drop", (event) => loadFile(event));
document
  .querySelector("#imageInput")
  .addEventListener("change", (event) => loadFile(event));
document.querySelector("#dragArea").addEventListener("click", () => {
  document.querySelector("#imageInput").click();
});

[
  document.querySelector('input[name="class"]'),
  ...document.querySelectorAll('input[name="quote"]'),
].forEach((item) => {
  item.addEventListener("input", () => {
    validateUploadForm();
  });
});

document.querySelector('input[name="name"]').addEventListener("input", (e) => {
  validateUploadForm();

  if (e.target.value.includes("-")) {
    let text = e.target.value;
    const regex = new RegExp("[-]{1}", "g");

    if ([...text.matchAll(regex)]) {
      const student = settings.data.find((item) => item.id === text);

      if (student) {
        e.target.title = student.id;
        e.target.value = student.name;
        document.querySelector('input[name="class"]').value = student.class;
        student.quotes.forEach((quote, index) => {
          let quotes = [...document.querySelectorAll('input[name="quote"]')];

          if (quotes[index] === undefined) {
            addLine();
            quotes = [...document.querySelectorAll('input[name="quote"]')];
          }

          quotes[index].value = quote;
        });
      }
    }
  }
});

/**
 * TODO - Image is not required for item creation
 * TODO - Validation of the form checks button state for image validation
 * TODO - VALIDATION
 */
