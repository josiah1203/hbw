import { useCallback, useEffect, useState } from "react";
import {
  fetchMarketplaceListings,
  installMarketplaceListing,
  isMarketplaceConfigured,
  type MarketplaceListing,
} from "@/api/marketplaceClient";
import { PageHeader } from "@/components/layout/PageHeader";

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
      <PageHeader
        title="Workflow Marketplace"
        description="Community checks — list, publish, install"
        meta={
          <>
            {isMarketplaceConfigured()
              ? "Live API"
              : "Mock — set VITE_HBP_API_URL + token"}
            {message && ` · ${message}`}
          </>
        }
      />

      <div className="st-panel">
        <div className="st-panel-toolbar">
          <div className="st-panel-toolbar-start">
            <span className="material-symbols-outlined st-icon-sm" aria-hidden="true">
              storefront
            </span>
            <span className="st-panel-title">Listings</span>
            <span className="st-divider-v" />
            <label htmlFor="marketplace-domain">Domain</label>
            <select
              id="marketplace-domain"
              className="st-select"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="">All domains</option>
              <option value="bim">bim</option>
              <option value="structural">structural</option>
              <option value="energy_building">energy_building</option>
              <option value="layout">layout</option>
            </select>
          </div>
          <div className="st-panel-toolbar-end">
            <button type="button" className="st-btn st-btn--secondary" onClick={refresh} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>
        <div className="st-panel-body st-panel-body--flush">
          {loading ? (
            <p className="hb-empty">Loading listings…</p>
          ) : (
            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Check ID</th>
                    <th>Domain</th>
                    <th>Installs</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.listing_id}>
                      <td>
                        <strong>{listing.name}</strong>
                      </td>
                      <td>
                        <span className="st-table-desc">{listing.description}</span>
                      </td>
                      <td>
                        <code className="st-table-mono">{listing.check_id}</code>
                      </td>
                      <td>
                        <span className="st-badge st-badge--tertiary">{listing.domain}</span>
                      </td>
                      <td>{listing.install_count}</td>
                      <td>
                        <button
                          type="button"
                          className="st-btn st-btn--primary"
                          disabled={installingId === listing.listing_id}
                          onClick={() => void handleInstall(listing.listing_id)}
                        >
                          {installingId === listing.listing_id ? "Installing…" : "Install"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
