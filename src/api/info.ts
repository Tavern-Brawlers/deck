import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { cardDrawn } from '../core/BotEmbed';

import pickRandomCard, { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const info = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments;

  const pool = new Pool();

  if(args[0]){
        pool.query(`select * from card where card.title='${args[0]}'`, (err: any, res: any) => {
          if(!err){
          const cards: {stashid: number, card: number, player: number, title: string, description: string}[] = res.rows;

          if(cards.length > 0){
            const embed = new RichEmbed()
            .setColor('#8d6e63')
            .setDescription(`**${cards[0].title}**`)
            .addField('Описание карты',cards[0].description,false);
            msg.channel.sendEmbed(embed);
          } else {
            const embed = new RichEmbed()
            .setColor('#E64A19')
            .setDescription(`Карты **${args[0]}** не существует`)
  
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
