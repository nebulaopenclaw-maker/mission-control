'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am - 8pm

const EVENT_COLORS: Record<string, string> = {
  meeting: 'bg-primary/20 border-primary/40 text-blue-300',
  task: 'bg-warning/20 border-warning/40 text-amber-300',
  deadline: 'bg-danger/20 border-danger/40 text-red-300',
  personal: 'bg-success/20 border-success/40 text-emerald-300',
  other: 'bg-white/[0.06] border-white/[0.1] text-text-secondary',
};

// Sample events (would come from Convex in production)
const SAMPLE_EVENTS = [
  { id: '1', title: 'Agent Performance Review', startHour: 10, duration: 1, day: 1, type: 'meeting' },
  { id: '2', title: 'Content Batch Review', startHour: 14, duration: 1, day: 2, type: 'task' },
  { id: '3', title: 'Investor Update Deadline', startHour: 18, duration: 0.5, day: 5, type: 'deadline' },
  { id: '4', title: 'Product Strategy', startHour: 9, duration: 1.5, day: 3, type: 'meeting' },
];

export function CalendarView() {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  const weekDays = DAYS.map((label, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return { label, date, isToday: date.toDateString() === today.toDateString() };
  });

  const monthYear = startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[13px] font-semibold text-text-primary">{monthYear}</h3>
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="ghost" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft size={12} />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setWeekOffset(0)}>
              <span className="text-[10px]">Today</span>
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight size={12} />
            </Button>
          </div>
        </div>
        <Button size="sm" variant="primary">
          <Plus size={11} /> Event
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-white/[0.06] pb-2 mb-1">
        <div className="text-[10px] text-text-muted text-right pr-3">Time</div>
        {weekDays.map(({ label, date, isToday }) => (
          <div key={label} className={cn('text-center px-1', isToday && 'text-primary')}>
            <div className="text-[9px] text-text-muted uppercase tracking-wide">{label}</div>
            <div className={cn(
              'text-[13px] font-semibold mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto',
              isToday ? 'bg-primary text-white' : 'text-text-secondary'
            )}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-96 relative">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 relative" style={{ height: 48 }}>
            <div className="text-[9px] text-text-dim text-right pr-3 pt-1 font-mono flex-shrink-0">
              {hour}:00
            </div>
            {weekDays.map(({ label }, dayIdx) => {
              const event = SAMPLE_EVENTS.find(
                (e) => e.day === dayIdx && e.startHour === hour
              );
              return (
                <div
                  key={label}
                  className="border-l border-white/[0.03] border-b border-b-white/[0.03] relative mx-0.5"
                >
                  {event && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        'absolute inset-x-0.5 top-0.5 rounded-md border px-1.5 py-1 cursor-pointer z-10',
                        EVENT_COLORS[event.type],
                      )}
                      style={{ height: `${event.duration * 48 - 4}px` }}
                    >
                      <p className="text-[9px] font-medium leading-tight truncate">{event.title}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/[0.04]">
        {Object.entries(EVENT_COLORS).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-sm border', cls)} />
            <span className="text-[9px] text-text-muted capitalize">{type}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
