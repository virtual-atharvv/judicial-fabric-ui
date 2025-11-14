import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  getCaseById,
  updateCaseStatus,
  addNote,
  getNotes,
  uploadDocument,
  getDocuments,
  runOCR,
  generateSummary,
  suggestIPC,
  findPrecedents,
  getSimilarCases,
  getAlerts,
  addAlert,
} from '@/lib/api';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import SkeletonCard from '@/components/Skeleton/SkeletonCard';

const CaseDetail = () => {
  const { case_id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // States for various data
  const [notes, setNotes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [ocrText, setOcrText] = useState('');
  const [summary, setSummary] = useState('');
  const [ipcSuggestions, setIpcSuggestions] = useState<any[]>([]);
  const [precedents, setPrecedents] = useState<any[]>([]);
  const [similarCases, setSimilarCases] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Form states
  const [noteText, setNoteText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [precedentQuery, setPrecedentQuery] = useState('');

  useEffect(() => {
    if (case_id) {
      loadCaseData();
    }
  }, [case_id]);

  // Auto-load data when switching tabs
  useEffect(() => {
    if (!case_id) return;
    
    switch (activeTab) {
      case 'notes':
        loadNotes();
        break;
      case 'documents':
        loadDocuments();
        break;
      case 'similar':
        loadSimilarCases();
        break;
      case 'alerts':
        loadAlerts();
        break;
    }
  }, [activeTab, case_id]);

  const loadCaseData = async () => {
    try {
      const data = await getCaseById(case_id!);
      setCaseData(data);
      setNewStatus(data.status);
    } catch (error) {
      toast({ title: 'Error loading case', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const data = await getNotes(case_id!);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote(case_id!, noteText);
      toast({ title: 'Note added' });
      setNoteText('');
      loadNotes();
    } catch (error) {
      toast({ title: 'Error adding note', variant: 'destructive' });
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateCaseStatus(case_id!, newStatus);
      toast({ title: 'Status updated' });
      loadCaseData();
    } catch (error) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      await uploadDocument(case_id!, file);
      toast({ title: 'Document uploaded' });
      loadDocuments();
    } catch (error) {
      toast({ title: 'Error uploading document', variant: 'destructive' });
    } finally {
      setUploadingDoc(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await getDocuments(case_id!);
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents', error);
    }
  };

  const handleRunOCR = async (docId: string) => {
    try {
      const result = await runOCR(case_id!, docId);
      setOcrText(result.text || result.extracted_text);
      toast({ title: 'OCR completed', description: 'Text extracted successfully' });
      setActiveTab('ocr-text');
    } catch (error) {
      toast({ title: 'Error running OCR', variant: 'destructive' });
    }
  };

  const handleGenerateSummary = async () => {
    if (!ocrText) {
      toast({ title: 'No OCR text available', variant: 'destructive' });
      return;
    }
    try {
      const result = await generateSummary(case_id!, ocrText);
      setSummary(result.summary);
      toast({ title: 'Summary generated' });
    } catch (error) {
      toast({ title: 'Error generating summary', variant: 'destructive' });
    }
  };

  const handleSuggestIPC = async () => {
    if (!ocrText) {
      toast({ title: 'No OCR text available', variant: 'destructive' });
      return;
    }
    try {
      const result = await suggestIPC(ocrText);
      setIpcSuggestions(result.suggestions || result);
      toast({ title: 'IPC suggestions generated' });
      setActiveTab('ipc');
    } catch (error) {
      toast({ title: 'Error suggesting IPC', variant: 'destructive' });
    }
  };

  const handleFindPrecedents = async () => {
    if (!precedentQuery.trim()) {
      toast({ title: 'Enter a search query', variant: 'destructive' });
      return;
    }
    try {
      const result = await findPrecedents(precedentQuery);
      setPrecedents(result.results || result);
      toast({ title: `Found ${precedents.length} precedents` });
    } catch (error) {
      toast({ title: 'Error finding precedents', variant: 'destructive' });
    }
  };

  const loadSimilarCases = async () => {
    try {
      const data = await getSimilarCases(case_id!);
      setSimilarCases(data);
    } catch (error) {
      console.error('Error loading similar cases', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const data = await getAlerts(case_id!);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold font-serif text-primary">{caseData?.title}</h1>
          <p className="text-muted-foreground mt-1">
            Case ID: {caseData?.case_id} • Client: {caseData?.client_name}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="glass-card p-2 grid grid-cols-3 lg:grid-cols-9 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="ocr-text">OCR Text</TabsTrigger>
            <TabsTrigger value="ipc">IPC</TabsTrigger>
            <TabsTrigger value="precedents">Precedents</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{caseData?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleStatusUpdate} className="w-full">
                      Update Status
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Add Note</Label>
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter note..."
                    rows={3}
                  />
                  <Button onClick={handleAddNote} className="mt-2">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Upload and manage case documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/5 transition-colors">
                      {uploadingDoc ? (
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload document
                          </p>
                        </>
                      )}
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                </div>
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div key={doc.doc_id} className="glass-card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-medium">{doc.filename || doc.doc_id}</span>
                      </div>
                      <Button size="sm" onClick={() => handleRunOCR(doc.doc_id)}>
                        Run OCR
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocr-text" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Extracted OCR Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ocrText ? (
                  <>
                    <Textarea value={ocrText} readOnly rows={12} className="font-mono text-sm" />
                    <div className="flex gap-2">
                      <Button onClick={handleGenerateSummary}>Generate Summary</Button>
                      <Button onClick={handleSuggestIPC} variant="outline">
                        IPC Suggestions
                      </Button>
                    </div>
                    {summary && (
                      <div className="glass-card p-4">
                        <h3 className="font-semibold mb-2">Summary:</h3>
                        <p className="text-sm">{summary}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No OCR text available. Run OCR on a document first.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ipc" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>IPC Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                {ipcSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {ipcSuggestions.map((ipc: any, idx: number) => (
                      <div key={idx} className="glass-card p-4">
                        <h3 className="font-semibold">{ipc.section || ipc.ipc_section}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Confidence: {Math.round((ipc.confidence || 0.85) * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No IPC suggestions yet. Generate from OCR text.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="precedents" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Find Precedents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter search query..."
                    value={precedentQuery}
                    onChange={(e) => setPrecedentQuery(e.target.value)}
                  />
                  <Button onClick={handleFindPrecedents}>Search</Button>
                </div>
                <div className="space-y-3">
                  {precedents.map((prec: any, idx: number) => (
                    <div key={idx} className="glass-card p-4">
                      <p className="text-sm font-mono">{prec.text || prec.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Score: {prec.score?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Similar Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarCases.map((sc: any) => (
                    <div key={sc.case_id} className="glass-card p-4">
                      <h3 className="font-semibold">{sc.title}</h3>
                      <p className="text-sm text-muted-foreground">Match: {sc.similarity || '85%'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notes.map((note: any, idx: number) => (
                    <div key={idx} className="glass-card p-3">
                      <p className="text-sm">{note.note || note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.created_at || 'Just now'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.map((alert: any, idx: number) => (
                    <div key={idx} className="glass-card p-3">
                      <p className="text-sm font-semibold">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">Due: {alert.due_date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Case Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Current Status:</strong> {caseData?.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {caseData?.updated_at || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default CaseDetail;
