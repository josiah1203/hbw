export interface MarketplaceListing {
  listing_id: string;
  check_id: string;
  name: string;
  author_org_id: string;
  description: string;
  domain: string;
  install_count: number;
  published_at: string;
}

const MOCK_LISTINGS: MarketplaceListing[] = [
  {
    listing_id: "community:ifc.validate",
    check_id: "ifc.validate",
    name: "IFC Schema Gate",
    author_org_id: "community",
    description: "Validate BIM/IFC domain on commit",
    domain: "bim",
    install_count: 42,
    published_at: "2026-06-01T00:00:00Z",
  },
  {
    listing_id: "community:structural.validate",
    check_id: "structural.validate",
    name: "Structural Consistency",
    author_org_id: "community",
    description: "Check structural members and loads",
    domain: "structural",
    install_count: 18,
    published_at: "2026-06-02T00:00:00Z",
  },
  {
    listing_id: "community:energy.model_consistency",
    check_id: "energy.model_consistency",
    name: "Energy Model QA",
    author_org_id: "community",
    description: "Thermal zone and HVAC system consistency",
    domain: "energy_building",
    install_count: 9,
    published_at: "2026-06-03T00:00:00Z",
  },
];

function isMarketplaceConfigured(): boolean {
  return Boolean(import.meta.env.VITE_HBP_API_URL && import.meta.env.VITE_HBP_ACCESS_TOKEN);
}

export async function fetchMarketplaceListings(domain?: string): Promise<MarketplaceListing[]> {
  if (!isMarketplaceConfigured()) {
    return domain
      ? MOCK_LISTINGS.filter((l) => l.domain === domain)
      : MOCK_LISTINGS;
  }
  const base = import.meta.env.VITE_HBP_API_URL as string;
  const token = import.meta.env.VITE_HBP_ACCESS_TOKEN as string;
  const qs = domain ? `?domain=${encodeURIComponent(domain)}` : "";
  const resp = await fetch(`${base}/v1/workflow/marketplace/listings${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Marketplace fetch failed: ${resp.status}`);
  const body = (await resp.json()) as { data: MarketplaceListing[] };
  return body.data.length > 0 ? body.data : MOCK_LISTINGS;
}

export async function installMarketplaceListing(listingId: string): Promise<void> {
  if (!isMarketplaceConfigured()) return;
  const base = import.meta.env.VITE_HBP_API_URL as string;
  const token = import.meta.env.VITE_HBP_ACCESS_TOKEN as string;
  const resp = await fetch(`${base}/v1/workflow/marketplace/install`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listing_id: listingId }),
  });
  if (!resp.ok) throw new Error(`Install failed: ${resp.status}`);
}

export { isMarketplaceConfigured, MOCK_LISTINGS };
