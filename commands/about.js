const i18n = require("../locales/localization");
const message = require("../utils/message_parsing");
const t_api = require("../apis/telegram_api");

const initial_message_key = "about.initial_message";

// для команд могут потребоваться составленные кнопки команд, откуда их брать? не знаю
module.exports = {
  aliases: [ "/help" ],
  handle: async (msg, data) => {
    // тут в общем то просто строчку отправляем
    const chat_id = message.get_chat_id(msg);
    const locale = message.get_user_locale(msg);
    const str = i18n.t(locale, initial_message_key);
    await t_api.send_message(chat_id, { text: str });
    return [];
  },
};