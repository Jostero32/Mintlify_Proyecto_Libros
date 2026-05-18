const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "..", "docs");

if (!fs.existsSync(docsDir)) {
  console.log("docs/ no existe en este entorno (probablemente dentro del contenedor). Skip export.");
  process.exit(0);
}

const { swaggerSpec } = require("../src/config/swagger");
const outputPath = path.join(docsDir, "openapi.json");

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`OpenAPI spec exported to ${path.relative(process.cwd(), outputPath)}`);
console.log(`  - ${Object.keys(swaggerSpec.paths || {}).length} paths`);
console.log(`  - ${Object.keys((swaggerSpec.components && swaggerSpec.components.schemas) || {}).length} schemas`);
