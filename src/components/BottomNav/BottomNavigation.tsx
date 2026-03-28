// Standalone demo of the tab bar (e.g. Storybook). Prefer TabBarShell in app routes.
import React, { useState } from "react";
import BottomNav from "./ui/BottomNav";

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>("Home");

  return (
    <BottomNav activeTab={activeTab} onTabPress={(tab) => setActiveTab(tab)} />
  );
};

export { BottomNavigation };
