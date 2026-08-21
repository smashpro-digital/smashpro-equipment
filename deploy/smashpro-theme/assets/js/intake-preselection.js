(() => {
  'use strict';

  const root = document.querySelector('[data-sp-intake]');
  if (!root) return;

  const server = window.smashproIntakePreselection || {};
  const requested = String(root.dataset.preselectedService || server.serviceSlug || '').trim();
  if (!requested) return;

  const serviceSelect = root.querySelector('[data-service-select]');
  const selection = root.querySelector('[data-service-selection]');
  const nextButton = root.querySelector('[data-step-next]');
  const backButton = root.querySelector('[data-step-back]');
  const submitButton = root.querySelector('[data-intake-submit]');
  const stepOne = root.querySelector('[data-intake-step="1"]');
  const stepTwo = root.querySelector('[data-intake-step="2"]');
  const stepTwoTitle = stepTwo?.querySelector('h2');
  const stepTwoHeader = stepTwo?.querySelector('header');
  const catalogStatus = root.querySelector('[data-catalog-status]');
  const progressButtons = [...root.querySelectorAll('[data-step-jump]')];

  if (!serviceSelect || !selection || !nextButton || !backButton || !submitButton || !stepOne || !stepTwo || !stepTwoTitle || !stepTwoHeader) return;

  const defaultStepTwoTitle = stepTwoTitle.textContent || 'Property and contact';
  const serverLabel = String(server.serviceLabel || '').trim();
  const serverFacts = Array.isArray(server.facts) ? server.facts.map((fact) => String(fact || '').trim()).filter(Boolean) : [];
  const canPreview = String(server.serviceSlug || '') === requested && Boolean(serverLabel);
  let contextCard = stepTwo.querySelector('[data-preselected-service-context]');
  let advanced = false;
  let previewing = false;
  let observer = null;

  const setProgressStep = (step) => {
    progressButtons.forEach((button) => {
      const number = Number(button.dataset.stepJump || 0);
      if (number === step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.disabled = number > step;
    });
  };

  const selectedLabel = () => {
    const option = serviceSelect.options?.[serviceSelect.selectedIndex];
    if (!option || !option.value) return '';
    return String(option.textContent || '').trim();
  };

  const changeService = () => {
    root.dataset.preselectionAdvanced = 'manual';
    advanced = true;
    observer?.disconnect();

    if (root.dataset.preselectionSynced === 'true') {
      const firstStep = root.querySelector('[data-step-jump="1"]');
      if (firstStep && !firstStep.disabled) firstStep.click();
      return;
    }

    previewing = false;
    stepOne.hidden = false;
    stepTwo.hidden = true;
    stepTwoTitle.textContent = defaultStepTwoTitle;
    if (contextCard) contextCard.hidden = true;
    backButton.hidden = true;
    nextButton.hidden = false;
    submitButton.hidden = true;
    setProgressStep(1);
    root.dataset.preselectionPreview = 'cancelled';
  };

  const wireChangeButton = (card) => {
    const button = card.querySelector('[data-preselected-change-service]') || card.querySelector('.sp-link-button');
    if (!button || button.dataset.preselectionBound === 'true') return;
    button.dataset.preselectionBound = 'true';
    button.addEventListener('click', changeService);
  };

  const ensureContextCard = () => {
    if (contextCard) {
      wireChangeButton(contextCard);
      return contextCard;
    }

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
    changeButton.dataset.preselectedChangeService = '';
    changeButton.textContent = 'Change service';

    contextCard.append(eyebrow, title, facts, changeButton);
    stepTwoHeader.insertAdjacentElement('afterend', contextCard);
    wireChangeButton(contextCard);
    return contextCard;
  };

  const populateContextCard = (label, values) => {
    const card = ensureContextCard();
    const title = card.querySelector('[data-preselected-service-title]');
    const facts = card.querySelector('[data-preselected-service-facts]');
    title.textContent = label;
    facts.replaceChildren();
    values.forEach((value) => {
      const span = document.createElement('span');
      span.textContent = value;
      facts.append(span);
    });
    facts.hidden = facts.childElementCount === 0;
    card.hidden = false;
    return card;
  };

  const showImmediatePreview = () => {
    if (!canPreview) return;

    previewing = true;
    root.dataset.preselectionPreview = 'server-validated';
    stepOne.hidden = true;
    stepTwo.hidden = false;
    stepTwoTitle.textContent = `Estimate for ${serverLabel}`;
    populateContextCard(serverLabel, serverFacts);
    backButton.hidden = true;
    nextButton.hidden = false;
    submitButton.hidden = true;
    setProgressStep(2);

    const statusText = catalogStatus?.querySelector('p');
    if (statusText) statusText.textContent = `Preparing your ${serverLabel} estimate...`;
  };

  const renderContext = () => {
    const label = selectedLabel();
    if (!label) return false;

    stepTwoTitle.textContent = `Estimate for ${label}`;
    const values = [];
    const sourceFacts = selection.querySelector('.sp-intake-selection__facts');
    if (sourceFacts) {
      [...sourceFacts.children].forEach((fact) => {
        const value = String(fact.textContent || '').trim();
        if (value) values.push(value);
      });
    }
    populateContextCard(label, values);
    return true;
  };

  const restoreFocusedField = (field, scrollTop) => {
    if (!field || typeof field.focus !== 'function') return;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      field.focus({ preventScroll: true });
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    }));
  };

  const tryAdvance = () => {
    if (advanced || root.dataset.preselectionAdvanced) return;

    if (!nextButton.disabled && serviceSelect.value !== requested) {
      advanced = true;
      observer?.disconnect();
      if (previewing) changeService();
      return;
    }

    if (serviceSelect.value !== requested || nextButton.disabled || selection.hidden) return;
    if (!renderContext()) return;

    const focusedField = stepTwo.contains(document.activeElement) ? document.activeElement : null;
    const scrollTop = window.scrollY;
    advanced = true;
    previewing = false;
    root.dataset.preselectionAdvanced = 'true';
    root.dataset.preselectionSynced = 'true';
    root.dataset.preselectionPreview = 'synced';
    observer?.disconnect();
    nextButton.click();
    restoreFocusedField(focusedField, scrollTop);
  };

  const scheduleRefresh = () => {
    window.requestAnimationFrame(() => {
      if (serviceSelect.value === requested && !selection.hidden) renderContext();
      tryAdvance();
    });
  };

  showImmediatePreview();

  observer = new MutationObserver(scheduleRefresh);
  observer.observe(selection, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['hidden'],
  });
  observer.observe(nextButton, {
    attributes: true,
    attributeFilter: ['disabled'],
  });

  serviceSelect.addEventListener('change', scheduleRefresh);
  window.addEventListener('pageshow', scheduleRefresh, { once: true });
  scheduleRefresh();

  window.setTimeout(() => observer?.disconnect(), 15000);
})();
