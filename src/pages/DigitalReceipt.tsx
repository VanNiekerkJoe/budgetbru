
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Camera, Upload, Receipt, FileText, X, Check,
  AlertCircle, Loader2, ChevronDown, ChevronUp, Eye, Plus,
  Trash2, List, Clock, Sparkles, Save, RotateCcw, ZoomIn,
  Share2, Copy, TrendingUp, ShieldCheck, ImageIcon, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBudget, ExpenseCategory } from '@/contexts/BudgetContext';
import { parseReceiptText, ParsedReceipt, LineItem, generateDescription } from '@/utils/receiptParser';
import { formatCurrency, getCategoryEmoji } from '@/utils/formatters';
import Tesseract from 'tesseract.js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from 'sonner';

type ScanHistoryItem = {
  id: number;
  image: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  scannedAt: string;
  lineItems?: LineItem[];
  note?: string;
};

type ScanStage = 'idle' | 'preprocessing' | 'uploading' | 'recognizing' | 'extracting' | 'done';

const STAGE_CONFIG: Record<ScanStage, { label: string; icon: string }> = {
  idle: { label: '', icon: '' },
  preprocessing: { label: 'Enhancing image…', icon: '🖼️' },
  uploading: { label: 'Preparing image…', icon: '📤' },
  recognizing: { label: 'Reading receipt text…', icon: '🔍' },
  extracting: { label: 'Extracting details…', icon: '📋' },
  done: { label: 'Complete!', icon: '✅' },
};

const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { bg: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]', label: '✓ Confident' },
    medium: { bg: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]', label: '⚠ Review' },
    low: { bg: 'bg-destructive/10 text-destructive', label: '✎ Manual' },
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config[level].bg}`}>
      {config[level].label}
    </span>
  );
};

const CATEGORIES: ExpenseCategory[] = ['rent', 'groceries', 'transport', 'entertainment', 'utilities', 'education', 'clothing', 'health', 'food', 'other'];

/** Preprocess image for better OCR: increase contrast + grayscale */
function preprocessImage(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(imageData); return; }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Convert to grayscale + increase contrast
      for (let i = 0; i < data.length; i += 4) {
        let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Increase contrast
        gray = ((gray - 128) * 1.5) + 128;
        gray = Math.max(0, Math.min(255, gray));
        // Sharpen: threshold for cleaner text
        gray = gray > 140 ? 255 : gray < 80 ? 0 : gray;
        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageData;
  });
}

/** Check for duplicate receipt in history */
function isDuplicateReceipt(history: ScanHistoryItem[], amount: number, date: string, description: string): boolean {
  return history.some(h =>
    h.amount === amount && h.date === date &&
    h.description.toLowerCase() === description.toLowerCase()
  );
}

const DigitalReceipt = () => {
  const { addExpense } = useBudget();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [parsedResult, setParsedResult] = useState<ParsedReceipt | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [note, setNote] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');

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

  // Stats from history
  const totalScanned = scanHistory.length;
  const totalSaved = scanHistory.reduce((s, h) => s + h.amount, 0);
  const topCategory = scanHistory.length > 0
    ? Object.entries(scanHistory.reduce((acc, h) => { acc[h.category] = (acc[h.category] || 0) + 1; return acc; }, {} as Record<string, number>))
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'other'
    : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size check
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image too large', { description: 'Please use an image under 10MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      const imageData = event.target.result as string;
      setCapturedImage(imageData);
      setActiveTab('scan');
      await performOCR(imageData);
    };
    reader.readAsDataURL(file);
  };

  const performOCR = async (imageData: string) => {
    setScanStage('preprocessing');
    setOcrProgress(2);
    try {
      // Step 1: Preprocess
      const enhanced = await preprocessImage(imageData);
      setOcrProgress(8);

      setScanStage('uploading');
      setOcrProgress(10);

      setScanStage('recognizing');
      const result = await Tesseract.recognize(enhanced, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(12 + Math.round((m.progress || 0) * 72));
          }
        },
      });
      setScanStage('extracting');
      setOcrProgress(88);

      const rawText = result.data.text;
      const parsed = parseReceiptText(rawText);
      setParsedResult(parsed);

      if (parsed.amount !== null) setAmount(parsed.amount);
      if (parsed.storeName) setDescription(parsed.storeName);
      setCategory(parsed.category);
      if (parsed.date) setDate(parsed.date);
      if (parsed.lineItems.length > 0) {
        setLineItems(parsed.lineItems);
        setShowBreakdown(true);
      }

      setOcrProgress(100);
      setScanStage('done');

      toast.success('Receipt scanned!', {
        description: parsed.amountConfidence === 'high'
          ? `Detected ${formatCurrency(parsed.amount || 0)} at ${parsed.storeName}`
          : 'Review the extracted details below.',
      });
    } catch (err) {
      console.error('OCR error:', err);
      setScanStage('idle');
      toast.error('Failed to scan receipt', { description: 'Please try a clearer image.' });
    }
  };

  const handleRescan = useCallback(async () => {
    if (!capturedImage) return;
    setParsedResult(null);
    setLineItems([]);
    setShowBreakdown(false);
    await performOCR(capturedImage);
  }, [capturedImage]);

  const triggerCamera = () => fileInputRef.current?.click();

  const handleClear = () => {
    setCapturedImage(null);
    setScanStage('idle');
    setOcrProgress(0);
    setParsedResult(null);
    setShowRawText(false);
    setShowBreakdown(false);
    setLineItems([]);
    setNewItemName('');
    setNewItemAmount('');
    setNote('');
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

    // Duplicate check
    const finalDescription = lineItems.length > 0
      ? generateDescription(description, lineItems)
      : description;

    if (isDuplicateReceipt(scanHistory, amount, date, finalDescription)) {
      toast.warning('Possible duplicate!', {
        description: 'A receipt with the same amount, date, and description already exists.',
        action: {
          label: 'Save anyway',
          onClick: () => doSave(finalDescription),
        },
      });
      return;
    }

    doSave(finalDescription);
  };

  const doSave = (finalDescription: string) => {
    addExpense({ amount, category, description: finalDescription, date });

    const historyItem: ScanHistoryItem = {
      id: Date.now(),
      image: capturedImage || '',
      amount,
      description: finalDescription,
      category,
      date,
      scannedAt: new Date().toISOString(),
      lineItems: lineItems.length > 0 ? lineItems : undefined,
      note: note || undefined,
    };
    setScanHistory(prev => [historyItem, ...prev].slice(0, 50));

    toast.success('Expense saved! 🎉', {
      description: `${formatCurrency(amount)} added to ${category}`,
    });
    handleClear();
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('receiptScanHistory');
    toast.success('Receipt history cleared');
  };

  const handleDeleteHistoryItem = (id: number) => {
    setScanHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(`R${amount.toFixed(2)}`);
    toast.success('Amount copied!');
  };

  const addLineItem = () => {
    if (!newItemName.trim()) return;
    setLineItems(prev => [...prev, {
      name: newItemName.trim(),
      amount: newItemAmount ? parseFloat(newItemAmount) : null,
      raw: `${newItemName} R${newItemAmount}`,
    }]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const isProcessing = ['preprocessing', 'uploading', 'recognizing', 'extracting'].includes(scanStage);
  const isDone = scanStage === 'done';

  const itemsTotal = lineItems.reduce((s, item) => s + (item.amount || 0), 0);
  const amountMismatch = lineItems.length > 0 && amount > 0 && Math.abs(itemsTotal - amount) > 1;

  return (
    <div className="relative min-h-screen bg-background pb-24">
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/8 to-accent/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Receipt Scanner
              <Badge variant="secondary" className="text-[9px] px-1.5 font-normal">AI</Badge>
            </h1>
            <p className="text-xs text-muted-foreground">Scan • Auto-detect • Save</p>
          </div>
          <div className="flex items-center gap-1">
            {totalScanned > 0 && (
              <Badge variant="outline" className="text-[10px] gap-1 font-normal">
                <Receipt size={10} />
                {totalScanned}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {scanHistory.length > 0 && (
        <div className="px-4 pb-2">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
            >
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap shrink-0">
                <TrendingUp size={12} />
                {formatCurrency(totalSaved)} scanned
              </div>
              <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap shrink-0">
                <Receipt size={12} />
                {totalScanned} receipt{totalScanned !== 1 ? 's' : ''}
              </div>
              {topCategory && (
                <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap shrink-0">
                  {getCategoryEmoji(topCategory)} Top: {topCategory}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      <div className="px-4 py-2">
        <div className="max-w-lg mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-3">
              <TabsTrigger value="scan" className="gap-1.5 text-sm">
                <Camera size={14} />
                Scanner
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-sm">
                <Clock size={14} />
                History
                {scanHistory.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1 h-4">{scanHistory.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ====== SCAN TAB ====== */}
            <TabsContent value="scan" className="space-y-4 mt-0">
              <Card className="overflow-hidden border-border/60 shadow-lg">
                <CardContent className="p-0">
                  {!capturedImage ? (
                    /* Upload area */
                    <div className="relative">
                      <div className="flex flex-col items-center py-14 px-6 text-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10"
                        >
                          <Camera size={32} className="text-primary" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-foreground mb-1">Scan a Receipt</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                          Snap or upload — we auto-detect the store, total, date & category using AI
                        </p>
                        <div className="flex gap-3">
                          <Button onClick={triggerCamera} size="lg" className="gap-2 rounded-xl px-6 shadow-md shadow-primary/20">
                            <Camera size={18} />
                            Take Photo
                          </Button>
                          <Button variant="outline" onClick={triggerCamera} size="lg" className="gap-2 rounded-xl px-6">
                            <Upload size={18} />
                            Upload
                          </Button>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                          {[
                            { icon: <Zap size={10} />, label: 'Auto-detect category' },
                            { icon: <ShieldCheck size={10} />, label: 'On-device OCR' },
                            { icon: <ImageIcon size={10} />, label: 'Image enhancement' },
                          ].map((f, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground/70 bg-muted/50 rounded-full px-2.5 py-1">
                              {f.icon}
                              {f.label}
                            </div>
                          ))}
                        </div>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div>
                      {/* Image preview */}
                      <div className="relative group">
                        <img
                          src={capturedImage}
                          alt="Receipt"
                          className={`w-full ${showImagePreview ? 'h-auto max-h-[70vh]' : 'h-48'} object-cover transition-all duration-300 cursor-pointer`}
                          onClick={() => setShowImagePreview(!showImagePreview)}
                        />
                        {!showImagePreview && (
                          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                        )}

                        {/* Image controls */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button
                            className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full border border-border/50 hover:bg-background transition-colors"
                            onClick={() => setShowImagePreview(!showImagePreview)}
                            title={showImagePreview ? 'Collapse' : 'Expand'}
                          >
                            <ZoomIn size={13} />
                          </button>
                          <button
                            className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full border border-border/50 hover:bg-background transition-colors"
                            onClick={handleClear}
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Scan status overlay */}
                        {isDone && !showImagePreview && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-[hsl(var(--success))]/15 backdrop-blur-md border border-[hsl(var(--success))]/30 rounded-xl px-3 py-2.5 flex items-center gap-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-[hsl(var(--success))]/20 flex items-center justify-center">
                                <Check size={12} className="text-[hsl(var(--success))]" />
                              </div>
                              <div className="flex-1">
                                <span className="text-[hsl(var(--success))] text-sm font-semibold">Scanned!</span>
                                <span className="text-[hsl(var(--success))]/70 text-xs ml-2">
                                  {lineItems.length > 0 && `${lineItems.length} items found`}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] text-[hsl(var(--success))] hover:text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10"
                                onClick={handleRescan}
                              >
                                <RotateCcw size={11} className="mr-1" />
                                Re-scan
                              </Button>
                            </motion.div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-4">
                        {/* Progress */}
                        <AnimatePresence>
                          {isProcessing && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3"
                            >
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 size={14} className="animate-spin text-primary" />
                                <span>{STAGE_CONFIG[scanStage].label}</span>
                              </div>
                              <Progress value={ocrProgress} className="h-2 rounded-full" />
                              <div className="flex justify-between">
                                {(['preprocessing', 'recognizing', 'extracting'] as const).map((s, i) => {
                                  const stageOrder = ['preprocessing', 'uploading', 'recognizing', 'extracting'];
                                  const currentIdx = stageOrder.indexOf(scanStage);
                                  const stageIdx = s === 'preprocessing' ? 0 : s === 'recognizing' ? 2 : 3;
                                  const isPast = currentIdx > stageIdx;
                                  const isActive = scanStage === s || (s === 'preprocessing' && scanStage === 'uploading');
                                  return (
                                    <div key={s} className="flex items-center gap-1 text-[11px]">
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                                        isPast ? 'bg-primary text-primary-foreground' :
                                        isActive ? 'bg-primary/20 text-primary ring-2 ring-primary/30' :
                                        'bg-muted text-muted-foreground'
                                      }`}>
                                        {isPast ? '✓' : STAGE_CONFIG[s].icon}
                                      </span>
                                      <span className={isActive ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                        {s === 'preprocessing' ? 'Enhance' : s === 'recognizing' ? 'OCR' : 'Extract'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Raw text */}
                        {parsedResult && (
                          <Collapsible open={showRawText} onOpenChange={setShowRawText}>
                            <CollapsibleTrigger asChild>
                              <button className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                                <Eye size={12} />
                                {showRawText ? 'Hide' : 'View'} raw OCR text
                                {showRawText ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <pre className="text-[11px] bg-muted/50 p-3 rounded-xl max-h-32 overflow-auto whitespace-pre-wrap font-mono text-muted-foreground border border-border/50">
                                {parsedResult.rawText || '(No text detected)'}
                              </pre>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {/* Editable form */}
                        {isDone && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            {/* Auto-detected category banner */}
                            {parsedResult && parsedResult.categoryConfidence !== 'low' && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                                  parsedResult.categoryConfidence === 'high'
                                    ? 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30'
                                    : 'bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xl">{getCategoryEmoji(category)}</span>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {parsedResult.categoryConfidence === 'high' ? 'Auto-detected with high confidence' : 'Tap category below to change'}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={parsedResult.categoryConfidence === 'high' ? 'default' : 'secondary'} className="text-[10px]">
                                  {parsedResult.categoryConfidence === 'high' ? '✓ Auto' : '? Review'}
                                </Badge>
                              </motion.div>
                            )}

                            {/* Amount */}
                            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-foreground">Total Amount</label>
                                <div className="flex items-center gap-1.5">
                                  <button onClick={handleCopyAmount} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy amount">
                                    <Copy size={12} />
                                  </button>
                                  {parsedResult && <ConfidenceBadge level={parsedResult.amountConfidence} />}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-muted-foreground">R</span>
                                <Input
                                  type="number"
                                  value={amount || ''}
                                  onChange={(e) => setAmount(Number(e.target.value))}
                                  className="text-2xl font-bold h-12 border-0 bg-transparent px-0 focus-visible:ring-0"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-foreground">Store / Description</label>
                                {parsedResult && <ConfidenceBadge level={parsedResult.storeConfidence} />}
                              </div>
                              <Input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Checkers, Pick n Pay"
                                className="rounded-xl"
                              />
                            </div>

                            {/* Category + Date row */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-sm font-medium text-foreground">Category</label>
                                  {parsedResult && <ConfidenceBadge level={parsedResult.categoryConfidence} />}
                                </div>
                                <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CATEGORIES.map(c => (
                                      <SelectItem key={c} value={c}>
                                        {getCategoryEmoji(c)} {c.charAt(0).toUpperCase() + c.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-sm font-medium text-foreground">Date</label>
                                  {parsedResult && <ConfidenceBadge level={parsedResult.dateConfidence} />}
                                </div>
                                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl" />
                              </div>
                            </div>

                            {/* Note */}
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Note (optional)</label>
                              <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note about this purchase…"
                                className="rounded-xl text-sm min-h-[60px] resize-none"
                              />
                            </div>

                            {/* Optional breakdown */}
                            <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
                              <CollapsibleTrigger asChild>
                                <button className="w-full flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2">
                                  <List size={14} />
                                  {showBreakdown ? 'Hide' : 'Show'} Item Breakdown
                                  {lineItems.length > 0 && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{lineItems.length} items</Badge>
                                  )}
                                  {showBreakdown ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2"
                                >
                                  {lineItems.length > 0 && (
                                    <div className="divide-y divide-border/50 max-h-40 overflow-auto">
                                      {lineItems.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 text-sm group">
                                          <span className="text-foreground truncate mr-2">{item.name}</span>
                                          <div className="flex items-center gap-2 shrink-0">
                                            <span className="font-medium text-foreground">
                                              {item.amount !== null ? formatCurrency(item.amount) : '—'}
                                            </span>
                                            <button
                                              onClick={() => setLineItems(prev => prev.filter((_, idx) => idx !== i))}
                                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add item */}
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Item name"
                                      value={newItemName}
                                      onChange={(e) => setNewItemName(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && addLineItem()}
                                      className="text-sm h-9 rounded-lg flex-1"
                                    />
                                    <Input
                                      placeholder="R 0"
                                      type="number"
                                      value={newItemAmount}
                                      onChange={(e) => setNewItemAmount(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && addLineItem()}
                                      className="text-sm h-9 rounded-lg w-20"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-9 w-9 p-0 rounded-lg shrink-0"
                                      disabled={!newItemName.trim()}
                                      onClick={addLineItem}
                                    >
                                      <Plus size={14} />
                                    </Button>
                                  </div>

                                  {lineItems.length > 0 && (
                                    <div className={`flex items-center justify-between text-xs pt-1 border-t border-border/50 ${
                                      amountMismatch ? 'text-[hsl(var(--warning))]' : 'text-muted-foreground'
                                    }`}>
                                      <span className="flex items-center gap-1">
                                        {amountMismatch && <AlertCircle size={10} />}
                                        {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                                        {amountMismatch && ' — total mismatch'}
                                      </span>
                                      <span className="font-medium">
                                        Items: {formatCurrency(itemsTotal)}
                                      </span>
                                    </div>
                                  )}
                                </motion.div>
                              </CollapsibleContent>
                            </Collapsible>

                            {/* Action buttons */}
                            <div className="pt-2 flex gap-3">
                              <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={handleClear}>
                                Cancel
                              </Button>
                              <Button
                                className="flex-1 rounded-xl h-11 gap-2 font-semibold shadow-md shadow-primary/20"
                                onClick={handleSaveExpense}
                                disabled={amount <= 0}
                              >
                                <Save size={16} />
                                Save Expense
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              {!capturedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-medium text-muted-foreground px-1">📸 Tips for best results</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: '💡', tip: 'Good lighting' },
                      { icon: '📋', tip: 'Flatten receipt' },
                      { icon: '🔢', tip: 'Total visible' },
                      { icon: '📏', tip: 'Fill the frame' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2.5 text-xs text-muted-foreground border border-border/30">
                        <span>{t.icon}</span>
                        {t.tip}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* ====== HISTORY TAB ====== */}
            <TabsContent value="history" className="space-y-3 mt-0">
              {scanHistory.length === 0 ? (
                <Card className="border-border/60">
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                      <Receipt size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No receipts yet</p>
                    <p className="text-xs text-muted-foreground">Scan your first receipt to get started</p>
                    <Button variant="outline" size="sm" className="mt-4 rounded-xl gap-1.5" onClick={() => setActiveTab('scan')}>
                      <Camera size={14} />
                      Scan Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {scanHistory.length} receipt{scanHistory.length !== 1 ? 's' : ''} · {formatCurrency(totalSaved)} total
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive h-7 px-2">
                          <Trash2 size={12} className="mr-1" />
                          Clear All
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear receipt history?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove all {scanHistory.length} saved receipts. Your expenses will not be affected.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Clear All
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="space-y-2">
                    {scanHistory.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                      >
                        <Card className="border-border/40 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-center gap-3 p-3 group">
                              {item.image ? (
                                <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-border/50 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                  <Receipt size={18} className="text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate text-foreground">{item.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 gap-0.5">
                                    {getCategoryEmoji(item.category)} {item.category}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                                </div>
                                {item.note && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate italic">"{item.note}"</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-bold text-foreground">{formatCurrency(item.amount)}</span>
                                <button
                                  onClick={() => handleDeleteHistoryItem(item.id)}
                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                            {item.lineItems && item.lineItems.length > 0 && (
                              <div className="border-t border-border/30 px-3 py-2 bg-muted/20">
                                <p className="text-[10px] text-muted-foreground mb-1">{item.lineItems.length} items</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.lineItems.slice(0, 4).map((li, i) => (
                                    <span key={i} className="text-[9px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
                                      {li.name} {li.amount != null && `R${li.amount.toFixed(0)}`}
                                    </span>
                                  ))}
                                  {item.lineItems.length > 4 && (
                                    <span className="text-[9px] text-muted-foreground">+{item.lineItems.length - 4} more</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DigitalReceipt;
