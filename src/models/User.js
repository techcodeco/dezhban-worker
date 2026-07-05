import { Schema, model } from "mongoose";

let userSchema = new Schema({
  chat_id: {
    type: String,
    required: true,
  },
  chat_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  chat_type: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("User", userSchema);
