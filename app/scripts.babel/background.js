import { MESSAGE } from './config/message-codes';

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: MESSAGE.URL_CHANGE,
        url: changeInfo.url
      })
    }
  }
);
