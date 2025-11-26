import React, { useRef } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useRoadmap } from "../RoadmapContext";
import TopicCard from "./TopicCard";
import ProgressSidebar from "./ProgressSidebar";

const EXAMPLE_JSON = `[
  {
    "id": "js-basics",
    "title": "JavaScript Basics",
    "shortDescription": "Переменные, типы, условия, циклы",
    "description": "Подробное описание темы, какие разделы пройти, какие ресурсы использовать и т.д.",
    "status": "not_started",
    "notes": "",
    "targetDate": ""
  },
  {
    "id": "react-core",
    "title": "React Core",
    "shortDescription": "Компоненты, props, state, эффекты",
    "description": "Описание того, что нужно изучить по React: компоненты, хуки, управление состоянием.",
    "status": "in_progress",
    "notes": "Например: пересмотреть урок по useEffect",
    "targetDate": "2025-12-31"
  }
]`;


function RoadmapLayout() {
  const {
    topics,
    currentIndex,
    overviewMode,
    goNext,
    goPrev,
    goToIndex,
    toggleOverview,
    loadFromJson,
  } = useRoadmap();

  const navigate = useNavigate();
  const { index } = useParams();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const overviewContainerRef = useRef(null);

  const activeIndex =
    typeof index !== "undefined" ? Number(index) || 0 : currentIndex;

  const activeTopic = topics[activeIndex];

  const handleNext = () => {
    if (activeIndex < topics.length - 1) {
      goNext();
      navigate(`/topic/${activeIndex + 1}`);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      goPrev();
      navigate(`/topic/${activeIndex - 1}`);
    }
  };

  const handleCardClick = (topic) => {
    navigate(`/details/${topic.id}`);
  };

  const handleShowAll = () => {
    toggleOverview();
  };

const handleFileSelectClick = () => {
  alert(
    "Пример JSON файла для импорта:\n\n" +
      EXAMPLE_JSON +
      "\n\nСкопируйте это в .json файл, измените под себя и загрузите."
  );

  if (fileInputRef.current) fileInputRef.current.click();
};

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        loadFromJson(json);
        navigate("/topic/0");
      } catch (err) {
        alert("Ошибка при чтении JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(topics, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isDetailsPage = location.pathname.startsWith("/details/");

  return (
    <div className="app-root">
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <header className="top-bar">
        <div className="top-bar-left">
          <h1 className="app-title">Roadmap</h1>
        </div>
        <div className="top-bar-right">
          <button className="top-btn" onClick={handleFileSelectClick}>
            Загрузить JSON
          </button>
          <button className="top-btn" onClick={handleExport}>
            Экспорт JSON
          </button>
          <button className="top-btn" onClick={handleShowAll}>
            Показать все темы
          </button>
        </div>
      </header>

      <div className="app-content">
        <main className={`corridor ${overviewMode ? "overview-mode" : ""}`}>
            {!overviewMode && !isDetailsPage && activeTopic && (
            <div className="card-wrapper" key={activeTopic.id}>
                <TopicCard
                topic={activeTopic}
                index={activeIndex}
                onClick={() => handleCardClick(activeTopic)}
                />
            </div>
            )}

          {overviewMode && !isDetailsPage && (
            <div className="overview-container" ref={overviewContainerRef}>
                <div className="overview-line" />
                <div className="overview-cards">
                {topics.map((topic, idx) => (
                    <div
                    key={topic.id}
                    className="overview-card-wrapper"
                    onClick={() => {
                        goToIndex(idx);
                        navigate(`/topic/${idx}`);
                    }}
                    >
                    <TopicCard topic={topic} index={idx} compact />
                    </div>
                ))}
                </div>
            </div>
            )}

          {isDetailsPage && (
            <div className="details-wrapper">
              <Outlet />
            </div>
          )}

          {!overviewMode && !isDetailsPage && (
            <div className="nav-buttons">
              <button
                className="nav-btn"
                onClick={handlePrev}
                disabled={activeIndex === 0}
              >
                ◀ Назад
              </button>
              <button
                className="nav-btn"
                onClick={handleNext}
                disabled={activeIndex === topics.length - 1}
              >
                Далее ▶
              </button>
            </div>
          )}
        </main>

        <aside className="sidebar">
          <ProgressSidebar />
        </aside>
      </div>
    </div>
  );
}

export default RoadmapLayout;
