/**
 * Represents a single event on the timeline.
 */
export interface TimelineEvent {
  /** The year the event occurred (e.g., 1999). */
  year: number;
  /** Optional month of the event (1 for January, 12 for December). */
  month?: number;
  /** Optional day of the event (1-31). */
  day?: number;
  /** The year the event ends. Required for multi-day events. */
  endYear?: number;
  /** The month the event ends. Required for multi-day events. */
  endMonth?: number;
  /** The day the event ends. Required for multi-day events. */
  endDay?: number;
  /** The title of the event. */
  title: string;
  /** A description of the event. Can contain HTML tags like <br> or <strong> for formatting. */
  description: string;
  /** Optional array of media (images or videos) to display with the event. */
  media?: {
    /** The URL of the image or video file. */
    url: string;
    /** The type of media. Use 'image' for JPG/PNG/GIF or 'video' for MP4. */
    type: 'image' | 'video';
  }[];
}

/**
 * Represents a colored section of the timeline, containing multiple events.
 */
export interface TimelineSection {
  /** A unique identifier for the section (e.g., '12th-century'). */
  id: string;
  /** The title of the section (e.g., "12th Century"). */
  title: string;
  /** The year the section begins. */
  startYear: number;
  /** The year the section ends. */
  endYear: number;
  /** The background image URL to display when this section is active. */
  backgroundImage: string;
  /** An array of `TimelineEvent` objects that fall within this section. */
  events: TimelineEvent[];
}