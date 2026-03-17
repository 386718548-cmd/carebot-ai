import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        medical: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        accent: {
          50: "#fdf4ff",
          500: "#d946ef",
          600: "#c026d3",
        },
        // Canva模板色系 - Playful Laboratory & Medicine
        canva: {
          mint: '#c9f4b7',      // 薄荷绿 - 健康/生长
          pink: '#fa92b4',      // 樱花粉 - 温暖/关怀
          yellow: '#fad65a',    // 柔和黄 - 希望/阳光
          dark: '#1a1b19',      // 深灰 - 文字/背景
          light: '#fcfcfa',     // 淡米白 - 主背景
        },
        // 叶片绿色系
        leaf: {
          50: "#F4FAF1",
          100: "#E1F0D9",
          200: "#C8E6C0",
          300: "#A8DBA8",
          400: "#7CC88F",
        },
        // 光点金色系
        glow: {
          50: "#FFFBF0",
          100: "#FFF4E0",
          200: "#FFE8CC",
          300: "#FDD8A8",
        },
        // 医疗可靠性灰色（增加信任感）
        'medical-neutral': {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        'card': '1.5rem',  // 卡片统一圆角
        'btn': '0.875rem', // 按钮圆角
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
