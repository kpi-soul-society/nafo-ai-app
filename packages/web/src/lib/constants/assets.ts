import { CheebsToken } from '@/components/images/CheebsToken';
import { Sparkles } from '@/components/images/Sparkles';
import { UAFlag } from '@/components/images/UAFlag';

export const LANDING_PITCH_DOG_ASSETS = [
  '/assets/doggy1.png',
  '/assets/doggy2.png',
  '/assets/doggy3.png',
  '/assets/doggy4.png',
];

export const CHEEBS_STEPS = ['/assets/step1.png', '/assets/step2.png', '/assets/step3.png'];

export const HOW_IT_WORKS_LIST = [
  {
    title: 'Contribute',
    description:
      'Your donation goes straight to the "United24" charity through our 3-rd party payment provider.\n\nWe are a non-profit project and don’t take any fees.',
    icon: UAFlag,
  },
  {
    title: 'Get Tokens',
    description: 'Based on your donation you will get a generous number of tokens.\n\n1 token = 1 creation.',
    icon: CheebsToken,
  },
  {
    title: 'Create',
    description: '\u2022 Good ol’ text prompt\n\u2022 Image evolution\n\u2022 Styles mixer\n\u2022 Reference images',
    icon: Sparkles,
  },
];

export const EDITOR_STYLES_PRESET = [
  {
    id: 'military',
    name: 'Military',
    imageUrl: '/assets/military.png',
  },
  {
    id: 'realistic',
    name: 'Realistic',
    imageUrl: '/assets/realism.png',
  },
  {
    id: 'anime',
    name: 'Anime',
    imageUrl: '/assets/anime.png',
  },
  {
    id: 'art',
    name: 'Art',
    imageUrl: '/assets/art.png',
  },
];
