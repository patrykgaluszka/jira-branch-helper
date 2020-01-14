import * as F from './helpers/functional.helper';
import { resolvePattern, useMiddlewares } from './helpers/parsing.helper';
import {
  validateIfFalsy,
  setDefaultIfFalsy,
  setControlValue,
  setCheckControlsValue
} from './helpers/control-events.helper';

import { createForm } from './factories';

import { defaultSettings } from './config/default-settings';

window.onload = function() {
  let form;

  const $branchNamingMsg = document.getElementById('branch-naming-msg');
  const $formMsg = document.getElementById('form-msg');

  const $resetButtons = document.querySelectorAll('.js-reset-btn');
  const $saveButton = document.getElementById('save-options');

  const getScope = (issueNameMiddlewares) => {
    const formValues = form.getValues();
    const issueId = F.path(['issueId', 'testVar'])(formValues);
    const issueName = F.path(['issueName', 'testVar'])(formValues);

    return {
      issueId,
      issueName: useMiddlewares(issueName, issueNameMiddlewares),
    }
  };

  function setControlMsg($el, msg) {
    $el.innerText = msg.text;
    $el.classList.remove('o-validation-msg--positive');
    $el.classList.remove('o-validation-msg--negative');
    $el.classList.add(`o-validation-msg--${msg.type}`);

    return msg.type === 'positive';
  }

  function setFormMsg($el, msg) {
    $el.innerText = msg.text;
    $el.classList.remove('o-form-msg--positive');
    $el.classList.remove('o-form-msg--negative');
    $el.classList.add('is-visible');
    $el.classList.add(`o-form-msg--${msg.type}`);

    if (msg.type === 'positive') {
      setTimeout(() => {
        $el.classList.remove('is-visible');
        $el.innerText = msg.text;
        $el.classList.remove('o-form-msg--positive');
      }, 3000);
    }
  }

  function validateForm() {
    const branchNaming = F.path(['branchNaming', 'pattern'])(form.getValues());
    
    if (branchNaming) {
      const issueNameMiddlewares = F.path(['issueName', 'middlewares'])(form.getValues());
      const scope = getScope(issueNameMiddlewares);
      
      try {
        const result = resolvePattern(branchNaming, scope);
        return setControlMsg($branchNamingMsg, {
          type: 'positive',
          text: `Branch will be named: "${result}"`
        });
      } catch(error) {
        return setControlMsg($branchNamingMsg, { type: 'negative', text: error.message });
      }
    } else {
      return setControlMsg($branchNamingMsg, { type: 'negative', text: 'Field is required.' });
    }
  }

  function addUIListeners() {
    $saveButton.addEventListener('click', (event) => {
      event.preventDefault();
  
      if (validateForm()) {
        const storage = form.getValues();
        chrome.storage.sync.set(storage, () => {
          setFormMsg($formMsg, { type: 'positive', text: 'Your setting have been saved!' });
        });
      } else {
        setFormMsg($formMsg, { type: 'negative', text: 'Your setting have some issues.' });
      };
    });

    $resetButtons.forEach(btn => btn.addEventListener('click', (event) => {
      const targetId = event.target.dataset.resetTargetId;
      const $input = document.getElementById(targetId);
      const inputName = $input.getAttribute('name');
      const control = form.inputs[inputName];
  
      control.setValue();

      validateForm();
    }));
  }

  function setupForm() {
    chrome.storage.sync.get(defaultSettings, function(storage) {
      form = createForm(defaultSettings, storage)
      const testVarListeners = {
        blur: [setDefaultIfFalsy(form), validateForm],
        keyup: [setControlValue(form), validateForm],
      };
      
      form.setControl('text', 'branch-naming', ['branchNaming', 'pattern'])
          .addEventListeners({
            blur: [validateIfFalsy(validateForm)],
            keyup: [setControlValue(form), validateForm],
          });
      form.setControl('text', 'issue-name', ['issueName', 'testVar'])
          .addEventListeners(testVarListeners);
      form.setControl('text', 'issue-id', ['issueId', 'testVar'])
          .addEventListeners(testVarListeners);
          
      form.setControl('check', 'issue-name-mid', ['issueName', 'middlewares'])
          .addEventListener('click', [setCheckControlsValue(form), validateForm]);

      validateForm();
    });
  }
  
  function onInit() {
    setupForm();
    addUIListeners();
  }

  onInit();
};