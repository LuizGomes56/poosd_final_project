import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import { swaggerDocument } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, "../../");
const jsonFile = path.join(outputDir, "swagger.json");
const yamlFile = path.join(outputDir, "openapi.yaml");

mkdirSync(outputDir, { recursive: true });
writeFileSync(jsonFile, `${JSON.stringify(swaggerDocument, null, 2)}\n`, "utf8");
writeFileSync(yamlFile, YAML.stringify(swaggerDocument), "utf8");

console.log(`SwaggerHub OpenAPI specs exported to ${jsonFile} and ${yamlFile}`);
