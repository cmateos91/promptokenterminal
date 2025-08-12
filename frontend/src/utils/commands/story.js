// Simple command-driven story engine aligned with the terminal style
// Usage examples:
//   story                  -> shows intro and available actions
//   story start            -> starts or resumes the story
//   story choose <n>       -> picks an option
//   story restart          -> restarts the story
//   story help             -> help

const initialState = {
  scene: 'intro',
  inventory: [],
  flags: {},
  started: false,
};

let state = { ...initialState };

const scenes = {
  intro: {
    title: 'PROMPT: The Staking Protocol',
    text: `You wake up in front of a retro terminal. A message blinks.\n\n"Welcome to the PROMPT Staking Protocol"\n\nYour goal: enable staking and start earning rewards.\nTo interact, use: story start | story choose <n> | story help`,
    options: [
      { text: 'Examine the terminal', next: 'examine_terminal' },
      { text: 'Connect the wallet', next: 'connect_wallet_hint' },
    ],
  },
  examine_terminal: {
    title: 'Terminal PROMPT',
    text: `The screen shows several useful commands.\nHint: type 'help' to list global terminal commands.\n\nThere seems to be an option to check staking status.`,
    options: [
      { text: 'Check staking status', next: 'status_hint' },
      { text: 'Back', next: 'intro' },
    ],
  },
  connect_wallet_hint: {
    title: 'Wallet Connection',
    text: `To connect your wallet, use the terminal command: connect <phantom|solflare>.\n\nTip: you can also type 'walletinfo' after connecting.`,
    options: [
      { text: 'Back', next: 'intro' },
      { text: 'Go to staking status', next: 'status_hint' },
    ],
  },
  status_hint: {
    title: 'Staking Status',
    text: `The protocol allows: stake <amount>, unstake <amount>, claim.\nYou can also check pools, apy, and stakingstats.\n\nYou are ready for your first stake.`,
    options: [
      { text: 'Perform first stake (simulated)', next: 'first_stake' },
      { text: 'Back', next: 'intro' },
    ],
  },
  first_stake: {
    title: 'First Stake',
    text: `You simulate an initial stake. The system replies with a soft hum.\n\nYou have unlocked new hints in the terminal 'help'.`,
    onEnter: () => {
      state.flags.didFirstStake = true;
    },
    options: [
      { text: 'Check profile', next: 'profile_hint' },
      { text: 'Back to start', next: 'intro' },
    ],
  },
  profile_hint: {
    title: 'Profile',
    text: `Your profile progresses as you use real terminal commands.\nTry: profile, rewards, pools, apy.\n\nThe story will continue as you explore the system.`,
    options: [
      { text: 'Back to start', next: 'intro' },
    ],
  },
};

function renderScene(sceneId) {
  const s = scenes[sceneId];
  if (!s) {
    return renderTextBlock('ERROR', 'Unknown scene. Use: story restart');
  }
  if (typeof s.onEnter === 'function') {
    s.onEnter();
  }
  const options = s.options
    .map((opt, i) => `${String(i + 1).padStart(2, ' ')}. ${opt.text}`)
    .join('\n');
  const body = `${s.text}\n\nOptions:\n${options}\n\nUse: story choose <n>  |  story help`;
  return renderTextBlock(s.title, body);
}

function renderTextBlock(title, body) {
  const header = `━━━ ${title} ━━━`;
  return `${header}\n${body}`;
}

function chooseOption(n) {
  const s = scenes[state.scene];
  if (!s || !Array.isArray(s.options) || s.options.length === 0) {
    return {
      type: 'game',
      content: renderTextBlock('No options', 'There are no available options. Use: story restart'),
    };
  }
  const index = Number(n) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= s.options.length) {
    return {
      type: 'game',
      content: renderTextBlock('Invalid option', 'Select a valid number. Ex: story choose 1'),
    };
  }
  const next = s.options[index].next;
  state.scene = next;
  return { type: 'game', content: renderScene(state.scene) };
}

export const storyCommands = {
  story: (args) => {
    const sub = (args[0] || '').toLowerCase();

    if (!state.started) {
      state.started = true;
      state.scene = 'intro';
    }

    switch (sub) {
      case '':
      case 'help':
        return {
          type: 'game',
          content: renderTextBlock(
            'Story Mode',
            `Commands:\n  story start          │ Start or show the story\n  story choose <n>     │ Choose an option\n  story restart        │ Restart the story\n  story help           │ Show this help\n\nTip: Combine the story with real terminal commands (help, status, stake, profile...).`
          ),
        };
      case 'start':
        return { type: 'game', content: renderScene(state.scene) };
      case 'choose':
        return chooseOption(args[1]);
      case 'restart':
        state = { ...initialState, started: true };
        return { type: 'game', content: renderScene(state.scene) };
      default:
        return {
          type: 'error',
          content: `Usage: story [start|choose <n>|restart|help]`,
        };
    }
  },
};
