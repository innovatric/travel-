import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNavigation from './MobileNavigation';
import PageTransition from '../common/PageTransition';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/planner': 'AI Planner',
  '/trips': 'My Trips',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TripFlow AI';

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((value) => !value)}
      />
      <MobileNavigation isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title={title}
          onMenuClick={() => setMobileNavOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
