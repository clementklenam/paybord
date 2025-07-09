import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-500 dark:focus:ring-gray-400 bg-white dark:bg-gray-800">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent className="border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <SelectItem value="today" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">Today</SelectItem>
        <SelectItem value="yesterday" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">Yesterday</SelectItem>
        <SelectItem value="last7days" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">Last 7 days</SelectItem>
        <SelectItem value="last30days" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">Last 30 days</SelectItem>
        <SelectItem value="thisMonth" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">This month</SelectItem>
        <SelectItem value="lastMonth" className="focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-700 dark:focus:text-gray-200">Last month</SelectItem>
      </SelectContent>
    </Select>
  );
}
