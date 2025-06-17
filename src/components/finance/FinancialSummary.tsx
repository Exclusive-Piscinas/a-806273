
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Banknote, Receipt } from 'lucide-react';

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  previousIncome?: number;
  previousExpenses?: number;
  period?: string;
  className?: string;
  onCardClick?: (type: 'income' | 'expenses' | 'balance') => void;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalIncome,
  totalExpenses,
  previousIncome,
  previousExpenses,
  period = '',
  className = '',
  onCardClick
}) => {
  const balance = totalIncome - totalExpenses;
  const previousBalance = previousIncome && previousExpenses 
    ? previousIncome - previousExpenses 
    : undefined;
  
  const getPercentChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };
  
  const incomeChange = getPercentChange(totalIncome, previousIncome);
  const expensesChange = getPercentChange(totalExpenses, previousExpenses);
  const balanceChange = getPercentChange(balance, previousBalance);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      <motion.div variants={item}>
        <Card 
          className={`bg-white hover:shadow-md transition-shadow ${onCardClick ? 'cursor-pointer' : ''}`} 
          onClick={() => onCardClick && onCardClick('income')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Banknote className="h-5 w-5 mr-2 text-green-500" />
              Receitas
            </CardTitle>
            <CardDescription>
              {period ? `Total de receitas ${period}` : 'Total de receitas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {totalIncome.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            
            {incomeChange !== null && (
              <p className={`text-sm flex items-center ${
                incomeChange > 0 ? 'text-green-600' : incomeChange < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {incomeChange > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : incomeChange < 0 ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : null}
                {incomeChange > 0 ? '+' : ''}{incomeChange.toFixed(1)}%
                {' comparado ao período anterior'}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card 
          className={`bg-white hover:shadow-md transition-shadow ${onCardClick ? 'cursor-pointer' : ''}`} 
          onClick={() => onCardClick && onCardClick('expenses')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-red-500" />
              Despesas
            </CardTitle>
            <CardDescription>
              {period ? `Total de despesas ${period}` : 'Total de despesas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            
            {expensesChange !== null && (
              <p className={`text-sm flex items-center ${
                expensesChange < 0 ? 'text-green-600' : expensesChange > 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {expensesChange > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : expensesChange < 0 ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : null}
                {expensesChange > 0 ? '+' : ''}{expensesChange.toFixed(1)}%
                {' comparado ao período anterior'}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="sm:col-span-2 lg:col-span-1">
        <Card 
          className={`bg-white hover:shadow-md transition-shadow ${onCardClick ? 'cursor-pointer' : ''}`}
          onClick={() => onCardClick && onCardClick('balance')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Saldo
            </CardTitle>
            <CardDescription>
              {period ? `Saldo ${period}` : 'Receitas - Despesas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </p>
            
            {balanceChange !== null && (
              <p className={`text-sm flex items-center ${
                balanceChange > 0 ? 'text-green-600' : balanceChange < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {balanceChange > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : balanceChange < 0 ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : null}
                {balanceChange > 0 ? '+' : ''}{balanceChange.toFixed(1)}%
                {' comparado ao período anterior'}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FinancialSummary;
