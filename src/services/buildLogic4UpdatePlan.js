export function buildLogic4UpdatePlan(
  logic4ProductId,
  matchedSpecs,
  logic4CurrentProductValues,
) {
  const updates = [];
  const unchanged = [];
  const missingFromIcecat = [];

  for (const matchedSpec of matchedSpecs) {
    const currentLogic4Value = logic4CurrentProductValues.find(
      (currentValue) => {
        return (
          currentValue.TemplatePropertyId === matchedSpec.templatePropertyId
        );
      },
    );

    const currentValues = currentLogic4Value?.Values || [];

    const alreadyHasIcecatValue = currentValues.includes(matchedSpec.value);

    if (alreadyHasIcecatValue) {
      unchanged.push({
        TemplatePropertyId: matchedSpec.templatePropertyId,
        Name: matchedSpec.name,
        IcecatValue: matchedSpec.value,
        Logic4Values: currentValues,
        reason: "Logic4 already has the Icecat value",
      });

      continue;
    }

    updates.push({
      TemplatePropertyId: matchedSpec.templatePropertyId,
      Name: matchedSpec.name,
      PreviousLogic4Values: currentValues,
      NewIcecatValue: matchedSpec.value,
      requestBody: {
        TemplatePropertyId: matchedSpec.templatePropertyId,
        PropertyValuesPerProduct: [
          {
            ProductId: logic4ProductId,
            Values: [matchedSpec.value],
          },
        ],
      },
    });
  }

  for (const currentValue of logic4CurrentProductValues) {
    const matchingIcecatSpec = matchedSpecs.find((matchedSpec) => {
      return matchedSpec.templatePropertyId === currentValue.TemplatePropertyId;
    });

    if (!matchingIcecatSpec) {
      missingFromIcecat.push({
        ProductId: currentValue.ProductId,
        TemplatePropertyId: currentValue.TemplatePropertyId,
        TemplatePropertyName: currentValue.TemplatePropertyName,
        Logic4Values: currentValue.Values || [],
        action: "Leave unchanged",
        reason:
          "Logic4 has this property/value, but no matching Icecat spec was found",
      });
    }
  }

  return {
    updates,
    unchanged,
    missingFromIcecat,
  };
}
