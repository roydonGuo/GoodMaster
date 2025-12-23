export type Theme = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
};

export const createTheme = (isDarkMode: boolean): Theme => ({
  bg: isDarkMode ? '#0b0b0f' : '#f6f7fb',
  card: isDarkMode ? '#16161d' : '#ffffff',
  text: isDarkMode ? '#f4f4f5' : '#111827',
  muted: isDarkMode ? '#9ca3af' : '#6b7280',
  accent: '#4f46e5',
});

