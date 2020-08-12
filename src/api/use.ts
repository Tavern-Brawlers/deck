import { Message, RichEmbed } from 'discord.js';

import { Bot } from '../core/BotInterface';
import { ParsedMessage } from '../core/BotCommandParser';

import { cardDrawn } from '../core/BotEmbed';

import pickRandomCard, { rarityMapNumberHex } from '../services/deck.service';

const { Pool } = require('pg');

const use = async (cmd: ParsedMessage, msg: Message, bot: Bot): Promise<void> => {
  const args = cmd.arguments.join(' ');

  const pool = new Pool();

};

export default use;
