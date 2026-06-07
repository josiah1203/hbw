import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function PageHeader({ title, description, actions, meta }: PageHeaderProps) {
  return (
    <div className="st-page-header">
      <div className="st-page-header-text">
        <h1 className="st-page-title">{title}</h1>
        {description && <p className="st-page-desc">{description}</p>}
        {meta && <div className="st-page-meta">{meta}</div>}
      </div>
      {actions && <div className="st-page-header-actions">{actions}</div>}
    </div>
  );
}
