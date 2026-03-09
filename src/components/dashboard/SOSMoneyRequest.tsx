import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, Send, Settings, Phone, Banknote, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { useBudget } from '@/contexts/BudgetContext';

interface SOSContact {
  name: string;
  phone: string;
}

interface BankingDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
}

const SOSMoneyRequest: React.FC = () => {
  const { remainingBudget } = useBudget();
  const [showSetup, setShowSetup] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const [contacts, setContacts] = useState<SOSContact[]>(() => {
    const saved = localStorage.getItem('budgetbru_sos_contacts');
    return saved ? JSON.parse(saved) : [{ name: '', phone: '' }];
  });

  const [banking, setBanking] = useState<BankingDetails>(() => {
    const saved = localStorage.getItem('budgetbru_banking');
    return saved ? JSON.parse(saved) : { bankName: '', accountHolder: '', accountNumber: '', branchCode: '' };
  });

  useEffect(() => {
    localStorage.setItem('budgetbru_sos_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('budgetbru_banking', JSON.stringify(banking));
  }, [banking]);

  const isSetupComplete = contacts.some(c => c.name && c.phone) && banking.accountNumber;

  const quickAmounts = [50, 100, 200, 500];

  const buildMessage = (contactName: string) => {
    const amt = amount ? `R${amount}` : 'some money';
    const reasonText = reason ? ` for ${reason}` : '';
    let msg = `🆘 Hey ${contactName}! I'm in a tight spot and could really use ${amt}${reasonText}. `;
    msg += `I only have ${formatCurrency(Math.max(0, remainingBudget))} left.\n\n`;
    if (banking.accountNumber) {
      msg += `💳 Banking Details:\n`;
      if (banking.bankName) msg += `Bank: ${banking.bankName}\n`;
      if (banking.accountHolder) msg += `Name: ${banking.accountHolder}\n`;
      msg += `Acc: ${banking.accountNumber}\n`;
      if (banking.branchCode) msg += `Branch: ${banking.branchCode}\n`;
    }
    msg += `\nThank you so much! 🙏`;
    return msg;
  };

  const handleSendWhatsApp = (contact: SOSContact) => {
    if (!contact.phone) {
      toast.error('Add a phone number first!');
      return;
    }
    const phone = contact.phone.replace(/\D/g, '').replace(/^0/, '27');
    const msg = encodeURIComponent(buildMessage(contact.name || 'there'));
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    toast.success(`S.O.S sent to ${contact.name}! 🚨`);
  };

  const handleSendSMS = (contact: SOSContact) => {
    if (!contact.phone) {
      toast.error('Add a phone number first!');
      return;
    }
    const msg = encodeURIComponent(buildMessage(contact.name || 'there'));
    window.open(`sms:${contact.phone}?body=${msg}`, '_blank');
    toast.success(`SMS opened for ${contact.name}!`);
  };

  const handleCopyMessage = () => {
    const msg = buildMessage('there');
    navigator.clipboard.writeText(msg);
    setCopied(true);
    toast.success('Message copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phone: '' }]);
    }
  };

  const updateContact = (i: number, field: keyof SOSContact, value: string) => {
    const updated = [...contacts];
    updated[i] = { ...updated[i], [field]: value };
    setContacts(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Siren size={16} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-card-foreground">S.O.S Money Request</h3>
              <p className="text-[10px] text-muted-foreground">Quick emergency request</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowSetup(!showSetup)}>
            <Settings size={13} className="text-muted-foreground" />
          </Button>
        </div>

        {/* Setup panel */}
        <AnimatePresence>
          {showSetup && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-muted/50 rounded-lg p-3 mb-3 space-y-3">
                {/* Emergency contacts */}
                <div>
                  <p className="text-[11px] font-semibold text-foreground mb-2">Emergency Contacts</p>
                  {contacts.map((c, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Name"
                        value={c.name}
                        onChange={(e) => updateContact(i, 'name', e.target.value)}
                        className="h-8 text-xs flex-1"
                        maxLength={50}
                      />
                      <Input
                        placeholder="Phone (e.g. 0821234567)"
                        value={c.phone}
                        onChange={(e) => updateContact(i, 'phone', e.target.value)}
                        className="h-8 text-xs flex-1"
                        maxLength={15}
                        type="tel"
                      />
                    </div>
                  ))}
                  {contacts.length < 3 && (
                    <Button variant="ghost" size="sm" className="text-[10px] h-6 text-primary" onClick={addContact}>
                      + Add contact
                    </Button>
                  )}
                </div>

                {/* Banking details */}
                <div>
                  <p className="text-[11px] font-semibold text-foreground mb-2">Your Banking Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Bank name"
                      value={banking.bankName}
                      onChange={(e) => setBanking({ ...banking, bankName: e.target.value })}
                      className="h-8 text-xs"
                      maxLength={50}
                    />
                    <Input
                      placeholder="Account holder"
                      value={banking.accountHolder}
                      onChange={(e) => setBanking({ ...banking, accountHolder: e.target.value })}
                      className="h-8 text-xs"
                      maxLength={100}
                    />
                    <Input
                      placeholder="Account number"
                      value={banking.accountNumber}
                      onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
                      className="h-8 text-xs"
                      maxLength={20}
                    />
                    <Input
                      placeholder="Branch code"
                      value={banking.branchCode}
                      onChange={(e) => setBanking({ ...banking, branchCode: e.target.value })}
                      className="h-8 text-xs"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSetupComplete ? (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground mb-2">Set up your contacts & banking details first</p>
            <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setShowSetup(true)}>
              <Settings size={13} className="mr-1.5" /> Set Up S.O.S
            </Button>
          </div>
        ) : (
          <>
            {/* Amount selection */}
            <div className="mb-3">
              <p className="text-[10px] text-muted-foreground mb-1.5">How much do you need?</p>
              <div className="flex gap-1.5 mb-2">
                {quickAmounts.map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      amount === String(a)
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : 'bg-muted/40 text-muted-foreground border-transparent hover:bg-muted'
                    }`}
                  >
                    R{a}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Or enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-8 text-xs"
                min={1}
                max={50000}
              />
            </div>

            {/* Reason */}
            <Input
              placeholder="Reason (optional, e.g. groceries, textbooks)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-8 text-xs mb-3"
              maxLength={100}
            />

            {/* Send buttons for each contact */}
            <div className="space-y-2">
              {contacts.filter(c => c.name && c.phone).map((contact, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground flex-1 truncate">{contact.name}</span>
                  <Button
                    size="sm"
                    className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    onClick={() => handleSendWhatsApp(contact)}
                  >
                    <MessageCircle size={11} /> WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => handleSendSMS(contact)}
                  >
                    <Phone size={11} /> SMS
                  </Button>
                </div>
              ))}
            </div>

            {/* Copy message */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-[10px] h-7 text-muted-foreground"
              onClick={handleCopyMessage}
            >
              {copied ? <Check size={11} className="mr-1" /> : <Copy size={11} className="mr-1" />}
              {copied ? 'Copied!' : 'Copy message to clipboard'}
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SOSMoneyRequest;
