import React, { useEffect, useState } from 'react';
import '../components/documentPages.css'

import AddAgent from '../components/addAgent';
function DocumentForm() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [oldDocuments, setOldDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();

    const fetchOldDocuments = async () => {
      try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/old-documents`);
        const data = await response.json();
          setOldDocuments(data);
        } catch (error) {
          console.error("Ошибка при получении старых документов:", error);
        }
      };

      fetchOldDocuments();
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

  return (
    <div className="document-page">
      <header className="header">
        <h1>Система управления документами</h1>
      </header>
      <main className="main-content">
        <AddAgent fetchDocuments={fetchDocuments} />
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