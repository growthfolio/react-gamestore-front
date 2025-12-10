/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Typography Scale (Minor Third 1.25)
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        'xl': ['1.563rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }],
        '2xl': ['1.953rem', { lineHeight: '1.3', letterSpacing: '-0.05em' }],
        '3xl': ['2.441rem', { lineHeight: '1.2', letterSpacing: '-0.05em' }],
        '4xl': ['3.052rem', { lineHeight: '1.1', letterSpacing: '-0.075em' }],
        '5xl': ['3.815rem', { lineHeight: '1', letterSpacing: '-0.075em' }]
      },
      
      colors: {
        // 🎮 CYBER GAMING PREMIUM PALETTE
        
        // Primary - Electric Blue (Futurista)
        primary: {
          50: '#E6F3FF',
          100: '#CCE7FF', 
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#0087FF', // Main brand
          600: '#006BCC',
          700: '#004F99',
          800: '#003366',
          900: '#001733'
        },
        
        // Secondary - Cyber Purple (Premium)
        secondary: {
          50: '#F3E6FF',
          100: '#E7CCFF',
          200: '#CF99FF', 
          300: '#B766FF',
          400: '#9F33FF',
          500: '#8700FF', // Premium accent
          600: '#6B00CC',
          700: '#4F0099',
          800: '#330066',
          900: '#170033'
        },
        
        // Accent - Neon Green (Gaming)
        accent: {
          50: '#E6FFED',
          100: '#CCFFDB',
          200: '#99FFB7',
          300: '#66FF93', 
          400: '#33FF6F',
          500: '#00FF4B', // Gaming highlight
          600: '#00CC3C',
          700: '#00992D',
          800: '#00661E',
          900: '#00330F'
        },
        
        // Neutrals - Dark Gaming Theme
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1A1A1A', // Custom gaming dark
          900: '#171717',
          950: '#0A0A0A'
        },
        
        // Feedback Colors
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D'
        },
        
        warning: {
          50: '#FFFBEB', 
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309'
        },
        
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626', 
          700: '#B91C1C'
        },
        
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8'
        },
        
        // Gaming Specific
        gaming: {
          neon: '#00FF4B',
          cyber: '#0087FF', 
          purple: '#8700FF',
          dark: '#0A0A0A',
          glow: '#00FFFF'
        }
      },
      
      // Gradients
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0087FF 0%, #8700FF 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00FF4B 0%, #00FFFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #171717 0%, #0A0A0A 100%)',
        'gradient-card': 'linear-gradient(145deg, #1A1A1A 0%, #262626 100%)'
      },
      
      // Box Shadows (Glow Effects)
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 135, 255, 0.3)',
        'glow-md': '0 0 20px rgba(0, 135, 255, 0.4)', 
        'glow-lg': '0 0 30px rgba(0, 135, 255, 0.5)',
        'glow-neon': '0 0 20px rgba(0, 255, 75, 0.6)',
        'glow-purple': '0 0 25px rgba(135, 0, 255, 0.5)',
        'card-gaming': '0 8px 32px rgba(0, 0, 0, 0.4)'
      },
      
      // Border Radius
      borderRadius: {
        'gaming': '12px',
        'card': '16px',
        'button': '8px'
      },
      
      // Typography
      fontFamily: {
        'gaming': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'accent': ['Orbitron', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      
      // Text Shadows (Glow Effects)
      textShadow: {
        'glow-sm': '0 0 4px currentColor',
        'glow-md': '0 0 8px currentColor', 
        'glow-lg': '0 0 16px currentColor',
        'glow-neon': '0 0 12px #00FF4B',
        'glow-cyber': '0 0 10px #0087FF',
        'glow-purple': '0 0 14px #8700FF'
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow-sm': {
          textShadow: '0 0 4px currentColor',
        },
        '.text-shadow-glow-md': {
          textShadow: '0 0 8px currentColor',
        },
        '.text-shadow-glow-lg': {
          textShadow: '0 0 16px currentColor',
        },
        '.animate-fade-in': {
          animation: 'fadeIn 1s ease-in-out',
        },
        '@keyframes fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
      addUtilities(newUtilities)
    }
  ],
}