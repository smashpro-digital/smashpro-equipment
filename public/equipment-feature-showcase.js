const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
const nonempty = (value, limit) => typeof value === "string" && value.trim().length > 0 && value.length <= limit;
const safeId = value => typeof value === "string" && /^[a-z][a-z0-9-]{0,63}$/.test(value);

export function receivedEquipmentFeature(payload, feed, serverDate, started, now = Date.now()) {
  const serverNow = serverDate ? Date.parse(serverDate) : now;
  if (!record(payload) || !record(feed) || !Number.isFinite(serverNow) || started > now) return null;
  if (payload.ok !== true || payload.schema_version !== 1 || payload.property !== "hq" || payload.placement !== feed.placement) return null;
  const generated = typeof payload.generated_at === "string" ? Date.parse(payload.generated_at) : NaN;
  if (!Number.isFinite(generated) || generated > serverNow + 5000 || serverNow - generated >= 60000) return null;
  if (!Array.isArray(payload.items) || payload.items.length !== 1) return null;
  const partner = payload.items[0];
  if (!record(partner) || partner.classification !== "Affiliate relationship" || !Array.isArray(partner.products) || partner.products.length !== 1) return null;
  const product = partner.products[0];
  if (!record(product) || product.name !== feed.product || product.stage !== "Exploring" || !nonempty(product.description, 1200) || !Array.isArray(product.links) || product.links.length !== 1) return null;
  const link = product.links[0];
  if (!record(link) || link.property !== "hq" || link.placement !== feed.placement || link.advertiser_id !== feed.advertiserId || link.publisher_id !== feed.publisherId || !Number.isSafeInteger(link.campaign_id) || link.campaign_id <= 0 || !nonempty(link.disclosure, 1000) || !nonempty(link.url, 2000)) return null;
  const validUntil = typeof link.valid_until === "string" ? Date.parse(link.valid_until) : NaN;
  if (!Number.isFinite(validUntil) || validUntil <= serverNow || validUntil > generated + 60000) return null;
  try {
    const url = new URL(link.url);
    if (url.protocol !== "https:" || url.hostname !== "www.awin1.com" || url.pathname !== "/cread.php" || url.username || url.password || url.port || url.hash || /[\s\\]/.test(link.url)) return null;
    const keys = [...url.searchParams.keys()];
    if (new Set(keys).size !== keys.length || url.searchParams.get("awinmid") !== feed.advertiserId || url.searchParams.get("awinaffid") !== feed.publisherId || url.searchParams.has("v") || url.searchParams.has("r") || url.searchParams.get("ued") !== feed.destination) return null;
  } catch {
    return null;
  }
  const remaining = validUntil - serverNow - (now - started);
  if (remaining <= 0 || remaining > 60000) return null;
  const image = product.image;
  const validImage = record(image)
    && Number.isSafeInteger(image.id)
    && image.id > 0
    && image.creative_id === feed.creativeId
    && image.url === feed.imageUrl
    && image.width === feed.imageWidth
    && image.height === feed.imageHeight
    && nonempty(image.alt, 300);
  return {
    url: link.url,
    disclosure: link.disclosure,
    validUntil: now + remaining,
    image: validImage ? { src: image.url, alt: image.alt, width: image.width, height: image.height } : null,
  };
}

function isSafeAction(action, feedAction) {
  if (!record(action) || !nonempty(action.label, 120) || !["primary", "secondary", "outline"].includes(action.variant)) return false;
  if (feedAction) return action.href === "" && action.external === true && action.sponsored === true;
  if (typeof action.href !== "string" || !action.href || /[\s\\]/.test(action.href)) return false;
  if (action.external) {
    try {
      const url = new URL(action.href);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }
  try {
    const url = new URL(action.href, window.location.href);
    return url.origin === window.location.origin && !url.username && !url.password;
  } catch {
    return false;
  }
}

class EquipmentFeatureShowcaseElement extends HTMLElement {
  constructor() {
    super();
    this.config = null;
    this.activeFeed = null;
    this.controller = null;
    this.interval = 0;
    this.expiryTimer = 0;
    this.started = false;
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  connectedCallback() {
    this.activeFeed = null;
    this.controller = null;
    this.replaceChildren();
    this.config = this.readConfig();
    if (!this.config) return;
    this.started = true;
    if (!this.config.feed) {
      if (!this.config.requireFeed) this.render();
      return;
    }
    if (!this.config.requireFeed) this.render();
    void this.refresh();
    this.interval = window.setInterval(() => {
      if (!document.hidden) void this.refresh();
    }, 15000);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  disconnectedCallback() {
    this.started = false;
    this.controller?.abort();
    window.clearInterval(this.interval);
    window.clearTimeout(this.expiryTimer);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  readConfig() {
    try {
      const value = JSON.parse(this.getAttribute("data-config") || "");
      if (!record(value) || !nonempty(value.manufacturer, 100) || !nonempty(value.model, 100) || !nonempty(value.status, 100) || !nonempty(value.headline, 200) || !nonempty(value.description, 2000)) return null;
      if (!record(value.image) || !nonempty(value.image.src, 2000) || !nonempty(value.image.alt, 500)) return null;
      if (value.layout !== undefined && !["image-left", "image-right"].includes(value.layout)) return null;
      if (value.theme !== undefined && !["green", "purple"].includes(value.theme)) return null;
      if (value.features !== undefined && (!Array.isArray(value.features) || value.features.length > 12 || !value.features.every(item => nonempty(item, 200)))) return null;
      if (value.actions !== undefined && (!Array.isArray(value.actions) || value.actions.length > 6)) return null;
      const feedIndex = Number.isSafeInteger(value.feedActionIndex) ? value.feedActionIndex : -1;
      if (Array.isArray(value.actions) && !value.actions.every((item, index) => isSafeAction(item, index === feedIndex))) return null;
      if (feedIndex >= 0 && (!value.feed || !Array.isArray(value.actions) || feedIndex >= value.actions.length)) return null;
      if (value.feed !== undefined && (!record(value.feed) || !nonempty(value.feed.url, 2000) || !nonempty(value.feed.placement, 200) || !nonempty(value.feed.product, 200) || !nonempty(value.feed.advertiserId, 20) || !nonempty(value.feed.publisherId, 20) || !nonempty(value.feed.destination, 2000) || !nonempty(value.feed.creativeId, 30) || !nonempty(value.feed.imageUrl, 2000) || !Number.isSafeInteger(value.feed.imageWidth) || !Number.isSafeInteger(value.feed.imageHeight))) return null;
      if (value.id !== undefined && !safeId(value.id)) return null;
      return value;
    } catch {
      return null;
    }
  }

  onVisibilityChange() {
    const hadFeed = this.activeFeed !== null;
    this.activeFeed = null;
    window.clearTimeout(this.expiryTimer);
    this.controller?.abort();
    if (hadFeed || this.config.requireFeed) this.render();
    if (!document.hidden) void this.refresh();
  }

  async refresh() {
    this.controller?.abort();
    const controller = new AbortController();
    this.controller = controller;
    const started = Date.now();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    try {
      const feedUrl = new URL(this.config.feed.url, window.location.href);
      if (feedUrl.origin !== window.location.origin || feedUrl.pathname !== "/dashboard/api/public_gear.php") throw new Error("Invalid equipment feed URL");
      if (feedUrl.searchParams.get("property") !== "hq" || feedUrl.searchParams.get("placement") !== this.config.feed.placement || [...feedUrl.searchParams.keys()].length !== 2) throw new Error("Invalid equipment feed placement");
      const response = await fetch(feedUrl, { signal: controller.signal, credentials: "omit", cache: "no-store", redirect: "error", headers: { Accept: "application/json" } });
      if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error("Equipment feed unavailable");
      const next = receivedEquipmentFeature(await response.json(), this.config.feed, response.headers.get("date"), started);
      if (!this.started || this.controller !== controller) return;
      if (!next) throw new Error("Equipment feed response was not approved");
      const current = this.activeFeed;
      const unchanged = current
        && current.url === next.url
        && current.disclosure === next.disclosure
        && current.image?.src === next.image?.src
        && current.image?.alt === next.image?.alt;
      this.activeFeed = next;
      window.clearTimeout(this.expiryTimer);
      this.expiryTimer = window.setTimeout(() => {
        this.activeFeed = null;
        this.render();
      }, Math.max(0, next.validUntil - Date.now()));
      if (!unchanged) this.render();
    } catch {
      if (this.started && this.controller === controller) {
        const hadFeed = this.activeFeed !== null;
        this.activeFeed = null;
        window.clearTimeout(this.expiryTimer);
        if (hadFeed || this.config.requireFeed) this.render();
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }

  render() {
    const feed = this.activeFeed;
    if (this.config.requireFeed && !feed) {
      this.replaceChildren();
      this.removeAttribute("class");
      this.removeAttribute("id");
      this.removeAttribute("role");
      this.removeAttribute("aria-labelledby");
      return;
    }
    const focusedHref = this.contains(document.activeElement) && document.activeElement instanceof HTMLAnchorElement
      ? document.activeElement.getAttribute("href")
      : null;
    const config = this.config;
    const section = document.createElement("section");
    section.className = `equipment-feature-showcase__section equipment-feature-showcase--${config.theme || "green"}`;
    section.setAttribute("aria-labelledby", `${config.id || "equipment-feature"}-title`);
    const shell = document.createElement("div");
    shell.className = "equipment-feature-showcase__shell";
    if (config.eyebrow) {
      const eyebrow = document.createElement("p");
      eyebrow.className = "equipment-feature-showcase__eyebrow";
      eyebrow.textContent = config.eyebrow;
      shell.append(eyebrow);
    }
    const card = document.createElement("article");
    const imageData = feed?.image || (config.requireFeed ? null : config.image);
    card.className = `equipment-feature-showcase__card equipment-feature-showcase__card--${config.layout || "image-left"}${imageData ? "" : " equipment-feature-showcase__card--no-image"}`;
    if (imageData) {
      const visual = document.createElement("figure");
      visual.className = "equipment-feature-showcase__visual";
      const image = document.createElement("img");
      image.src = imageData.src;
      image.alt = imageData.alt;
      image.width = imageData.width || config.image.width || 2160;
      image.height = imageData.height || config.image.height || 2700;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        if (!visual.isConnected) return;
        const fallback = document.createElement("div");
        fallback.className = "equipment-feature-showcase__image-fallback";
        fallback.setAttribute("role", "img");
        fallback.setAttribute("aria-label", "Product image unavailable");
        fallback.textContent = "Product image unavailable";
        image.remove();
        visual.prepend(fallback);
      }, { once: true });
      visual.append(image);
      if (config.image.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = config.image.caption;
        visual.append(caption);
      }
      card.append(visual);
    }
    const story = document.createElement("div");
    story.className = "equipment-feature-showcase__story";
    const identity = document.createElement("div");
    identity.className = "equipment-feature-showcase__identity";
    const product = document.createElement("span");
    product.textContent = `${config.manufacturer} ${config.model}`;
    const status = document.createElement("span");
    status.className = "equipment-feature-showcase__status-badge";
    status.setAttribute("role", "status");
    status.setAttribute("aria-label", `Status: ${config.status}`);
    status.textContent = config.status;
    identity.append(product, status);
    const heading = document.createElement("h2");
    heading.id = `${config.id || "equipment-feature"}-title`;
    heading.textContent = config.headline;
    const description = document.createElement("p");
    description.className = "equipment-feature-showcase__description";
    description.textContent = config.description;
    story.append(identity, heading, description);
    if (config.features?.length) {
      const features = document.createElement("ul");
      features.className = "equipment-feature-showcase__features";
      features.setAttribute("aria-label", "Equipment showcase features");
      for (const item of config.features) {
        const feature = document.createElement("li");
        feature.textContent = item;
        features.append(feature);
      }
      story.append(features);
    }
    if (config.actions?.length) {
      const actions = document.createElement("div");
      actions.className = "equipment-feature-showcase__actions";
      config.actions.forEach((action, index) => {
        const href = index === config.feedActionIndex ? feed?.url : action.href;
        if (!href) return;
        const link = document.createElement("a");
        link.className = `equipment-feature-showcase__button equipment-feature-showcase__button--${action.variant}`;
        link.href = href;
        link.textContent = action.label;
        if (action.external) {
          link.target = "_blank";
          link.rel = action.sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer";
        }
        if (index === config.feedActionIndex) {
          link.addEventListener("click", event => {
            if (!this.activeFeed || Date.now() >= this.activeFeed.validUntil) {
              event.preventDefault();
              this.activeFeed = null;
              this.render();
            }
          });
        }
        actions.append(link);
      });
      story.append(actions);
    }
    if (config.disclosure || feed?.disclosure) {
      const disclosure = document.createElement("p");
      disclosure.className = "equipment-feature-showcase__disclosure";
      disclosure.textContent = [config.disclosure, feed?.disclosure].filter(Boolean).join(" ");
      story.append(disclosure);
    }
    if (config.statusDetail) {
      const detail = document.createElement("p");
      detail.className = "equipment-feature-showcase__status-detail";
      detail.textContent = config.statusDetail;
      story.append(detail);
    }
    card.append(story);
    shell.append(card);
    section.append(shell);
    if (config.id) this.id = config.id;
    this.setAttribute("role", "region");
    this.setAttribute("aria-labelledby", `${config.id || "equipment-feature"}-title`);
    this.className = "equipment-feature-showcase";
    this.replaceChildren(section);
    if (focusedHref) {
      [...this.querySelectorAll("a")].find(link => link.getAttribute("href") === focusedHref)?.focus({ preventScroll: true });
    }
  }
}

if (!customElements.get("equipment-feature-showcase")) {
  customElements.define("equipment-feature-showcase", EquipmentFeatureShowcaseElement);
}
