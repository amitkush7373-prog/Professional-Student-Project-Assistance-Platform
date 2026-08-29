import React, { useState } from 'react';
import {
  Code2,
  Moon,
  Sun,
  Bell,
  User as UserIcon,
  Shield,
  Layers,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  HelpCircle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    activeView,
    setActiveView,
    notifications,
    setIsNotificationDrawerOpen,
    setIsAuthModalOpen
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
  };

  const navLinks = [
    { label: 'Explore Services', view: 'services' },
    { label: 'Pricing Matrix', view: 'pricing' },
    { label: 'Academic Integrity', view: 'legal-integrity' },
    { label: 'Help & FAQ', view: 'support' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] glass-panel transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group focus-ring rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300">
                  ApexProject
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-[var(--text-muted)] -mt-1">
                  Professional Assistance
                </span>
              </div>
            </button>

            {/* Role Indicator Badge */}
            <div className="relative ml-2 hidden md:block">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                title="Click to switch active role workspace"
              >
                {currentUser.role === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                {currentUser.role === 'expert' && <Briefcase className="w-3.5 h-3.5" />}
                {currentUser.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                <span className="capitalize">{currentUser.role} Portal</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Role Dropdown */}
              {isRoleDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 rounded-xl glass-dropdown p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Switch Workspace Role
                  </div>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      currentUser.role === 'student'
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-semibold">Student Portal</div>
                      <div className="text-[10px] opacity-75">Submit & track projects</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('expert')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors mt-1 ${
                      currentUser.role === 'expert'
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-semibold">Expert / Developer</div>
                      <div className="text-[10px] opacity-75">Assigned projects & chat</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors mt-1 ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-semibold">Super Admin Command</div>
                      <div className="text-[10px] opacity-75">Orders, pricing & analytics</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === link.view
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Tools & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-1"
              title="Toggle Currency (INR / USD)"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-ring"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors focus-ring"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dashboard Shortcut Button */}
            <button
              onClick={() => {
                if (currentUser.role === 'student') setActiveView('student-dashboard');
                else if (currentUser.role === 'expert') setActiveView('expert-dashboard');
                else setActiveView('admin-dashboard');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Dashboard</span>
            </button>

            {/* Primary Action Button: Submit Requirement */}
            <button
              onClick={() => setActiveView('submit')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Project</span>
            </button>

            {/* User Profile Avatar / Demo Switcher */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors focus-ring"
              title="Account & Demo Logins"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-blue-500/40"
              />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-color)] py-4 space-y-2 animate-in fade-in duration-200">
            <div className="px-2 py-1 text-xs font-semibold text-[var(--text-muted)] uppercase">Role Portal</div>
            <div className="grid grid-cols-3 gap-2 px-2 pb-2">
              <button
                onClick={() => {
                  handleRoleChange('student');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border ${
                  currentUser.role === 'student'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                onClick={() => {
                  handleRoleChange('expert');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border ${
                  currentUser.role === 'expert'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Expert</span>
              </button>
              <button
                onClick={() => {
                  handleRoleChange('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border ${
                  currentUser.role === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            <div className="border-t border-[var(--border-color)] pt-2 space-y-1">
              {navLinks.map(link => (
                <button
                  key={link.view}
                  onClick={() => {
                    setActiveView(link.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    activeView === link.view
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  if (currentUser.role === 'student') setActiveView('student-dashboard');
                  else if (currentUser.role === 'expert') setActiveView('expert-dashboard');
                  else setActiveView('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10"
              >
                Open {currentUser.role.toUpperCase()} Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
