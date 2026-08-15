const [major, minor] = process.versions.node.split(".").map(Number);
const supported = major > 22 || (major === 22 && minor >= 13);

if (!supported) {
  console.error(`
This project requires Node.js 22.13.0 or newer.
Your terminal is currently using Node.js ${process.versions.node}.

Install Node 22, restart your terminal, and verify it with:
  node --version

Then run:
  npm run release
`);
  process.exit(1);
}
