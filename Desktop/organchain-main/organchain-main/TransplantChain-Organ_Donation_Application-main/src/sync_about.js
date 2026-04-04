const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'about-general.html');
const destPath = path.join(__dirname, 'about.html');

const srcHtml = fs.readFileSync(srcPath, 'utf8');
let destHtml = fs.readFileSync(destPath, 'utf8');

const splitMarker = '<!-- ── Hero Section ── -->';

if (srcHtml.includes(splitMarker) && destHtml.includes(splitMarker)) {
    // Keep everything before the Hero Section marker in the destination (Header / Nav)
    const destHeader = destHtml.substring(0, destHtml.indexOf(splitMarker));
    
    // Grab everything starting from the Hero Section marker in the source (Content / Footer)
    const srcBody = srcHtml.substring(srcHtml.indexOf(splitMarker));
    
    // Stitch them back together
    destHtml = destHeader + srcBody;
    
    // The `<title>` might have been updated previously, so let's match the <title> tag precisely
    destHtml = destHtml.replace(
        '<title>Mission Architecture — Secure Organ Network</title>',
        '<title>About OrganChain — National Digital Infrastructure</title>'
    );

    fs.writeFileSync(destPath, destHtml);
    console.log('Successfully synced NOTTO profile content into the Authenticated about.html layout!');
} else {
    console.error('Failed to locate Hero Section structure markers!');
}
