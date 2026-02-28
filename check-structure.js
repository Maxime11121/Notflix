const fs = require('fs');
const path = require('path');

const requiredFiles = [
    // Backend
    'backend/server.js',
    'backend/config/database.js',
    'backend/config/auth.js',
    'backend/models/User.js',
    'backend/models/WatchHistory.js',
    'backend/models/Review.js',
    'backend/routes/auth.js',
    'backend/routes/users.js',
    'backend/routes/content.js',
    'backend/middleware/auth.js',
    
    // Frontend
    'frontend/index.html',
    'frontend/login.html',
    'frontend/register.html',
    'frontend/player.html',
    'frontend/profile.html',
    
    // CSS
    'frontend/css/main.css',
    'frontend/css/player.css',
    'frontend/css/auth.css',
    'frontend/css/themes.css',
    
    // JS
    'frontend/js/app.js',
    'frontend/js/auth.js',
    'frontend/js/player.js',
    'frontend/js/sources.js',
    'frontend/js/subtitles.js',
    'frontend/js/social.js',
    'frontend/js/notifications.js',
    'frontend/js/analytics.js',
    
    // Config
    'package.json',
    '.env.example',
    'README.md'
];

console.log('🔍 Checking project structure...\n');

let allPresent = true;
let missingFiles = [];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allPresent = false;
        missingFiles.push(file);
    }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
    console.log('✅ All files present! Project structure is complete.');
} else {
    console.log('❌ Missing files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
}

console.log('\n' + '='.repeat(50));