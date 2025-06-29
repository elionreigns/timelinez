import React, { useState, useEffect, useMemo } from 'react';
import { TimelineSection } from '../types';

interface BackgroundDisplayProps {
  sections: TimelineSection[];
  scrollPosition: number;
  totalWidth: number;
}

const BackgroundDisplay: React.FC<BackgroundDisplayProps> = ({ sections, scrollPosition, totalWidth }) => {
  const [currentBg, setCurrentBg] = useState(sections[0]?.backgroundImage || '');
  const [prevBg, setPrevBg] = useState('');
  const [isFading, setIsFading] = useState(false);

  const currentSection = useMemo(() => {
    if (totalWidth === 0) return sections[0];
    const scrollPercentage = scrollPosition / totalWidth;
    const sectionIndex = Math.floor(scrollPercentage * sections.length);
    return sections[Math.min(sectionIndex, sections.length - 1)];
  }, [scrollPosition, totalWidth, sections]);

  useEffect(() => {
    const newBg = currentSection?.backgroundImage;
    if (newBg && newBg !== currentBg) {
      setPrevBg(currentBg);
      setCurrentBg(newBg);
      setIsFading(true);
      const timer = setTimeout(() => setIsFading(false), 1000); // matches transition duration
      return () => clearTimeout(timer);
    }
  }, [currentSection, currentBg]);

  if (!sections.length) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${prevBg})`, opacity: isFading ? 1 : 0 }}
      />
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${currentBg})`, opacity: isFading ? 0 : 1 }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/50" />
    </div>
  );
};

export default React.memo(BackgroundDisplay);