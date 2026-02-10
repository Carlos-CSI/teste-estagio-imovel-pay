import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useEffect, useRef } from 'react';

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Clientes' },
  { to: '/charges', icon: FileText, label: 'Cobranças' },
  { to: '/payments', icon: DollarSign, label: 'Pagamentos' },
];

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useApp();
  const asideRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const asideEl = asideRef.current;
    let prevFocused: Element | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleSidebar();
    };

    if (isSidebarOpen && asideEl) {
      prevFocused = document.activeElement;
      const focusable = asideEl.querySelector<HTMLElement>(
        'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (prevFocused instanceof HTMLElement && !isSidebarOpen) {
        prevFocused.focus();
      }
    };
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        ref={asideRef}
        aria-hidden={!isSidebarOpen}
        className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Imóvel Pay</span>
            </div>
            
            <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Fechar menu"
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Versão 0.5.0 © 2026 Imóvel Pay</p>
                <hr className="my-2 border-gray-200" />
                <p className="text-xs text-gray-600">Desenvolvido por <span className="font-medium"><a href="https://github.com/christianbvolz" target="_blank" rel="noreferrer" className="hover:underline">Christian Volz</a></span></p>
        
              </div>
          </div>
        </div>
      </aside>
    </>
  );
}
