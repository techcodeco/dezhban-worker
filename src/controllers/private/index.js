import commandHandler from "./commands/index.js";
export default async (bot, update) => {
  if (update.isCommand) {
    await commandHandler(bot, update);
    return;
  }
  if (update.isQuery) {
    console.log("query");
    return;
  }
  console.log("هیچی");
};
