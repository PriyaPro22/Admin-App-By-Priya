// HARDCODED TEST - Add this to ChildCategoryV2Form.tsx handleSave function
// Put this RIGHT AFTER line 89 (after the console.log statements)

// 🧪 EXACT THUNDER CLIENT TEST
console.log("🧪 RUNNING HARDCODED TEST - EXACT THUNDER CLIENT FORMAT");

const hardcodedPayload = {
    childCatMedia: {
        images: {
            imageTitle: "Installation Image 1",
            url: "https://dummyimage.com/600x400/000/fff&text=Installation+1",
            visibility: true
        }
    }
};

const hardcodedUrl = `https://api.bijliwalaaya.in/api/product-listing/main/${selectedMainId}/child-category/media`;

console.log("🧪 Hardcoded Payload:", JSON.stringify(hardcodedPayload, null, 2));
console.log("🧪 Hardcoded URL:", hardcodedUrl);

try {
    const token = localStorage.getItem("token");
    const testResponse = await fetch(hardcodedUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-token": "super_secure_token",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(hardcodedPayload)
    });

    const testData = await testResponse.json();
    console.log("🧪 TEST RESPONSE:", testData);
    console.log("🧪 TEST STATUS:", testResponse.status);

    if (testData.success && testData.data && Object.keys(testData.data).length > 0) {
        alert("✅ HARDCODED TEST WORKED! Check MongoDB!");
    } else {
        alert("❌ HARDCODED TEST - Empty response! Backend issue!");
        console.error("🧪 TEST FAILED - Response is empty");
    }
} catch (err) {
    console.error("🧪 TEST ERROR:", err);
    alert("❌ HARDCODED TEST FAILED!");
}

return; // STOP HERE - Don't run the normal save
