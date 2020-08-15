import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { cardDrawn } from '../core/BotEmbed';

import pickRandomCard, { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const draw = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  let rarity = 0;
  const probs = [0.35,0.25,0.20,0.15,0.05]
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < probs.length; i++){
    sum += probs[i];
    if ( rand < sum ) {
      rarity = i;
      break;
    }
  }

  pool.query(`select * from card where rarity='${rarity}'`)
      .then((res: {rows: {id: number, user: string, title: string, description: string}[]}) => {
              const stash = res.rows;
              const randomCard = stash[Math.floor(Math.random() * stash.length)];

              pool.query(`insert into stash (card, player) values ('${randomCard.id}', '${msg.author.id}');`)
                  .then(() => {
                    const embed = new RichEmbed()
                    .setColor(rarityMapNumberHex.get(rarity)!)
                    .setDescription(`<@${msg.author.id}> вытянул карту ${randomCard.title}`)
                    .addField('Описание карты',randomCard.description,false);
                    msg.channel.sendEmbed(embed);
                  })
      });
};

export default draw;
