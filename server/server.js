const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
//const Doc = require('./models/Document');
require('dotenv').config();




const app = express();
app.use(cors({
  origin: "*",
  methods: "GET, POST, DELETE",
  allowedHeaders: "Content-Type, Authorization",
}));

//connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/document", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connect to MongoDB"));

//Document Schema
const documentSchema = new mongoose.Schema({
  agent: String,
  documentName: String,
  filePath: String,
  uploadedAt: {type: Date, default: Date.now},
});


const Document = mongoose.model("Document", documentSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage});
app.use("/uploads", express.static("uploads"));
app.use("/oldDoc", express.static("oldDoc"));

app.post("/api/documents", upload.single("file"), async(req, res) => {
  try{
      const {agent, documentName} = req.body;
      const newDocument = new Document({
          agent,
          documentName,
          filePath: req.file.path,
      });

      await newDocument.save();
      res.status(201).json({message: "Документ загружен успешно!"});
  } catch(error){
      console.error(error);
      res.status(500).json({message: "Ошибка загрузки документа!"})
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Найти документ в базе данных
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Документ не найден." });
    }

    // Удалить файл из папки uploads
    fs.unlinkSync(document.filePath);

    await Document.findByIdAndDelete(id);
    res.status(200).json({ message: "Документ успешно удален." });
  } catch (error) {
    console.error("Ошибка на сервере при удалении документа:", error);
    res.status(500).json({ message: "Ошибка при удалении документа." });
  }
});

app.get("/api/documents", async(req, res) => {
  try{
      const documents = await Document.find().sort({uploadedAt: -1});
      res.json(documents);
  } catch(error){
      console.error(error);
      res.status(500).json({message: "Ошибка получения списка документов!"})
  }
});

app.get("/api/old-documents", (req, res) => {
  const oldDocDir = path.join(__dirname, 'oldDoc');
  fs.readdir(oldDocDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Ошибка получения старых документов!" });
    }
    const oldDocuments = files.map(file => ({
      documentName: file,
      filePath: `oldDoc/${file}`
    }));
    res.status(200).json(oldDocuments);
  });
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
})

app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});