import { TimelineSection } from '../types.ts';

/*
  =========================================================================
  EASY EDITING: ADD YOUR TIMELINE CONTENT HERE
  =========================================================================

  This is the central file for all your timeline's historical data.
  You can add new sections or new events inside existing sections.
*/

// Add a placeholder image URL for events that don't have a real image
const PLACEHOLDER_IMAGE_URL = 'https://www.erictheprophet.com/media/prayerauthoritylogo.png';

export const timelineData: TimelineSection[] = [
  {
    id: 'schaefer-history',
    title: 'Schaefer History',
    startYear: 1900,
    endYear: 1987,
    backgroundImage: 'https://images.unsplash.com/photo-1519782245348-a94f923295e8?q=80&w=2670&auto=format&fit=crop',
    events: [
      // Add events for grandparents and parents here
    ],
  },
  {
    id: 'adolescence',
    title: 'Adolescence',
    startYear: 1988,
    endYear: 2006,
    backgroundImage: 'https://images.unsplash.com/photo-1475666675596-c74e83b76237?q=80&w=2574&auto=format&fit=crop',
    events: [
      {
        year: 1988,
        month: 8,
        day: 14,
        title: "Born at St. Joseph's Hospital",
        description: "I was born at St. Joseph's Hospital in Orange County, marking the beginning of my journey.",
        media: [{
          url: 'https://www.erictheprophet.com/media/eric-born.jpg',
          type: 'image',
        }],
      },
      {
        year: 1988,
        endYear: 1989,
        title: 'Early Years in Hawaii',
        description: 'Spent my first year of life in the beautiful islands of Hawaii.',
        media: [{
          url: PLACEHOLDER_IMAGE_URL,
          type: 'image',
        }],
      },
      {
        year: 1989,
        endYear: 2002,
        title: 'Growing up in California',
        description: 'The majority of my childhood and early adolescence was spent in California.',
        media: [{
          url: PLACEHOLDER_IMAGE_URL,
          type: 'image',
        }],
      },
      {
        year: 2002,
        endYear: 2006,
        title: 'Attended Kaiser High School',
        description: 'Started high school at Kaiser High in Hawaii.',
        media: [{
          url: PLACEHOLDER_IMAGE_URL,
          type: 'image',
        }],
      },
      {
        year: 2004,
        endYear: 2005,
        title: 'Kaiser High School Diving Team',
        description: 'Competed on the high school diving team.',
        media: [{
          url: 'https://www.erictheprophet.com/media/diving.mp4',
          type: 'video',
        }],
      },
      {
        year: 2006,
        month: 6,
        day: 2,
        title: 'Graduated from Kaiser High School',
        description: 'Completed high school, graduating from Kaiser High.',
        media: [{
          url: PLACEHOLDER_IMAGE_URL,
          type: 'image',
        }],
      },
    ],
  },
  {
    id: 'adulthood',
    title: 'Adulthood',
    startYear: 2007,
    endYear: 2018,
    backgroundImage: 'https://images.unsplash.com/photo-1505623772559-2ed4a055e144?q=80&w=2574&auto=format&fit=crop',
    events: [
      {
        year: 2012,
        endYear: 2013,
        title: 'Travel to Israel',
        description: 'Embarked on a transformative trip to Israel, exploring its history and culture.',
        media: [{
          url: 'https://www.erictheprophet.com/media/jerusalem.jpg',
          type: 'image',
        }],
      },
    ],
  },
  {
    id: 'occc',
    title: 'OCCC',
    startYear: 2019,
    endYear: 2019,
    backgroundImage: 'https://images.unsplash.com/photo-1590425298993-49273950b7a8?q=80&w=2670&auto=format&fit=crop',
    events: [
      {
        year: 2019,
        month: 2,
        day: 19,
        endYear: 2019,
        endMonth: 12,
        endDay: 10,
        title: 'Period of Reflection',
        description: 'A difficult but formative period of reflection and growth.',
        media: [{
          url: 'https://images.unsplash.com/photo-1518624979984-131935995964?q=80&w=2574&auto=format&fit=crop',
          type: 'image',
        }],
      },
      {
        year: 2019,
        month: 3,
        day: 30,
        endYear: 2019,
        endMonth: 5,
        endDay: 3,
        title: '40 Day Fast',
        description: 'Undertook a 40 day fast for spiritual clarity and physical discipline.',
        media: [{
          url: 'https://images.unsplash.com/photo-1579047036995-5c1797c3c544?q=80&w=2574&auto=format&fit=crop',
          type: 'image'
        }]
      }
    ],
  },
  {
    id: 'probation-era',
    title: 'Probation',
    startYear: 2020,
    endYear: 2025,
    backgroundImage: 'https://images.unsplash.com/photo-1549476464-3739221153a3?q=80&w=2574&auto=format&fit=crop',
    events: [
      {
        year: 2021,
        month: 9,
        day: 1,
        title: 'Married Ashley Danielle Petty',
        description: 'On September 1st, 2021, I married Ashley Danielle Petty and made her a Schaefer.<br/><br/>We were married at Magic Island in Hawaii. This timeline was inspired by Tiki-Toki, and I built it myself so I could host our story on my own site.',
        media: [{
          url: 'https://www.erictheprophet.com/media/etp-family.jpg',
          type: 'image',
        }],
      },
      {
        year: 2023,
        month: 6,
        day: 5,
        endYear: 2023,
        endMonth: 6,
        endDay: 14,
        title: 'The Highway Band at Hebrew Fest',
        description: 'Our band, The Highway Band, had a memorable performance at Hebrew Fest, playing over multiple days and sharing our music with a fantastic crowd.',
        media: [
          {
            url: 'https://videos.pexels.com/video-files/5092036/5092036-hd_1280_720_30fps.mp4',
            type: 'video'
          },
          {
            url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop',
            type: 'image'
          }
        ]
      },
      {
        year: 2025,
        month: 2,
        day: 1,
        title: 'Probation Ends',
        description: 'After five years, my probation period officially ended, marking the beginning of a new chapter of freedom and opportunity.',
        media: [{
          url: 'https://images.unsplash.com/photo-1529241993627-2b5a1b151125?q=80&w=2670&auto=format&fit=crop',
          type: 'image'
        }]
      },
      {
        year: 2025,
        month: 6,
        day: 27,
        title: 'Timeline Created',
        description: 'This interactive timeline was built on this date to capture and share our family\'s story, from its roots to the future we are building together.<br/><br/>It was inspired by Tiki-Toki and built with the help of Google\'s AI.',
        media: [{
          url: 'https://videos.pexels.com/video-files/853877/853877-hd_1280_720_25fps.mp4',
          type: 'video',
        }],
      },
    ],
  },
  {
    id: 'future-era',
    title: 'Into The Future',
    startYear: 2026,
    endYear: 2040,
    backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
    events: [
      {
        year: 2026,
        month: 8,
        day: 1,
        title: 'Prayer Authority Milestone',
        description: 'Aim to achieve 100,000 members on Prayer Authority and 500 paid members paying $5/month for access to cool APIs and tools I’ve built.',
        media: [{
          url: 'https://www.prayerauthority.com/images/prayer-authority-logo.jpg',
          type: 'image',
        }],
      },
      {
        year: 2027,
        month: 8,
        day: 1,
        title: 'Standing in Faith: Cedar',
        description: 'Cedar is the planned name if Ashley and I were to ever have a son and we want to figure out if IVF or surrogacy is the best option, we are hoping to find out if we should get her tubes untied or not',
        media: [{
          url: 'https://www.erictheprophet.com/media/cedar.png',
          type: 'image',
        }],
      },
    ],
  },
];