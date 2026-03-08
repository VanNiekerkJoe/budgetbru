
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Camera, Upload, Receipt, FileText, X, Check,
  AlertCircle, Loader2, ChevronDown, ChevronUp, Eye, Plus,
  Trash2, List, Clock, Sparkles, Save
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
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
};

type ScanStage = 'idle' | 'uploading' | 'recognizing' | 'extracting' | 'done';

const STAGE_CONFIG: Record<ScanStage, { label: string; icon: string }> = {
  idle: { label: '', icon: '' },
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
    setShowBreakdown(false);
    setLineItems([]);
    setNewItemName('');
    setNewItemAmount('');
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

    const finalDescription = lineItems.length > 0
      ? generateDescription(description, lineItems)
      : description;

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
    };
    setScanHistory(prev => [historyItem, ...prev].slice(0, 50));

    toast.success('Expense saved!', {
      description: `${formatCurrency(amount)} added to ${category} expenses`,
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

  const isProcessing = scanStage !== 'idle' && scanStage !== 'done';
  const isDone = scanStage === 'done';

  return (
    <div className="relative min-h-screen bg-background pb-24">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/8 to-accent/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-2">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Receipt Scanner</h1>
            <p className="text-xs text-muted-foreground">Scan, review & save to expenses</p>
          </div>
          <Receipt size={20} className="text-primary" />
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="max-w-lg mx-auto space-y-4">

          {/* Scanner Card */}
          <Card className="overflow-hidden border-border/60 shadow-md">
            <CardContent className="p-0">
              {!capturedImage ? (
                /* Upload area */
                <div className="relative">
                  <div className="flex flex-col items-center py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Camera size={28} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Scan a Receipt</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                      Take a photo or upload an image — we'll extract the total, store, and date automatically
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={triggerCamera} size="lg" className="gap-2 rounded-xl px-6">
                        <Camera size={18} />
                        Take Photo
                      </Button>
                      <Button variant="outline" onClick={triggerCamera} size="lg" className="gap-2 rounded-xl px-6">
                        <Upload size={18} />
                        Upload
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 mt-4 flex items-center gap-1">
                      <Sparkles size={10} />
                      On-device OCR — no data leaves your browser
                    </p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </div>
              ) : (
                <div>
                  {/* Image preview */}
                  <div className="relative">
                    <img src={capturedImage} alt="Receipt" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    <button
                      className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-1.5 rounded-full border border-border/50 hover:bg-background transition-colors"
                      onClick={handleClear}
                    >
                      <X size={14} />
                    </button>
                    {isDone && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-[hsl(var(--success))]/15 backdrop-blur-sm border border-[hsl(var(--success))]/30 rounded-lg px-3 py-2 flex items-center gap-2">
                          <Check size={14} className="text-[hsl(var(--success))]" />
                          <span className="text-[hsl(var(--success))] text-sm font-medium">Scanned successfully</span>
                        </div>
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
                          <Progress value={ocrProgress} className="h-1.5" />
                          <div className="flex justify-between">
                            {(['uploading', 'recognizing', 'extracting'] as const).map((s, i) => {
                              const isActive = scanStage === s;
                              const isPast = ['uploading', 'recognizing', 'extracting'].indexOf(scanStage) > i;
                              return (
                                <div key={s} className="flex items-center gap-1 text-[11px]">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                    isPast ? 'bg-primary text-primary-foreground' :
                                    isActive ? 'bg-primary/20 text-primary ring-2 ring-primary/30' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {isPast ? '✓' : STAGE_CONFIG[s].icon}
                                  </span>
                                  <span className={isActive ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                    {s === 'uploading' ? 'Prep' : s === 'recognizing' ? 'OCR' : 'Extract'}
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
                          <pre className="text-[11px] bg-muted/50 p-3 rounded-lg max-h-32 overflow-auto whitespace-pre-wrap font-mono text-muted-foreground border border-border/50">
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
                                : 'bg-amber-500/10 border-amber-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{getCategoryEmoji(category)}</span>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  Auto-detected: {category.charAt(0).toUpperCase() + category.slice(1)}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {parsedResult.categoryConfidence === 'high' ? 'High confidence match' : 'Tap category below to change'}
                                </p>
                              </div>
                            </div>
                            <Badge variant={parsedResult.categoryConfidence === 'high' ? 'default' : 'secondary'} className="text-[10px]">
                              {parsedResult.categoryConfidence === 'high' ? '✓ Auto' : '? Review'}
                            </Badge>
                          </motion.div>
                        )}
                        {/* Amount — prominent */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-foreground">Total Amount</label>
                            {parsedResult && <ConfidenceBadge level={parsedResult.amountConfidence} />}
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

                        {/* Optional breakdown toggle */}
                        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
                          <CollapsibleTrigger asChild>
                            <button className="w-full flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2">
                              <List size={14} />
                              {showBreakdown ? 'Hide' : 'Add'} Item Breakdown
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

                              {/* Add item row */}
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
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                                  <span>{lineItems.length} item{lineItems.length !== 1 ? 's' : ''}</span>
                                  <span className="font-medium">
                                    Total: {formatCurrency(lineItems.reduce((s, item) => s + (item.amount || 0), 0))}
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
                            className="flex-1 rounded-xl h-11 gap-2 font-semibold"
                            onClick={handleSaveExpense}
                            disabled={amount <= 0}
                          >
                            <Save size={16} />
                            Save to Expenses
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* OCR Tips — compact */}
          {!capturedImage && (
            <div className="flex items-start gap-2.5 px-1 text-xs text-muted-foreground">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-[hsl(var(--warning))]" />
              <p>For best results: use good lighting, flatten the receipt, and ensure the total is clearly visible.</p>
            </div>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <Card className="border-border/60 shadow-md overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  Saved Receipts
                  <Badge variant="secondary" className="text-[10px] ml-1">{scanHistory.length}</Badge>
                </CardTitle>
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
              </CardHeader>
              <CardContent className="pt-1 pb-3 space-y-1.5">
                {scanHistory.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/30 group"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="w-11 h-11 rounded-lg object-cover border border-border/50 shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Receipt size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{item.description}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {getCategoryEmoji(item.category)} {item.category} · {item.date}
                      </p>
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
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalReceipt;
