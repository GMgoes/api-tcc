import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const { PORT } = process.env;

  const app = await NestFactory.create(AppModule);

  app.listen(PORT).then(() => {
    console.log(`Server is running at http://localhost:${PORT}/api 🚀`);
  });
}

bootstrap();
