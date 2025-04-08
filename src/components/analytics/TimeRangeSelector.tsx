
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeRange } from '@/hooks/useAnalyticsData';

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ timeRange, onTimeRangeChange }) => {
  return (
    <Select 
      value={timeRange} 
      onValueChange={(val: TimeRange) => onTimeRangeChange(val)}
    >
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7days">Last 7 Days</SelectItem>
        <SelectItem value="30days">Last 30 Days</SelectItem>
        <SelectItem value="90days">Last 90 Days</SelectItem>
        <SelectItem value="all">All Time</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
