import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

const { Pool } = require('pg');

const info = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.filter(str => /\S/.test(str))

  const card = args.join(' ')

  const pool = new Pool();

  if(card){
        pool.query(`select * from card where card.title='${card}'`, (err: any, res: any) => {
          if(!err){
          const cards: {stashid: number, card: number, player: number, title: string, description: string, rule: string, example: string}[] = res.rows;

          if(cards.length > 0){
            const embed = new RichEmbed()
            .setColor('#8d6e63')
            .setThumbnail('https://cdn3.iconfinder.com/data/icons/fantasy-and-role-play-game-adventure-quest/512/Spell_Book-512.png')
            .setDescription(`**${cards[0].title}**`)
            .addField('Описание карты',cards[0].description,false)
            .addField('Правило',`${cards[0].rule}`,false)
            .addField('Пример использования',cards[0].example,false);
            msg.channel.sendEmbed(embed);
          } else {
            const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Карты **${card}** не существует`)
  
            msg.channel.sendEmbed(embed);
          }

          } else {
          msg.channel.send(err);
          }
        });
  } else {
    const embed = new RichEmbed()
    .setColor('FFB300')
    .setDescription(`<@${msg.author.id}> укажи название карты, которую хочешь применить`)

    msg.channel.sendEmbed(embed);
  }

};

export default info;
