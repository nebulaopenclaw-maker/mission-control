import { NextResponse } from 'next/server';
import { readTextFile, readJsonFile, workspacePath, listDirectory } from '@/lib/workspace';
import path from 'path';

const FALLBACK_PRODUCTS = [
  { slug: 'openclaw', name: 'OpenClaw', tagline: 'Autonomous AI agent platform', status: 'Active', healthScore: 95, metrics: { uptime: '99.9%', sessions: 142, tasks: 847 } },
  { slug: 'nebula-os', name: 'Nebula OS', tagline: 'Operating system for AI agents', status: 'Development', healthScore: 60, metrics: { version: '0.3.2', tests: '87%' } },
  { slug: 'tradegpt', name: 'TradeGPT', tagline: 'AI-powered trading signals', status: 'Concept', healthScore: 20, metrics: { stage: 'research' } },
];

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (slug === '_list') {
    // Return all products
    try {
      const data = await readJsonFile(
        workspacePath('memory', 'ecosystem', 'products.json'),
        { products: FALLBACK_PRODUCTS }
      ) as any;
      return NextResponse.json({ products: data.products ?? FALLBACK_PRODUCTS });
    } catch {
      return NextResponse.json({ products: FALLBACK_PRODUCTS });
    }
  }

  try {
    const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);

    // Read product-specific memory files
    const productDir = workspacePath('memory', slug);
    const files = listDirectory(productDir);

    const sections: Record<string, string> = {};
    for (const section of ['overview', 'brand', 'community', 'content', 'legal', 'product', 'website']) {
      const filePath = path.join(productDir, `${section}.md`);
      const content = await readTextFile(filePath);
      if (content) sections[section] = content;
    }

    return NextResponse.json({
      product: product ?? { slug, name: slug, status: 'Unknown' },
      sections,
      files,
    });
  } catch {
    return NextResponse.json({
      product: FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? { slug, name: slug, status: 'Unknown' },
      sections: {},
      files: [],
    });
  }
}
