
const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\Dell\\Desktop\\Kishan Sir\\priya\\Admin App\\app\\components\\forms\\ChildCategoryForm.tsx";

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    let startIndex = -1;

    // Find the second "use client"; assuming the first one is commented
    // Actually the file has:
    // 2: // "use client";
    // 263: "use client";

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '"use client";') {
            startIndex = i;
            break;
        }
    }

    if (startIndex !== -1) {
        const newLines = lines.slice(startIndex);
        const newContent = newLines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log("Successfully cleaned ChildCategoryForm.tsx");
    } else {
        console.log("Could not find active 'use client'; block");
    }

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
