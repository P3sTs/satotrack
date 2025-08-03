
import type { Config } from "tailwindcss";

export default {
	darkMode: 'class',
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
				urbanist: ['Urbanist', 'sans-serif'],
				outfit: ['Outfit', 'sans-serif'],
				mono: ['Courier New', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'hsl(var(--primary-50))',
					100: 'hsl(var(--primary-100))',
					500: 'hsl(var(--primary-500))',
					600: 'hsl(var(--primary-600))',
					700: 'hsl(var(--primary-700))',
					800: 'hsl(var(--primary-800))',
					900: 'hsl(var(--primary-900))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced color palette for modern UI
				gradient: {
					start: 'hsl(var(--gradient-start))',
					middle: 'hsl(var(--gradient-middle))',
					end: 'hsl(var(--gradient-end))'
				},
				neon: {
					blue: 'hsl(var(--neon-blue))',
					purple: 'hsl(var(--neon-purple))',
					pink: 'hsl(var(--neon-pink))',
					green: 'hsl(var(--neon-green))',
					cyan: 'hsl(var(--neon-cyan))'
				},
				// Financial colors
				profit: {
					DEFAULT: 'hsl(var(--profit-green))',
					50: 'hsl(var(--profit-50))',
					500: 'hsl(var(--profit-500))',
					600: 'hsl(var(--profit-600))'
				},
				loss: {
					DEFAULT: 'hsl(var(--loss-red))',
					50: 'hsl(var(--loss-50))',
					500: 'hsl(var(--loss-500))',
					600: 'hsl(var(--loss-600))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning-yellow))',
					50: 'hsl(var(--warning-50))',
					500: 'hsl(var(--warning-500))',
					600: 'hsl(var(--warning-600))'
				},
				'data-cyan': {
					DEFAULT: 'hsl(var(--data-cyan))',
					50: 'hsl(var(--data-cyan-50))',
					500: 'hsl(var(--data-cyan-500))',
					600: 'hsl(var(--data-cyan-600))'
				},
				'tech-purple': {
					DEFAULT: 'hsl(var(--tech-purple))',
					50: 'hsl(var(--tech-purple-50))',
					500: 'hsl(var(--tech-purple-500))',
					600: 'hsl(var(--tech-purple-600))'
				},
				// Bitcoin colors
				bitcoin: {
					DEFAULT: 'hsl(var(--bitcoin-orange))',
					dark: 'hsl(var(--bitcoin-dark))',
					50: 'hsl(var(--bitcoin-50))',
					500: 'hsl(var(--bitcoin-500))',
					600: 'hsl(var(--bitcoin-600))'
				},
				// Dashboard colors
				dashboard: {
					dark: 'hsl(var(--dashboard-dark))',
					medium: 'hsl(var(--dashboard-medium))',
					light: 'hsl(var(--dashboard-light))'
				},
				// SatoTrack specific colors
				satotrack: {
					primary: 'hsl(var(--satotrack-primary))',
					text: 'hsl(var(--satotrack-text))',
					secondary: 'hsl(var(--satotrack-secondary))',
					success: 'hsl(var(--satotrack-success))',
					alert: 'hsl(var(--satotrack-alert))',
					warning: 'hsl(var(--satotrack-warning))',
					neon: 'hsl(var(--satotrack-neon))'
				}
			},
			borderRadius: {
				lg: '1rem',
				md: 'calc(1rem - 2px)',
				sm: 'calc(1rem - 4px)',
				xl: '1.5rem',
				'2xl': '2rem',
				'3xl': '3rem'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				// Enhanced animations
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(-20px)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-100px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(100px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-down': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(0, 255, 198, 0.4)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(0, 255, 198, 0.8)',
						transform: 'scale(1.02)'
					}
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'skeleton-loading': {
					'0%': { opacity: '0.6' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.6' }
				},
				'card-hover': {
					'0%': { transform: 'translateY(0) scale(1)' },
					'100%': { transform: 'translateY(-8px) scale(1.02)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				// Enhanced animations
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-out': 'fade-out 0.3s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
				'scale-up': 'scale-up 0.3s ease-out forwards',
				'scale-down': 'scale-down 0.2s ease-out forwards',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'float': 'float 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 1.5s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
				'skeleton-loading': 'skeleton-loading 1.5s ease-in-out infinite',
				'card-hover': 'card-hover 0.3s ease-out forwards',
				// Staggered animations
				'fade-in-delay-100': 'fade-in 0.5s ease-out 0.1s forwards',
				'fade-in-delay-200': 'fade-in 0.5s ease-out 0.2s forwards',
				'fade-in-delay-300': 'fade-in 0.5s ease-out 0.3s forwards',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-premium': 'linear-gradient(135deg, var(--tw-gradient-stops))',
				'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)'
			},
			boxShadow: {
				'glow': '0 0 20px rgba(0, 255, 198, 0.4)',
				'glow-lg': '0 0 40px rgba(0, 255, 198, 0.6)',
				'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
				'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
				'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
				'premium': '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 60px rgba(0, 255, 198, 0.1)',
				'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 255, 198, 0.2)',
				'inner-glow': 'inset 0 0 20px rgba(0, 255, 198, 0.1)'
			},
			backdropBlur: {
				xs: '2px',
			},
			screens: {
				'xs': '475px',
				'3xl': '1920px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
