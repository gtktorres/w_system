import dotenv from 'dotenv';
dotenv.config();

const { Client, GatewayIntentBits, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

var isToxic = false;

client.on('guildMemberAdd', async (member) => {
    try {
        const browser = await puppeteer.lauch();
        //TODO: Create puppet that looks through and screenshot link elements
    }catch(ex){
        
    }
});

client.on('messageCreate', async (message) => {
    try {
        
        const owner = await client.user.fetch(process.env.DISCORD_OWNER_ID);

        //Message Prep
        const userDetails = `
            **New Member Joined**
            - Username: ${message.author.username}}
            - ID: ${message.author.id}
            - Member Info: ${(await message.fetch()).toString()}
        `;
        
        //Send message to Toxic Comment analysis
        fetch(`http://localhost:5079/ToxicMessage${message}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Traces of Toxicity: ' + data);
            isToxic = data;
        })
        .catch((err) => {
            console.log(err.message);
        });

        //Send direct message
        if(isToxic) {
            await owner.send(userDetails);
            console.log('message is sent');      
        }
        
    } catch(error){
        console.error('Message not sent: ' + error.message);
    }
});

client.login(process.env.DISCORD_TOKEN);