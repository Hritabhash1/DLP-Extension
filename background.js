const BLOCKED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.doc', '.docx'];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  
  if (message.action === "block_upload") {
    console.log("Blocked file upload:", message.fileName);
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Upload Blocked',
      message: `File upload blocked: ${message.fileName}`
    });
    
    sendResponse({ success: true });
  }
  return true; 
});

// Handle downloads
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  const url = downloadItem.url.toLowerCase();
  const filename = downloadItem.filename.toLowerCase();
  
  const isDocument = BLOCKED_EXTENSIONS.some(ext => filename.endsWith(ext));
  
  if (isDocument) {
    try {
      await chrome.downloads.cancel(downloadItem.id);
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Download Blocked',
        message: `Document download blocked from ${new URL(url).hostname}`
      });
    } catch (error) {
      console.error('Error canceling download:', error);
    }
  }
});
