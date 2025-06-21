import { User, CollaborationRequest, ChatMessage } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'investor',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Seasoned investor in early-stage SaaS and fintech startups. Looking for disruptive ideas with strong founding teams.',
    investmentInterests: ['SaaS', 'Fintech', 'AI', 'HealthTech'],
    portfolioCompanies: [
      { name: 'Innovate Inc.', url: '#' },
      { name: 'FinTech Solutions', url: '#' },
    ],
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'entrepreneur',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Founder of ConnectSphere, a social networking platform for professionals. Former software engineer at a FAANG company.',
    startupName: 'ConnectSphere',
    startupDescription: 'A revolutionary AI-powered platform designed to enhance professional networking by suggesting meaningful connections based on skills, experience, and career goals.',
    fundingNeeds: '$500,000 for 10% equity. Funds will be used for marketing and scaling our engineering team.',
    pitchDeckUrl: '#',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'investor',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Venture capitalist with a focus on deep tech and renewable energy. Passionate about supporting technology that makes a positive impact on the world.',
    investmentInterests: ['Deep Tech', 'Renewable Energy', 'Sustainability'],
    portfolioCompanies: [
      { name: 'QuantumLeap', url: '#' },
      { name: 'Solaris', url: '#' },
    ],
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'entrepreneur',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'CEO of Healthera, a digital health platform providing personalized wellness plans. Background in medicine and public health.',
    startupName: 'Healthera',
    startupDescription: 'A mobile-first platform that uses AI to create personalized fitness and nutrition plans, connecting users with certified coaches and a supportive community.',
    fundingNeeds: '$1.2M for clinical trials and market expansion.',
    pitchDeckUrl: '#',
  },
    {
    id: '5',
    name: 'Ethan Hunt',
    email: 'ethan@example.com',
    role: 'entrepreneur',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Creator of EcoTrack, an app helping consumers make sustainable purchasing decisions.',
    startupName: 'EcoTrack',
    startupDescription: 'EcoTrack scans product barcodes to provide a comprehensive sustainability score, empowering consumers to make environmentally conscious choices.',
    fundingNeeds: '$300,000 for product development and user acquisition.',
    pitchDeckUrl: '#',
  },
   {
    id: '6',
    name: 'Fiona Glenanne',
    email: 'fiona@example.com',
    role: 'investor',
    avatarUrl: 'https://placehold.co/100x100.png',
    bio: 'Angel investor specializing in consumer goods and e-commerce. Enjoys working with first-time founders.',
    investmentInterests: ['E-commerce', 'Consumer Goods', 'Marketplaces'],
    portfolioCompanies: [
      { name: 'ShopEasy', url: '#' },
      { name: 'DirectStyle', url: '#' },
    ],
  },
];

export const entrepreneurs = users.filter(u => u.role === 'entrepreneur');
export const investors = users.filter(u => u.role === 'investor');

export const requests: CollaborationRequest[] = [
  {
    id: 'req1',
    investorId: '1',
    investorName: 'Alice Johnson',
    investorAvatarUrl: 'https://placehold.co/100x100.png',
    entrepreneurId: '2',
    status: 'pending',
    timestamp: '2024-05-20T10:00:00Z',
  },
  {
    id: 'req2',
    investorId: '3',
    investorName: 'Charlie Brown',
    investorAvatarUrl: 'https://placehold.co/100x100.png',
    entrepreneurId: '2',
    status: 'accepted',
    timestamp: '2024-05-19T15:30:00Z',
  },
   {
    id: 'req3',
    investorId: '1',
    investorName: 'Alice Johnson',
    investorAvatarUrl: 'https://placehold.co/100x100.png',
    entrepreneurId: '4',
    status: 'rejected',
    timestamp: '2024-05-18T11:00:00Z',
  },
];

export const messages: ChatMessage[] = [
    {
        id: 'msg1',
        senderId: '3', // Charlie Brown
        receiverId: '2', // Bob Smith
        message: 'Hi Bob, really impressed with ConnectSphere. Your background is perfect for this venture. Let\'s chat more.',
        timestamp: '2024-05-19T15:32:00Z',
        read: true,
    },
    {
        id: 'msg2',
        senderId: '2', // Bob Smith
        receiverId: '3', // Charlie Brown
        message: 'Hi Charlie, thanks for reaching out! I appreciate the kind words. I\'m available to chat tomorrow afternoon.',
        timestamp: '2024-05-19T15:45:00Z',
        read: true,
    },
    {
        id: 'msg3',
        senderId: '3', // Charlie Brown
        receiverId: '2', // Bob Smith
        message: 'Great, how about 2 PM EST?',
        timestamp: '2024-05-19T16:00:00Z',
        read: false,
    },
     {
        id: 'msg4',
        senderId: '1', // Alice Johnson
        receiverId: '4', // Diana Prince
        message: 'Diana, your work with Healthera is inspiring. While it\'s not a fit for my current thesis, I wish you the best of luck.',
        timestamp: '2024-05-18T11:05:00Z',
        read: true,
    },
];

export function getUserById(id: string | null) {
    if (!id) return null;
    return users.find(user => user.id === id) || null;
}
