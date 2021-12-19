const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/imgs/profiles");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      (req.body?.id ? req.body.id : uuidv4()) + "-01" + file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
});

const overWriteJSON = (newItem, title) => {
  fs.readFile(
    "./public/scripts/data.json",
    "utf8",
    function calreadFileCallbacklback(err, data) {
      if (err) {
        console.log(err);
      } else {
        let obj = JSON.parse(data);

        if (obj.data.find((item) => item.id === newItem?.id)) {
          obj.data = obj.data.filter((item) => item.id !== newItem.id);
        }

        if (newItem) {
          obj.data.push(newItem);
        }

        if (title) {
          obj.pageTitle = title;
        }

        let json = JSON.stringify(obj);
        fs.writeFile(
          "./public/scripts/data.json",
          json,
          {
            encoding: "utf8",
          },
          (err) => {
            if (err) console.error(err);
          }
        );
      }
    }
  );
};

app.post("/uploadImage", upload.single("myFile"), async (req, res, next) => {
  if (req.file) {
    const file = req.file.filename.split(".");
    const newItem = {
      id: req.body?.id ? req.body.id : file[0].slice(0, file[0].length - 3),
      fileType: "image/" + file[1],
      multipleImages: false,
      name: req.body.name,
      class: req.body.class,
      quotes: JSON.parse(req.body.quotes),
    };

    overWriteJSON(newItem);
    res.status(200).send(newItem);
  }
});

app.use((req, res, next) => {
  overWriteJSON(null, decodeURI(req.path.split("/")[1]));
  res.status(200).render("index");
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
