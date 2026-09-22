// Auto-generated from live Supabase schema — DO NOT edit manually
// Live DB: tduigjbrpkibnysdewhj.supabase.co

export type Profile = {
  id: string;
  full_name: string;
  student_id: string | null;
  department: string | null;
  year: string | null;
  bio: string | null;
  avatar_url: string | null;
  college: string | null;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  phone_number?: string | null;
  whatsapp_enabled?: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
};

export type Resource = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  condition: string | null;
  method: string | null;         // 'Sell' | 'Rent' | 'Borrow' | 'Lend' | 'Free'
  price: number | null;
  price_unit: string | null;     // 'total' | 'per_day' | 'per_hour' etc.
  terms: string | null;
  location: string | null;
  image_urls: string[];          // array of public storage URLs
  status: string;                // 'active' | 'paused' | 'completed'
  available_from: string | null;
  available_to: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  // joined
  owner?: Profile;
  category?: Category;
};

export type Need = {
  id: string;
  poster_id: string;             // references profiles.id — NOT user_id
  title: string;
  description: string | null;
  category_id: string | null;
  deadline: string | null;
  duration: string | null;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  image_url: string | null;
  status: string;                // 'open' | 'matched' | 'closed'
  created_at: string;
  updated_at: string;
  // joined
  poster?: Profile;
  category?: Category;
};

export type Ride = {
  id: string;
  creator_id: string;            // references profiles.id
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  total_seats: number;
  available_seats: number;
  vehicle_type: string | null;
  estimated_cost: number | null;
  notes: string | null;
  status: string;                // 'active' | 'full' | 'completed' | 'cancelled'
  created_at: string;
  updated_at: string;
  // joined
  creator?: Profile;
};

export type Skill = {
  id: string;
  owner_id: string;              // references profiles.id — NOT user_id
  title: string;
  description: string | null;
  category_id: string | null;
  level: string | null;          // 'Beginner' | 'Intermediate' | 'Expert'
  availability: string | null;
  rate: number | null;
  rate_unit: string | null;      // 'per_hour' | 'per_session' | 'free' | 'exchange'
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // joined
  owner?: Profile;
  category?: Category;
};

export type Conversation = {
  id: string;
  type: string | null;
  resource_id: string | null;
  need_id: string | null;
  ride_id: string | null;
  skill_id: string | null;
  last_message_at: string | null;
  created_at: string;
  // joined
  participants?: ConversationParticipant[];
  last_message?: Message;
};

export type ConversationParticipant = {
  conversation_id: string;
  profile_id: string;            // references profiles.id — NOT user_id
  joined_at: string;
  last_read_at: string | null;
  // joined
  profile?: Profile;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;                  // message text — NOT content
  image_url: string | null;
  created_at: string;
  // joined
  sender?: Profile;
};

export type RideMember = {
  id: string;
  ride_id: string;
  member_id: string;             // references profiles.id — NOT user_id
  status: string;
  message: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string | null;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};
