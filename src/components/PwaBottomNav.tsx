import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Smartphone, BookOpen, Home } from 'lucide-react';

export default function PwaBottomNav() {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/dashboard', label: 'Dashboard', icon: Shield, exact: true },
    { to: '/install', label: 'Add Device', icon: Smartphone, exact: false },
    { to: '/docs', label: 'Docs', icon: BookOpen, exact: false },
  ];

  return (
    <nav className="pwa-bottom-dock" aria-label="Mobile Navigation">
      <div className="pwa-bottom-dock-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`pwa-dock-item ${isActive ? 'active' : ''}`}
            >
              <div className="pwa-dock-icon-wrapper">
                <Icon className="pwa-dock-icon" />
                {item.to === '/dashboard' && (
                  <span className="pwa-dock-badge-dot" />
                )}
              </div>
              <span className="pwa-dock-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
