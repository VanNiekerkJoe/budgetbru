
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, Receipt, FileText, X, Check, AlertCircle, Loader2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBudget, ExpenseCategory } from '@/contexts/BudgetContext';
import { parseReceiptText, ParsedReceipt, generateDescription } from '@/utils/receiptParser';
import { formatCurrency } from '@/utils/formatters';
import Tesseract from 'tesseract.js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { toast } from 'sonner';

type ScanHistoryItem = {
  id: number;
  image: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  scannedAt: string;
};

type ScanStage = 'idle' | 'uploading' | 'recognizing' | 'extracting' | 'done';

const STAGE_LABELS: Record<ScanStage, string> = {
  idle: '',
  uploading: 'Uploading image…',
  recognizing: 'Recognizing text…',
  extracting: 'Extracting details…',
  done: 'Complete!',
};

const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const styles = {
    high: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  const labels = { high: 'High confidence', medium: 'Review suggested', low: 'Manual entry needed' };
  return <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${styles[level]}`}>{labels[level]}</Badge>;
};

const DigitalReceipt = () => {
  const { addExpense } = useBudget();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [parsedResult, setParsedResult] = useState<ParsedReceipt | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('receiptScanHistory') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('receiptScanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      const imageData = event.target.result as string;
      setCapturedImage(imageData);
      await performOCR(imageData);
    };
    reader.readAsDataURL(file);
  };

  const performOCR = async (imageData: string) => {
    setScanStage('uploading');
    setOcrProgress(5);

    try {
      setScanStage('recognizing');
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(10 + Math.round((m.progress || 0) * 75));
          }
        },
      });

      setScanStage('extracting');
      setOcrProgress(90);

      const rawText = result.data.text;
      const parsed = parseReceiptText(rawText);
      setParsedResult(parsed);

      // Pre-fill form
      if (parsed.amount !== null) setAmount(parsed.amount);
      if (parsed.storeName) setDescription(parsed.storeName);
      setCategory(parsed.category);
      if (parsed.date) setDate(parsed.date);

      setOcrProgress(100);
      setScanStage('done');

      toast.success('Receipt scanned!', {
        description: parsed.amountConfidence === 'high'
          ? `Detected ${formatCurrency(parsed.amount || 0)} from ${parsed.storeName}`
          : 'Review the extracted details below.',
      });
    } catch (err) {
      console.error('OCR error:', err);
      setScanStage('idle');
      toast.error('Failed to scan receipt', { description: 'Please try a clearer image.' });
    }
  };

  const triggerCamera = () => fileInputRef.current?.click();

  const handleClear = () => {
    setCapturedImage(null);
    setScanStage('idle');
    setOcrProgress(0);
    setParsedResult(null);
    setShowRawText(false);
    setAmount(0);
    setDescription('');
    setCategory('other');
    setDate(new Date().toISOString().split('T')[0]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveExpense = () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    addExpense({ amount, category, description, date });

    const historyItem: ScanHistoryItem = {
      id: Date.now(),
      image: capturedImage || '',
      amount,
      description,
      category,
      date,
      scannedAt: new Date().toISOString(),
    };
    setScanHistory(prev => [historyItem, ...prev].slice(0, 20));

    toast.success(`Expense of ${formatCurrency(amount)} saved!`);
    handleClear();
  };

  const isProcessing = scanStage !== 'idle' && scanStage !== 'done';
  const isDone = scanStage === 'done';

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center text-foreground">Scan Receipt</h1>
        <div className="w-24" />
      </div>

      <div className="px-4 py-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">

          {/* Main scanner card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <Receipt size={18} className="text-primary" />
                Receipt Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center py-8">
                  <div className="mb-6 text-center">
                    <p className="text-muted-foreground mb-2">
                      Take a photo of your receipt — we'll extract the details automatically
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Uses on-device OCR. No data leaves your browser.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={triggerCamera} className="flex items-center gap-2">
                      <Camera size={18} />
                      Take Photo
                    </Button>
                    <Button variant="outline" onClick={triggerCamera} className="flex items-center gap-2">
                      <Upload size={18} />
                      Upload
                    </Button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image preview */}
                  <div className="relative">
                    <img src={capturedImage} alt="Receipt" className="w-full h-40 object-cover rounded-md border border-border" />
                    <button className="absolute top-2 right-2 bg-foreground/70 text-background p-1 rounded-full" onClick={handleClear}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 size={14} className="animate-spin text-primary" />
                        {STAGE_LABELS[scanStage]}
                      </div>
                      <Progress value={ocrProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground/60">
                        {(['uploading', 'recognizing', 'extracting'] as const).map(s => (
                          <span key={s} className={scanStage === s ? 'text-primary font-medium' : ''}>
                            {s === 'uploading' ? '📤 Upload' : s === 'recognizing' ? '🔍 OCR' : '📋 Extract'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success banner */}
                  {isDone && (
                    <div className="border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-md p-3 flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span className="text-green-800 dark:text-green-300 text-sm">Receipt scanned — review details below</span>
                    </div>
                  )}

                  {/* Raw text collapsible */}
                  {parsedResult && (
                    <Collapsible open={showRawText} onOpenChange={setShowRawText}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye size={14} />
                          {showRawText ? 'Hide' : 'Show'} extracted text
                          {showRawText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <pre className="text-xs bg-muted p-3 rounded-md max-h-40 overflow-auto whitespace-pre-wrap font-mono">
                          {parsedResult.rawText || '(No text detected)'}
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Editable form */}
                  {isDone && (
                    <div className="pt-2 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium">Amount (ZAR)</label>
                          {parsedResult && <ConfidenceBadge level={parsedResult.amountConfidence} />}
                        </div>
                        <Input type="number" value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))} className="text-lg" placeholder="0.00" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium">Description</label>
                          {parsedResult && <ConfidenceBadge level={parsedResult.storeConfidence} />}
                        </div>
                        <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Store or merchant name" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium">Category</label>
                          {parsedResult && <ConfidenceBadge level={parsedResult.categoryConfidence} />}
                        </div>
                        <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {(['rent', 'groceries', 'transport', 'entertainment', 'utilities', 'education', 'clothing', 'health', 'food', 'other'] as const).map(c => (
                              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium">Date</label>
                          {parsedResult && <ConfidenceBadge level={parsedResult.dateConfidence} />}
                        </div>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={handleClear}>Cancel</Button>
                        <Button className="flex-1" onClick={handleSaveExpense} disabled={amount <= 0}>
                          Save Expense
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 text-amber-500" />
                  <p>OCR works best with clear, well-lit receipt photos. You can always edit the extracted details before saving.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scan history */}
          {scanHistory.length > 0 && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  Scanned Receipts ({scanHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-2">
                {scanHistory.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                    <img src={item.image} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.category} · {item.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Tips for Better Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-sm">
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Place the receipt on a flat, well-lit surface</li>
                <li>Ensure all text and the total are clearly visible</li>
                <li>Avoid shadows and wrinkles on the receipt</li>
                <li>Always review and edit the extracted details before saving</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalReceipt;
