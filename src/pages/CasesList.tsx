import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, ExternalLink } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllCases } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';

const CasesList = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    const filtered = cases.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.case_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCases(filtered);
  }, [searchTerm, cases]);

  const loadCases = async () => {
    try {
      const data = await getAllCases();
      setCases(data);
      setFilteredCases(data);
    } catch (error) {
      toast({ title: 'Error loading cases', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyCaseId = (caseId: string) => {
    navigator.clipboard.writeText(caseId);
    toast({ title: 'Case ID copied', description: caseId });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-serif text-primary">Cases</h1>
            <p className="text-muted-foreground mt-1">Manage all judicial cases</p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, client, or case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cases Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((caseItem, idx) => (
              <motion.div
                key={caseItem.case_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card-hover p-6 space-y-4"
              >
                <div>
                  <h3 className="font-bold text-lg">{caseItem.title}</h3>
                  <p className="text-sm text-muted-foreground">{caseItem.client_name}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {caseItem.status}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary">
                    {caseItem.priority || 'medium'}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCaseId(caseItem.case_id)}
                    className="flex-1"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy ID
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/cases/${caseItem.case_id}`)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredCases.length === 0 && (
          <div className="text-center py-12 glass-card">
            <p className="text-muted-foreground">No cases found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CasesList;
