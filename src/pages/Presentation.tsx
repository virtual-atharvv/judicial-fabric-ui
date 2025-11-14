import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Presentation as PresentationIcon, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllCases } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Presentation = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
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
    }
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setFullscreen(!fullscreen);
  };

  const topCase = cases[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PresentationIcon className="w-10 h-10" />
            <h1 className="text-5xl font-bold font-serif">Judicial Presentation</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
          >
            {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Main Content */}
        {topCase ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-12 space-y-6">
                <div>
                  <p className="text-sm text-white/70 mb-2">Case Title</p>
                  <h2 className="text-4xl font-bold">{topCase.title}</h2>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-white/70 mb-1">Client</p>
                    <p className="text-2xl font-semibold">{topCase.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Case ID</p>
                    <p className="text-2xl font-mono">{topCase.case_id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white/70 mb-2">Description</p>
                  <p className="text-lg leading-relaxed">{topCase.description}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <div className="px-6 py-3 rounded-full bg-white/20 backdrop-blur">
                    <span className="text-sm font-semibold">Status: {topCase.status}</span>
                  </div>
                  <div className="px-6 py-3 rounded-full bg-white/20 backdrop-blur">
                    <span className="text-sm font-semibold">
                      Priority: {topCase.priority || 'Medium'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Key Precedent</h3>
                <p className="text-lg leading-relaxed">
                  Section 302 IPC - Murder: Whoever commits murder shall be punished with death or
                  imprisonment for life, and shall also be liable to fine.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-12 text-center">
              <p className="text-xl">No cases available for presentation</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-white/50 text-sm">
          <p>Judicial Intelligence Fabric • Presentation Mode</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Presentation;
