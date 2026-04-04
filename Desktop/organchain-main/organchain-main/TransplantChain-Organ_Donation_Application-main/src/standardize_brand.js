const fs = require('fs');
const path = require('path');

const basePath = __dirname;
const files = fs.readdirSync(basePath).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(basePath, file), 'utf8');
    let modified = false;

    // 1. Standardize Header height to exactly h-16 (64px) to freeze the Y-axis globally
    const headerRegex = /<header\s+class="([^"]*)"([^>]*)>/i;
    const headerMatch = content.match(headerRegex);

    if (headerMatch) {
        let classes = headerMatch[1];
        
        // Strip out any existing h- height tags and style overrides that cause shifting
        classes = classes.replace(/\bh-\w*\b/g, '').trim(); 
        let rawAttrs = headerMatch[2].replace(/style="[^"]*"/, '');

        if (!classes.includes('h-16')) {
            classes += ' h-16';
        }
        
        // Ensure standard background for uniform presentation
        if (!classes.includes('bg-slate-950') && !classes.includes('bg-white') && !classes.includes('bg-slate-900')) {
             if (file.includes('general') || file === 'index.html' || file.includes('about')) {
                 classes += ' bg-slate-950';
             }
        }

        const newHeader = `<header class="${classes}" ${rawAttrs}>`;
        content = content.replace(headerRegex, newHeader);
        modified = true;
    }

    // 2. Standardize Nav padding to exactly px-6 to freeze the X-axis globally
    // We only want the first nav element which is inside the header
    const navStart = content.indexOf('<nav ');
    if (navStart !== -1) {
        const navEnd = content.indexOf('>', navStart);
        const navTag = content.substring(navStart, navEnd + 1);
        
        if (navTag.includes('justify-between')) {
             const cleanNav = '<nav class="max-w-[1400px] w-full mx-auto px-6 h-full flex items-center justify-between">';
             content = content.substring(0, navStart) + cleanNav + content.substring(navEnd + 1);
             modified = true;
        }
    }

    // 3. Standardize the Logo Block
    // Find the <a> holding the primary-logo
    const logoRegex = /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<img src="images\/primary-logo\.png"[\s\S]*?<\/span><\/span>\s*<\/a>/;
    
    const logoMatch = content.match(logoRegex);
    if (logoMatch) {
        let href = logoMatch[1];
        let adminCommand = logoMatch[0].includes('Admin Command Center');
        let textMatch = adminCommand ? 'Admin Command Center' : 'OrganChain';

        let standardizedAnchor = `<a href="${href}" class="flex items-center gap-x-3 transition-opacity hover:opacity-90 shrink-0 whitespace-nowrap">
                    <img src="images/primary-logo.png" alt="Logo" class="h-10 w-auto object-contain drop-shadow-md" />
                    <span class="text-white font-extrabold tracking-tight text-xl flex items-center"><span class="font-light text-slate-300">${textMatch}</span></span>
                </a>`;
        
        content = content.replace(logoRegex, standardizedAnchor);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(path.join(basePath, file), content);
        console.log(`Successfully standardized branding constraints in: ${file}`);
    }
});
