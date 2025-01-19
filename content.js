let defaultForbiddenExtensions = ['pdf', 'docx', 'xls', 'txt'];
let forbiddenExtensions = new Set(defaultForbiddenExtensions);
let allowedWebsites = [];

function checkFileUpload(fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (allowedWebsites.some(site => window.location.hostname.includes(site))) {
        console.log("Upload allowed: Detected on an allowed website.");
        return false;
    }
    if (forbiddenExtensions.has(fileExtension)) {
        alert(`Uploading "${fileName}" is not allowed.`);
        return true;
    }
    return false;
}

function handleFileUpload(event) {
    const files = event.target.files || event.dataTransfer?.files;
    if (!files) return;

    for (let file of files) {
        if (checkFileUpload(file.name)) {
            if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
                event.target.value = '';  // Clear the file input field
            }
            event.preventDefault();

            alert(`Uploading "${file.name}" is restricted.`);
            console.log(`Upload of ${file.name} blocked.`);

            try {
                chrome.runtime.sendMessage({
                    action: "showNotification",
                    title: "Upload Blocked",
                    message: `Uploading "${file.name}" is restricted.`
                });
            } catch (error) {
                console.error("Chrome runtime API unavailable in this context.");
            }
            return;
        }
    }
}

async function fetchSettings() {
    return new Promise((resolve) => {
        try {
            chrome.storage.sync.get(['extensions', 'websites'], (data) => {
                forbiddenExtensions = new Set(data.extensions?.length ? data.extensions : defaultForbiddenExtensions);
                allowedWebsites = data.websites || [];
                resolve();
            });
        } catch (error) {
            console.error("Error fetching settings:", error);
            resolve();
        }
    });
}

async function initializeScript() {
    await fetchSettings();
    document.addEventListener('change', (event) => {
        if (event.target.type === 'file') {
            handleFileUpload(event);
        }
    }, true);
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        if (changes.extensions) {
            forbiddenExtensions = new Set(changes.extensions.newValue?.length ? changes.extensions.newValue : defaultForbiddenExtensions);
        }
        if (changes.websites) {
            allowedWebsites = changes.websites.newValue || [];
        }
    }
});

document.addEventListener('DOMContentLoaded', initializeScript);
