const { sequelize, Document } = require('./db'); // Импорт конфигурации Sequelize
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');

const restoreFiles = async () => {
  try {
    await sequelize.sync(); // Синхронизировать модели с базой данных

    const files = fs.readdirSync(uploadDir);

    const documents = files.map((file) => ({
      documentName: file,
      agent: "Название агентов",
      filePath: `uploads/${file}`
    }));

    await Document.bulkCreate(documents);
    console.log('Files restored successfully');

    sequelize.close();
  } catch (error) {
    console.error(error);
  }
}

restoreFiles();