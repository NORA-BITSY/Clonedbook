export const BOATABLE_CONFIG = {
  brand: {
    name: 'Boatable',
    tagline: 'Your Complete Maritime Network',
    logo: '/logo-boatable.svg',
    colors: {
      primary: '#004d7a',      // Deep ocean blue
      secondary: '#008793',    // Teal
      accent: '#ffd700',       // Gold
      danger: '#ff6b6b',       // Emergency red
      success: '#51cf66',      // Sea green
      warning: '#ffd43b',      // Warning yellow
      background: '#f8f9fa',   // Light gray
      surface: '#ffffff'       // White
    }
  },
  
  modules: {
    marketplace: {
      enabled: true,
      categories: ['vessels', 'parts', 'equipment', 'services', 'charters', 'slips'],
      commission: 0.05
    },
    groups: {
      enabled: true,
      types: ['club', 'marina', 'fleet', 'event', 'regional', 'interest']
    },
    diagnostics: {
      enabled: true,
      engines: ['marine', 'sail', 'electrical', 'hull', 'navigation']
    },
    pricing: {
      enabled: true,
      sources: ['nada', 'buc', 'soldboats', 'yachtworld']
    },
    maintenance: {
      enabled: true,
      intervals: ['hours', 'days', 'miles', 'custom']
    },
    weather: {
      enabled: true,
      providers: ['noaa', 'windy', 'predictwind']
    },
    maps: {
      enabled: true,
      provider: 'mapbox',
      features: ['navigation', 'anchorages', 'marinas', 'hazards']
    }
  },
  
  userRoles: {
    captain: { label: 'Boat Owner', color: '#004d7a' },
    crew: { label: 'Crew Member', color: '#008793' },
    marina: { label: 'Marina', color: '#00b4d8' },
    business: { label: 'Marine Business', color: '#0077b6' },
    service: { label: 'Service Provider', color: '#023e8a' },
    enthusiast: { label: 'Enthusiast', color: '#48cae4' }
  },
  
  vesselTypes: [
    'Sailboat', 'Powerboat', 'Yacht', 'Catamaran', 'Trawler',
    'Center Console', 'Pontoon', 'Houseboat', 'Jet Ski', 'Kayak'
  ],

  // Navigation and location settings
  navigation: {
    defaultZoom: 10,
    maxZoom: 18,
    minZoom: 4,
    defaultCenter: { lat: 39.7392, lng: -104.9903 }, // Denver, CO as default
    updateInterval: 30000, // 30 seconds
    trackingRadius: 50 // nautical miles
  },

  // Emergency settings
  emergency: {
    coastGuardChannel: 16,
    automaticAlertTime: 300000, // 5 minutes
    sosButtonHoldTime: 3000, // 3 seconds
    emergencyContacts: ['uscg', 'local_police', 'marine_patrol']
  },

  // Weather settings
  weather: {
    updateInterval: 600000, // 10 minutes
    forecastDays: 7,
    alertTypes: ['marine_warning', 'gale', 'storm', 'hurricane'],
    units: {
      wind: 'knots',
      temperature: 'fahrenheit',
      pressure: 'inHg',
      visibility: 'nautical_miles'
    }
  },

  // Maintenance intervals (in hours for engine, days for other)
  maintenanceIntervals: {
    engineOil: { hours: 100, priority: 'high' },
    engineCoolant: { hours: 500, priority: 'medium' },
    fuelFilter: { hours: 200, priority: 'high' },
    transmission: { hours: 300, priority: 'medium' },
    propeller: { days: 90, priority: 'medium' },
    hullCleaning: { days: 30, priority: 'low' },
    anodeInspection: { days: 90, priority: 'high' },
    safetyEquipment: { days: 365, priority: 'critical' }
  },

  // Marketplace settings
  marketplace: {
    featured: {
      durationDays: 30,
      costMultiplier: 3
    },
    categories: {
      vessels: {
        subcategories: ['sailboats', 'powerboats', 'yachts', 'commercial', 'personal_watercraft'],
        priceRanges: [
          { min: 0, max: 25000, label: 'Under $25K' },
          { min: 25000, max: 100000, label: '$25K - $100K' },
          { min: 100000, max: 500000, label: '$100K - $500K' },
          { min: 500000, max: 1000000, label: '$500K - $1M' },
          { min: 1000000, max: null, label: 'Over $1M' }
        ]
      },
      parts: {
        subcategories: ['engine', 'electrical', 'navigation', 'safety', 'deck', 'interior'],
        conditions: ['new', 'used', 'refurbished', 'salvage']
      },
      services: {
        subcategories: ['repair', 'maintenance', 'survey', 'delivery', 'cleaning', 'storage'],
        serviceTypes: ['mobile', 'yard', 'marina', 'remote']
      }
    }
  },

  // Group settings
  groups: {
    maxMembers: {
      club: 1000,
      marina: 500,
      fleet: 50,
      event: 200,
      regional: 2000,
      interest: 5000
    },
    permissions: {
      admin: ['manage_members', 'edit_settings', 'delete_posts', 'pin_posts', 'manage_events'],
      moderator: ['delete_posts', 'warn_members', 'manage_events'],
      member: ['post', 'comment', 'react', 'create_events']
    }
  }
};

export type BoatableConfig = typeof BOATABLE_CONFIG;