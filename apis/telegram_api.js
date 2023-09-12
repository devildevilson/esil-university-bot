require("dotenv").config();
const axios = require("axios");
const common = require("../utils/common");
//const commands_order = require("./commands_order");

const TELEGRAM_SEND_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`;
const TELEGRAM_EDIT_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/editMessageText`;

// async function send_message(userdata, msg) {
//   msg.chat_id = userdata.chat_id;
//   const res = await axios.post(TELEGRAM_SEND_URI, msg);
//   userdata.prev_message = res.data.result.message_id;
// }

// async function update_message(userdata, msg) {
//   msg.chat_id = userdata.chat_id;
//   msg.message_id = userdata.prev_message;
//   const res = await axios.post(TELEGRAM_EDIT_URI, msg);
// }

const COMMANDS_PLACEHOLDER_MSG = "main.input_field_placeholder";
// async function send_last_message(userdata, msg) {
//   const locale = userdata.user.locale;
//   msg.chat_id = userdata.chat_id;

//   const commands_list = await userdata.user.get_commands_list();
//   //console.log("commands_list:", commands_list);
//   // зададим клавиатуру, теперь нам нужно задавать клавиатуру исходя из ролей пользователя
//   // это значит что нужно передать id пользователя в функцию и на выходе получить список команд
//   // как это лучше всего сделать? лучше всего конечно здесь получить список команд
//   // надо передать сюда функцию которая список команд этот соберет 
//   msg.reply_markup = undefined;
//   //const buttons = common.get_keys(commands, "main.");
//   //const buttons = common.str_arr_modify(commands_order, "main.");
//   const buttons = common.str_arr_modify(commands_list, "main.");
//   msg.reply_markup = common.make_reply_keyboard(locale, buttons, COMMANDS_PLACEHOLDER_MSG, undefined, true);

//   const res = await axios.post(TELEGRAM_SEND_URI, msg);
//   userdata.prev_message = res.data.result.message_id;
// }

// async function several_sending(chat_id_arr, msg) {
//   let local_msg = msg;
//   let promises_arr = [];
//   for (const id of chat_id_arr) {
//     local_msg.chat_id = id;
//     const p = axios.post(TELEGRAM_SEND_URI, local_msg);
//     promises_arr.push(p);
//   }

//   await Promise.all(promises_arr);
// }

const t_api = {
  send_message: async (chat_id, msg) => {
    msg.chat_id = chat_id;
    const res = await axios.post(TELEGRAM_SEND_URI, msg);
    return res.data.result.message_id;
  },

  update_message: async (chat_id, prev_message, msg) => {
    msg.chat_id = chat_id;
    msg.message_id = prev_message;
    await axios.post(TELEGRAM_EDIT_URI, msg);
  },


};

module.exports = t_api;

// module.exports = { 
//   send_message, 
//   update_message, 
//   send_last_message,
//   send_message_to_different_chats: several_sending
// };