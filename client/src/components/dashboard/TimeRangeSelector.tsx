import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] border-gray-200 bg-[#2d5a5a] text-white focus:border-[#FFD700] focus:ring-[#FFD700]">
        <SelectValue placeholder="Select time range" className="text-white" />
      </SelectTrigger>
      <SelectContent className="border-gray-200 bg-[#2d5a5a] text-white">
        <SelectItem value="today" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">Today</SelectItem>
        <SelectItem value="yesterday" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">Yesterday</SelectItem>
        <SelectItem value="last7days" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">Last 7 days</SelectItem>
        <SelectItem value="last30days" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">Last 30 days</SelectItem>
        <SelectItem value="thisMonth" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">This month</SelectItem>
        <SelectItem value="lastMonth" className="focus:bg-[#FFD700] focus:text-[#2d5a5a] text-white">Last month</SelectItem>
      </SelectContent>
    </Select>
  );
}
