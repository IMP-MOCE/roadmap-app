import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoadmapLayout from "./components/RoadmapLayout";
import TopicDetail from "./components/TopicDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoadmapLayout />}>
        <Route index element={<Navigate to="/topic/0" replace />} />
        <Route path="topic/:index" element={<RoadmapLayout />} />
      </Route>
      
      <Route path="/details/:id" element={<TopicDetail />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
