import { resolvePattern } from './parsing.helper';

const noPermissionsMsg = (branch) => `
=====================================================
=====================================================
===  No clipboard permissions were granted.
===  Copy it by hand from line below.
=====================================================
=====================================================

${branch}
`.trim();

export const getBranchName = (issueId, issueName, namingPattern) => {
  const scope = { issueName, issueId };

  return resolvePattern(namingPattern, scope).substring(0, 120);
};

export const createButtonElement = () => {
  const $button = document.createElement('a');

  $button.setAttribute('title', 'Copy git branchname');
  $button.setAttribute('href', '#');
  $button.classList.add('aui-button');

  return $button;
};

export const createIconElement = (iconId) => {
  const $icon = document.createElement('span');
  $icon.classList.add('icon', 'aui-icon', 'aui-icon-small', `aui-iconfont-${iconId}`, `icon-${iconId}`);
  
  return $icon;
};

export const createLabelElement = (text) => {
  const $label = document.createElement('span');
  $label.classList.add('trigger-label');
  $label.innerText = ` ${text}`;

  return $label;
};

export const addButtonClickHandler = ($button, branchName) => {
  $button.addEventListener('click', (e) => {
    e.preventDefault();

    navigator.clipboard.writeText(branchName).then(function() {
    }, function() {
      throw new Error(noPermissionsMsg(branchName));
    });
  });
};
