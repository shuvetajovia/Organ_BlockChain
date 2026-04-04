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

files.forEach(file => {
    let content = fs.readFileSync(path.join(basePath, file), 'utf8');

    // 1. Add Lucide Script to HEAD
    if (!content.includes('unpkg.com/lucide@latest')) {
        content = content.replace('</head>', '    <script src="https://unpkg.com/lucide@latest"></script>\n</head>');
    }
    
    // 2. Add Lucide instantiation
    if (!content.includes('lucide.createIcons()')) {
        content = content.replace('</body>', '    <script>lucide.createIcons();</script>\n</body>');
    }

    // 3. Update CSS Hover States to Emerald color #10B981
    content = content.replace(/\.nav-item:hover\s*{\s*color:\s*#([a-fA-F0-9]+|fff|ffffff);\s*}/g, '.nav-item:hover { color: #10B981; }');
    content = content.replace(/\.nav-active\s*{\s*color:\s*#([a-fA-F0-9]+|fff|ffffff);/g, '.nav-active { color: #10B981;');

    // 4. Transform List Items
    const navItems = [
        { name: 'Home', href: 'dashboard.html', icon: 'home' },
        { name: 'About', href: 'about.html', icon: 'info' },
        { name: 'Hospitals', href: 'hospitals.html', icon: 'building-2' },
        { name: 'Pledge Portal', href: 'pledge-verification.html', icon: 'shield-check' },
        { name: 'Awareness', href: 'awareness.html', icon: 'book-open' },
        { name: 'FAQs', href: 'faqs.html', icon: 'help-circle' },
        { name: 'Download Forms', href: 'download-forms.html', icon: 'file-text' },
        { name: 'Profile', href: 'profile.html', icon: 'user' }
    ];

    let newUlContent = '';
    navItems.forEach(item => {
        let activeClass = '';
        if (file === item.href) {
            activeClass = ' nav-active';
        }
        newUlContent += `\n                <li><a href="${item.href}" class="nav-item${activeClass}" style="display:flex; align-items:center;"><i data-lucide="${item.icon}" class="w-[18px] h-[18px] mr-2"></i><span>${item.name}</span></a></li>`;
    });
    newUlContent += '\n            ';

    const ulRegex = /<ul[^>]*hidden md:flex[^>]*>[\s\S]*?(?:<li><a href="profile\.html"[\s\S]*?<\/li>)[\s\S]*?<\/ul>/;
    
    if (content.match(ulRegex)) {
        content = content.replace(ulRegex, (match) => {
            const openTag = match.substring(0, match.indexOf('>') + 1);
            return openTag + newUlContent + '</ul>';
        });
    }

    // 5. Replace Logout button
    const logoutRegex = /<button[^>]*onclick="sessionStorage\.clear\(\); window\.location\.href='index\.html';"[^>]*>[\s\S]*?Logout[\s\S]*?<\/button>/;
    const newLogout = `<button onclick="sessionStorage.clear(); window.location.href='index.html';" class="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1.5 border border-slate-700 hover:border-emerald-500/50 px-3 py-1.5 rounded-lg shrink-0">
                <i data-lucide="log-out" class="w-[18px] h-[18px]"></i>
                Logout
            </button>`;
            
    if (content.match(logoutRegex)) {
        content = content.replace(logoutRegex, newLogout);
    }

    fs.writeFileSync(path.join(basePath, file), content);
    console.log(`Updated ${file}`);
});
console.log('Update Complete');
