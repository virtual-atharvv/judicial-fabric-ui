import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCase } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CreateCase = () => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createCase({ title, client_name: clientName, description });
      toast({ title: 'Case created successfully', description: `Case ID: ${result.case_id}` });
      navigate(`/cases/${result.case_id}`);
    } catch (error: any) {
      toast({
        title: 'Error creating case',
        description: error.response?.data?.detail || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-primary">Create New Case</h1>
          <p className="text-muted-foreground mt-2">Enter case details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Case Title</Label>
            <Input
              id="title"
              placeholder="Enter case title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter case description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/cases')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 btn-judicial" disabled={loading}>
              {loading ? 'Creating...' : 'Create Case'}
            </Button>
          </div>
        </form>
      </motion.div>
    </MainLayout>
  );
};

export default CreateCase;
