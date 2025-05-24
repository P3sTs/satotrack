
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
					DEFAULT: 'hsl(var(--sidebar-background, var(--card)))',
					foreground: 'hsl(var(--sidebar-foreground, var(--card-foreground)))',
					primary: 'hsl(var(--sidebar-primary, var(--primary)))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground, var(--primary-foreground)))',
					accent: 'hsl(var(--sidebar-accent, var(--accent)))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground, var(--accent-foreground)))',
					border: 'hsl(var(--sidebar-border, var(--border)))',
					ring: 'hsl(var(--sidebar-ring, var(--ring)))'
				},
				// Financial colors
				profit: {
					DEFAULT: 'hsl(var(--profit-green))', // #00C853
				},
				loss: {
					DEFAULT: 'hsl(var(--loss-red))', // #D50000
				},
				warning: {
					DEFAULT: 'hsl(var(--warning-yellow))', // #FFD600
				},
				'data-cyan': {
					DEFAULT: 'hsl(var(--data-cyan))', // #00B8D4
				},
				'tech-purple': {
					DEFAULT: 'hsl(var(--tech-purple))', // #7C4DFF
				},
				// Bitcoin colors
				bitcoin: {
					DEFAULT: '#F7931A',
					dark: '#D97C0B'
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
					warning: 'hsl(var(--satotrack-warning))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
						filter: 'drop-shadow(0 0 2px hsl(var(--primary)))'
					},
					'50%': {
						filter: 'drop-shadow(0 0 6px hsl(var(--primary)))'
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
				'primary-glow': '0 0 10px hsl(var(--primary) / 0.5)',
				'primary-lg': '0 0 15px hsl(var(--primary) / 0.7)',
				'profit-glow': '0 0 10px hsl(var(--profit-green) / 0.5)',
				'loss-glow': '0 0 10px hsl(var(--loss-red) / 0.5)',
				'tech-glow': '0 0 15px hsl(var(--tech-purple) / 0.7)',
				'data-glow': '0 0 15px hsl(var(--data-cyan) / 0.7)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
