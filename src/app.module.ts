import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import generateModulesSet from './utils/module-set';

@Module({
  imports: generateModulesSet(),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
