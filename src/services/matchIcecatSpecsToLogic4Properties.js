export function matchIcecatSpecsToLogic4Properties(
  icecatSpecs,
  logic4TemplateProperties,
) {
  const matchedSpecs = [];
  const unmatchedSpecs = [];

  for (const icecatSpec of icecatSpecs) {
    const matchingLogic4Property = logic4TemplateProperties.find((property) => {
      return property.Name === icecatSpec.name;
    });

    if (!matchingLogic4Property) {
      unmatchedSpecs.push({
        name: icecatSpec.name,
        value: icecatSpec.value,
        reason: "No matching Logic4 template property found",
      });

      continue;
    }

    matchedSpecs.push({
      name: icecatSpec.name,
      value: icecatSpec.value,
      templatePropertyId: matchingLogic4Property.TemplatePropertyId,
    });
  }

  return {
    matchedSpecs,
    unmatchedSpecs,
  };
}
