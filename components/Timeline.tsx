import React, { useLayoutEffect, useState, useCallback, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { TimelineSection, TimelineEvent } from '../types.ts';
import { useDraggableScroll } from '../hooks/useDraggableScroll.ts';
import { generateHslaColor, getTextColorForBackground } from '../utils/color.ts';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons.tsx';

interface TimelineProps {
  data: TimelineSection[];
  onEventSelect: (event: TimelineEvent) => void;
  onScroll: (scrollLeft: number, scrollWidth: number, clientWidth: number) => void;
}

export interface TimelineHandle {
  scrollToToday: () => void;
}

const PIXELS_PER_YEAR = 120; // Controls the "zoom" level of the timeline
const EVENT_MARKER_HEIGHT = 48; // px, includes margin for stacking
const MAX_EVENT_LANES_VISIBLE = 3; // The number of stacked events visible before scrolling
const HEADER_HEIGHT_REM = '2.5rem'; // The height of the colored section headers

// --- Date Calculation Helpers ---
const dateToDays = (year: number, month = 1, day = 1): number => {
  return year * 365.25 + (month - 1) * 30.44 + day;
}

const getEventPosition = (event: TimelineEvent, section: TimelineSection): { left: string, width: string } => {
  const sectionStartDays = dateToDays(section.startYear);
  const sectionYears = section.endYear - section.startYear + 1;
  const sectionDurationDays = sectionYears * 365.25;

  if (sectionDurationDays <= 0) return { left: '0%', width: '0%' };

  const eventStartDays = dateToDays(event.year, event.month, event.day);
  const eventEndDays = event.endYear
    ? dateToDays(event.endYear, event.endMonth, event.endDay)
    : eventStartDays;

  const leftPercentage = ((eventStartDays - sectionStartDays) / sectionDurationDays) * 100;

  const durationDays = Math.max(eventEndDays - eventStartDays, 0.5); // Give single days a tiny duration
  const widthPercentage = (durationDays / sectionDurationDays) * 100;

  return { left: `${leftPercentage}%`, width: `${widthPercentage}%` };
}

const formatShortDate = (event: TimelineEvent): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!event.month || !event.day) return `${event.year}`;

  const startStr = `${months[event.month - 1]} ${event.day}`;

  const isMultiDay = !!(event.endYear && (event.year !== event.endYear || event.month !== event.endMonth || event.day !== event.endDay));

  if (isMultiDay && event.endMonth && event.endDay) {
    const endStr = event.month === event.endMonth
      ? `${event.endDay}`
      : `${months[event.endMonth - 1]} ${event.endDay}`;
    return `${startStr} - ${endStr}`;
  }

  return startStr;
};


const MonthTicks: React.FC<{ section: TimelineSection }> = ({ section }) => {
  const ticks = [];
  const sectionYears = section.endYear - section.startYear + 1;
  const sectionStartDays = dateToDays(section.startYear);
  const sectionDurationDays = sectionYears * 365.25;
  if (sectionDurationDays <= 0) return null;

  for (let year = section.startYear; year <= section.endYear; year++) {
    // January tick
    const janDays = dateToDays(year, 1, 1);
    ticks.push({
      key: `${year}-1`,
      position: ((janDays - sectionStartDays) / sectionDurationDays) * 100
    });
    // July tick
    const julDays = dateToDays(year, 7, 1);
    ticks.push({
      key: `${year}-7`,
      position: ((julDays - sectionStartDays) / sectionDurationDays) * 100
    });
  }

  return (
    <>
      {ticks.map(tick => (
        <div
          key={tick.key}
          className="absolute top-1/2 -translate-y-1/2 w-px h-2.5 bg-white/30 z-0"
          style={{ left: `${tick.position}%` }}
        />
      ))}
    </>
  );
};
const MemoizedMonthTicks = React.memo(MonthTicks);


const EventMarker: React.FC<{
  event: TimelineEvent;
  section: TimelineSection;
  onClick: () => void;
  lane: number;
  totalLanes: number;
}> = ({ event, section, onClick, lane, totalLanes }) => {
  const { left, width } = getEventPosition(event, section);
  const isMultiDay = !!(event.endYear && (event.year !== event.endYear || event.month !== event.endMonth || event.day !== event.endDay));

  const minWidthPx = isMultiDay ? 80 : 40;
  const displayWidth = `max(${minWidthPx}px, ${width})`;

  const totalLaneBlockHeight = totalLanes * EVENT_MARKER_HEIGHT;
  const blockTopOffset = `calc(50% - ${totalLaneBlockHeight / 2}px)`;
  const top = `calc(${blockTopOffset} + ${lane * EVENT_MARKER_HEIGHT}px)`;

  return (
    <button
      onClick={onClick}
      className="absolute group z-20 flex justify-center items-center"
      style={{
        left: left,
        width: displayWidth,
        height: `${EVENT_MARKER_HEIGHT - 4}px`,
        top: top,
      }}
      aria-label={`View event: ${event.title}`}
    >
      <div className="whitespace-nowrap text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 py-1 rounded-md bg-black/90 text-white shadow-lg transform -translate-x-1/2 left-1/2 absolute bottom-full">
        {event.title}
      </div>
      <div
        className="w-full h-full rounded-md flex flex-col items-center justify-center transition-all duration-300 text-white p-1"
        style={{
          background: 'linear-gradient(145deg, #787878, #232323)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.4), 0 2px 5px rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,0,0,0.7)'
        }}
      >
        <span className="text-base transition-transform duration-300 group-hover:scale-110">⏳</span>
        <p className="text-[10px] leading-tight mt-0.5 text-white/80">{formatShortDate(event)}</p>
      </div>
    </button>
  );
};
const MemoizedEventMarker = React.memo(EventMarker);


const Timeline = forwardRef<TimelineHandle, TimelineProps>(({ data, onEventSelect, onScroll }, ref) => {
  const scrollContainerRef = useDraggableScroll<HTMLDivElement>();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTickPosition = useRef(0);
  const [isTicking, setIsTicking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const TICK_INTERVAL = 50; // pixels

  useEffect(() => {
    audioRef.current = document.getElementById('tick-sound') as HTMLAudioElement;

    // Enable audio on first user interaction
    const enableAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3; // Set volume to 30%
        setAudioEnabled(true);
      }
    };

    // Listen for any user interaction to enable audio
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, enableAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableAudio);
      });
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      onScroll(scrollLeft, scrollWidth, clientWidth);
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 1);

      if (Math.abs(scrollLeft - lastTickPosition.current) > TICK_INTERVAL) {
        // Visual feedback always works
        setIsTicking(true);
        setTimeout(() => setIsTicking(false), 150);

        // Audio feedback only if enabled
        if (audioEnabled && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => {
            console.log('Audio playback failed:', e);
            // If audio fails, we still have visual feedback
          });
        }

        lastTickPosition.current = scrollLeft;
      }
    }
  }, [onScroll, scrollContainerRef, audioEnabled]);

  const scrollToToday = useCallback((smooth = false) => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const startYear = data[0]?.startYear;
    if (!startYear) return;

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const daysFromStart = dateToDays(todayYear, todayMonth, todayDay) - dateToDays(startYear, 1, 1);
    const pixelsFromStart = (daysFromStart / 365.25) * PIXELS_PER_YEAR;

    const clientWidth = element.clientWidth;
    const targetScrollLeft = pixelsFromStart - (clientWidth / 2);

    if (smooth) {
      element.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    } else {
      element.scrollLeft = targetScrollLeft;
    }
  }, [data, scrollContainerRef]);

  useImperativeHandle(ref, () => ({
    scrollToToday: () => scrollToToday(true), // Call with smooth scroll for button click
  }), [scrollToToday]);

  useLayoutEffect(() => {
    scrollToToday(false); // Initial load scroll (instant)

    const element = scrollContainerRef.current;
    if (!element) return;

    handleScroll();

    element.addEventListener('scroll', handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      resizeObserver.unobserve(element);
    };
  }, [scrollToToday, handleScroll]);

  const eventLayouts = useMemo(() => {
    return data.map(section => {
      const sortedEvents = [...section.events].sort((a, b) => dateToDays(a.year, a.month, a.day) - dateToDays(b.year, b.month, b.day));
      const lanes: { end: number }[][] = [];
      const layout = sortedEvents.map(event => {
        const start = dateToDays(event.year, event.month, event.day);
        const end = event.endYear ? dateToDays(event.endYear, event.endMonth, event.endDay) : start;
        let assignedLane = -1;

        for (let i = 0; i < lanes.length; i++) {
          if (lanes[i].every(laneEvent => start >= laneEvent.end)) {
            lanes[i].push({ end });
            assignedLane = i;
            break;
          }
        }

        if (assignedLane === -1) {
          lanes.push([{ end }]);
          assignedLane = lanes.length - 1;
        }

        return { event, lane: assignedLane };
      });
      return { sectionId: section.id, layout, laneCount: lanes.length };
    });
  }, [data]);

  const navigate = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * (direction === 'left' ? -0.5 : 0.5);
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-black to-gray-900 border-t border-b border-yellow-400/30 shadow-inner flex items-center select-none" style={{ minHeight: '8rem', paddingBottom: '2.5rem' }}>
      <button
        onClick={() => navigate('left')}
        disabled={!canScrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 m-1 md:m-2 bg-black/60 rounded-full text-yellow-400 hover:bg-black/80 hover:text-yellow-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        aria-label="Scroll left"
      >
        <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className={`absolute top-0 left-1/2 -translate-x-1/2 z-40 ${isTicking ? 'animate-tick-bob' : ''}`}>
        <div className="w-0 h-0 border-x-6 md:border-x-8 border-x-transparent border-t-[10px] md:border-t-[12px] border-t-blue-500 drop-shadow-lg"></div>
      </div>

      <div className="h-full w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="w-full h-full flex overflow-x-auto cursor-grab"
          style={{
            overflowY: 'visible',
            paddingBottom: '20px',
            boxSizing: 'content-box',
          }}
        >
          {data.map((section, index) => {
            const bgColor = index % 2 === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #FFFFFF, #F5F5DC)';
            const textColor = index % 2 === 0 ? 'text-gray-900' : 'text-gray-800';
            const layoutInfo = eventLayouts.find(l => l.sectionId === section.id);
            const laneCount = layoutInfo?.laneCount || 1;
            const trackHeightPx = Math.max(laneCount, MAX_EVENT_LANES_VISIBLE) * EVENT_MARKER_HEIGHT + 20;
            const isScrollable = laneCount > MAX_EVENT_LANES_VISIBLE;

            const sectionYears = section.endYear - section.startYear + 1;
            const sectionWidth = sectionYears * PIXELS_PER_YEAR;

            return (
              <div
                key={section.id}
                className="relative h-full flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: `${sectionWidth}px` }}
              >
                {/* Color section */}
                <div
                  className="relative flex justify-center items-center p-1 md:p-2"
                  style={{ background: bgColor, height: '2rem', minHeight: '2rem' }}
                >
                  <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(180deg, hsla(0,0%,100%,.3) 0, hsla(0,0%,100%,.1) 50%, transparent 51%, hsla(0,0%,0%,.1))' }}
                  />
                  <div className={`absolute top-0.5 left-1 md:top-1 md:left-2 font-heading text-xs md:text-base ${textColor} opacity-80 font-bold`}>{section.startYear}</div>
                  <div className={`absolute top-0.5 right-1 md:top-1 md:right-2 font-heading text-xs md:text-base ${textColor} opacity-80 font-bold`}>{section.endYear}</div>

                  <h2 className={`relative font-heading text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl text-center ${textColor} font-bold px-1 md:px-2 leading-tight`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {section.title}
                  </h2>
                </div>

                {/* Event track */}
                <div
                  className={`relative bg-gradient-to-b from-gray-900 to-black border-t border-yellow-400/20 flex-grow ${isScrollable ? 'overflow-y-auto custom-scrollbar' : ''}`}
                >
                  <div className="absolute top-1/2 left-0 w-full h-px bg-yellow-400/30 z-0"></div>
                  <div className="relative w-full" style={{ height: `${trackHeightPx}px` }}>
                    <MemoizedMonthTicks section={section} />
                    {layoutInfo?.layout.map(({ event, lane }) => (
                      <MemoizedEventMarker
                        key={`${event.year}-${event.month}-${event.title}`}
                        event={event}
                        section={section}
                        onClick={() => onEventSelect(event)}
                        lane={lane}
                        totalLanes={laneCount}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => navigate('right')}
        disabled={!canScrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 m-1 md:m-2 bg-black/60 rounded-full text-yellow-400 hover:bg-black/80 hover:text-yellow-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        aria-label="Scroll right"
      >
        <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Gold/white gradient bar at the bottom for visual finish */}
      <div className="absolute left-0 bottom-0 w-full h-6 md:h-8 pointer-events-none z-50" style={{ background: 'linear-gradient(to top, #FFD700 60%, #FFF 100%, transparent 100%)' }} />
    </div>
  );
});

export default React.memo(Timeline);