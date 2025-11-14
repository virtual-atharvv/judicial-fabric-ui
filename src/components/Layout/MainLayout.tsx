import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;
