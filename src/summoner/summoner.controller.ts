import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { SummonerDto } from './dto/summoner.dto';
import { SummonerService } from './summoner.service';

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get('/:nickname')
  async getUserByName(@Param('nickname') nickname: string): Promise<any> {
    return await this.summonerService.getRecentMatches(nickname);
  }
}
