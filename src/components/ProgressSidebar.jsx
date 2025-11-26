import React from "react";
import { useRoadmap } from "../RoadmapContext";

function ProgressSidebar() {
  const { total, doneCount, progressPercent, topics } = useRoadmap();

  return (
    <div className="progress-sidebar">
      <h3>Прогресс</h3>
      <div className="progress-bar-vertical">
        <div
          className="progress-bar-fill"
          style={{ height: `${progressPercent}%` }}
        />
      </div>
      <div className="progress-info">
        <div className="progress-percent">{progressPercent}%</div>
        <div className="progress-fraction">
          {doneCount}/{total} выполнено
        </div>
      </div>

      <div className="progress-list">
        {topics.map((t, idx) => (
          <div key={t.id} className="progress-list-item">
            <span className="progress-list-index">{idx + 1}.</span>
            <span className={`progress-list-status status-${t.status}`}>
              ●
            </span>
            <span className="progress-list-title">{t.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressSidebar;
