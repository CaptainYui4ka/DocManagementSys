import React, { useState } from 'react';
import '../components/documentPages.css';

const AddAgent = ({ fetchDocuments }) => {
    const [agent, setAgent] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [file, setFile] = useState(null); // Состояние для выбранного файла
    const [message, setMessage] = useState("");

    // Функция для обработки выбора файла
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agent || !documentName || !file) {
            setMessage("Все поля обязательны для заполнения");
            return;
        }
        const formData = new FormData();
        formData.append('agent', agent);
        formData.append('documentName', documentName);
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setMessage("Документ успешно загружен!");
                fetchDocuments(); // Обновляем список документов после загрузки
            } else {
                setMessage("Не удалось загрузить документ.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Произошла ошибка при загрузке документа.");
        }
    };

    return (
        <div className='add-agent'>
            <section className="form-section">
                <h2>Добавить новый документ</h2>
                <form className="document-form" onSubmit={handleSubmit}>
                    <label>
                        Имя агента:
                        <input
                            type="text"
                            value={agent}
                            onChange={(e) => setAgent(e.target.value)}
                            placeholder="Введите имя агента"
                            required
                        />
                    </label>
                    <label>
                        Название документа:
                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Введите название документа"
                            required
                        />
                    </label>
                    <label className="file-upload">
                        Выбрать файл:
                        <input type="file" onChange={handleFileChange} required />
                    </label>
                    <button type="submit">Загрузить</button>
                </form>
                {message && <p>{message}</p>}
            </section>
        </div>
    );
};

export default AddAgent;