
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export type Language = 'English' | 'Afrikaans' | 'Zulu' | 'Xhosa' | 'Sotho';

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  compact?: boolean;
}

const SOUTH_AFRICAN_LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'English', label: 'English', flag: '🇿🇦' },
  { value: 'Afrikaans', label: 'Afrikaans', flag: '🇿🇦' },
  { value: 'Zulu', label: 'isiZulu', flag: '🇿🇦' },
  { value: 'Xhosa', label: 'isiXhosa', flag: '🇿🇦' },
  { value: 'Sotho', label: 'Sesotho', flag: '🇿🇦' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('budgetbru-language');
    if (savedLanguage && SOUTH_AFRICAN_LANGUAGES.some(l => l.value === savedLanguage)) {
      setSelectedLanguage(savedLanguage as Language);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    localStorage.setItem('budgetbru-language', language);
    
    if (onLanguageChange) {
      onLanguageChange(language);
    }
    
    toast.success(`Language changed to ${language}`, {
      description: "App language preferences updated!",
      icon: "🌍",
    });
  };

  const currentLanguage = SOUTH_AFRICAN_LANGUAGES.find(l => l.value === selectedLanguage);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${compact ? 'px-2 py-1' : ''}`}
      >
        <Globe size={compact ? 14 : 16} />
        {!compact && (
          <>
            <span>{currentLanguage?.flag} {currentLanguage?.label}</span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px] right-0"
          >
            <div className="py-1">
              {SOUTH_AFRICAN_LANGUAGES.map((language) => (
                <button
                  key={language.value}
                  onClick={() => handleLanguageChange(language.value)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedLanguage === language.value ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{language.flag}</span>
                    <span>{language.label}</span>
                  </div>
                  {selectedLanguage === language.value && (
                    <Check size={14} className="text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
