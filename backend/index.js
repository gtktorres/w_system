const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');
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
            - Username: ${member.username}}
            - ID: ${member.id}
            - Guild: ${member.Guild}
        `;

        //Send member info to Pattern analysis
        fetch(`http://localhost:5079/toxic_pattern_name/${member.username}`)
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
            console.log('message is sent');
            return await owner.send(userDetails);      
        }

        fetch(`http://localhost:5079/toxic_pattern_avatar/${member.avatar}`)
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
            console.log('message is sent'); 
            return await owner.send(userDetails);     
        }

    }catch(ex){
        console.error(`No Contest: ${error.message}`);
    }
});

// client.on('messageCreate', async (message) => {
//     try {
        
//         const owner = await client.user.fetch(process.env.DISCORD_OWNER_ID);

//         //Message Prep
//         const userDetails = `
//             **New Message**
//             - Username: ${message.author.username}}
//             - ID: ${message.author.id}
//             - Message Info: ${await message.fetch().toString()}
//         `;
//         console.log(await message.fetch().toString());
//         //Send message to Toxic Comment analysis`
//         fetch(`http://localhost:5079/toxic-message/${message}`)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('Traces of Toxicity: ' + data);
//             isToxic = data;
//         })
//         .catch((err) => {
//             console.log(err.message);
//         });

//         //Send direct message
//         if(isToxic) {
//             await owner.send(userDetails);
//             console.log('message is sent');      
//         }
        
//     } catch(error){
//         console.error('Message not sent: ' + error.message);
//     }
// });

client.login(process.env.DISCORD_TOKEN);