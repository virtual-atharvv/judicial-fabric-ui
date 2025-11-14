import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, AlertCircle, Clock, CheckCircle2, Plus, Database } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllCases, indexDocument } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';

const Dashboard = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preloading, setPreloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await getAllCases();
      setCases(data);
    } catch (error) {
      toast({ title: 'Error loading cases', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const preloadDemoData = async () => {
    setPreloading(true);
    const demoSnippets = [
      'Section 302 IPC - Murder: Whoever commits murder shall be punished with death or imprisonment for life.',
      'Section 420 IPC - Cheating: Whoever cheats shall be punished with imprisonment up to 7 years.',
      'Section 498A IPC - Cruelty by husband or relatives: Imprisonment up to 3 years and fine.',
      'Vishaka vs State of Rajasthan - Guidelines on sexual harassment at workplace.',
      'Kesavananda Bharati case - Basic structure doctrine of the Constitution.',
    ];

    try {
      for (let i = 0; i < demoSnippets.length; i++) {
        await indexDocument(demoSnippets[i], { source: 'demo', index: i });
      }
      toast({ title: 'Demo data preloaded successfully', description: '5 precedents indexed' });
    } catch (error) {
      toast({ title: 'Error preloading data', variant: 'destructive' });
    } finally {
      setPreloading(false);
    }
  };

  const stats = [
    {
      icon: FolderOpen,
      label: 'Total Cases',
      value: cases.length,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: AlertCircle,
      label: 'High Priority',
      value: cases.filter((c) => c.priority === 'high').length,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: cases.filter((c) => c.status === 'pending' || c.status === 'open').length,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: cases.filter((c) => c.status === 'completed' || c.status === 'closed').length,
      color: 'text-green-600',
      bg: 'bg-green-600/10',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-serif text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to Judicial Intelligence Fabric</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={preloadDemoData} variant="outline" disabled={preloading}>
              <Database className="w-4 h-4 mr-2" />
              {preloading ? 'Preloading...' : 'Preload Demo Data'}
            </Button>
            <Button onClick={() => navigate('/cases/create')} className="btn-judicial">
              <Plus className="w-4 h-4 mr-2" />
              Create New Case
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="glass-card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Cases */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Latest cases in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No cases yet. Create your first case!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cases.slice(0, 5).map((caseItem) => (
                  <motion.div
                    key={caseItem.case_id}
                    whileHover={{ scale: 1.01 }}
                    className="glass-card p-4 cursor-pointer"
                    onClick={() => navigate(`/cases/${caseItem.case_id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{caseItem.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.client_name} • {caseItem.case_id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {caseItem.status}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                          {caseItem.priority || 'medium'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
