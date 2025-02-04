const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Document = require('./models/Document'); // Импорт модели Document

mongoose.connect('mongodb://localhost:27017/documents', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'));

const uploadDir = path.join(__dirname, 'uploads');

const restoreFiles = async () => {
    try {
        const files = fs.readdirSync(uploadDir);

        const documents = files.map((file) => ({
            documentName: file,
            agent: "Название агентов",
            filePath: `uploads/${file}`
        }));

        await Document.insertMany(documents);
        console.log('Files restored successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
}

restoreFiles();