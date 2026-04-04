const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Z-Index and Opacity Overlap Bug
content = content.replace(
    /\.slide { opacity: 0; transition: opacity [0-9.]+s ease-in-out; position: absolute; inset: 0; }/g,
    '.slide { opacity: 0; z-index: 0; transition: opacity 0.5s ease-in-out; position: absolute; inset: 0; }'
);

// 2. Adjust Image Links for Fallbacks
content = content.replace(
    'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80'
);
content = content.replace(
    'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80'
);
content = content.replace(
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
);

// 3. Fix Gradient Background for Readability
content = content.replace(
    '<div class="absolute inset-0 z-20 bg-black/40"></div>',
    '<div class="absolute inset-0 z-20" style="background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);"></div>'
);

// 4. Center Typography dynamically to ensure "Immutable Transparency" remains centered and sharp
content = content.replace(/flex items-center max-w-\[1400px\]/g, 'flex items-center justify-center max-w-[1400px]');
content = content.replace(/<div class="max-w-2xl">/g, '<div class="max-w-2xl text-center">');

fs.writeFileSync(targetPath, content);
console.log('Slider CSS Z-Index, Opacity and Assets patched securely');
