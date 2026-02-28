const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
    'frontend/assets',
    'frontend/assets/images'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created: ${dir}`);
    }
});

// Create placeholder logo SVG
const logoSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
    <rect width="200" height="60" fill="#141414"/>
    <text x="100" y="40" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#e50914" text-anchor="middle">NOTFLIX</text>
</svg>
`;

fs.writeFileSync('frontend/assets/images/logo.svg', logoSVG.trim());
console.log('✅ Created: logo.svg');

// Create PWA icons (placeholder)
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

iconSizes.forEach(size => {
    const iconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#e50914" rx="20"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/3}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">N</text>
</svg>
    `;
    
    fs.writeFileSync(`frontend/assets/images/icon-${size}.png`, iconSVG.trim());
});

console.log('✅ Created all PWA icons');

// Create default avatar
const avatarSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#e50914" rx="100"/>
    <text x="100" y="120" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">U</text>
</svg>
`;

fs.writeFileSync('frontend/assets/images/default-avatar.svg', avatarSVG.trim());
console.log('✅ Created: default-avatar.svg');

console.log('\n🎉 All assets created successfully!');