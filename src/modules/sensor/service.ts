import { Injectable } from '@nestjs/common';
import { IMessageToSend, ISensorInformation } from '../../interfaces/interface';
import 'dotenv/config';
import { ElenaService } from '../elena/service';
import * as moment from 'moment';
import { RepositoryService } from '../repository/mongo';
import { SheetsService } from '../google/sheets';
import { TYPE_MESSAGE } from 'src/enums/enum';

@Injectable()
export class SensorService {
  private readonly finalMinute = 15;
  private readonly inicialMinute = 0;
  private readonly optimalValue = 700;
  // private readonly maxAttempts = 5; // TODO: Implementar resiliencia à falhas

  private readonly sensorsIndentification = {
    '6def0549-a1df-410f-b4ae-ca29e4e298b4': 'Sensor 01 - Odin',
    '2dae44a1-37bd-4d0f-b04b-d9cc9fad5902': "Sensor 02 - Freyr'",
    '0f38f35a-8c44-41c8-a14c-cc8c2d3e8004': "Sensor 03 - Frigga'",
    '3aa323e4-c420-49dd-bc1c-c6b46e5ec1f9': "Sensor 04 - Tyr'",
    '31245365-3a6f-4b37-a0da-85d7a1a7f3e1': "Sensor 05 - Vidar'",
  };

  constructor(
    private readonly elenaService: ElenaService,
    private readonly sheetsService: SheetsService,
    private readonly repository: RepositoryService,
  ) {}

  async processData(data: ISensorInformation): Promise<void> {
    try {
      const newData = this.verifyQuantity(data);

      await this.elenaService.sendMessageInGroup(
        this.mountMessage(TYPE_MESSAGE.SENSOR_READING, newData),
      );

      await this.repository
        .write(data)
        .then(
          async () =>
            await this.elenaService.sendMessageInGroup(
              this.mountMessage(TYPE_MESSAGE.WRITING_DATABASE),
            ),
        );

      await this.sheetsService
        .write({
          date: moment(new Date()).format('DD/MM/YYYY, h:mm:ss'),
          quantity: String(data.quantity),
          sensorIndentification:
            this.sensorsIndentification[data.sensorIndentification],
        })
        .then(
          async () =>
            await this.elenaService.sendMessageInGroup(
              this.mountMessage(TYPE_MESSAGE.WRITING_SPREADSHEET),
            ),
        );
    } catch (error) {
      console.error(error, 'SensorService > processData > exception');
    }
  }

  private verifyQuantity(data: ISensorInformation): IMessageToSend {
    const { quantity, sensorIndentification } = data;

    const newData: IMessageToSend = {
      sensorIndentification,
    };

    const readingMoment = moment(new Date());

    const readingMinutes = readingMoment.minutes();

    newData.inScheduled =
      readingMinutes >= this.inicialMinute &&
      readingMinutes <= this.finalMinute;

    newData.critical = quantity < this.optimalValue;

    return newData;
  }

  private mountMessage(
    typeMessage: TYPE_MESSAGE,
    data?: IMessageToSend,
  ): string {
    switch (typeMessage) {
      case TYPE_MESSAGE.SENSOR_READING:
        return `**${
          this.sensorsIndentification[data.sensorIndentification]
        }**\n${
          data.inScheduled
            ? 'Dentro do horário previsto \u{2705}'
            : 'Fora do horário previsto \u{274C}'
        }\n${
          data.critical
            ? 'Fora do nível previsto \u{274C}'
            : 'Dentro do nível previsto \u{2705}'
        }\nHorário: ${moment(new Date()).format('DD/MM/YYYY, h:mm:ss\n')}`;

      case TYPE_MESSAGE.WRITING_DATABASE:
        return 'Registrando informação - BASE DE DADOS';

      case TYPE_MESSAGE.WRITING_SPREADSHEET:
        return 'Registrando informação - PLANILHA';
    }
  }
}
