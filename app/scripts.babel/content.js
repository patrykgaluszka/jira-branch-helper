import { defaultSettings } from './config/default-settings';
import { useMiddlewares } from './helpers/parsing.helper';
import {
  addButtonClickHandler,
  createButtonElement,
  createIconElement,
  createLabelElement,
  getBranchName,
} from './helpers/dom.helper';

import { selectors } from './config/jira-selectors.js'
import { MESSAGE } from './config/message-codes';

function tryLater(wait = 500) {
  window.setTimeout(() => {
    init();
  }, wait);
}

function init() {
  const jiraPage = !!document.querySelector(selectors.jiraPage);
  
  if (jiraPage) {
    const $issueLoader = document.querySelector(selectors.issueLoading);

    if ($issueLoader) {
      tryLater();
      return;
    }

    const $issueId = document.querySelector(selectors.issueId);
    const $issueName = document.querySelector(selectors.issueName);
    
    if ($issueName && $issueId) {
      const $buttonsGroup = document.querySelector(selectors.buttonsGroup);
      
      if ($buttonsGroup) {
        chrome.storage.sync.get(defaultSettings, (storage) => {
          const pattern = storage.branchNaming.pattern;
          const issueId = $issueId.innerText;
          const issueName = useMiddlewares($issueName.innerText, storage.issueName.middlewares)
          const branchName = getBranchName(issueId, issueName, pattern);
      
          const $button = createButtonElement();
          const $icon = createIconElement('branch');
          const $label = createLabelElement('Copy branch name');
          addButtonClickHandler($button, branchName);
          
          $button.appendChild($icon);
          $button.appendChild($label);
      
          $buttonsGroup.appendChild($button);
        });
      }
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === MESSAGE.URL_CHANGE) {
      tryLater();
    }
});

window.onload = () => {
  init();
};
