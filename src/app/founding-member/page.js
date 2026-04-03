import FoundingMemberClient from './FoundingMemberClient';

export const metadata = {
  title: 'Founding Member Offer — SMC Journal',
  description: 'Join the exclusive 10-person founding member group for SMC Journal and secure lifetime access.',
  openGraph: {
    title: 'Founding Member Offer — SMC Journal',
    description: 'Own the edge for a lifetime. Only 10 spots remaining.',
    images: [{ 
      url: 'https://smcjournal.app/founding-member-og.png',
      width: 1200,
      height: 630,
      alt: 'Founding Member Offer — SMC Journal'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founding Member Offer — SMC Journal',
    description: 'Own the edge for a lifetime. Only 10 spots remaining.',
    images: ['https://smcjournal.app/founding-member-og.png'],
  },
};

export default function FoundingMemberPage() {
  return <FoundingMemberClient />;
}
