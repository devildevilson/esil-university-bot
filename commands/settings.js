const i18n = require("../locales/localization");
const message = require("../utils/message_parsing");
const t_api = require("../apis/telegram_api");

const initial_message_key = "settings.initial_message";

// для того чтобы настройки сделать, нужно где-то запоминать пользователя
// поэтому лучше пока наверное это не делать

module.exports = {
  aliases: [ "/settings" ],
  handle_123: async (msg, data) => {
    // тут в общем то просто строчку отправляем
    const chat_id = message.get_chat_id(msg);
    const locale = message.get_user_locale(msg);
    const str = i18n.t(locale, initial_message_key);
    await t_api.send_message(chat_id, { text: str });
    return [];
  },
};