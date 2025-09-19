"use client";

import React, { useState } from "react";
import { PropertyManagement, OwnerManagement } from "@/components/organisms";
import { Button } from "@/components/atoms";
import { Home, Users, BarChart3, Settings, Menu, X } from "lucide-react";

type TabType = "properties" | "owners" | "analytics" | "settings";

/**
 * Home Page - Main application page with enhanced navigation
 * Follows Single Responsibility Principle - only handles page-level state and routing
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("properties");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { 
      id: "properties" as TabType, 
      label: "Propiedades", 
      icon: Home,
      description: "Gestiona tu inventario inmobiliario"
    },
    { 
      id: "owners" as TabType, 
      label: "Propietarios", 
      icon: Users,
      description: "Administra la información de propietarios"
    },
    { 
      id: "analytics" as TabType, 
      label: "Analíticas", 
      icon: BarChart3,
      description: "Visualiza estadísticas y reportes"
    },
    { 
      id: "settings" as TabType, 
      label: "Configuración", 
      icon: Settings,
      description: "Ajustes de la aplicación"
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "properties":
        return <PropertyManagement />;
      case "owners":
        return <OwnerManagement />;
      case "analytics":
        return (
          <div className="text-center py-20">
            <BarChart3 className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Analíticas en Desarrollo
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Las funcionalidades de analíticas y reportes estarán disponibles próximamente.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-20">
            <Settings className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Configuración
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Las opciones de configuración estarán disponibles próximamente.
            </p>
          </div>
        );
      default:
        return <PropertyManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  RealEstate Pro
                </h1>
                <p className="text-sm text-gray-500">Gestión Inmobiliaria</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''} group relative`}
                    title={tab.description}
                  >
                    <div className="relative z-10 flex items-center space-x-2">
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-xl animate-slideIn">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">{tab.label}</div>
                      <div className={`text-sm ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button className="fab lg:hidden no-print">
        <Home className="w-6 h-6" />
      </button>
    </div>
  );
}