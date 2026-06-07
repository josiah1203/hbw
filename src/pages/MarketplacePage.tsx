import { useCallback, useEffect, useState } from "react";
import {
  fetchMarketplaceListings,
  installMarketplaceListing,
  isMarketplaceConfigured,
  type MarketplaceListing,
} from "@/api/marketplaceClient";

export function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [domainFilter, setDomainFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchMarketplaceListings(domainFilter || undefined)
      .then(setListings)
      .catch((err: unknown) =>
        setMessage(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, [domainFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleInstall = async (listingId: string) => {
    setInstallingId(listingId);
    try {
      await installMarketplaceListing(listingId);
      setMessage(`Installed ${listingId}`);
      refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setInstallingId(null);
    }
  };

  return (
    <>
      <header className="hb-header">
        <h2>Workflow Marketplace</h2>
        <p>
          Community checks — list, publish, install
          {isMarketplaceConfigured()
            ? " (live API)"
            : " (mock — set VITE_HBP_API_URL + token)"}
        </p>
        {message && <p className="hb-meta">{message}</p>}
      </header>
      <div className="hb-content">
        <div className="hb-select-row">
          <label htmlFor="marketplace-domain">Domain filter</label>
          <select
            id="marketplace-domain"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="">All domains</option>
            <option value="bim">bim</option>
            <option value="structural">structural</option>
            <option value="energy_building">energy_building</option>
            <option value="layout">layout</option>
          </select>
          <button type="button" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="hb-meta">Loading listings…</p>
        ) : (
          <div className="hb-card-grid">
            {listings.map((listing) => (
              <article key={listing.listing_id} className="hb-card hb-card-static">
                <h3>{listing.name}</h3>
                <p>{listing.description}</p>
                <p>
                  <code>{listing.check_id}</code> · {listing.domain} · {listing.install_count}{" "}
                  installs
                </p>
                <button
                  type="button"
                  className="hb-btn"
                  disabled={installingId === listing.listing_id}
                  onClick={() => void handleInstall(listing.listing_id)}
                >
                  {installingId === listing.listing_id ? "Installing…" : "Install"}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
