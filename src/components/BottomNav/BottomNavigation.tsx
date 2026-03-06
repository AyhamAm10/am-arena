// src/components/BottomNav/BottomNavigation.tsx
import React, { useState } from "react";
import BottomNav from "./ui/BottomNav";

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Home");

  return <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />;
};

export  {BottomNavigation};