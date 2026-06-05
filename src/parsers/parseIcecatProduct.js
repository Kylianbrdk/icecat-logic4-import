import { XMLParser } from "fast-xml-parser";

function toArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function parseIcecatProduct(xmlData) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const parsedIcecatXml = parser.parse(xmlData);

  const icecatRoot = parsedIcecatXml["ICECAT-interface"];
  const icecatProduct = icecatRoot.Product;

  const icecatProductFeatures = toArray(icecatProduct.ProductFeature);

  const specs = icecatProductFeatures
    .map((feature) => {
      const featureName = Array.isArray(feature.Feature?.Name)
        ? feature.Feature.Name[0]?.Value
        : feature.Feature?.Name?.Value;

      const featureValue = feature.Presentation_Value || feature.Value;

      return {
        name: featureName,
        value: featureValue,
      };
    })
    .filter((spec) => spec.name && spec.value);

  return {
    icecatId: icecatProduct.ID,
    productNumber: icecatProduct.Prod_id,
    title: icecatProduct.Title,
    brand: icecatProduct.Supplier?.Name,
    specs,
  };
}
