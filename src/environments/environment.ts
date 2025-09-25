export const environment = {
  production: false,
  // Para obter uma API key gratuita do TMDB:
  // 1. Acesse: https://www.themoviedb.org/settings/api
  // 2. Crie uma conta gratuita
  // 3. Gere uma API key
  // 4. Substitua 'your_tmdb_api_key_here' pela sua API key
  apiKey: (globalThis as any).NG_APP_API_KEY || '58aa17f6ae2714d299ac999471b13c2f'
};
