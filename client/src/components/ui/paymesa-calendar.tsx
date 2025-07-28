import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface PaymesaCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function PaymesaCalendar({ selected, onSelect, className }: PaymesaCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date();
  });

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect?.(selectedDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return day === selected.getDate() && 
           currentMonth.getMonth() === selected.getMonth() && 
           currentMonth.getFullYear() === selected.getFullYear();
  };

  const isOutsideMonth = (day: number) => {
    return day < 1 || day > daysInMonth;
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows * 7 days

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - adjustedFirstDay + 1;
      const isOutside = isOutsideMonth(dayNumber);
      const isLastRow = i >= 35;

      days.push(
        <div
          key={i}
          className={cn(
            "border-r border-gray-300 last:border-r-0",
            "flex items-center justify-center",
            "min-h-[44px]",
            !isLastRow && "border-b border-gray-300"
          )}
        >
          {!isOutside && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-11 w-full rounded-none text-sm font-normal",
                "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-0",
                "transition-colors duration-150",
                isToday(dayNumber) && "bg-gray-100 font-medium",
                isSelected(dayNumber) && "bg-[#2d5a5a] text-white hover:bg-[#1f4a4a]",
                isOutside && "text-gray-400"
              )}
              onClick={() => handleDateSelect(dayNumber)}
            >
              {dayNumber}
            </Button>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-0"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-base font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-0"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-gray-600 text-center pb-3"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
} 