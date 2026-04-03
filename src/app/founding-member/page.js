import FoundingMemberClient from './FoundingMemberClient';

export const metadata = {
  title: 'Founding Member Offer — SMC Journal',
  description: 'Join the exclusive 10-person founding member group for SMC Journal and secure lifetime access.',
  openGraph: {
    title: 'Founding Member Offer — SMC Journal',
    description: 'Own the edge for a lifetime. Only 10 spots remaining.',
    images: [{ url: '/founding-member-og.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founding Member Offer — SMC Journal',
    description: 'Own the edge for a lifetime. Only 10 spots remaining.',
    images: ['/founding-member-og.png'],
  },
};

export default function FoundingMemberPage() {
  return <FoundingMemberClient />;
}
