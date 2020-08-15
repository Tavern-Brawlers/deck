import { Message, RichEmbed, User} from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

const { Pool } = require('pg');

const inventory = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  pool.query(`select count(card), title from (select card,player,title,description from stash inner join card on stash.card=card.id where player='${msg.author.id}') as playerStash group by playerStash.card, playerStash.title order by playerStash.title`, (err: any, res: any) => {
    if(!err){
      const stash: {count: number, title: string}[] = res.rows;

      const embed = new RichEmbed()
      .setColor('#b2ebf2')
      .setDescription(`Инвентарь пользователя <@${msg.author.id}>`)
      .setFooter(stash.map(el => `${el.title} ${el.count}`).join('\n'));

      msg.channel.sendEmbed(embed);
    }
    pool.end();
  });
};

export default inventory;
