// src/config.js
// Change the password below to something secure
// You can change this anytime without editing App.js

export const APP_PASSWORD = 'GarryMcDarby2024';

// Add more search sources here if needed
export const AVAILABLE_SEARCH_SOURCES = [
  'Indeed',
  'Craigslist',
  'Direct',
  'LinkedIn',
  'Facebook Jobs',
];

// Default search sources to enable
export const DEFAULT_SEARCH_SOURCES = ['Indeed', 'Craigslist', 'Direct'];
```

3. Make sure you also created `src/AccessLog.js` with the code from the second artifact

4. Then push:
```
git add src/config.js src/AccessLog.js
git commit -m "Create config and AccessLog files"
git push