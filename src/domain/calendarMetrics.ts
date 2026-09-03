const MS_PER_DAY = 86_400_000;

export function calendarDaysSince(dateOnly: string, now = new Date()) {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const start = Date.UTC(year, month - 1, day);
  const current = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((current - start) / MS_PER_DAY));
}

export function installJourneyCalendarMetricCorrection() {
  if (typeof document === "undefined") return () => undefined;

  let correcting = false;
  const apply = () => {
    if (correcting) return;
    const article = Array.from(document.querySelectorAll<HTMLElement>(".ardhi-status-grid article")).find(
      (node) => node.querySelector(":scope > span")?.textContent?.trim() === "Days Since Production",
    );
    const valueNode = article?.querySelector<HTMLElement>("strong span");
    if (!valueNode) return;

    const expected = String(calendarDaysSince("2026-08-18"));
    if (valueNode.textContent?.trim() === expected) return;

    correcting = true;
    valueNode.textContent = expected;
    correcting = false;
  };

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  const timer = window.setInterval(apply, 60_000);
  queueMicrotask(apply);

  return () => {
    observer.disconnect();
    window.clearInterval(timer);
  };
}
