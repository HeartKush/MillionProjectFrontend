"use client";

import React, { useState } from "react";
import { PropertyManagement, OwnerManagement } from "@/components/organisms";
import { Button } from "@/components/atoms";

type TabType = "properties" | "owners";

/**
 * Home Page - Main application page with navigation
 * Follows Single Responsibility Principle - only handles page-level state and routing
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("properties");

  const tabs = [
    { id: "properties" as TabType, label: "Propiedades", icon: "🏠" },
    { id: "owners" as TabType, label: "Propietarios", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-110 transition-all duration-300">
            <span className="text-5xl">🏠</span>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-pulse">
            Million Project
          </h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            🚀 Sistema de gestión de propiedades inmobiliarias con tecnología
            moderna
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-12 flex justify-center">
          <nav className="inline-flex bg-white/90 backdrop-blur-md p-3 rounded-3xl shadow-2xl border-2 border-white/30">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "primary" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-4 px-8 py-4 rounded-2xl transition-all duration-500 font-bold text-lg ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white shadow-2xl transform scale-110 hover:scale-115"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <main className="animate-fadeIn">
          {activeTab === "properties" && <PropertyManagement />}
          {activeTab === "owners" && <OwnerManagement />}
        </main>
      </div>
    </div>
  );
}
