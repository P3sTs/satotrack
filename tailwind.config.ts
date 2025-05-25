
import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
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
				mono: ['Courier New', 'monospace'],
			},
			colors: {
				border: '#404040',
				input: '#262626',
				ring: '#3b82f6',
				background: '#17171a',
				foreground: '#fafafa',
				primary: {
					DEFAULT: '#3b82f6',
					foreground: '#fafafa'
				},
				secondary: {
					DEFAULT: '#404040',
					foreground: '#fafafa'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#fafafa'
				},
				muted: {
					DEFAULT: '#262626',
					foreground: '#d9d9d9'
				},
				accent: {
					DEFAULT: '#a855f7',
					foreground: '#fafafa'
				},
				popover: {
					DEFAULT: '#1f1f23',
					foreground: '#fafafa'
				},
				card: {
					DEFAULT: '#1f1f23',
					foreground: '#fafafa'
				},
				sidebar: {
					DEFAULT: '#1f1f23',
					foreground: '#fafafa',
					primary: '#3b82f6',
					'primary-foreground': '#fafafa',
					accent: '#a855f7',
					'accent-foreground': '#fafafa',
					border: '#404040',
					ring: '#3b82f6'
				},
				// Financial colors
				profit: {
					DEFAULT: '#22c55e',
				},
				loss: {
					DEFAULT: '#ef4444',
				},
				warning: {
					DEFAULT: '#eab308',
				},
				'data-cyan': {
					DEFAULT: '#06b6d4',
				},
				'tech-purple': {
					DEFAULT: '#a855f7',
				},
				// Bitcoin colors
				bitcoin: {
					DEFAULT: '#F7931A',
					dark: '#D97C0B'
				},
				// Dashboard colors
				dashboard: {
					dark: '#17171a',
					medium: '#1f1f23',
					light: '#404040'
				},
				// SatoTrack specific colors
				satotrack: {
					primary: '#3b82f6',
					text: '#fafafa',
					secondary: '#cccccc',
					success: '#22c55e',
					alert: '#ef4444',
					warning: '#eab308',
					neon: '#22c55e'
				}
			},
			borderRadius: {
				lg: '1rem',
				md: 'calc(1rem - 2px)',
				sm: 'calc(1rem - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'glow': {
					'0%, 100%': {
						filter: 'drop-shadow(0 0 2px #3b82f6)'
					},
					'50%': {
						filter: 'drop-shadow(0 0 6px #3b82f6)'
					}
				},
				'scan-line': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-up': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'terminal-typing': {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				},
				'terminal-cursor': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite',
				'glow': 'glow 3s infinite',
				'scan-line': 'scan-line 2s linear infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-up': 'scale-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'terminal-typing': 'terminal-typing 3.5s steps(40, end)',
				'terminal-cursor': 'terminal-cursor 0.7s step-end infinite'
			},
			boxShadow: {
				'primary-glow': '0 0 10px rgba(59, 130, 246, 0.5)',
				'primary-lg': '0 0 15px rgba(59, 130, 246, 0.7)',
				'profit-glow': '0 0 10px rgba(34, 197, 94, 0.5)',
				'loss-glow': '0 0 10px rgba(239, 68, 68, 0.5)',
				'tech-glow': '0 0 15px rgba(168, 85, 247, 0.7)',
				'data-glow': '0 0 15px rgba(6, 182, 212, 0.7)',
				'neon-lg': '0 0 20px rgba(34, 197, 94, 0.8)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
