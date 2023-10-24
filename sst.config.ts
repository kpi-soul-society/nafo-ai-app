import { SSTConfig } from 'sst';

export default {
  config(_input) {
    return {
      name: 'nafo-legion', // legacy name, kept it to avoid migrating from old CloudFormation stacks
      region: 'eu-central-1',
    };
  },

  async stacks(app) {
    const appStacks = await import('./stacks');
    appStacks.default(app);
  },
} satisfies SSTConfig;
