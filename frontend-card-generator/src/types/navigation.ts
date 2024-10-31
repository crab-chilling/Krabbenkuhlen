import React from "react";

export interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  description: string;
  to: string;
}
