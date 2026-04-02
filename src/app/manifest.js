export default function manifest() {
  return {
    name: 'SMC Journal',
    short_name: 'SMC Journal',
    description: 'Track your trades, identify mistakes, and improve your execution with SMC Journal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
