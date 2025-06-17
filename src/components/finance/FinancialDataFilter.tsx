
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, RefreshCw, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialDataFilterProps {
  timeFrame: string;
  setTimeFrame: (value: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
  categories?: string[];
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
  onRefresh?: () => void;
  onClearFilters?: () => void;
  className?: string;
}

const FinancialDataFilter: React.FC<FinancialDataFilterProps> = ({
  timeFrame,
  setTimeFrame,
  categoryFilter,
  setCategoryFilter,
  categories = [],
  dateRange,
  setDateRange,
  onRefresh,
  onClearFilters,
  className = ''
}) => {
  // Count active filters
  const activeFilters = [
    timeFrame !== 'all' ? 1 : 0,
    categoryFilter && categoryFilter !== 'all' ? 1 : 0,
    dateRange?.from ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const hasActiveFilters = activeFilters > 0;

  return (
    <div className={`p-4 bg-muted/30 rounded-lg ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters} filtros ativos
            </Badge>
          )}
        </h3>
        
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          )}
          
          {hasActiveFilters && onClearFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Período</label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="month">Mês atual</SelectItem>
              <SelectItem value="quarter">Trimestre atual</SelectItem>
              <SelectItem value="year">Ano atual</SelectItem>
              <SelectItem value="custom">Período personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {categories.length > 0 && setCategoryFilter && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'Todas as categorias' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {timeFrame === 'custom' && setDateRange && (
          <div className="space-y-1 col-span-full md:col-span-1">
            <label className="text-sm font-medium">Intervalo de Datas</label>
            <DatePickerWithRange 
              date={dateRange} 
              setDate={setDateRange} 
              className="w-full"
            />
          </div>
        )}
      </div>
      
      {dateRange?.from && dateRange.to && (
        <div className="mt-3 text-sm flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">
            {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} 
            {" até "} 
            {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
      )}
    </div>
  );
};

export default FinancialDataFilter;
