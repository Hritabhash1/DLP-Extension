Data Loss Prevention (DLP) Chrome Extension
This Chrome extension is designed to block the upload and download of files with specific extensions (e.g., .pdf, .docx, .xls) on unapproved websites. It also allows users to customize the list of approved file types and websites in real-time and displays user notifications when a blocked action is attempted.

Features
Block Upload and Download: Prevents uploading and downloading of specific file types on unapproved websites.
Customizable Rules: Users can define approved file types and websites for upload/download actions.
User Notifications: Displays a clear alert when a blocked upload/download action is attempted, with the reason for the block.
Real-Time Updates: Allows users to modify the list of approved file types and websites dynamically.
Setup and Installation
1. Clone or Download the Repository
You can clone or download the repository from GitHub.

bash
Copy
Edit
git clone https://github.com/yourusername/dlp-chrome-extension.git
2. Load the Extension in Chrome
Open Chrome and go to chrome://extensions/.
Enable Developer mode by toggling the switch in the top-right corner.
Click on Load unpacked.
Select the folder where you have the extension files (the folder containing background.js, content.js, and manifest.json).
File Structure
bash
Copy
Edit
dlp-chrome-extension/
├── background.js        # Handles the blocking logic and interactions
├── content.js           # Interacts with the DOM and identifies upload/download links
├── manifest.json        # Metadata and permissions for the extension
├── README.md            # This file
├── userInterface.html   # (Optional) HTML interface for customizing settings
├── userNotifications.js # Handles the user notifications
How It Works
background.js
Listens for events when a download or upload is attempted.
Checks if the file extension is in the block list and whether the site is approved.
If the action is blocked, it sends a message to show a notification.
content.js
Injected into every webpage to monitor for download/upload links.
Identifies links with file extensions matching those in the block list.
Blocks the default action (download/upload) if the file extension is on the block list.
Customizable Rules
The extension allows users to add/remove file extensions and define approved websites dynamically.
These rules are stored in local storage or a configuration file (based on your implementation).
User Notifications
When a user tries to download or upload a file of an unapproved type, a notification is shown with the reason.
Notifications help users understand why a particular action was blocked.
Permissions
This extension requires the following permissions:

activeTab: To interact with the current tab and access the links on the page.
tabs: To interact with active tabs and inject content scripts.
notifications: To show notifications when a blocked action occurs.
storage: For storing user configurations like allowed file types and websites.
How to Use
Once installed, the extension will automatically start blocking download and upload actions based on pre-defined rules.
To modify the rules (e.g., add/remove file types or websites):
Open the extension settings page (if implemented).
Customize the file types and websites.
When a download or upload attempt is blocked, a notification will appear explaining the reason.
Customizing the Extension
You can easily modify the following to meet your specific needs:

File Types: Adjust the list of file types to block in content.js:

javascript
Copy
Edit
const blockedExtensions = ['.exe', '.pdf', '.docx', '.zip'];
Approved Websites: Add or remove websites from the approved list.

Notifications: Modify the notification messages to suit your needs.

Troubleshooting
Blocked action not working: Ensure that the extension is installed correctly and the permissions are granted.
Customization not reflecting: Refresh the page or restart the extension after making changes to the settings.
