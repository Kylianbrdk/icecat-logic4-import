/*
    Sets up the actual call to the endpoint to update the Logic4 data. 
*/

import { updateLogic4TemplatePropertyValue } from "../clients/logic4Client.js";

export async function sendLogic4Updates(updates) {
  const results = [];

  for (const update of updates) {
    try {
      const result = await updateLogic4TemplatePropertyValue(update);
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        templatePropertyId: update.TemplatePropertyId,
        name: update.Name,
        attemptedValue: update.NewIcecatValue,
        error: error.message,
      });
    }
  }

  return results;
}
