
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
					foreground: 'hsl(var(--primary-foreground))'
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
				// Financial colors
				profit: {
					DEFAULT: 'hsl(var(--profit-green))',
				},
				loss: {
					DEFAULT: 'hsl(var(--loss-red))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning-yellow))',
				},
				'data-cyan': {
					DEFAULT: 'hsl(var(--data-cyan))',
				},
				'tech-purple': {
					DEFAULT: 'hsl(var(--tech-purple))',
				},
				// Bitcoin colors
				bitcoin: {
					DEFAULT: 'hsl(var(--bitcoin-orange))',
					dark: 'hsl(var(--bitcoin-dark))'
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
