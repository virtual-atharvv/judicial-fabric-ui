import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Scale,
  Settings,
  ChevronLeft,
  ChevronRight,
  Presentation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderOpen, label: 'Cases', path: '/cases' },
  { icon: FileText, label: 'New Case', path: '/cases/create' },
  { icon: Scale, label: 'Precedents', path: '/precedents' },
  { icon: Presentation, label: 'Presentation', path: '/presentation' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'glass-card h-screen sticky top-0 transition-all duration-300 border-r',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold text-primary">J.I.F</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:bg-accent/20 hover:translate-x-1',
                  isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground'
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Judicial Intelligence Fabric v1.0
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
