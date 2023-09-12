const fmt = require("@paydirt/fmt");
const fs = require("fs");

let locales = {};
let fallback_locale = locales.ru;
let locales_arr = [];

function t(locale, key, ...args) {
  //if (typeof key !== "string") throw "invalid key";
  if (typeof locale !== "string") return key;
  if (key == "") return key;

  let l = locales[locale];
  if (l === undefined) l = fallback_locale;

  const keys = key.split('.');
  let cur = l;
  for (const k of keys) { 
    // может вернуть что нашли?
    if (cur === undefined || typeof cur !== "object") return key;
    cur = cur[k];
  }

  if (!cur) return key;
  if (typeof cur === "string") return fmt.sprintf(cur, ...args);
  return cur;
}

function get_supported_locales() {
  let arr = [];
  for (const [key, _] of Object.entries(locales)) {
    arr.push(key);
  }

  return arr;
}

function load_json(path) {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
}

function is_json(name) {
  const ext = ".json";
  const res = name.lastIndexOf(ext);
  return res + ext.length == name.length;
}

function get_file_name(name) {
  const point_index = name.lastIndexOf(".");
  let slash_index = name.lastIndexOf("/");
  if (slash_index === -1) slash_index = name.lastIndexOf("\\");
  let file_name = name;
  file_name = point_index !== -1 ? file_name.substring(0, point_index) : file_name;
  file_name = slash_index !== -1 ? file_name.substring(slash_index, file_name.length) : file_name;
  return file_name;
}

function reload() {
  const loc_files_folder = "./locales/";
  const files = fs.readdirSync(loc_files_folder);
  for (const file of files) {
    if (!is_json(file)) continue;
    const name = get_file_name(file);
    const data = load_json(loc_files_folder+file);
    locales[name] = data;
  }

  fallback_locale = locales.ru;
  locales_arr = get_supported_locales();
}

function supported_locales() {
  return locales_arr;
}

reload();

module.exports = { t, reload, supported_locales };

// nodejs сохраняет модули в кеше так что необязательно тащить как зависимость локализацию 