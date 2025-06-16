
import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value: 'pt' | 'en') => setLanguage(value)}>
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue placeholder={t('language.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt">{t('language.portuguese')}</SelectItem>
          <SelectItem value="en">{t('language.english')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
