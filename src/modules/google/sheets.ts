import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { IDataToSpreadSheets } from 'src/interfaces/interface';

@Injectable()
export class SheetsService {
  private readonly spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  private async auth() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'src/modules/google/credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
      });

      const client = await auth.getClient();

      const googleSheets = google.sheets({
        version: 'v4',
        auth: client as any,
      });

      return {
        auth,
        client,
        googleSheets,
      };
    } catch (error) {
      console.error(error, 'SheetsService > auth > exception');
    }
  }

  async read() {
    try {
      const { auth, googleSheets } = await this.auth();

      const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: this.spreadsheetId,
        range: 'Page-01',
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      });

      return rows;
    } catch (error) {
      console.error(error, 'SheetsService > read > exception');
    }
  }

  async write(data: IDataToSpreadSheets) {
    try {
      const { quantity, date, sensorIndentification } = data;

      const { auth, googleSheets } = await this.auth();

      const row = await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: this.spreadsheetId,
        range: 'Page-01',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[sensorIndentification, quantity, date]],
        },
      });

      return row;
    } catch (error) {
      console.error(error, 'SheetsService > write > exception');
    }
  }
}
