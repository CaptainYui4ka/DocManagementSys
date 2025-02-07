const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { sequelize, Document } = require('./db'); // Импорт конфигурации Sequelize
require('dotenv').config();

const app = express();
app.use(cors()); // Используйте cors для разрешения запросов с клиента
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Сохраняем оригинальное имя файла
  }
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));
app.use("/oldDoc", express.static("oldDoc"));

app.post("/api/documents", upload.single("file"), async (req, res) => {
  try {
    const { agent, documentName } = req.body;
    const newDocument = await Document.create({
      agent,
      documentName,
      filePath: req.file.path,
    });

    res.status(201).json({ message: "Документ загружен успешно!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка загрузки документа!" });
  }
});

app.get("/api/documents", async (req, res) => {
  try {
    const documents = await Document.findAll({ order: [['uploadedAt', 'DESC']] });
    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка получения списка документов!" });
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Найти документ в базе данных
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Документ не найден." });
    }

    // Удалить файл из папки uploads
    fs.unlinkSync(document.filePath);

    await document.destroy();
    res.status(200).json({ message: "Документ успешно удален." });
  } catch (error) { 
    console.error("Ошибка на сервере при удалении документа:", error);
    res.status(500).json({ message: "Ошибка при удалении документа." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync(); // Синхронизировать модели с базой данных
});