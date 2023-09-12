const i18n = require("../locales/localization");
const message = require("../utils/message_parsing");
const common = require("../utils/common");
const t_api = require("../apis/telegram_api");

const initial_message_key = "settings.initial_message";
const locales_list_key = "settings.locales";
const placeholder_key = "settings.lang_input_field_placeholder";

// для того чтобы настройки сделать, нужно где-то запоминать пользователя
// поэтому лучше пока наверное это не делать
// мы вообще можем запомнить в сессии, но тогда нужно переделывать реакцию на новые данные

function prepare_locales(locale) {
  const locales_list = i18n.t(locale, locales_list_key);
  let obj = {};
  for (const [ code, str ] of Object.entries(locales_list)) {
    obj[str] = code;
  }

  return obj;
} 

function make_locales_keyboard(locale) {
  const locales_list = i18n.t(locale, locales_list_key);
  const button_list = Object.keys(locales_list).map(key => `settings.locales.${key}`);
  return common.make_reply_keyboard(locale, button_list, placeholder_key, undefined, true);
}

module.exports = {
  aliases: [ "/settings" ],
  handle: async (msg, data) => {
    // тут в общем то просто строчку отправляем
    const chat_id = message.get_chat_id(msg);
    const locale = data && data.locale ? data.locale : message.get_user_locale(msg);

    if (!data || !data.status) {
      const reply_keyboard = make_locales_keyboard(locale);
      const str = i18n.t(locale, initial_message_key);
      await t_api.send_message(chat_id, { text: str, reply_markup: reply_keyboard }); 
      return [ { status: "await", locale }, true ];
    }

    const locales_obj = prepare_locales(locale);
    const text = message.get_text(msg);
    if (!locales_obj[text]) {
      const reply_keyboard = make_locales_keyboard(locale);
      const str = i18n.t(locale, initial_message_key);
      await t_api.send_message(chat_id, { text: str, reply_markup: reply_keyboard }); 
      return [ { status: "await", locale }, true ];
    }

    const new_locale = locales_obj[text];
    
    return [ { locale: new_locale } ];
  },
};