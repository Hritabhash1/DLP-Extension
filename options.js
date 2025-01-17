function getBlockedWebsites(callback) {
    chrome.storage.sync.get('blockedWebsites', function(data) {
      const websites = data.blockedWebsites || [];
      callback(websites);
    });
  }
  
  function saveBlockedWebsites(websites) {
    chrome.storage.sync.set({ 'blockedWebsites': websites });
  }
  
  document.getElementById('addWebsite').addEventListener('click', function() {
    const websiteInput = document.getElementById('websiteInput').value.trim();
    if (websiteInput) {
      getBlockedWebsites(function(websites) {
        if (!websites.includes(websiteInput)) {
          websites.push(websiteInput);
          saveBlockedWebsites(websites);
          updateWebsiteList(); 
          document.getElementById('websiteInput').value = ''; 
        } else {
          alert('Website is already in the list.');
        }
      });
    } else {
      alert('Please enter a valid website.');
    }
  });
  
  function removeWebsite(websiteToRemove) {
    getBlockedWebsites(function(websites) {
      const updatedWebsites = websites.filter(website => website !== websiteToRemove);
      saveBlockedWebsites(updatedWebsites);
      updateWebsiteList(); 
    });
  }
  
  function updateWebsiteList() {
    getBlockedWebsites(function(websites) {
      const listElement = document.getElementById('websiteList');
      listElement.innerHTML = ''; 
      websites.forEach(function(website) {
        const li = document.createElement('li');
        li.className = 'websiteItem'; 
        li.textContent = website;
  
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.onclick = function() {
          removeWebsite(website);
        };
  
        li.appendChild(removeButton);
        listElement.appendChild(li);
      });
    });
  }
  
  updateWebsiteList();
  