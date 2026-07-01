import fs from "fs";
import { EventEmitter } from "node:events";
import axios from "axios";
import axiosRetry from "axios-retry";
import FormData from "form-data";
import parseBotMarkdown from "../utils/parseBotMarkdown.js";
import NewMessageContext from "./contexts/NewMessageContext.js";
import { CacheableMemory } from "cacheable";
import EditMessageContext from "./contexts/EditMessageContext.js";

axiosRetry(axios, {
  retries: 5,
  retryDelay: (retryCount) => {
    return 0;
  },
  onRetry: (retryCount, err) => {
    console.log(
      "rubika bot api error try again retry count : ",
      retryCount,
      ", Error : ",
      err.message,
    );
  },
  retryCondition: (error) => {
    return (
      axios.isAxiosError(error) &&
      (error.response?.status >= 500 ||
        error.code === "ECONNRESET" ||
        error.code === "ENOTFOUND" ||
        error.code === "ETIMEDOUT")
    );
  },
});
class RubikaApi extends EventEmitter {
  constructor(token, options = {}) {
    super();
    this.token = token;
    this.API = "https://botapi.rubika.ir/v3";
    this.lastUpdateTime = 0;
    this.cache = new CacheableMemory({
      maxSize: 10000 || options.maxSize,
      lruSize: 1500 || options.lruSize,
    });
  }
  async request(method, body) {
    return await axios.post(`${this.API}/${this.token}/${method}`, body);
  }
  async polling() {
    let offset_id;
    while (true) {
      try {
        let { data } = await this.request("getUpdates", { offset_id });
        if (data.status == "OK") {
          offset_id = data.data.next_offset_id;
          for (const update of data.data.updates) {
            if (
              update.type === "NewMessage" ||
              update.type === "UpdatedMessage"
            ) {
              const now = Math.floor(Date.now() / 1000);
              const time = parseInt(
                update.type === "NewMessage"
                  ? update.new_message.time
                  : update.updated_message.time || this.lastUpdateTime + 1,
              );
              if (time <= this.lastUpdateTime) continue;
              if (now - time > 5) continue;
              this.lastUpdateTime = Math.max(this.lastUpdateTime, time);
              this.updateHandler(update);
            }
          }
        } else {
          throw new Error("polling error");
        }
      } catch (error) {
        console.log(`polling error `);
      }
    }
  }
  updateHandler(update) {
    switch (update.type) {
      case "UpdatedMessage":
        let editctx = new EditMessageContext(update);
        this.emit("updateMessage", editctx);
        break;
      case "NewMessage":
        let newctx = new NewMessageContext(update);
        this.emit("newMessage", newctx);
        if (newctx.text.startsWith("/")) this.emit("command", update);
        if (update.query) {
          update.query = update.query;
          this.emit("query", ctx);
        }
        break;
      case "RemovedMessage":
        this.emit("removeMessage", update);
        break;
      case "StartedBot":
        this.emit("start", update);
        break;
      case "StoppedBot":
        this.emit("stop", update);
        break;
      default:
        break;
    }
  }
  async sendMessage(options, meta) {
    if (meta) {
      let { metadata, real_text } = parseBotMarkdown(options.text);
      options.text = real_text;
      options.metadata = {
        meta_data_parts: metadata,
      };
    }
    return await this.request("sendMessage", options);
  }
  async requestSendFile(options = { type: "File" }) {
    return await this.request("requestSendFile", options);
  }
  async uploadFile(url, filePath, filename) {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename,
      contentType: "application/octet-stream",
    });
    return await axios.post(url, form);
  }
  async sendFile(options) {
    return await this.request("sendFile", options);
  }
}

export default RubikaApi;
