import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#10131a]">
      <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-auto bg-[#10131a] min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
