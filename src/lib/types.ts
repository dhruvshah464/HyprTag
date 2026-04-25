import { Timestamp } from 'firebase/firestore';

export type PostStatus = 'idea' | 'draft' | 'scheduled' | 'published' | 'pending';

export interface GrowthMove {
  id: string;
  type: 'reel' | 'carousel' | 'image' | 'thread';
  hook: string;
  caption: string;
  format: string;
  strategicReason: string;
  bestTime: string;
  status: 'active' | 'completed' | 'skipped';
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  type: string;
  status: PostStatus;
  scheduledTime?: string;
  createdAt: Timestamp | any;
  
  // Growth Metrics
  reach?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  viralScore?: number; // 0-100
  
  // System Insights
  insight?: {
    success: boolean;
    reason: string;
    action: string;
  };
}

export interface UserGrowthProfile {
  niche: string;
  targetAudience: string;
  lastAnalysisAt: Timestamp | any;
  overallViralScore: number;
  suggestions: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface MonetizationTemplate {
  id: string;
  category: 'brand-deals' | 'dm-scripts' | 'funnels' | 'offers';
  title: string;
  description: string;
  content: string;
  tags: string[];
}
