import { readJsonFile, readXmlFile } from "./utils/readFiles.js";
import { parseIcecatProduct } from "./parsers/parseIcecatProduct.js";
import { matchIcecatSpecsToLogic4Properties } from "./services/matchIcecatSpecsToLogic4Properties.js";
import { buildLogic4UpdatePlan } from "./services/buildLogic4UpdatePlan.js";
import { sendLogic4Updates } from "./services/sendLogic4Updates.js";

const logic4TemplateProperties = readJsonFile(
  "./data/logic4-template-properties.json",
);
const logic4CurrentProductValues = readJsonFile(
  "./data/logic4-current-product-values.json",
);

const icecatXml = readXmlFile("./data/icecat-sample.xml");
const icecatProduct = parseIcecatProduct(icecatXml);

console.log("\nIcecat product info:");
console.log({
  icecatId: icecatProduct.icecatId,
  productNumber: icecatProduct.productNumber,
  title: icecatProduct.title,
  brand: icecatProduct.brand,
  specCount: icecatProduct.specs.length,
});

console.log("\nFirst 20 clean Icecat specs:");
console.table(icecatProduct.specs.slice(0, 20));

const matchResult = matchIcecatSpecsToLogic4Properties(
  icecatProduct.specs,
  logic4TemplateProperties,
);

const logic4ProductId = 1;
const updatePlan = buildLogic4UpdatePlan(
  logic4ProductId,
  matchResult.matchedSpecs,
  logic4CurrentProductValues,
);

console.log("\nValues that need to be updated in Logic4:");
console.dir(updatePlan.updates);

console.log("\nValues that are already correct:");
console.table(updatePlan.unchanged);

console.log("\nLogic4 values missing from Icecat:");
console.table(updatePlan.missingFromIcecat);

const dryRun = true;

if (dryRun) {
  console.log("\nDry run enabled. No updates were sent to Logic4.");
  console.log("\nUpdate payloads that would be sent:");
  console.dir(
    updatePlan.updates.map((update) => update.requestBody),
    { depth: null },
  );
} else {
  const updateResults = await sendLogic4Updates(updatePlan.updates);

  console.log("\nLogic4 update results:");
  console.table(updateResults);
}
