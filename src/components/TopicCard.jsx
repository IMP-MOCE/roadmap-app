import React from "react";
import { useRoadmap, STATUS } from "../RoadmapContext";

function TopicCard({ topic, index, compact = false, onClick }) {
  const { toggleTopicStatus } = useRoadmap();

  const statusClass = (() => {
    switch (topic.status) {
      case STATUS.IN_PROGRESS:
        return "status-in-progress";
      case STATUS.DONE:
        return "status-done";
      default:
        return "status-not-started";
    }
  })();

  const handleStatusClick = (e) => {
    e.stopPropagation();
    toggleTopicStatus(topic.id);
  };

  return (
    <div
      className={`topic-card-container ${compact ? "compact" : "full"} card-enter`}
      onClick={onClick}
    >
      <div className={`topic-card ${statusClass} topic-card-main`}>
        <div className="topic-card-inner">
          <div className="topic-meta">
            <span className="topic-index">#{index + 1}</span>
            <button
              className="status-toggle"
              onClick={handleStatusClick}
              title="Переключить статус"
            >
              {topic.status === STATUS.NOT_STARTED && "Не начато"}
              {topic.status === STATUS.IN_PROGRESS && "В работе"}
              {topic.status === STATUS.DONE && "Выполнено"}
            </button>
          </div>
          <h2 className="topic-title">{topic.title}</h2>
          {topic.shortDescription && (
            <p className="topic-short">{topic.shortDescription}</p>
          )}
        </div>
      </div>

      <div className={`topic-card ${statusClass} topic-card-reflection`}>
        <div className="topic-card-inner">
          <div className="topic-meta">
            <span className="topic-index">#{index + 1}</span>
          </div>
          <h2 className="topic-title">{topic.title}</h2>
          {topic.shortDescription && (
            <p className="topic-short">{topic.shortDescription}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicCard;
