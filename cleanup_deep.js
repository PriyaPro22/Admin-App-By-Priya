const fs = require('fs');

const filePath = "c:\\Users\\Dell\\Desktop\\Kishan Sir\\priya\\Admin App\\app\\components\\forms\\DeepChildCategoryForm.tsx";

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    // Keep only lines 0 to 1264 (line 1265 in 1-indexed = line 1264 in 0-indexed)
    // The component ends with "export default DeepChildCategoryForm;" at line 1264
    const cleanedLines = lines.slice(0, 1265);

    const newContent = cleanedLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully cleaned DeepChildCategoryForm.tsx - removed duplicate code");

} catch (err) {
    console.error("Error:", err);
    process.exit(1);
}
