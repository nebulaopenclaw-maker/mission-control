export const dynamic = 'force-dynamic';
import { EcosystemDetail } from '@/components/ecosystem-view';

export default function EcosystemSlugPage({ params }: { params: { slug: string } }) {
  return <EcosystemDetail slug={params.slug} />;
}
