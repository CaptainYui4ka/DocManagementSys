import React, { useEffect, useState } from 'react';
import '../components/documentPages.css'
function DocumentForm() {
  const [agent, setAgent] = useState('');
  const [documents, setDocuments] = useState([])
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(documents)

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      doc.agent.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        setFilteredDocuments(data); // Для синхронизации с отфильтрованными документами
      } else {
        console.error("Не удалось загрузить документы.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке документов:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот документ?")) {
      return;
    }

    try {
      console.log(process.env.REACT_APP_API_URL);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${id}`, {
        method: "DELETE",
      });

      // Проверяем статус ответа
      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== id)); // Удаляем документ из списка
        alert("Документ успешно удален!");
      } else {
        const errorData = await response.json(); // Получаем сообщение об ошибке
        console.error("Ошибка сервера:", errorData);
        alert(`Не удалось удалить документ: ${errorData.message || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      console.error("Ошибка при удалении документа:", error);
      alert("Произошла ошибка. Попробуйте еще раз.");
    }
  };

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
        body: formData
      });

      if (response.ok) {
        setMessage("Документ успешно загружен!");
        setAgent("");
        setDocumentName("");
        setFile(null);
        fetchDocuments(); // Обновляем список документов после загрузки
      } else {
        setMessage("Файл загрузился")
      }
    } catch (error) {
      console.error(error);
      setMessage("Ошибка!")
    }
  };

  return (
    <div className="document-page">
      <header className="header">
        <h1>Система управления документами</h1>
      </header>
      <main className="main-content">
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
              />
            </label>
            <label>
              Название документа:
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Введите название документа"
              />
            </label>
            <label className="file-upload">
              Выбрать файл:
              <input type="file" onChange={handleFileChange} />
            </label>
            <button type="submit">Загрузить</button>
          </form>
          {message && <p>{message}</p>}
        </section>

        <section className="document-list">
          <h2>Загруженные документы</h2>
          <input
            type='text'
            placeholder='Поиск по агенту...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredDocuments.length > 0 ? (
            <ul>
              {filteredDocuments.map((doc) => (
                <li key={doc._id}>
                  <span>
                    {doc.documentName} - {doc.agent}
                  </span>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать
                  </a>
                  <button onClick={() => handleDelete(doc._id)}>Удалить</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Документы не найдены.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default DocumentForm;