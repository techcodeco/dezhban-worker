import { start } from "./start.command.js";

export default async (bot, update) => {
  let command = update.command;
  switch (command) {
    case "start":
      await start(bot, update);
      break;
    default:
      break;
  }
};
