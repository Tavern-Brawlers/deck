import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { cardDrawn } from '../core/BotEmbed';

import pickRandomCard, { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const draw = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

  const rarity = Math.floor(Math.random() * 5);

  pool.query(`select * from card where rarity='${rarity}'`)
      .then((res: {rows: {id: number, user: string, title: string, description: string}[]}) => {
              const stash = res.rows;
              const randomCard = stash[Math.floor(Math.random() * stash.length)];
              msg.channel.send(`Вытянул карту ${randomCard.title}, пытаюсь пихнуть её в бд`);

              pool.query(`insert into stash (card, player) values ('${randomCard.id}', '${msg.author.id}');`)
                  .then(() => {
                    const embed = new RichEmbed()
                    .setColor(rarityMapNumberHex.get(rarity)!)
                    .setDescription(`<@${msg.author.id}> вытянул карту ${randomCard.title}`)
                    .setFooter(randomCard.description);
                    msg.channel.sendEmbed(embed);
                  })
      });
};

export default draw;
