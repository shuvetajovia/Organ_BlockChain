const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Shift Slide 1 (Lobby / National Hub)
content = content.replace(
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
);

// 2. Shift Slide 2 (Surgeons)
content = content.replace(
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80'
);

// 3. Shift Slide 3 (Logistics / Green Corridor)
content = content.replace(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80'
);

// 4. Shift Slide 4 (Digital Healthcare Interface)
content = content.replace(
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
);

// 5. Update Overlay Gradient to subtle 40% Navy Blue
content = content.replace(
    /style="background:\s*linear-gradient\(to bottom,\s*rgba\(0,0,0,0\.7\),\s*transparent\);"/g,
    'style="background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(0,0,0,0.4));"'
);

fs.writeFileSync(targetPath, content);
console.log('Image Carousel Source & Theme Array Executed.');
