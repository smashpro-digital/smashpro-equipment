interface AttachmentSpecField {
  label: string;
  value?: string | number | null;
}

/** Omit unassigned fields in markup; populated data automatically restores the card. */
export function AttachmentSpecGrid({ fields }: { fields: AttachmentSpecField[] }) {
  const assigned = fields.filter(field => typeof field.value === "number" || (typeof field.value === "string" && field.value.trim().length > 0));
  if (!assigned.length) return null;
  return <dl className="spec-grid">{assigned.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>;
}
