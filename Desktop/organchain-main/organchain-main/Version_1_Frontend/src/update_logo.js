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
    'profile.html',
    'admin-dashboard.html',
    'node-registry.html',
    'audit-ledger.html',
    'match-archive.html',
    'security-logs.html',
    'about-general.html',
    'awareness-general.html',
    'faqs-general.html',
    'index.html',
    'login.html',
    'register.html'
];

const basePath = __dirname;

const stringA = 'Tech Knight <span class="text-emerald-500 mx-1">|</span>';
const stringB = 'Tech Knight <span class="text-emerald-500 mx-1.5 opacity-80">|</span>';

// We want to replace "Tech Knight | " with the image logo.
const logoInject = `<img src="images/organ-donation-logo-new.svg" alt="Logo" class="h-8 w-auto mr-1.5 drop-shadow-md" />`;

files.forEach(file => {
    const targetPath = path.join(basePath, file);
    if (!fs.existsSync(targetPath)) return;
    
    let content = fs.readFileSync(targetPath, 'utf8');

    if (content.includes(stringA)) {
        content = content.replace(stringA, logoInject);
        fs.writeFileSync(targetPath, content);
        console.log(`Injected Logo into ${file}`);
    } else if (content.includes(stringB)) {
        content = content.replace(stringB, logoInject);
        fs.writeFileSync(targetPath, content);
        console.log(`Injected Logo into ${file} (Variant B)`);
    } else if (content.includes('Tech Knight')) {
        // Fallback generic search
        content = content.replace(/Tech Knight\s*<span[^>]*>\|<\/span>/g, logoInject);
        fs.writeFileSync(targetPath, content);
        console.log(`Injected Logo into ${file} (Regex Fallback)`);
    }
});

console.log('Global Branding Replacements Completed.');
