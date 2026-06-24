import { EventEmitter } from "events";
import mongoose from "mongoose";

class MongoConnect extends EventEmitter {
  constructor(uri) {
    super();
    this.uri = uri;
    this.connect();
  }
  async connect() {
    try {
      let conn = await mongoose.connect(this.uri);
      this.emit("connected", conn);
    } catch (error) {
      this.emit("error", error);
    }
  }
}

export default MongoConnect;
