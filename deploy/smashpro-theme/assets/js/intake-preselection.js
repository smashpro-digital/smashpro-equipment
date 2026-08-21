(() => {
  'use strict';

  const root = document.querySelector('[data-sp-intake]');
  if (!root) return;

  const requested = String(root.dataset.preselectedService || '').trim();
  if (!requested) return;

  const serviceSelect = root.querySelector('[data-service-select]');
  const selection = root.querySelector('[data-service-selection]');
  const nextButton = root.querySelector('[data-step-next]');
  const stepTwo = root.querySelector('[data-intake-step="2"]');
  const stepTwoTitle = stepTwo?.querySelector('h2');
  const stepTwoHeader = stepTwo?.querySelector('header');

  if (!serviceSelect || !selection || !nextButton || !stepTwo || !stepTwoTitle || !stepTwoHeader) return;

  const defaultStepTwoTitle = stepTwoTitle.textContent || 'Property and contact';
  let contextCard = null;
  let advanced = false;
  let observer = null;

  const selectedLabel = () => {
    const option = serviceSelect.options?.[serviceSelect.selectedIndex];
    if (!option || !option.value) return '';
    return String(option.textContent || '').trim();
  };

  const ensureContextCard = () => {
    if (contextCard) return contextCard;

    contextCard = document.createElement('aside');
    contextCard.className = 'sp-intake-selection sp-intake-selection--context';
    contextCard.dataset.preselectedServiceContext = '';
    contextCard.setAttribute('aria-live', 'polite');

    const eyebrow = document.createElement('p');
    eyebrow.className = 'sp-eyebrow';
    eyebrow.textContent = 'Selected project service';

    const title = document.createElement('h3');
    title.dataset.preselectedServiceTitle = '';

    const facts = document.createElement('div');
    facts.className = 'sp-intake-selection__facts';
    facts.dataset.preselectedServiceFacts = '';

    const changeButton = document.createElement('button');
    changeButton.type = 'button';
    changeButton.className = 'sp-link-button';
    changeButton.textContent = 'Change service';
    changeButton.addEventListener('click', () => {
      root.dataset.preselectionAdvanced = 'manual';
      const firstStep = root.querySelector('[data-step-jump="1"]');
      if (firstStep && !firstStep.disabled) firstStep.click();
    });

    contextCard.append(eyebrow, title, facts, changeButton);
    stepTwoHeader.insertAdjacentElement('afterend', contextCard);
    return contextCard;
  };

  const renderContext = () => {
    const label = selectedLabel();
    const card = ensureContextCard();
    const title = card.querySelector('[data-preselected-service-title]');
    const facts = card.querySelector('[data-preselected-service-facts]');

    if (!label) {
      stepTwoTitle.textContent = defaultStepTwoTitle;
      card.hidden = true;
      return false;
    }

    stepTwoTitle.textContent = `Estimate for ${label}`;
    title.textContent = label;
    facts.replaceChildren();

    const sourceFacts = selection.querySelector('.sp-intake-selection__facts');
    if (sourceFacts) {
      [...sourceFacts.children].forEach((fact) => facts.append(fact.cloneNode(true)));
    }
    facts.hidden = facts.childElementCount === 0;
    card.hidden = false;
    return true;
  };

  const tryAdvance = () => {
    if (advanced || root.dataset.preselectionAdvanced) return;
    if (serviceSelect.value !== requested || nextButton.disabled || selection.hidden) return;
    if (!renderContext()) return;

    advanced = true;
    root.dataset.preselectionAdvanced = 'true';
    observer?.disconnect();
    nextButton.click();
  };

  const scheduleAdvance = () => {
    window.requestAnimationFrame(tryAdvance);
  };

  observer = new MutationObserver(scheduleAdvance);
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['disabled', 'hidden'],
  });

  serviceSelect.addEventListener('change', () => window.requestAnimationFrame(renderContext));
  window.addEventListener('pageshow', scheduleAdvance, { once: true });
  scheduleAdvance();

  window.setTimeout(() => observer?.disconnect(), 15000);
})();
