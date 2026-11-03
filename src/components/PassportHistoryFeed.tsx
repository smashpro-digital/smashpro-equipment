import "./PassportHistoryFeed.css";

export type PassportHistoryItem = {
  id: string;
  date: string;
  title: string;
  summary: string;
  state: string;
  href?: string;
  linkLabel?: string;
};

type Props = {
  items: PassportHistoryItem[];
  onArchiveClick?: () => void;
};

/**
 * Public-only, presentation-only activity summary shared by legacy and
 * projected passport renderers. The source record remains authoritative.
 */
export function PassportHistoryFeed({ items, onArchiveClick }: Props) {
  if (!items.length) return null;

  return (
    <section className="passport-history-feed" aria-label="Recent equipment history">
      <div className="passport-history-feed__heading">
        <div>
          <p className="passport-history-feed__eyebrow">Fleet Activity</p>
          <h3>Recent History</h3>
        </div>
        <span>Latest verified or reported milestones</span>
      </div>
      <ol className="passport-history-feed__items">
        {items.map((item) => (
          <li className="passport-history-feed__item" key={item.id}>
            <time>{item.date}</time>
            <h4>{item.title}</h4>
            <span className="passport-history-feed__state">{item.state}</span>
            <p>{item.summary}</p>
            {item.href && (
              <a href={item.href}>
                {item.linkLabel ?? "View record"} <span aria-hidden="true">↗</span>
              </a>
            )}
          </li>
        ))}
      </ol>
      {onArchiveClick && (
        <button className="passport-history-feed__archive" type="button" onClick={onArchiveClick}>
          Browse complete history <span aria-hidden="true">↓</span>
        </button>
      )}
    </section>
  );
}
