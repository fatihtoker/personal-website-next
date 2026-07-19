import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      colors: {
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        'surface-strong': 'var(--surface-strong)',
        line: 'var(--line)',
        acid: 'var(--acid)',
        coral: 'var(--coral)',
        sky: 'var(--sky)',

        red: '#DC2626',
        'pale-yellow': '#FFFFD1',
        'gray': '#393D3F',
        'purple': '#9792E3',
        'light-gray': "#F5F4FC",
        // LingoLink Colors
        'lingo-primary': '#6366F1',
        'lingo-primary-dark': '#4F46E5',
        'lingo-primary-light': '#818CF8',
        'lingo-primary-bg': '#EEF2FF',
        
        'lingo-accent': '#10B981',
        'lingo-accent-light': '#6EE7B7',
        'lingo-accent-dark': '#059669',
        
        'lingo-bg': '#0F0A1E',
        'lingo-surface': '#1E1735',
        'lingo-surface-elevated': '#2A2145',
        'lingo-text': '#F8FAFF',
        'lingo-text-secondary': '#A0A3BD',
        'lingo-border': '#2E2750',

        // Game Modes
        'lingo-confusion': '#EC4899',
        'lingo-practice': '#14B8A6',
        'lingo-daily': '#F59E0B',
        'lingo-journey': '#6366F1',

        // Gamification
        'lingo-gold': '#FFD700',
        'lingo-diamond': '#B9F2FF',
        'lingo-energy': '#FF6B9D',
        'lingo-xp': '#7C3AED',
      }
    },
  },
  plugins: [],
}
export default config
