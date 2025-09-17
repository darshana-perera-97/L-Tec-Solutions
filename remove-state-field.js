const fs = require('fs');
const path = require('path');

// List of all product HTML files
const productFiles = [
    'products/gaming-pc.html',
    'products/workstation-pc.html',
    'products/office-pc.html',
    'products/mini-pc.html',
    'products/server-pc.html',
    'products/allinone-pc.html',
    'products/gaming-laptop.html',
    'products/business-laptop.html',
    'products/ultrabook.html',
    'products/workstation-laptop.html',
    'products/student-laptop.html',
    'products/2in1-laptop.html',
    'products/mechanical-keyboard.html',
    'products/gaming-mouse.html',
    'products/4k-monitor.html',
    'products/hd-webcam.html',
    'products/gaming-headset.html',
    'products/usb-hub.html'
];

function removeStateField(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the state/province input field
        const stateFieldRegex = /<div class="col-md-4">\s*<div class="form-group mb-3">\s*<label for="state" class="form-label">State\/Province \*<\/label>\s*<input type="text" class="form-control" id="state" name="state" required>\s*<\/div>\s*<\/div>/;
        
        const updatedContent = content.replace(stateFieldRegex, '');
        
        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`⚠️  No changes needed: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Update all product files
console.log('🔄 Removing State/Province input fields from all product pages...\n');

let updatedCount = 0;
productFiles.forEach(file => {
    if (fs.existsSync(file)) {
        if (removeStateField(file)) {
            updatedCount++;
        }
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log(`\n✅ Update complete! ${updatedCount} files updated.`);
console.log('\n📋 Changes made:');
console.log('- Removed State/Province input field');
console.log('- Kept the Province dropdown selection');
console.log('- Cleaned up form layout');
