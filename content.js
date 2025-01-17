function getBlockedWebsites(callback) {
  chrome.storage.sync.get('blockedWebsites', function(data) {
    console.log("Retrieved blocked websites from storage:", data);
    const websites = data.blockedWebsites || [];
    callback(websites);
  });
}

function isBlockedWebsite(currentHost, blockedWebsites) {
  console.log("Checking if current website is blocked", currentHost, blockedWebsites);
  return blockedWebsites.some((blockedHost) => currentHost.includes(blockedHost));
}

function handleFileDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log("File drop detected...");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (["pdf", "docx", "xls"].includes(fileExtension)) {
      alert(`File upload blocked: ${file.name}`);
      sendMessageToExtension("block_upload", { fileName: file.name });
    } else {
      alert(`File type allowed: ${file.name}`);
    }
  }
}

function handleFileInput(event) {
  event.preventDefault();
  event.stopPropagation();

  if (event.target && event.target.type === "file") {
    const files = event.target.files;
    const blockedFiles = [];
    const allowedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (["pdf", "docx", "xls"].includes(fileExtension)) {
        blockedFiles.push(file.name);
      } else {
        allowedFiles.push(file.name);
      }
    }

    if (blockedFiles.length > 0) {
      event.target.value = ""; 
      alert(`Blocked files: ${blockedFiles.join(", ")}`);
      sendMessageToExtension("block_upload", { blockedFiles });
    } else {
      console.log(`Allowed files: ${allowedFiles.join(", ")}`);
    }
  }
}

function blockDownload(downloadItem) {
  const blockedExtensions = ["pdf", "docx", "xls", "xlsx"];
  const fileExtension = downloadItem.filename.split(".").pop().toLowerCase();

  if (blockedExtensions.includes(fileExtension)) {
    console.log(`Download blocked for file: ${downloadItem.filename}`);

    chrome.downloads.cancel(downloadItem.id, function() {
      alert(`Blocked download: ${downloadItem.filename}`);
    });

    return { cancel: true };
  }

  return { cancel: false };
}



function sendMessageToExtension(action, data) {
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action, ...data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to extension:", chrome.runtime.lastError);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  } else {
    console.warn("Chrome runtime context is not available.");
  }
}

getBlockedWebsites(function(blockedWebsites) {
  const currentHost = window.location.hostname;
  console.log("Current website:", currentHost);

  if (isBlockedWebsite(currentHost, blockedWebsites)) {
    console.log("Blocking functionality active on this website.");

    document.ondragover = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    document.ondrop = handleFileDrop;
    document.body.addEventListener("change", handleFileInput);

    chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
      const result = blockDownload(downloadItem);
      if (result.cancel) {
        suggest({ conflictAction: "overwrite", filename: downloadItem.filename });
      } else {
        suggest(); 
      }
    });
  } else {
    console.log("Blocking functionality is not active on this website.");
  }
});
