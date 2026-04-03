import FoundingMemberClient from './FoundingMemberClient';

export const metadata = {
  title: 'Founding Member — SMC Journal',
  description: 'Join the exclusive group of only 10 Founding Members for SMC Journal and secure a lifetime of edge.',
  metadataBase: new URL('https://smcjournal.app'),
  openGraph: {
    title: 'Founding Member Pass — SMC Journal',
    description: 'Own the elite institutional edge for a lifetime. Only 10 spots exist.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founding Member Pass — SMC Journal',
    description: 'Own the elite institutional edge for a lifetime. Only 10 spots exist.',
  },
};

export default function FoundingMemberPage() {
  return <FoundingMemberClient />;
}
