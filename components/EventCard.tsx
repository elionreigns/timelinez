
import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../types.ts';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons.tsx';

interface EventCardProps {
  event: TimelineEvent;
  onClose: () => void;
}

const formatDate = (event: TimelineEvent): string => {
  // If it's not a range or has incomplete start date, format as a single date
  const isRange = event.endYear && (event.year !== event.endYear || event.month !== event.endMonth || event.day !== event.endDay);

  if (!isRange) {
    const singleDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', timeZone: 'UTC' };
    if (event.month) singleDateOptions.month = 'long';
    if (event.day) singleDateOptions.day = 'numeric';
    const date = new Date(Date.UTC(event.year, (event.month || 1) - 1, event.day || 1));
    return date.toLocaleDateString('en-US', singleDateOptions);
  }

  const startDate = new Date(Date.UTC(event.year, (event.month || 1) - 1, event.day || 1));
  const endDate = new Date(Date.UTC(event.endYear!, (event.endMonth || 1) - 1, event.endDay || 1));

  const fullOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
    if (startDate.getUTCMonth() === endDate.getUTCMonth()) {
      // e.g., "June 5 - 14, 2023"
      return `${startDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })} ${startDate.getUTCDate()} - ${endDate.getUTCDate()}, ${startDate.getUTCFullYear()}`;
    } else {
      // e.g., "June 5 - July 10, 2023"
      const startPart = startDate.toLocaleString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
      const endPart = endDate.toLocaleString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
      return `${startPart} - ${endPart}, ${startDate.getUTCFullYear()}`;
    }
  }

  // e.g., "December 20, 2023 - January 5, 2024"
  return `${startDate.toLocaleDateString('en-US', fullOptions)} - ${endDate.toLocaleDateString('en-US', fullOptions)}`;
};

const EventCard: React.FC<EventCardProps> = ({ event, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const currentMedia = event.media?.[currentMediaIndex];

  useEffect(() => {
    // Reset loading state when the media source changes
    setIsMediaLoaded(false);
  }, [currentMediaIndex]);

  const handleNextMedia = () => {
    if (event.media && currentMediaIndex < event.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white/95 text-gray-800 rounded-lg shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up no-scrollbar border-t-2 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-black/40 rounded-full hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 transition-colors z-20 p-1.5"
            aria-label="Close event details"
          >
            <CloseIcon className="w-6 h-6" />
          </button>

          <div className="flex justify-between items-start mb-4 gap-4 pr-12">
            <h2 className="text-4xl md:text-5xl font-heading text-gray-900">{event.title}</h2>
            <p className="text-base md:text-lg font-bold text-gray-500 text-right whitespace-nowrap flex-shrink-0">{formatDate(event)}</p>
          </div>

          {currentMedia && (
            <div className="relative w-full aspect-video max-h-[50vh] rounded-lg overflow-hidden bg-gray-200 mb-6 group">
              {!isMediaLoaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              )}
              {currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setIsMediaLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : (
                <img
                  key={currentMedia.url}
                  src={currentMedia.url}
                  alt={event.title}
                  onLoad={() => setIsMediaLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isMediaLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              )}

              {event.media && event.media.length > 1 && (
                <>
                  <button
                    onClick={handlePrevMedia}
                    disabled={currentMediaIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed z-10"
                    aria-label="Previous media"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextMedia}
                    disabled={currentMediaIndex === event.media.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed z-10"
                    aria-label="Next media"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}

            </div>
          )}

          <div
            className="text-base leading-relaxed prose max-w-none prose-p:text-gray-700 prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
    </div>
  );
};

export default React.memo(EventCard);