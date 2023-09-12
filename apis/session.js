let session_obj = {};

async function set_data(user_id, command_name, data) {
  session_obj[user_id] = { command_name, data };
}

async function get_data(user_id) {
  const obj = session_obj[user_id];
  if (!obj) return [ undefined, undefined ];
  return [ obj.command_name, obj.data ];
}

const session = {
  set: async (user_id, command_name, data) => {
    set_data(user_id, command_name, data);
  },

  get: async (user_id) => {
    return get_data(user_id);
  },

  remove: async (user_id) => {
    session_obj[user_id] = undefined;
  },
};

module.exports = session;