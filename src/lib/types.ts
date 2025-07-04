
export type UserRole = 'investor' | 'entrepreneur' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  createdAt?: string;
  hasCompletedOnboarding?: boolean;
  startupName?: string;
  startupDescription?: string;
  fundingNeeds?: string;
  pitchDeckUrl?: string;
  investmentInterests?: string[];
  bookmarkedProfiles: string[];
  portfolioCompanies?: { name: string; url: string }[];
};

export type CollaborationRequest = {
  id: string;
  investorId: string;
  investorName: string;
  investorAvatarUrl: string;
  entrepreneurId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
};
