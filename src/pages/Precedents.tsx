import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Trash2, Loader2 } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { indexDocument } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const Precedents = () => {
  const [snippets, setSnippets] = useState<string[]>(['']);
  const [indexing, setIndexing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const addSnippet = () => {
    setSnippets([...snippets, '']);
  };

  const removeSnippet = (idx: number) => {
    setSnippets(snippets.filter((_, i) => i !== idx));
  };

  const updateSnippet = (idx: number, value: string) => {
    const updated = [...snippets];
    updated[idx] = value;
    setSnippets(updated);
  };

  const handleBatchIndex = async () => {
    const validSnippets = snippets.filter((s) => s.trim());
    if (validSnippets.length === 0) {
      toast({ title: 'No snippets to index', variant: 'destructive' });
      return;
    }

    setIndexing(true);
    setProgress(0);

    try {
      for (let i = 0; i < validSnippets.length; i++) {
        await indexDocument(validSnippets[i], { source: 'manual', index: i });
        setProgress(((i + 1) / validSnippets.length) * 100);
      }
      toast({
        title: 'Precedents indexed',
        description: `Successfully indexed ${validSnippets.length} snippets`,
      });
      setSnippets(['']);
      setProgress(0);
    } catch (error) {
      toast({ title: 'Error indexing precedents', variant: 'destructive' });
    } finally {
      setIndexing(false);
    }
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-primary">Precedents Manager</h1>
          <p className="text-muted-foreground mt-2">Batch index legal precedents and case snippets</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add Precedent Snippets</CardTitle>
            <CardDescription>
              Paste legal texts, IPC sections, or case law snippets to index them for future searches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {snippets.map((snippet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-2">
                  <Textarea
                    placeholder={`Snippet ${idx + 1}: Paste legal text here...`}
                    value={snippet}
                    onChange={(e) => updateSnippet(idx, e.target.value)}
                    rows={4}
                    className="flex-1"
                  />
                  {snippets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSnippet(idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="flex gap-2">
              <Button variant="outline" onClick={addSnippet} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Snippet
              </Button>
              <Button onClick={handleBatchIndex} disabled={indexing} className="flex-1 btn-judicial">
                {indexing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Indexing...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Index All Snippets
                  </>
                )}
              </Button>
            </div>

            {indexing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Paste multiple legal text snippets (IPC sections, case precedents, etc.)</p>
            <p>2. Click "Index All Snippets" to add them to the vector database</p>
            <p>3. Use the search in Case Detail pages to find relevant precedents</p>
            <p className="text-xs text-muted-foreground mt-4">
              Indexed documents are stored using embeddings for semantic search
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default Precedents;
