const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Resizing Container
content = content.replace('h-[500px] lg:h-[600px]', 'h-[60vh] max-h-[500px]');

// 2. Adjusting Text Overlays for Contrast
content = content.replace('bg-black/10', 'bg-black/40');
content = content.replace('from-slate-950/50', 'from-slate-950/70');

// 3. Substituting Image Assets
// Slide 1 (National Health / Surgery)
content = content.replace(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2600&auto=format&fit=crop'
);
// Slide 2 (Organ Logistics)
content = content.replace(
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=2600&auto=format&fit=crop'
);
// Slide 3 (Awareness / Identity)
content = content.replace(
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2600&auto=format&fit=crop'
);

// 4. Inject 4th Slide (Digital Infrastructure)
const slide4HTML = `
            <!-- Slide 4 -->
            <div class="slide">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2600&auto=format&fit=crop" class="w-full h-full object-cover" alt="Digital Infrastructure">
                <div class="absolute inset-0 z-30 flex items-center max-w-[1400px] mx-auto px-6">
                    <div class="max-w-2xl">
                        <span class="inline-flex items-center px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-300 uppercase bg-indigo-900/40 border border-indigo-400/30 rounded-full backdrop-blur-md shadow-lg">Digital Infrastructure</span>
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5 [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">Immutable Transparency</h1>
                        <p class="text-lg text-slate-100 font-medium leading-relaxed mb-8 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">Every match logic operation runs transparently on smart contracts via secure handheld devices authorized by the national network.</p>
                    </div>
                </div>
            </div>`;

// Insert the 4th slide just before the closing </div> of #heroCarousel
content = content.replace(
    /(<\/div>\s*<!-- Carousel Indicators -->)/,
    slide4HTML + '\n        $1'
);

// 5. Add 4th Indicator Marker
// Just append one more indicator matching the non-active state
content = content.replace(
    /(<button class="w-10 h-1 rounded-full bg-white\/30 transition-opacity indicator"><\/button>\s*<\/div>\s*<\/section>)/,
    '<button class="w-10 h-1 rounded-full bg-white/30 transition-opacity indicator"></button>\n            $1'
);

fs.writeFileSync(targetPath, content);
console.log('Hero UI Overhaul applied to index.html successfully!');
