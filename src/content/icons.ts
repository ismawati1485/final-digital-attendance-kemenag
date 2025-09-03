
// Icon mapping untuk memudahkan manajemen icon
export const icons = {
  // Navigation
  back: 'ArrowLeft',
  home: 'Home',
  
  // Meeting Info
  calendar: 'Calendar',
  clock: 'Clock',
  location: 'MapPin',
  user: 'User',
  
  // Status
  success: 'CheckCircle',
  warning: 'AlertCircle',
  error: 'XCircle',
  
  // Actions
  edit: 'PenTool',
  delete: 'Trash2',
  search: 'Search',
  clear: 'X',
  
  // Form
  signature: 'PenTool',
  submit: 'CheckCircle',
  loading: 'Loader2'
} as const;

export type IconName = keyof typeof icons;
