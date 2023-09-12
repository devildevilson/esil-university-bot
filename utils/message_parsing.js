module.exports = {
  is_valid: (msg) => {
    if (msg.message || msg.callback_query) return true;
    return false;
  },

  is_start: (msg) => {
    const text = get_text(msg);
    return text == "/start";
  },

  is_cancel: (msg) => {
    const text = get_text(msg);
    return text == "/cancel";
  },

  get_chat_id: (msg) => {
    if (msg.message || msg.callback_query) {
      if (msg.callback_query) {
        return msg.callback_query.message.chat.id;
      } else {
        return msg.message.chat.id;
      }
    }

    return undefined;
  },

  get_text: (msg) => {
    if (msg.message || msg.callback_query) {
      if (msg.callback_query) {
        return msg.callback_query.data.trim();
      } else {
        return msg.message.text.trim();
      }
    }

    return undefined;
  },

  get_type: (msg) => {
    if (msg.message) return "message";
    if (msg.callback_query) return "callback_query";
    return "undefined";
  },

  get_user_data: (msg) => {
    if (msg.message) {
      const user = msg.message.from;
      return { 
        telegram_id: user.id, 
        first_name: user.first_name ? user.first_name : "", 
        last_name: user.last_name ? user.last_name : "", 
        telegram_username: user.username ? user.username : "", 
        locale: user.language_code 
      };
    }

    if (msg.callback_query) {
      const user = msg.callback_query.message.from;
      return { 
        telegram_id: user.id, 
        first_name: user.first_name ? user.first_name : "", 
        last_name: user.last_name ? user.last_name : "", 
        telegram_username: user.username ? user.username : "", 
        locale: user.language_code 
      };
    }

    return {};
  },

  get_user_locale: (msg) => {
    if (msg.message) {
      const user = msg.message.from;
      return user.language_code;
    }

    if (msg.callback_query) {
      const user = msg.callback_query.message.from;
      return user.language_code;
    }

    return undefined;
  },

  update_user_locale: (msg, locale) => {
    if (msg.message) {
      const user = msg.message.from;
      user.language_code = locale;
    }

    if (msg.callback_query) {
      const user = msg.callback_query.message.from;
      user.language_code = locale;
    }
  },

  get_user_id: (msg) => {
    if (msg.message) {
      const user = msg.message.from;
      return user.id;
    }

    if (msg.callback_query) {
      const user = msg.callback_query.message.from;
      return user.id;
    }

    return undefined;
  },

  is_private_chat: (msg) => {
    if (msg.message) return msg.message.chat.type == "private";
    if (msg.callback_query) return msg.callback_query.message.chat.type == "private";
    return false;
  },
};