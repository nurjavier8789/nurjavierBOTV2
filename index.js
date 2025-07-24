const Eris = require("eris");
const mySecret = process.env['TOKEN']

const bot = new Eris("Bot " + mySecret, {
    getALLUsers: true,
    intents: ["guildPresences", "guildMembers", "guilds", "guildMessages"]
});
const prefix = "./";
const {stripIndents} = require("common-tags");
require("pluris")(Eris);

bot.on("ready", () => {
    console.log("Ready!");
    bot.editStatus("idle", {name: "Under Maintenance...", type: 0});
});

bot.on("messageCreate", async message => {
    if (message.author.bot || !message.channel.guild) return;
    
    
    let msg = message.content.toLowerCase();
    if (!msg.startsWith(prefix)) return;
    
    if (msg.startsWith(prefix + "ping")) {
        return message.channel.createMessage({content: "Pong!\nYou Connected", messageReferenceID: message.id})
    }

    if (msg.startsWith(prefix + "help")) {
        let embed = {
          title: "Help Command",
          description: "Prefix this bot is [`./`]",
          timestamp: new Date(),
          color: 0x7289DA,
          footer: {
            text: "by nurjavier8789"
          },
          fields: [
              {name: "`/serverinfo`", value: "see more info this server"},
              {name: "`/ping`", value: "check if you actually connected"}
          ]
        };

        return message.channel.createMessage({content: "Tada~", messageReferenceID: message.id, embed: embed})
    }

    if (msg.startsWith(prefix + "embed")) {
        let embed = {
            title: "Title",
            description: "Description",
            url: "https://google.com",
            timestamp: new Date(),
            color: 0x7289DA,
            footer: {
                text: "Footer"
            },
            fields: [
                {name: "Fields", value: "Value...", inline: true}
            ],
            author: {
                name: "This is Author", url: "https://discord.com"
            }
        };

        return message.channel.createMessage({embed: embed});
    }

    if (msg.startsWith(prefix + "2embed")) {
      let icon;
        if (message.guild.icon) icon = message.guild.dynamicIconURL(message.guild.icon.startsWith("a_") ? "gif" : "png", 128);
      
      const embed = new Eris.RichEmbed()
        .setColor(0x7289DA)
        .setThumbnail(icon)
        .setDescription("description")
        .setAuthor(message.guild.icon)
        .addField("fields", stripIndents`
        value...`)
        .addField("fields 2", stripIndents`
        value...`)

        if (message.guild.banner) embed.setImage(message.guild.dynamicBannerURL("png", 4096))
        if (message.guild.icon) embed.setAuthor(message.guild.name, icon, icon);

        return message.channel.createMessage({embed: embed})
    }

    if (msg.startsWith(prefix + "serverinfo")) {
        //Verification Level
        let vl = ["None", "Low", "Medium", "High", "Very High"];
        let verification_level = vl[message.guild.verificationlevel];

        //Stats
        let members = {
            real: message.guild.members.filter(x => !x.bot).length.toLocaleString(),
            bot: message.guild.members.filter(x => x.bot).length.toLocaleString(),
            presence: {
                online: message.guild.members.filter(x => x.status === "online").length.toLocaleString(),
                idle: message.guild.members.filter(x => x.status === "idle").length.toLocaleString(),
                dnd: message.guild.members.filter(x => x.status === "dnd").length.toLocaleString(),
                offline: message.guild.members.filter(x => !x.status || x.status === "offline").length.toLocaleString()
            }
        };

        let roles = message.guild.roles.size.toLocaleString();
        let region = message.guild.region.charAt(0).toUpperCase() + message.guild.region.slice(1);
        
        //Channels
        let channels = {
            total: message.guild.channels.size.toLocaleString(),
            text: message.guild.channels.filter(x => x.type === 0).length.toLocaleString(),
            voice: message.guild.channels.filter(x => x.type === 2).length.toLocaleString(),
            category: message.guild.channels.filter(x => x.type === 4).length.toLocaleString(),
        };

        //Emojis
        let emojis = {
            static: message.guild.emojis.filter(x => !x.animated).length.toLocaleString(),
            animated: message.guild.emojis.filter(x => x.animated).length.toLocaleString(),
            total: message.guild.emojis.length.toLocaleString()
        };

        let icon;
        if (message.guild.icon) icon = message.guild.dynamicIconURL(message.guild.icon.startsWith("a_") ? "gif" : "png", 128);

        const embed = new Eris.RichEmbed()
        .setColor(0x7289DA)
        .setThumbnail(icon)
        .setDescription(message.guild.description ? message.guild.description : "")
        .setAuthor(message.guild.name)
        .addField("Information", stripIndents`
        **Name:** ${message.guild.name}
        **ID:** ${message.guild.id}
        **Owner:** <@!${message.guild.ownerID}>
        **Region:** ${region}
        **Verification Level:** ${verification_level}
        **Created At:** ${new Date(message.guild.createdAt).toDateString()}
        `)
        .addField("Statistics", stripIndents`
        **Members:** ${message.guild.memberCount} (${members.real} members / ${members.bot} bots)
        **Roles:** ${roles}
        **Channels:** ${channels.total} (${channels.text} text / ${channels.voice} voice / ${channels.category} category)
        **Emojis** ${emojis.total} (${emojis.static} non-animated / ${emojis.animated} animated)
        **Status** ${members.presence.online} online / ${members.presence.idle} idle / ${members.presence.dnd} DND / ${members.presence.offline} offline
        `)
        .setTimestamp(Date.now())

        if (message.guild.banner) embed.setImage(message.guild.dynamicBannerURL("png", 4096))
        if (message.guild.icon) embed.setAuthor(message.guild.name, icon, icon);

        return message.channel.createMessage({embed: embed, messageReferenceID: message.id});
    };
});

bot.connect();