const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./db/config.json")
const fs = require('fs');


bot.commands = new Discord.Collection();
    
fs.readdir('./cmds/', (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if(jsfile.length <= 0) {
        console.log('[HANDLE]: Aucune commande trouvée')
    }
    jsfile.forEach((f,i) =>{
        let props = require(`./cmds/${f}`);
        console.log('[HANDLER]: ${f} ok !')
        bot.commands.set(props.config.name, props)
    })
})

bot.on("ready", async () => {

    console.log(`(${bot.user.username}): En Ligne`)

    let statuses = [
        "Bot en développement",
        "Bientôt disponible sur le serveur",
        "En cours de test",
        `En ligne sur ${bot.guild}` 
    ]
    setInterval(function(){
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {type: "WATCHING"})
    }, 5000)
})

bot.on("message", async message => {

    if(message.author.bot) return; // *test
    if(message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = bot.commands.get(command.slice(prefix.length))
    if(commandFile) commandFile.run(bot, message, args)
}) 

bot.login(process.env.TOKEN);