const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'about-general.html',
    'awareness-general.html',
    'faqs-general.html'
];

const basePath = __dirname;
const navItemCss = ".nav-item { display: inline-flex; align-items: center; white-space: nowrap; flex-shrink: 0; height: 100%; padding: 0 1.25rem; font-size: 0.875rem; font-weight: 500; color: #cbd5e1; transition: all 0.2s ease-in-out; text-decoration: none; border-bottom: 2px solid transparent; }";

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
    content = content.replace(/\.nav-item\s*\{[^}]+\}/g, navItemCss);

    // 4. Transform List Items
    const navItems = [
        { name: 'Home', href: 'index.html', icon: 'home' },
        { name: 'About', href: 'about-general.html', icon: 'info' },
        { name: 'Awareness', href: 'awareness-general.html', icon: 'book-open' },
        { name: 'FAQ', href: 'faqs-general.html', icon: 'help-circle' }
    ];

    let newUlContent = '';
    navItems.forEach(item => {
        let activeClass = '';
        if (file === item.href) {
            activeClass = ' nav-active';
        }
        newUlContent += `\n                    <li><a href="${item.href}" class="nav-item${activeClass}" style="display:inline-flex; align-items:center; white-space:nowrap;"><i data-lucide="${item.icon}" class="w-[18px] h-[18px] mr-2"></i><span>${item.name}</span></a></li>`;
    });
    newUlContent += '\n                ';

    const ulRegex = /<ul[^>]*hidden lg:flex[^>]*>[\s\S]*?(?:<li><a href="faqs-general\.html"[\s\S]*?<\/li>)[\s\S]*?<\/ul>/;
    
    if (content.match(ulRegex)) {
        content = content.replace(ulRegex, (match) => {
            const openTag = match.substring(0, match.indexOf('>') + 1);
            return openTag + newUlContent + '</ul>';
        });
    }

    fs.writeFileSync(path.join(basePath, file), content);
    console.log(`Updated Public Navigation for ${file}`);
});
console.log('Public Nav Fix Complete');
