const getImageUrl = (path) => {
  if (!path) return "/assets/placeholder.png"; // Return a placeholder if no path

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Mimic the logic in utils/image.ts
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const url = new URL(apiUrl);
    return `${url.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } catch (e) {
    return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
  }
};

console.log("Testing getImageUrl logic (JS version)...");

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api";

const testCases = [
  { input: "/media/products/image.jpg", expected: "http://localhost:8000/media/products/image.jpg" },
  { input: "media/products/image.jpg", expected: "http://localhost:8000/media/products/image.jpg" },
  { input: "http://example.com/image.jpg", expected: "http://example.com/image.jpg" },
  { input: "https://example.com/image.jpg", expected: "https://example.com/image.jpg" },
  { input: null, expected: "/assets/placeholder.png" },
  { input: undefined, expected: "/assets/placeholder.png" },
];

let passed = 0;
testCases.forEach(({ input, expected }, index) => {
  const result = getImageUrl(input);
  if (result === expected) {
    console.log(`Test Case ${index + 1}: PASS`);
    passed++;
  } else {
    console.error(`Test Case ${index + 1}: FAIL`);
    console.error(`  Input: ${input}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Got: ${result}`);
  }
});

console.log(`\n${passed}/${testCases.length} tests passed.`);

if (passed === testCases.length) {
    console.log("All tests passed!");
    process.exit(0);
} else {
    console.error("Some tests failed.");
    process.exit(1);
}
