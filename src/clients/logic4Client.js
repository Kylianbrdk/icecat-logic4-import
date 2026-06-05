export async function updateLogic4TemplatePropertyValue(update) {
  // API call is a dummy implementation. This should be integrated into the proper existing systems
  const response = await fetch(
    "/v3/ProductTemplates/SetProductTemplatePropertyValues",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update.requestBody),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Logic4 update failed for TemplatePropertyId ${update.TemplatePropertyId}. ` +
        `Status: ${response.status}. Response: ${errorText}`,
    );
  }

  return {
    success: true,
    templatePropertyId: update.TemplatePropertyId,
    name: update.Name,
    newValue: update.NewIcecatValue,
  };
}
