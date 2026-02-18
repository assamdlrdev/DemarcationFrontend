const Constants: any = {
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173/', // Fallback for local development
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Demarcation', // Fallback for local development
  COVER: import.meta.env.VITE_COVER || 'cover.jpg', // Fallback for local development
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/', // Fallback for local development
  API_BASE_URL_ASSET: import.meta.env.VITE_API_BASE_URL_ASSET || 'http://127.0.0.1:8000/', // Fallback for local development
  API_SECRET: import.meta.env.VITE_API_SECRET || 'DEMARCATION12345678', // Fallback for local development
  SERVICE_PERCENTAGE: import.meta.env.VITE_SERVICE_PERCENTAGE ? parseFloat(import.meta.env.VITE_SERVICE_PERCENTAGE) : 5, // Default 5% if not set
  SINGLESIGN_URL: import.meta.env.VITE_SINGLESIGN_URL || 'http://localhost/singlesignResurvey/', // Fallback for local development
};

export default Constants;
