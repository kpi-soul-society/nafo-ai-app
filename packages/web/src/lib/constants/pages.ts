import * as R from './routes';

export const LANDING_ANCHORS = [
  { name: 'Gallery', route: R.GALLERY },
  { name: 'How it works', route: R.HOW_IT_WORKS_ANCHOR },
  { name: 'About NAFO', route: R.ABOUT_NAFO_ANCHOR },
];

export const MAIN_UNAUTHORISED_PAGES = [{ name: 'Gallery', route: R.GALLERY }];

export const MAIN_PAGES = [
  { name: 'Editor', route: R.EDITOR },
  { name: 'Tokens', route: R.TOKENS },
  { name: 'Gallery', route: R.GALLERY },
];
