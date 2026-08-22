/**
 * Mock posts for the Forum screen — mirrors the shape of the web app's
 * Community Forum (lib/community.ts's CommunityPost + categoryLabels).
 * Representative categories and titles, not the full ~23-category
 * taxonomy the web app has.
 */

export type ForumPost = {
  id: string;
  title: string;
  category: string;
  relativeTime: string;
  reactionCount: number;
  commentCount: number;
};

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How do you keep MCAT Biochem terms from blurring together?',
    category: 'Study Strategies',
    relativeTime: '2h ago',
    reactionCount: 14,
    commentCount: 6,
  },
  {
    id: '2',
    title: 'Anyone else finding Organic Chem harder than Gen Chem?',
    category: 'MCAT',
    relativeTime: '5h ago',
    reactionCount: 9,
    commentCount: 11,
  },
  {
    id: '3',
    title: 'Best way to memorize the brachial plexus?',
    category: 'Anatomy',
    relativeTime: '1d ago',
    reactionCount: 21,
    commentCount: 8,
  },
  {
    id: '4',
    title: 'Study schedule for working full-time + nursing school?',
    category: 'Nursing',
    relativeTime: '1d ago',
    reactionCount: 17,
    commentCount: 14,
  },
  {
    id: '5',
    title: 'Flashcards vs. active recall — what actually worked for you?',
    category: 'Productivity',
    relativeTime: '2d ago',
    reactionCount: 32,
    commentCount: 19,
  },
];
