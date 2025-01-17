chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed or updated.");

  chrome.tabs.query({ url: "*://*/*" }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);

  if (message.action === "block_upload") {
    console.log("Blocked file upload:", message.fileName);
    sendResponse({ success: true });
  }
});