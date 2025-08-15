// ============ CORE TYPES ============
export interface ITimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ILocation {
  type: 'point' | 'marina' | 'anchorage' | 'landmark' | 'hazard';
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  name?: string;
  description?: string;
  amenities?: string[];
  depth?: number;
  tides?: ITideData;
  weather?: IWeatherData;
  restrictions?: string[];
  contact?: IContact;
  reviews?: IReview[];
  photos?: IImage[];
  updatedAt: ITimestamp;
}

export interface IContact {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  vhfChannel?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface IImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  blurDataUrl?: string;
  dominantHex?: string;
  caption?: string;
  tags?: string[];
  location?: ILocation;
  takenAt?: ITimestamp;
  size?: {
    width: number;
    height: number;
    fileSize: number;
  };
}

export interface IDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: ITimestamp;
  category?: string;
  tags?: string[];
}

export interface IReview {
  id: string;
  userId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  photos?: IImage[];
  helpful: string[]; // user IDs who found helpful
  verified: boolean;
  response?: {
    content: string;
    responderName: string;
    respondedAt: ITimestamp;
  };
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

// ============ MARKETPLACE ============
export interface IMarketplaceListing {
  id: string;
  sellerId: string;
  businessId?: string;
  category: 'vessel' | 'parts' | 'equipment' | 'service' | 'charter' | 'slip';
  type: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    negotiable: boolean;
    financing?: boolean;
  };
  location: ILocation;
  condition: 'new' | 'used' | 'refurbished' | 'salvage';
  specifications: Record<string, any>;
  images: IImage[];
  videos?: string[];
  documents?: IDocument[];
  status: 'draft' | 'active' | 'pending' | 'sold' | 'expired';
  featured: boolean;
  views: number;
  favorites: string[]; // user IDs
  inquiries: IInquiry[];
  shipping?: IShippingOptions;
  warranty?: IWarranty;
  inspection?: IInspectionReport;
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
  expiresAt?: ITimestamp;
}

export interface IInquiry {
  id: string;
  buyerId: string;
  message: string;
  offer?: {
    amount: number;
    terms?: string;
    financing?: boolean;
  };
  response?: {
    message: string;
    respondedAt: ITimestamp;
  };
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  createdAt: ITimestamp;
}

export interface IShippingOptions {
  available: boolean;
  cost?: number;
  estimatedDays?: number;
  methods: string[];
  restrictions?: string[];
}

export interface IWarranty {
  type: 'manufacturer' | 'dealer' | 'extended';
  duration: number; // months
  coverage: string[];
  transferable: boolean;
  contact: IContact;
}

export interface IInspectionReport {
  id: string;
  inspectorId: string;
  date: ITimestamp;
  type: 'survey' | 'mechanical' | 'electrical' | 'hull';
  summary: string;
  score: number; // 0-100
  issues: IInspectionIssue[];
  recommendations: string[];
  photos: IImage[];
  document: IDocument;
  validUntil: ITimestamp;
}

export interface IInspectionIssue {
  category: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  estimatedCost?: number;
  photos?: IImage[];
}

// ============ GROUPS ============
export interface IGroup {
  id: string;
  type: 'club' | 'marina' | 'fleet' | 'event' | 'regional' | 'interest';
  name: string;
  description: string;
  coverImage: string;
  avatar: string;
  category: string[];
  location?: ILocation;
  privacy: 'public' | 'private' | 'secret';
  membershipType: 'open' | 'approval' | 'invite';
  members: IGroupMember[];
  admins: string[];
  moderators: string[];
  rules: IGroupRule[];
  events: string[]; // event IDs
  posts: string[]; // post IDs
  resources: IResource[];
  settings: IGroupSettings;
  stats: IGroupStats;
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IGroupMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: ITimestamp;
  permissions: string[];
  title?: string;
  bio?: string;
  active: boolean;
}

export interface IGroupRule {
  id: string;
  title: string;
  description: string;
  order: number;
  category: string;
}

export interface IResource {
  id: string;
  type: 'document' | 'link' | 'video' | 'image';
  title: string;
  description?: string;
  url: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: ITimestamp;
}

export interface IGroupSettings {
  allowMemberPosts: boolean;
  requirePostApproval: boolean;
  allowMemberEvents: boolean;
  publicDirectory: boolean;
  memberDirectory: boolean;
  autoApproveMembers: boolean;
  allowPhotos: boolean;
  allowVideos: boolean;
  allowPolls: boolean;
}

export interface IGroupStats {
  memberCount: number;
  postCount: number;
  eventCount: number;
  activeMembers: number;
  weeklyActivity: number;
  monthlyGrowth: number;
}

// ============ DIAGNOSTIC & PRICING ENGINE ============
export interface IDiagnosticReport {
  id: string;
  vesselId: string;
  userId: string;
  type: 'engine' | 'electrical' | 'hull' | 'systems' | 'comprehensive';
  date: ITimestamp;
  technician?: string;
  systems: ISystemCheck[];
  issues: IDiagnosticIssue[];
  recommendations: IRecommendation[];
  estimatedCosts: ICostEstimate[];
  photos: IImage[];
  documents: IDocument[];
  nextInspection: ITimestamp;
  score: number; // 0-100 health score
}

export interface ISystemCheck {
  system: string;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  details: string;
  lastChecked: ITimestamp;
  nextCheck?: ITimestamp;
  notes?: string;
}

export interface IDiagnosticIssue {
  id: string;
  system: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cause?: string;
  solution: string;
  estimatedCost: number;
  urgency: 'immediate' | 'soon' | 'seasonal' | 'eventual';
  photos?: IImage[];
}

export interface IRecommendation {
  id: string;
  category: 'maintenance' | 'upgrade' | 'replacement' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  benefits: string[];
  estimatedCost: number;
  timeframe: string;
  vendors?: string[];
}

export interface ICostEstimate {
  category: string;
  description: string;
  laborHours: number;
  laborRate: number;
  parts: IPart[];
  totalCost: number;
  confidence: number; // 0-100
}

export interface IPart {
  id: string;
  name: string;
  partNumber?: string;
  manufacturer?: string;
  price: number;
  availability: 'in-stock' | 'order' | 'back-order' | 'discontinued';
  suppliers: string[];
  alternativeParts?: string[];
}

export interface IPricingAnalysis {
  id: string;
  vesselId: string;
  requestedBy: string;
  date: ITimestamp;
  marketValue: {
    low: number;
    average: number;
    high: number;
    currency: string;
  };
  comparables: IComparable[];
  depreciation: IDepreciationSchedule;
  marketTrends: ITrendData;
  factors: IPricingFactor[];
  confidence: number; // 0-100
  sources: string[];
  validUntil: ITimestamp;
}

export interface IComparable {
  vesselId?: string;
  listingId?: string;
  make: string;
  model: string;
  year: number;
  length: number;
  price: number;
  sold: boolean;
  saleDate?: ITimestamp;
  location: string;
  similarity: number; // 0-100
  adjustments: IPriceAdjustment[];
}

export interface IPriceAdjustment {
  factor: string;
  amount: number;
  reason: string;
}

export interface IDepreciationSchedule {
  currentAge: number;
  annualDepreciation: number;
  projectedValues: Array<{
    year: number;
    value: number;
  }>;
}

export interface ITrendData {
  category: string;
  region: string;
  timeframe: '3months' | '6months' | '1year' | '2years';
  trend: 'increasing' | 'stable' | 'decreasing';
  percentage: number;
  dataPoints: number;
}

export interface IPricingFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

// ============ VESSEL DASHBOARD & MAINTENANCE ============
export interface IVessel {
  id: string;
  ownerId: string;
  coOwners?: string[];
  name: string;
  type: string;
  make: string;
  model: string;
  year: number;
  hullId: string;
  registration: IRegistration;
  specifications: IVesselSpecs;
  images: IImage[];
  documents: IDocument[];
  location: ILocation;
  homePort: string;
  dashboard: IVesselDashboard;
  maintenance: IMaintenanceSchedule;
  crew: ICrew[];
  equipment: IEquipment[];
  insurance: IInsurance;
  financing?: IFinancing;
  visibility: 'public' | 'friends' | 'private';
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IRegistration {
  number: string;
  state: string;
  expiresAt: ITimestamp;
  document?: IDocument;
}

export interface IVesselSpecs {
  length: {
    overall: number;
    waterline?: number;
    unit: 'feet' | 'meters';
  };
  beam: {
    value: number;
    unit: 'feet' | 'meters';
  };
  draft: {
    value: number;
    unit: 'feet' | 'meters';
  };
  displacement?: {
    value: number;
    unit: 'pounds' | 'kilograms';
  };
  fuel: {
    capacity: number;
    type: 'gas' | 'diesel' | 'electric';
    unit: 'gallons' | 'liters';
  };
  water?: {
    capacity: number;
    unit: 'gallons' | 'liters';
  };
  engines: IEngine[];
  accommodation?: {
    berths: number;
    heads: number;
    cabins: number;
  };
  construction: {
    hullMaterial: string;
    deckMaterial?: string;
    yearBuilt: number;
    designer?: string;
    builder?: string;
  };
}

export interface IEngine {
  id: string;
  type: 'inboard' | 'outboard' | 'saildrive' | 'electric';
  make: string;
  model: string;
  year: number;
  horsepower: number;
  fuel: 'gas' | 'diesel' | 'electric';
  hours: number;
  serialNumber?: string;
  lastService?: ITimestamp;
}

export interface IVesselDashboard {
  vesselId: string;
  metrics: {
    engineHours: number;
    nauticalMiles: number;
    fuelConsumption: number;
    averageSpeed: number;
    daysActive: number;
    lastUpdate: ITimestamp;
  };
  alerts: IAlert[];
  upcomingMaintenance: IMaintenanceTask[];
  recentTrips: ITrip[];
  expenses: IExpenseTracking;
  performance: IPerformanceMetrics;
}

export interface IAlert {
  id: string;
  type: 'maintenance' | 'weather' | 'emergency' | 'system' | 'navigation';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  createdAt: ITimestamp;
  expiresAt?: ITimestamp;
  actionRequired: boolean;
  actionUrl?: string;
  dismissed: boolean;
}

export interface ITrip {
  id: string;
  vesselId: string;
  name?: string;
  startLocation: ILocation;
  endLocation: ILocation;
  startTime: ITimestamp;
  endTime?: ITimestamp;
  route?: ILocation[];
  distance?: number; // nautical miles
  fuelUsed?: number;
  averageSpeed?: number;
  maxSpeed?: number;
  crew: string[]; // user IDs
  logs: ITripLog[];
  photos?: IImage[];
  public: boolean;
}

export interface ITripLog {
  id: string;
  timestamp: ITimestamp;
  location: ILocation;
  speed?: number;
  heading?: number;
  weather?: IWeatherSnapshot;
  notes?: string;
  photos?: IImage[];
}

export interface IExpenseTracking {
  annual: {
    budget: number;
    spent: number;
    categories: Record<string, number>;
  };
  recent: IExpense[];
}

export interface IExpense {
  id: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'dockage' | 'equipment' | 'other';
  amount: number;
  currency: string;
  description: string;
  vendor?: string;
  date: ITimestamp;
  receipt?: IDocument;
  tags?: string[];
}

export interface IPerformanceMetrics {
  fuelEfficiency: {
    current: number;
    average: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  engineHealth: {
    score: number; // 0-100
    lastCheck: ITimestamp;
    issues: string[];
  };
  utilization: {
    hoursPerMonth: number;
    daysPerMonth: number;
    seasonalPattern: Record<string, number>;
  };
}

export interface IMaintenanceSchedule {
  vesselId: string;
  tasks: IMaintenanceTask[];
  history: IMaintenanceRecord[];
  reminders: IReminder[];
  vendors: IVendor[];
  budget: {
    annual: number;
    spent: number;
    projected: number;
  };
}

export interface IMaintenanceTask {
  id: string;
  category: 'engine' | 'hull' | 'electrical' | 'safety' | 'cosmetic' | 'other';
  name: string;
  description: string;
  interval: {
    type: 'hours' | 'days' | 'miles' | 'months' | 'custom';
    value: number;
  };
  lastCompleted?: ITimestamp;
  nextDue: ITimestamp;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedTime: number; // hours
  parts?: IPart[];
  vendor?: IVendor;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  notes?: string;
  attachments?: IDocument[];
}

export interface IMaintenanceRecord {
  id: string;
  taskId?: string;
  name: string;
  category: string;
  date: ITimestamp;
  vendor?: IVendor;
  cost: number;
  parts: IPart[];
  laborHours: number;
  description: string;
  photos?: IImage[];
  documents?: IDocument[];
  warranty?: IWarranty;
  nextService?: ITimestamp;
}

export interface IReminder {
  id: string;
  taskId: string;
  type: 'email' | 'sms' | 'push' | 'dashboard';
  message: string;
  scheduledFor: ITimestamp;
  sent: boolean;
  recurring: boolean;
}

export interface IVendor {
  id: string;
  name: string;
  type: 'marina' | 'mobile' | 'yard' | 'dealer' | 'independent';
  contact: IContact;
  services: string[];
  specialties: string[];
  location: ILocation;
  rating: number;
  reviews: IReview[];
  certified: boolean;
  insurance: boolean;
  hourlyRate?: number;
  travelCharge?: number;
  notes?: string;
}

export interface IEquipment {
  id: string;
  category: 'navigation' | 'communication' | 'safety' | 'fishing' | 'entertainment' | 'other';
  name: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: ITimestamp;
  warrantyExpires?: ITimestamp;
  value: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string; // location on vessel
  photos?: IImage[];
  documents?: IDocument[];
  lastService?: ITimestamp;
  notes?: string;
}

export interface IInsurance {
  provider: string;
  policyNumber: string;
  type: 'liability' | 'comprehensive' | 'agreed-value' | 'actual-cash-value';
  coverage: {
    hull: number;
    liability: number;
    personal: number;
    uninsured: number;
  };
  deductible: number;
  premium: {
    annual: number;
    monthly?: number;
  };
  effectiveDate: ITimestamp;
  expirationDate: ITimestamp;
  contact: IContact;
  document?: IDocument;
  claims: IClaim[];
}

export interface IClaim {
  id: string;
  claimNumber: string;
  date: ITimestamp;
  type: string;
  description: string;
  amount: number;
  status: 'filed' | 'processing' | 'approved' | 'paid' | 'denied';
  adjuster?: IContact;
  documents: IDocument[];
}

export interface IFinancing {
  lender: string;
  loanAmount: number;
  interestRate: number;
  term: number; // months
  payment: number;
  balance: number;
  nextPayment: ITimestamp;
  contact: IContact;
  documents: IDocument[];
}

// ============ BUSINESS PROFILES ============
export interface IBusinessProfile {
  id: string;
  ownerId: string;
  type: 'marina' | 'dealer' | 'service' | 'charter' | 'manufacturer' | 'other';
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  location: ILocation[];
  contact: IContact;
  hours: IBusinessHours;
  services: IService[];
  certifications: ICertification[];
  insurance: IInsurance;
  reviews: IReview[];
  rating: number;
  photos: IImage[];
  videos: string[];
  team: ITeamMember[];
  fleet?: string[]; // vessel IDs for charter companies
  inventory?: string[]; // marketplace listing IDs
  promotions: IPromotion[];
  events: IEvent[];
  verified: boolean;
  premium: boolean;
  analytics: IBusinessAnalytics;
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IBusinessHours {
  monday: IDayHours;
  tuesday: IDayHours;
  wednesday: IDayHours;
  thursday: IDayHours;
  friday: IDayHours;
  saturday: IDayHours;
  sunday: IDayHours;
  timezone: string;
  seasonal?: {
    summer: IBusinessHours;
    winter: IBusinessHours;
  };
}

export interface IDayHours {
  open: boolean;
  start?: string; // HH:mm format
  end?: string;
  break?: {
    start: string;
    end: string;
  };
}

export interface IService {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: {
    type: 'fixed' | 'hourly' | 'estimate';
    amount: number;
    currency: string;
  };
  duration?: number; // minutes
  availability: 'year-round' | 'seasonal' | 'by-appointment';
  bookingRequired: boolean;
  mobile: boolean;
  emergencyService: boolean;
  specialRequirements?: string[];
}

export interface ICertification {
  id: string;
  name: string;
  issuingBody: string;
  number?: string;
  issuedDate: ITimestamp;
  expiresDate?: ITimestamp;
  document?: IDocument;
  verified: boolean;
}

export interface ITeamMember {
  userId?: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  certifications: ICertification[];
  specialties: string[];
  experience: string;
  contact?: IContact;
}

export interface IPromotion {
  id: string;
  title: string;
  description: string;
  discount: {
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
  };
  applicableServices: string[];
  startDate: ITimestamp;
  endDate: ITimestamp;
  maxUses?: number;
  currentUses: number;
  code?: string;
  restrictions?: string[];
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  type: 'race' | 'regatta' | 'social' | 'educational' | 'maintenance' | 'other';
  startDate: ITimestamp;
  endDate: ITimestamp;
  location: ILocation;
  organizer: string;
  maxAttendees?: number;
  currentAttendees: number;
  cost?: number;
  registrationRequired: boolean;
  registrationDeadline?: ITimestamp;
  photos?: IImage[];
  attendees: IEventAttendee[];
  agenda?: IEventAgenda[];
  requirements?: string[];
  contact: IContact;
}

export interface IEventAttendee {
  userId: string;
  status: 'registered' | 'confirmed' | 'cancelled' | 'no-show';
  registeredAt: ITimestamp;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export interface IEventAgenda {
  time: string;
  title: string;
  description: string;
  location?: string;
  speaker?: string;
}

export interface IBusinessAnalytics {
  views: {
    total: number;
    weekly: number;
    monthly: number;
  };
  inquiries: {
    total: number;
    weekly: number;
    monthly: number;
    conversionRate: number;
  };
  bookings: {
    total: number;
    weekly: number;
    monthly: number;
    revenue: number;
  };
  reviews: {
    average: number;
    count: number;
    distribution: Record<string, number>;
  };
  topServices: Array<{
    serviceId: string;
    bookings: number;
    revenue: number;
  }>;
}

// ============ WEATHER & TIDES ============
export interface IWeatherData {
  provider: string;
  location: ILocation;
  current: IWeatherConditions;
  forecast: IWeatherForecast[];
  marine: IMarineConditions;
  alerts: IWeatherAlert[];
  lastUpdate: ITimestamp;
}

export interface IWeatherConditions {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  dewPoint: number;
  uvIndex: number;
  conditions: string;
  icon: string;
  wind: IWindConditions;
}

export interface IWindConditions {
  speed: number;
  direction: number; // degrees
  gusts?: number;
  beaufortScale: number;
}

export interface IWeatherForecast {
  date: ITimestamp;
  high: number;
  low: number;
  conditions: string;
  icon: string;
  precipitation: {
    probability: number;
    amount?: number;
    type?: 'rain' | 'snow' | 'sleet';
  };
  wind: IWindConditions;
  marine?: IMarineConditions;
}

export interface IMarineConditions {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  swellHeight?: number;
  swellPeriod?: number;
  swellDirection?: number;
  waterTemperature?: number;
  seaState: string; // calm, slight, moderate, rough, very rough, high, very high, phenomenal
}

export interface IWeatherAlert {
  id: string;
  type: 'marine_warning' | 'gale' | 'storm' | 'hurricane' | 'fog' | 'ice';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  areas: string[];
  effective: ITimestamp;
  expires: ITimestamp;
  issued: ITimestamp;
  source: string;
}

export interface IWeatherSnapshot {
  timestamp: ITimestamp;
  conditions: IWeatherConditions;
  marine?: IMarineConditions;
}

export interface ITideData {
  station: string;
  location: ILocation;
  current: {
    height: number;
    trend: 'rising' | 'falling' | 'slack';
  };
  predictions: ITidePrediction[];
  datum: string;
  lastUpdate: ITimestamp;
}

export interface ITidePrediction {
  time: ITimestamp;
  height: number;
  type: 'high' | 'low';
}

// ============ CREW MANAGEMENT ============
export interface ICrew {
  vesselId: string;
  members: ICrewMember[];
  positions: ICrewPosition[];
  schedule: ICrewSchedule[];
  certifications: ICertification[];
  emergencyRoles: IEmergencyRole[];
}

export interface ICrewMember {
  userId: string;
  role: 'captain' | 'first-mate' | 'engineer' | 'deckhand' | 'chef' | 'guest';
  permissions: string[];
  startDate: ITimestamp;
  endDate?: ITimestamp;
  experience: string;
  certifications: ICertification[];
  emergencyContact: IContact;
  active: boolean;
}

export interface ICrewPosition {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  certifications: string[];
  experience: string;
  compensation?: {
    type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'trip' | 'voluntary';
    amount?: number;
    currency?: string;
  };
  location: ILocation;
  duration: string;
  startDate: ITimestamp;
  endDate?: ITimestamp;
  applicants: ICrewApplication[];
  status: 'open' | 'filled' | 'closed';
}

export interface ICrewApplication {
  userId: string;
  appliedAt: ITimestamp;
  coverLetter: string;
  experience: string;
  references: IReference[];
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  notes?: string;
}

export interface IReference {
  name: string;
  relationship: string;
  contact: IContact;
  verified: boolean;
}

export interface ICrewSchedule {
  id: string;
  tripId?: string;
  title: string;
  startDate: ITimestamp;
  endDate: ITimestamp;
  assignments: Record<string, string>; // position -> userId
  notes?: string;
}

export interface IEmergencyRole {
  position: string;
  userId: string;
  backup?: string;
  responsibilities: string[];
  equipment: string[];
  training: string[];
}

// ============ LANDMARKS & MARINAS ============
export interface IMarina {
  id: string;
  name: string;
  type: 'marina' | 'harbor' | 'anchorage' | 'mooring-field';
  location: ILocation;
  businessId?: string;
  facilities: IFacility[];
  slips: ISlip[];
  rates: IRate[];
  fuel: IFuelService;
  services: IService[];
  amenities: string[];
  restaurants?: IRestaurant[];
  transportation: ITransportation[];
  contact: IContact;
  vhfChannel?: number;
  website?: string;
  reservations: {
    required: boolean;
    system?: string;
    link?: string;
  };
  tides: ITideData;
  weather: IWeatherData;
  approach: IApproachInfo;
  restrictions: string[];
  photos: IImage[];
  reviews: IReview[];
  rating: number;
  verified: boolean;
  lastUpdate: ITimestamp;
}

export interface IFacility {
  type: string;
  description: string;
  available: boolean;
  hours?: IBusinessHours;
  cost?: number;
  notes?: string;
}

export interface ISlip {
  id: string;
  number: string;
  length: number;
  width: number;
  depth: number;
  power: string[]; // 30A, 50A, etc.
  water: boolean;
  wifi: boolean;
  available: boolean;
  rate: number;
  rateType: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  reservable: boolean;
  amenities: string[];
}

export interface IRate {
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'annual';
  vesselLength: {
    min: number;
    max: number;
  };
  rate: number;
  currency: string;
  includes: string[];
  peak?: boolean;
  notes?: string;
}

export interface IFuelService {
  available: boolean;
  types: string[]; // gas, diesel, water
  selfService: boolean;
  attendant: boolean;
  hours: IBusinessHours;
  payment: string[];
  pumpout: boolean;
}

export interface IRestaurant {
  name: string;
  cuisine: string[];
  hours: IBusinessHours;
  contact: IContact;
  delivery: boolean;
  reservation: boolean;
  rating?: number;
}

export interface ITransportation {
  type: 'shuttle' | 'taxi' | 'rental' | 'public' | 'uber';
  description: string;
  cost?: string;
  contact?: IContact;
  schedule?: string;
}

export interface IApproachInfo {
  depth: number;
  hazards: string[];
  markers: string[];
  currentSets: string[];
  notes: string;
  chartReference?: string;
}

export interface ILandmark {
  id: string;
  type: 'lighthouse' | 'bridge' | 'inlet' | 'reef' | 'wreck' | 'monument' | 'natural';
  name: string;
  description: string;
  location: ILocation;
  significance: string;
  history?: string;
  navigation: INavigationInfo;
  hazards?: IHazard[];
  photos: IImage[];
  visiting: {
    accessible: boolean;
    restrictions?: string[];
    bestTime?: string;
    facilities?: string[];
  };
  lastUpdate: ITimestamp;
}

export interface INavigationInfo {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  bearing?: number;
  distance?: number;
  lightCharacteristic?: string;
  radarReflector: boolean;
  soundSignal?: string;
  visibility?: number; // nautical miles
}

export interface IHazard {
  type: 'reef' | 'shoal' | 'rock' | 'wreck' | 'cable' | 'restricted';
  description: string;
  severity: 'caution' | 'danger' | 'prohibited';
  depth?: number;
  chartedPosition?: {
    latitude: number;
    longitude: number;
  };
  markers?: string[];
}

// ============ ROUTES & NAVIGATION ============
export interface IRoute {
  id: string;
  userId: string;
  vesselId: string;
  name: string;
  description: string;
  waypoints: IWaypoint[];
  totalDistance: number; // nautical miles
  estimatedTime: number; // hours
  fuelEstimate?: number;
  hazards: IHazard[];
  pointsOfInterest: IPointOfInterest[];
  weatherWindows?: IWeatherWindow[];
  shared: boolean;
  downloads: number;
  rating: number;
  reviews: IReview[];
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IWaypoint {
  id: string;
  name?: string;
  location: ILocation;
  type: 'start' | 'waypoint' | 'destination' | 'fuel' | 'overnight' | 'provision';
  notes?: string;
  eta?: ITimestamp;
  services?: string[];
  hazards?: string[];
  alternates?: ILocation[];
}

export interface IPointOfInterest {
  id: string;
  name: string;
  type: string;
  location: ILocation;
  description: string;
  photos?: IImage[];
  rating?: number;
  reviews?: IReview[];
}

export interface IWeatherWindow {
  start: ITimestamp;
  end: ITimestamp;
  conditions: IWeatherConditions;
  suitability: 'excellent' | 'good' | 'marginal' | 'poor';
  notes: string;
}

export interface IUserLocation {
  userId: string;
  vesselId?: string;
  current: ILocation;
  heading?: number;
  speed?: number;
  status: 'anchored' | 'moored' | 'underway' | 'docked';
  privacy: 'public' | 'friends' | 'private';
  track?: ILocation[]; // recent positions
  sharing: {
    enabled: boolean;
    with: string[]; // user IDs
    until?: ITimestamp;
  };
  emergency: boolean;
  lastUpdate: ITimestamp;
}

// ============ POSTS WITH LOCATION ============
export interface IPost {
  id: string;
  userId: string;
  businessId?: string;
  vesselId?: string;
  type: 'status' | 'photo' | 'video' | 'route' | 'catch' | 'review' | 'emergency';
  content: string;
  media: IMedia[];
  location?: ILocation;
  route?: string; // route ID
  weather?: IWeatherSnapshot;
  tags: string[];
  mentions: string[];
  visibility: 'public' | 'friends' | 'group' | 'private';
  groupId?: string;
  reactions: Record<string, IReaction>;
  comments: IComment[];
  shares: number;
  views: number;
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  location?: ILocation;
  takenAt?: ITimestamp;
  size?: {
    width: number;
    height: number;
    duration?: number; // for videos
  };
}

export interface IReaction {
  type: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
  timestamp: ITimestamp;
}

export interface IComment {
  id: string;
  userId: string;
  content: string;
  media?: IMedia[];
  reactions: Record<string, IReaction>;
  replies: IComment[];
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

// ============ FLEET MANAGEMENT ============
export interface IFleet {
  id: string;
  ownerId: string;
  businessId?: string;
  name: string;
  vessels: string[]; // vessel IDs
  managers: string[]; // user IDs
  crew: ICrewMember[];
  maintenanceSchedule: IFleetMaintenance;
  operations: IFleetOperations;
  tracking: IFleetTracking;
  budget: IFleetBudget;
  insurance: IInsurance[];
  compliance: ICompliance;
  analytics: IFleetAnalytics;
  createdAt: ITimestamp;
  updatedAt: ITimestamp;
}

export interface IFleetMaintenance {
  schedule: IMaintenanceTask[];
  coordinatedTasks: ICoordinatedTask[];
  vendors: IVendor[];
  inventory: IInventoryItem[];
  budget: {
    annual: number;
    allocated: Record<string, number>; // vessel ID -> amount
    spent: Record<string, number>;
  };
}

export interface ICoordinatedTask {
  id: string;
  vessels: string[];
  task: IMaintenanceTask;
  discount?: number;
  scheduledDate: ITimestamp;
  vendor: IVendor;
}

export interface IInventoryItem {
  id: string;
  part: IPart;
  quantity: number;
  location: string;
  reorderLevel: number;
  lastUpdated: ITimestamp;
}

export interface IFleetOperations {
  schedule: IFleetSchedule[];
  dispatching: IDispatchRecord[];
  tracking: IFleetTracking;
  communication: IFleetCommunication;
}

export interface IFleetSchedule {
  id: string;
  vesselId: string;
  type: 'charter' | 'maintenance' | 'training' | 'repositioning';
  startDate: ITimestamp;
  endDate: ITimestamp;
  captain: string;
  crew: string[];
  itinerary?: IWaypoint[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface IDispatchRecord {
  id: string;
  vesselId: string;
  dispatchedAt: ITimestamp;
  destination: ILocation;
  purpose: string;
  estimatedReturn: ITimestamp;
  actualReturn?: ITimestamp;
  fuelBefore: number;
  fuelAfter?: number;
  crew: string[];
  notes?: string;
}

export interface IFleetTracking {
  realTime: boolean;
  vehicles: Record<string, IVehicleTracking>;
  geofences: IGeofence[];
  alerts: ITrackingAlert[];
}

export interface IVehicleTracking {
  vesselId: string;
  lastPosition: ILocation;
  heading: number;
  speed: number;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  batteryLevel?: number;
  fuelLevel?: number;
  lastUpdate: ITimestamp;
}

export interface IGeofence {
  id: string;
  name: string;
  type: 'allowed' | 'restricted' | 'alert';
  boundary: ILocation[];
  vessels: string[];
  alerts: boolean;
}

export interface ITrackingAlert {
  id: string;
  vesselId: string;
  type: 'geofence' | 'speed' | 'maintenance' | 'emergency';
  message: string;
  timestamp: ITimestamp;
  acknowledged: boolean;
}

export interface IFleetCommunication {
  channels: ICommChannel[];
  broadcasts: IBroadcast[];
  emergencyProtocol: IEmergencyProtocol;
}

export interface ICommChannel {
  id: string;
  name: string;
  type: 'vhf' | 'cellular' | 'satellite' | 'app';
  frequency?: string;
  participants: string[];
  emergency: boolean;
}

export interface IBroadcast {
  id: string;
  senderId: string;
  message: string;
  recipients: string[];
  priority: 'low' | 'normal' | 'high' | 'emergency';
  sentAt: ITimestamp;
  acknowledged: string[]; // user IDs who acknowledged
}

export interface IEmergencyProtocol {
  contacts: IContact[];
  procedures: IEmergencyProcedure[];
  equipment: string[];
  checkIn: {
    interval: number; // minutes
    required: boolean;
    timeout: number; // minutes before alert
  };
}

export interface IEmergencyProcedure {
  type: string;
  steps: string[];
  contacts: IContact[];
  equipment: string[];
}

export interface IFleetBudget {
  annual: {
    total: number;
    operational: number;
    maintenance: number;
    fuel: number;
    insurance: number;
    crew: number;
  };
  monthly: Record<string, number>;
  vessel: Record<string, IVesselBudget>;
}

export interface IVesselBudget {
  allocated: number;
  spent: number;
  categories: Record<string, number>;
  projections: Record<string, number>;
}

export interface ICompliance {
  inspections: IInspectionRecord[];
  certifications: ICertification[];
  training: ITrainingRecord[];
  documentation: IDocument[];
  nextDue: IComplianceItem[];
}

export interface IInspectionRecord {
  id: string;
  vesselId: string;
  type: string;
  inspector: string;
  date: ITimestamp;
  result: 'pass' | 'fail' | 'conditional';
  issues: string[];
  nextDue: ITimestamp;
  certificate?: IDocument;
}

export interface ITrainingRecord {
  id: string;
  userId: string;
  course: string;
  provider: string;
  completedAt: ITimestamp;
  expiresAt?: ITimestamp;
  certificate?: IDocument;
}

export interface IComplianceItem {
  type: string;
  description: string;
  dueDate: ITimestamp;
  vesselId?: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface IFleetAnalytics {
  utilization: Record<string, number>; // vessel ID -> utilization %
  efficiency: {
    fuelConsumption: Record<string, number>;
    maintenance: Record<string, number>;
    downtime: Record<string, number>;
  };
  revenue: {
    total: number;
    byVessel: Record<string, number>;
    byService: Record<string, number>;
  };
  trends: {
    monthly: Record<string, any>;
    seasonal: Record<string, any>;
  };
}