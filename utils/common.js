const { performance } = require("perf_hooks");
const i18n = require("../locales/localization");

module.exports = {
  make_reply_keyboard: (locale, buttons, placeholder, button_back, is_persistent) => {
    let reply = {
      keyboard: [],
      one_time_keyboard: true,
      resize_keyboard: true,
      is_persistent: is_persistent ? is_persistent : false
    };

    for (const button of buttons) {
      reply.keyboard.push( [ { text: i18n.t(locale, button) } ] );
    }

    if (button_back) reply.keyboard.push( [ { text: i18n.t(locale, button_back) } ] );
    if (placeholder && placeholder !== "") reply.input_field_placeholder = i18n.t(locale, placeholder);

    return reply;
  },

  make_reply_keyboard2: (locale, buttons, placeholder, button_back, is_persistent) => {
    let reply = {
      keyboard: [],
      one_time_keyboard: true,
      resize_keyboard: true,
      is_persistent: is_persistent ? is_persistent : false
    };

    for (const button of buttons) {
      reply.keyboard.push( [ { text: button } ] );
    }

    if (button_back) reply.keyboard.push( [ { text: i18n.t(locale, button_back) } ] );
    if (placeholder && placeholder !== "") reply.input_field_placeholder = i18n.t(locale, placeholder);

    return reply;
  },

  get_keys: (obj, prefix, postfix) => {
    let keys = [];
    for (const [key, _] of Object.entries(obj)) {
      let final_key = key;
      if (prefix) final_key = prefix+final_key;
      if (postfix) final_key = final_key+postfix;
      keys.push(final_key);
    }
    return keys;
  },

  str_arr_modify: (arr, prefix, postfix) => {
    let local_arr = [...arr];
    for (let i = 0; i < local_arr.length; ++i) {
      let final_str = local_arr[i];
      if (prefix) final_str = prefix+final_str;
      if (postfix) final_str = final_str+postfix;
      local_arr[i] = final_str;
    }

    return local_arr;
  },

  perf: async (msg, func, ...args) => {
    const start_time = performance.now();
    const ret = await func(...args);
    const end_time = performance.now();
    console.info(`${msg} took ${end_time - start_time} milliseconds`);
    return ret;
  },

  make_message_from_user_request: (request_id, row) => {
    const name = row[0];
    const phone = row[1];
    const email = row[2];
    const type = row[3];
    const desc = row[4];
    const address = row[5];
    const room = row[6];

    const msg = `Заявка №${request_id} \nЗаявитель: ${name} \nТелефон: ${phone} \nЕмаил: ${email} \nТип: ${type} \nОписание: ${desc} \nАдрес: ${address} \nАудитория: ${room}`;
    return { text: msg };
  }
};