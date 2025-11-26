import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export const STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

const STATUS_ORDER = [STATUS.NOT_STARTED, STATUS.IN_PROGRESS, STATUS.DONE];

const STORAGE_KEY_TOPICS = "roadmap-topics-v1";
const STORAGE_KEY_INDEX = "roadmap-current-index-v1";

const defaultTopics = [
  {
    id: "js-basics",
    title: "JavaScript Basics",
    shortDescription: "Переменные, типы, условия, циклы",
    description:
      "Подробное описание темы JavaScript Basics. Здесь вы можете расписать, что именно нужно пройти, ссылки на ресурсы и т.д.",
    status: STATUS.NOT_STARTED,
    notes: "",
    targetDate: ""
  },
  {
    id: "react-core",
    title: "React Core",
    shortDescription: "Компоненты, props, state, эффекты",
    description:
      "Подробное описание темы React Core. Компонентный подход, хуки, управление состоянием.",
    status: STATUS.NOT_STARTED,
    notes: "",
    targetDate: ""
  },
  {
    id: "react-router",
    title: "React Router",
    shortDescription: "Маршруты, навигация, динамические URL",
    description:
      "Подробное описание темы React Router. Настройка маршрутов, параметры, вложенные маршруты.",
    status: STATUS.NOT_STARTED,
    notes: "",
    targetDate: ""
  },
];

function normalizeTopics(source) {
  if (!Array.isArray(source)) return defaultTopics;

  return source.map((item, idx) => ({
    id: item.id || `topic-${idx}`,
    title: item.title || `Topic ${idx + 1}`,
    shortDescription: item.shortDescription || "",
    description: item.description || "",
    status:
      item.status === STATUS.NOT_STARTED ||
      item.status === STATUS.IN_PROGRESS ||
      item.status === STATUS.DONE
        ? item.status
        : STATUS.NOT_STARTED,
    notes: item.notes || "",
    targetDate: item.targetDate || ""
  }));
}

const RoadmapContext = createContext(null);

export function RoadmapProvider({ children }) {
  const [topics, setTopics] = useState(() => {
    if (typeof window === "undefined") return defaultTopics;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TOPICS);
      if (!saved) return defaultTopics;
      const parsed = JSON.parse(saved);
      return normalizeTopics(parsed);
    } catch (e) {
      console.warn("Ошибка чтения из localStorage (topics):", e);
      return defaultTopics;
    }
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INDEX);
      const idx = Number(saved);
      if (Number.isFinite(idx) && idx >= 0) return idx;
      return 0;
    } catch {
      return 0;
    }
  });

  const [overviewMode, setOverviewMode] = useState(false);

  const total = topics.length;
  const doneCount = topics.filter((t) => t.status === STATUS.DONE).length;
  const progressPercent =
    total === 0 ? 0 : Math.round((doneCount / total) * 100);

  function cycleStatus(currentStatus) {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    const nextIdx = (idx + 1) % STATUS_ORDER.length;
    return STATUS_ORDER[nextIdx];
  }

  const setTopicStatus = (id, status) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const toggleTopicStatus = (id) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: cycleStatus(t.status) } : t
      )
    );
  };

  const setTopicNotes = (id, notes) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notes } : t))
    );
  };

  const setTopicTargetDate = (id, targetDate) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, targetDate } : t))
    );
  };
  

  const goNext = () => {
    setOverviewMode(false);
    setCurrentIndex((prev) => {
      if (topics.length === 0) return 0;
      return Math.min(prev + 1, topics.length - 1);
    });
  };

  const goPrev = () => {
    setOverviewMode(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToIndex = (index) => {
    if (index < 0 || index >= topics.length) return;
    setOverviewMode(false);
    setCurrentIndex(index);
  };

  const toggleOverview = () => {
    setOverviewMode((prev) => !prev);
  };

  const loadFromJson = (data) => {
    const mapped = normalizeTopics(data);
    setTopics(mapped);
    setCurrentIndex(0);
    setOverviewMode(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TOPICS, JSON.stringify(topics));
    } catch (e) {
      console.warn("Ошибка записи в localStorage (topics):", e);
    }
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INDEX, String(currentIndex));
    } catch (e) {
      console.warn("Ошибка записи в localStorage (index):", e);
    }
  }, [currentIndex]);
  
  useEffect(() => {
    if (currentIndex >= topics.length && topics.length > 0) {
      setCurrentIndex(topics.length - 1);
    }
  }, [topics.length, currentIndex]);

  const value = {
    topics,
    currentIndex,
    overviewMode,
    total,
    doneCount,
    progressPercent,
    setTopicStatus,
    toggleTopicStatus,
    setTopicNotes,
    setTopicTargetDate,
    goNext,
    goPrev,
    goToIndex,
    toggleOverview,
    loadFromJson,
  };


  return (
    <RoadmapContext.Provider value={value}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) {
    throw new Error("useRoadmap must be used within RoadmapProvider");
  }
  return ctx;
}
