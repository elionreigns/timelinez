import React, { useState, useCallback, useEffect, useRef } from 'react';
import { timelineData } from './data/timeline-data.ts';
import { TimelineEvent } from './types.ts';
import Timeline, { TimelineHandle } from './components/Timeline.tsx';
import EventCard from './components/EventCard.tsx';
import BackgroundDisplay from './components/BackgroundDisplay.tsx';

// Helper function to find the closest event to today's date
const findClosestEventToToday = (): TimelineEvent | null => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  let closestEvent: TimelineEvent | null = null;
  let smallestDifference = Infinity;

  // Flatten all events from all sections
  const allEvents: TimelineEvent[] = [];
  timelineData.forEach(section => {
    allEvents.push(...section.events);
  });

  allEvents.forEach(event => {
    // Calculate difference in days from today to event start date
    const eventStart = new Date(event.year, (event.month || 1) - 1, event.day || 1);
    const todayDate = new Date(todayYear, todayMonth - 1, todayDay);

    const diffTime = Math.abs(todayDate.getTime() - eventStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < smallestDifference) {
      smallestDifference = diffDays;
      closestEvent = event;
    }
  });

  return closestEvent;
};

const App: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);
  const [scrollState, setScrollState] = useState({ position: 0, totalWidth: 1 });
  const [mainBackground, setMainBackground] = useState<string | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const timelineRef = useRef<TimelineHandle>(null);

  useEffect(() => {
    // Splash screen logic
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 700); // Remove after fade out
      }, 500); // Keep splash for a moment
    }

    const bg = document.body.dataset.mainBackground;
    if (bg) {
      setMainBackground(bg);
    }

    // Scroll to today on initial load (do not open modal)
    setTimeout(() => {
      timelineRef.current?.scrollToToday();
    }, 0);
  }, []);

  const handleEventSelect = useCallback((event: TimelineEvent) => {
    setActiveEvent(event);
  }, []);

  const handleCloseCard = useCallback(() => {
    setActiveEvent(null);
  }, []);

  const handleTimelineScroll = useCallback((scrollLeft: number, scrollWidth: number, clientWidth: number) => {
    const totalScrollableWidth = scrollWidth - clientWidth;
    setScrollState({ position: scrollLeft, totalWidth: totalScrollableWidth });

    // Parallax calculation
    if (totalScrollableWidth > 0) {
      const scrollPercentage = scrollLeft / totalScrollableWidth;
      const PARALLAX_AMOUNT = 60; // Max pixels of background movement
      setParallaxOffset(-(scrollPercentage * PARALLAX_AMOUNT));
    }
  }, []);

  const handleScrollToToday = () => {
    timelineRef.current?.scrollToToday();
  };

  const handleTestAudio = () => {
    const audio = document.getElementById('tick-sound') as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.3;
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.log('Audio test failed:', e);
        alert('Audio is blocked by browser. Please interact with the page first.');
      });
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden text-white font-sans bg-black">
      <header className="absolute top-0 left-0 p-3 md:p-6 z-30 w-full flex justify-between items-center bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md border-b border-yellow-400/30">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-heading tracking-wider filter drop-shadow(0 2px 2px rgba(0,0,0,0.5)) text-yellow-400">ETP: The Prophetic Timeline</h1>
          <p className="text-xs md:text-base text-yellow-200/80 filter drop-shadow(0 1px 2px rgba(0,0,0,0.5))">From 1900 to the Future</p>
        </div>
        <div className="text-xs md:text-base text-right hidden sm:block">
          <a href="https://www.erictheprophet.com" target="_blank" rel="noopener noreferrer" className="opacity-75 hover:opacity-100 transition-opacity filter drop-shadow(0 1px 2px rgba(0,0,0,0.5)) text-yellow-200">
            ErictheProphet.com
          </a>
          <div className="flex gap-2 mt-1 justify-end">
            <button
              onClick={handleScrollToToday}
              className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors filter drop-shadow(0 1px 2px rgba(0,0,0,0.5)) focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              Scroll to Today
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex-grow">
        {mainBackground ? (
          <>
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-center transition-transform duration-100 linear"
              style={{
                backgroundImage: `url(${mainBackground})`,
                backgroundSize: 'contain',
                transform: `translateX(${parallaxOffset}px)`
              }}
            />
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(https://www.transparenttextures.com/patterns/carbon-fibre.png)`,
                backgroundRepeat: 'repeat',
                opacity: 0.05
              }}
            />
            <div className="absolute inset-0 w-full h-full bg-black/80" />
          </>
        ) : (
          <BackgroundDisplay
            sections={timelineData}
            scrollPosition={scrollState.position}
            totalWidth={scrollState.totalWidth}
          />
        )}
      </div>

      <Timeline ref={timelineRef} data={timelineData} onEventSelect={handleEventSelect} onScroll={handleTimelineScroll} />

      {activeEvent && <EventCard event={activeEvent} onClose={handleCloseCard} />}
    </main>
  );
};

export default React.memo(App);