import FoundingMemberClient from './FoundingMemberClient';

export const metadata = {
  title: 'Exclusive Founding Member Pass — SMC Journal',
  description: 'Join the elite 10-person group of Founding Members for SMC Journal and secure a lifetime of edge.',
  metadataBase: new URL('https://smcjournal.app'),
  openGraph: {
    title: 'Exclusive Founding Member Pass — SMC Journal',
    description: 'Own the elite institutional edge for a lifetime. Only 10 spots exist.',
    images: [{ 
      url: '/smc-final-founding-pass.png',
      width: 1200,
      height: 630,
      alt: 'SMC Journal Founding Member Elite Pass'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exclusive Founding Member Pass — SMC Journal',
    description: 'Own the elite institutional edge for a lifetime. Only 10 spots exist.',
    images: ['https://smcjournal.app/smc-final-founding-pass.png'],
  },
};

export default function FoundingMemberPage() {
  return <FoundingMemberClient />;
}
