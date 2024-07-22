import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class ElenaService {
  private readonly url = process.env.TELEGRAM_URL;
  private readonly token = process.env.TELEGRAM_BOT;
  private readonly chatId = process.env.TELEGRAM_GROUP_ID;

  async sendMessageInGroup(message: string, groupId: string = this.chatId) {
    const response = await axios.post(`${this.url}${this.token}/sendMessage`, {
      chat_id: groupId,
      text: message,
    });

    return response;
  }

  async sendMessageInChat(chatId: string, message: string) {
    await axios.get(
      `${this.url}${this.token}/sendMessage?chat_id=${chatId}&text=${message}`,
    );
  }

  async getInfo() {
    return await axios.get(`${this.url}${this.token}/getMe`);
  }
}
