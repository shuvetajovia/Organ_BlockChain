const fs = require('fs');
const path = require('path');

const files = [
    'dashboard.html',
    'about.html',
    'hospitals.html',
    'pledge-verification.html',
    'awareness.html',
    'faqs.html',
    'download-forms.html',
    'profile.html'
];

const basePath = __dirname;
const navItemCss = ".nav-item { display:inline-flex; align-items:center; white-space:nowrap; flex-shrink:0; height:100%; padding:0 0.65rem; font-size:0.85rem; font-weight:500; color:#cbd5e1; transition:all 0.2s ease-in-out; text-decoration:none; border-bottom:2px solid transparent; }";

files.forEach(file => {
    let content = fs.readFileSync(path.join(basePath, file), 'utf8');

    // 1. Replace the entire .nav-item CSS rule block dynamically
    content = content.replace(/\.nav-item\s*\{[^}]+\}/g, navItemCss);

    fs.writeFileSync(path.join(basePath, file), content);
    console.log(`Optimized Spacing for ${file}`);
});
console.log('Flexbox Layout Fix Complete');
