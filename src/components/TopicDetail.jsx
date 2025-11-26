import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoadmap, STATUS } from "../RoadmapContext";

function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics, setTopicNotes, toggleTopicStatus, setTopicTargetDate } = useRoadmap();

  const topic = topics.find((t) => t.id === id);

  if (!topic) {
    return (
      <div className="details-card">
        <p>Тема не найдена.</p>
        <button className="primary-btn" onClick={() => navigate(-1)}>
          Назад
        </button>
      </div>
    );
  }

  const handleNotesChange = (e) => {
    setTopicNotes(topic.id, e.target.value);
  };

  const handleTargetDateChange = (e) => {
    setTopicTargetDate(topic.id, e.target.value);
  };

  const handleStatusClick = () => {
    toggleTopicStatus(topic.id);
  };

  return (
    <div className="details-card">
      <button className="primary-btn back-btn" onClick={() => navigate(-1)}>
        ◀ Назад к коридору
      </button>

      <div className="details-header">
        <h2>{topic.title}</h2>
        <button className="status-toggle large" onClick={handleStatusClick}>
          {topic.status === STATUS.NOT_STARTED && "Не начато"}
          {topic.status === STATUS.IN_PROGRESS && "В работе"}
          {topic.status === STATUS.DONE && "Выполнено"}
        </button>
      </div>

      {topic.description && (
        <p className="details-description">{topic.description}</p>
      )}

        <div className="target-date-section">
          <label htmlFor="targetDate">Желаемая дата завершения:</label>
          <input
            id="targetDate"
            type="date"
            value={topic.targetDate || ""}
            onChange={handleTargetDateChange}
          />
        </div>

      <div className="notes-section">
        <label htmlFor="notes">Заметки по теме:</label>
        <textarea
          id="notes"
          value={topic.notes || ""}
          onChange={handleNotesChange}
          placeholder="Ваши заметки, ссылки, мысли..."
        />
      </div>
    </div>
  );
}

export default TopicDetail;
