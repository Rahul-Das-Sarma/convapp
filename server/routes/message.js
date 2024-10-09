import express from "express";
import { allMessages, chatList, sendMessage } from "../controller/message.js";

const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);
router.route("/fetch/:chatId").get(chatList);

export default router;
