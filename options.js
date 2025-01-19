function displayAlertMessage(msg, category) {
  const notificationElement = document.getElementById('notification');
  notificationElement.textContent = msg;
  notificationElement.className = `notification ${category}`;
  notificationElement.style.display = 'block';

  setTimeout(() => {
      notificationElement.style.display = 'none';
  }, 3000);
}

document.getElementById('saveBtn').addEventListener('click', () => {
  const inputExtensions = document.getElementById('extensions');
  const inputWebsites = document.getElementById('websites');
  const addedExtensions = inputExtensions.value.split(',').map(item => item.trim()).filter(item => item);
  const addedWebsites = inputWebsites.value.split(',').map(item => item.trim()).filter(item => item);

  chrome.storage.sync.get(['storedExtensions', 'storedWebsites'], (result) => {
      const currentExtensions = result.storedExtensions || [];
      const currentWebsites = result.storedWebsites || [];

      const updatedExtensionsList = [...new Set([...currentExtensions, ...addedExtensions])];
      const updatedWebsitesList = [...new Set([...currentWebsites, ...addedWebsites])];

      chrome.storage.sync.set({ storedExtensions: updatedExtensionsList, storedWebsites: updatedWebsitesList }, () => {
          displayAlertMessage('Settings saved successfully!', 'success');
          inputExtensions.value = '';
          inputWebsites.value = '';
          refreshSettingsList();
      });
  });
});

function refreshSettingsList() {
  chrome.storage.sync.get(['storedExtensions', 'storedWebsites'], (result) => {
      const extensionsArray = result.storedExtensions || [];
      const websitesArray = result.storedWebsites || [];

      const extensionsDiv = document.getElementById('extensionsList');
      extensionsDiv.innerHTML = '';
      extensionsArray.forEach((ext, idx) => {
          const item = document.createElement('div');
          item.className = 'list-item';
          item.innerHTML = `
              ${ext}
              <button class="delete-extension" data-idx="${idx}">Remove</button>
          `;
          extensionsDiv.appendChild(item);
      });

      const websitesDiv = document.getElementById('websitesList');
      websitesDiv.innerHTML = '';
      websitesArray.forEach((site, idx) => {
          const item = document.createElement('div');
          item.className = 'list-item';
          item.innerHTML = `
              ${site}
              <button class="delete-website" data-idx="${idx}">Remove</button>
          `;
          websitesDiv.appendChild(item);
      });

      attachDeleteHandlers();
  });
}

function attachDeleteHandlers() {
  document.querySelectorAll('.delete-extension').forEach(button => {
      button.addEventListener('click', (e) => {
          const idx = e.target.getAttribute('data-idx');
          chrome.storage.sync.get(['storedExtensions'], (result) => {
              const updatedExtensions = [...(result.storedExtensions || [])];
              updatedExtensions.splice(idx, 1);

              chrome.storage.sync.set({ storedExtensions: updatedExtensions }, () => {
                  displayAlertMessage('Extension removed successfully!', 'success');
                  refreshSettingsList(); // Reload updated settings
              });
          });
      });
  });

  document.querySelectorAll('.delete-website').forEach(button => {
      button.addEventListener('click', (e) => {
          const idx = e.target.getAttribute('data-idx');
          chrome.storage.sync.get(['storedWebsites'], (result) => {
              const updatedWebsites = [...(result.storedWebsites || [])];
              updatedWebsites.splice(idx, 1);

              chrome.storage.sync.set({ storedWebsites: updatedWebsites }, () => {
                  displayAlertMessage('Website removed successfully!', 'success');
                  refreshSettingsList(); // Reload updated settings
              });
          });
      });
  });
}

window.onload = () => {
  refreshSettingsList();
};
