const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');
const puppeteer = require('puppeteer');
dotenv.config();

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
        //Send member info to Pattern Analysis
        //Message Prep
        const userDetails = `
            **New Message**
            - Username: ${member.DisplayName}}
            - ID: ${member.id}
            - Guild: ${member.Guild}
        `;

        // Retrieve member details
        const memberInfo = {
            Avatar: member.Avatar,
            Bannable: member.Bannable,
            CommunicationDisabledUntil: member.CommunicationDisableUntil.toDateString(),
            DisplayColor: member.DisplayColor,
            DisplayHexColor: member.DisplayHexColor,
            DisplayName: member.DisplayName,
            DMChannel: member.DMChannel,
            Flags: member.Flags,
            Guild: member.Guild,
            ID: member.id,
            JoinedAt: member.joinedAt.toDateString(),
            Kickable: member.Kickable,
            Manageable: member.Manageable,
            Moderatable: member.Moderatable,
            Nickname: member.Nickname,
            Partial: member.Partial,
            Pending: member.Pending,
            Permissions: member.Permissions,
            PremiumSince: member.PremiumSince.toDateString(),
            Presence: member.Presence,
            Roles: member.Roles,
            User: member.User,
            Voice: member.Voice

        };

        //Send member info to Pattern analysis
        fetch(`http://localhost:5079/PatternAnalysis${memberInfo}`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Significant Pattern: ' + data);
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

    }catch(ex){
        console.error(`No Contest: ${error.message}`);
    }
});

client.on('messageCreate', async (message) => {
    try {
        
        const owner = await client.user.fetch(process.env.DISCORD_OWNER_ID);

        //Message Prep
        const userDetails = `
            **New Message**
            - Username: ${message.author.username}}
            - ID: ${message.author.id}
            - Message Info: ${(await message.fetch()).toString()}
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