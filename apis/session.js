let session_obj = {};

async function set_data(user_id, command_name, data) {
  //session_obj[user_id] = { command_name, data };
  if (!session_obj[user_id]) session_obj[user_id] = {};
  session_obj[user_id][command_name] = data;
}

async function get_data(user_id, command_name) {
  const obj = session_obj[user_id];
  //if (!obj) return [ undefined, undefined ];
  //return [ obj.command_name, obj.data ];
  if (!obj) return undefined;
  return obj.data;
}

async function set_current(user_id, command_name) {
  if (!session_obj[user_id]) session_obj[user_id] = {};
  session_obj[user_id].current = command_name;
}

async function get_current(user_id, command_name) {
  if (!session_obj[user_id]) return undefined;
  return session_obj[user_id].current;
}

const session = {
  set: async (user_id, command_name, data) => {
    set_data(user_id, command_name, data);
  },

  get: async (user_id, command_name) => {
    return get_data(user_id, command_name);
  },

  set_current: async (user_id, command_name) => {
    set_current(user_id, command_name);
  },

  get_current: async (user_id) => {
    return get_current(user_id);
  },

  remove: async (user_id) => {
    session_obj[user_id] = undefined;
  },
};

module.exports = session;