let forbiddenExtensions = ['pdf', 'docx', 'xls', 'txt'];
let allowedWebsites = [];

function loadCurrentSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['websites', 'extensions'], (data) => {
            allowedWebsites = data.websites || allowedWebsites;
            forbiddenExtensions = data.extensions || forbiddenExtensions;
            resolve();
        });
    });
}

function isAllowedWebsite(url) {
    try {
        const hostname = new URL(url).hostname;
        return allowedWebsites.some(site => hostname.includes(site));
    } catch (error) {
        console.error("Error parsing URL:", url, error);
        return false;
    }
}

chrome.downloads.onCreated.addListener(async (downloadItem) => {
    await loadCurrentSettings();

    chrome.downloads.onChanged.addListener((downloadStatus) => {
        if (downloadStatus.id === downloadItem.id && downloadStatus.filename && downloadStatus.filename.current) {
            const currentFileName = downloadStatus.filename.current;
            const currentFileExtension = currentFileName.split('.').pop().toLowerCase();

            chrome.downloads.search({ id: downloadItem.id }, (result) => {
                if (result.length > 0) {
                    const downloadUrl = result[0].url;

                    // Allow downloads originating from `blob:` URLs
                    if (downloadUrl.startsWith("blob:")) {
                        console.log(`Allowing download from blob URL: ${downloadUrl}`);
                        return;
                    }

                    if (isAllowedWebsite(downloadUrl)) {
                        console.log(`Download from allowed website: ${downloadUrl}`);
                        return; // Permit the download
                    }

                    console.log(`Checking download URL: ${currentFileExtension}`);
                    // Block the download if the file extension is restricted
                    if (forbiddenExtensions.includes(currentFileExtension)) {
                        chrome.downloads.cancel(downloadItem.id, () => {
                            chrome.notifications.create({
                                type: "basic",
                                iconUrl: "icon.png",
                                title: "Download Blocked",
                                message: `The download of "${currentFileName}" is not allowed.`,
                                priority: 2
                            });
                        });
                    }
                }
            });
        }
    });
});
