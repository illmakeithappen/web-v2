/** @type { import('@storybook/react-vite').Preview } */
import '../src/index.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'gitthub-white',
      values: [
        {
          name: 'gitthub-white',
          value: '#FFFFFF',
        },
        {
          name: 'gitthub-beige',
          value: '#E8DDD4',
        },
        {
          name: 'gitthub-light-beige',
          value: '#F0E8E0',
        },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
};

export default preview;