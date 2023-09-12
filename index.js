require("dotenv").config();
const t_api = require("./apis/telegram_api");
const manager = require("./command_manager")("./commands");
const fastify = require("fastify")({ logger: true });

fastify.route({
  method: 'GET',
  path: '/',
  handler: async function (request, reply) {
    return "Hello, world";
  }
});

fastify.route({
  method: 'POST',
  path: '/message',
  handler: async function (request, reply) {
    reply.code(200).send("ok");

    //console.log(request.body);
    // request.body по идее и есть msg которое мы ожидаем
    const ret = await manager.dispatch(request.body);

    return reply;
  },
  schema: {
    body: {
      type: "object",
    },
  }
});

(async () => {
  // как же тут сделать аккуратно команды
  // во первых явно должны быть алиасы - в самих командах должны быть дополнительные данные а не просто функция как раньше
  // во вторых желательно забирать команды автоматически - читать файловую систему из определенной папки по аналогии с локализацией
  // в третьих как задать порядок команд - веса? не особо понятно пока что
  // в четвертых как хранить сессию - для сессии точно нужен отдельный api

  try {
    await fastify.listen({ 
      port: process.env.SERVER_PORT,
      host: process.env.SERVER_HOST, 
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();