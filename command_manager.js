const fs = require("fs");
const session = require("./apis/session");
const message = require("./utils/message_parsing");
const i18n = require("./locales/localization");
const t_api = require("./apis/telegram_api");
const common = require("./utils/common");

const command_not_found_key = "command_dispatcher.command_not_found";
const last_msg_key = "command_dispatcher.last_msg";
const placeholder_key = "command_dispatcher.placeholder";

async function setup_locale(msg) {
  const user_id = message.get_user_id(msg);
  // поищем в будущем в базе данных
  const locale = message.get_user_locale(msg);
  const settings_data = await session.get(user_id, "settings");
  const final_locale = settings_data && settings_data.locale ? settings_data.locale : 
    (locale === "ru" ? "ru" : (locale === "kk" ? "kk" : "en"));
  message.update_user_locale(msg, final_locale);
}

function get_file_name(file) {
  const file_name_arr = file.split(".");
  if (file_name_arr.length === 1) return file;
  file_name_arr.pop();
  return file_name_arr.join(".");
}

let command_manager = function(commands_dir) {
  this.commands = {};
  this.aliases = {};
  this.command_list_locales = {};

  const dir = commands_dir.trim();
  const has_trailing_slash = dir[dir.length-1] === "/" || dir[dir.length-1] === "\\";
  const files = fs.readdirSync(commands_dir);
  for (const file of files) {
    const final_path = has_trailing_slash ? `${commands_dir}${file}` : `${commands_dir}/${file}`;
    const command_name = get_file_name(file);

    const command_module = require(final_path);
    if (!command_module.handle) continue;

    if (command_module.aliases) {
      for (const alias of command_module.aliases) {
        if (this.aliases[alias]) throw `Command '${command_name}' alias '${alias}' is already registered`;
        this.aliases[alias] = command_name;
      }
    }

    if (command_name !== "start") {
      const loc_key = command_module.localization_key ? command_module.localization_key : `${command_name}.name`;
      const locales = i18n.supported_locales();
      for (const locale of locales) {
        if (!this.command_list_locales[locale]) this.command_list_locales[locale] = [];
        const str = i18n.t(locale, loc_key);
        this.command_list_locales[locale].push(str);
        this.aliases[str] = command_name;
      }
    }

    if (this.commands[command_name]) throw `Command '${command_name}' is already registered`;
    this.commands[command_name] = command_module;
  }
};

command_manager.prototype.dispatch = async function(msg) {
  await setup_locale(msg);

  const user_id = message.get_user_id(msg);
  //let [ command_name, data ] = await session.get(user_id);
  let command_name = await session.get_current(user_id);
  if (!command_name) {
    const text = message.get_text(msg);
    command_name = this.aliases[text];
  }

  if (!command_name) {
    const text = message.get_text(msg);
    const command_text = text.split(" ")[0];
    command_name = this.aliases[command_text];
  }

  const chat_id = message.get_chat_id(msg);
  if (!command_name) {
    // список команд должен быть локализован и отсортирован
    const locale = message.get_user_locale(msg);
    const msg_str = i18n.t(locale, command_not_found_key);
    const reply = common.make_reply_keyboard2(locale, this.command_list_locales[locale], placeholder_key, undefined, true);
    await t_api.send_message(chat_id, { text: msg_str, reply_markup: reply });
    return false;
  }

  const command = this.commands[command_name];
  // что ожидаем? надо понять нужно ли хранить данные в сессии и надо понять нужно ли отправить последнее сообщение
  const data = await session.get(user_id, command_name);
  const [ next_data, is_current, no_last_message ] = await command.handle(msg, data);
  console.log(next_data);

  if (is_current) await session.set_current(user_id, command_name);
  else await session.set_current(user_id, undefined);

  if (next_data) await session.set(user_id, command_name, next_data);
  else await session.set(user_id, command_name, undefined);

  if (!is_current && !no_last_message) {
    await setup_locale(msg);
    const locale = message.get_user_locale(msg);
    const msg_str = i18n.t(locale, last_msg_key);
    const reply = common.make_reply_keyboard2(locale, this.command_list_locales[locale], placeholder_key, undefined, true);
    await t_api.send_message(chat_id, { text: msg_str, reply_markup: reply });
  }

  return true;
};

command_manager.prototype.list = function() {
  let commands = {};
  for (const [ alias, command_name ] of Object.entries(this.aliases)) {
    if (!commands[command_name]) commands[command_name] = [];
    commands[command_name].push(alias);
  }

  return commands;
};

// команда ждет что мы отправим текущее сообщение, пользователя, состояние команды

module.exports = (...args) => { return new command_manager(...args); };