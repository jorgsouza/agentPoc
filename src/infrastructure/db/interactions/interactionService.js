import { Interaction } from "../../../domain/entities/Interaction.js";

export async function saveInteraction(user_id, message, response) {
  try {
    const interaction = new Interaction(user_id, message, response);
    const InteractionModel = Interaction.getModel();
    await new InteractionModel(interaction.toDatabase()).save();
  } catch (error) {
    console.error("❌ Error saving interaction:", error.message);
  }
}

export async function getInteractions(user_id) {
  try {
    const InteractionModel = Interaction.getModel();
    const records = await InteractionModel.find({ user_id }).sort({ timestamp: -1 }).limit(10);
    return records.map(Interaction.fromDatabase);
  } catch (error) {
    console.error("❌ Error retrieving interactions:", error.message);
    return [];
  }
}
