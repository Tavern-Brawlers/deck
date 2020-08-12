import { Message, RichEmbed, User} from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

const { Pool } = require('pg');

const inventory = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  pool.query(`select card,player,title,description from stash inner join card on stash.card=card.id where player='${msg.author.id}'`, (err: any, res: any) => {
    if(!err){
      const stash: {id: number, user: string, title: string, description: string}[] = res.rows;

      const embed = new RichEmbed()
      .setColor('#b2ebf2')
      .setDescription(`Инвентарь пользователя <@${msg.author.id}>`)
      .setFooter(stash.map(el => `${el.title}`).join('\n'));

      msg.channel.sendEmbed(embed);
    } else {
      msg.channel.send(`В инвентаре у <@${msg.author.id}> пусто`)
    }
    pool.end();
  });
};

export default inventory;
