import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MatchDto, SummonerDto } from './dto/summoner.dto';
dotenv.config();

@Injectable()
export class SummonerService {
  constructor(private readonly httpService: HttpService) {}
  private logger = new Logger('HTTP');
  private headers = {
    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
    Origin: 'https://developer.riotgames.com',
    'X-Riot-Token': process.env.RIOT_API_KEY,
  };

  async getByName(nickname: string): Promise<SummonerDto> {
    try {
      const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}`;
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: this.headers,
      });
      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getMatchList(puuid: string): Promise<string[]> {
    try {
      const url = `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`;
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: this.headers,
      });
      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getMatch(matchId: string): Promise<MatchDto> {
    try {
      const url = `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`;
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: this.headers,
      });
      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getRecentMatches(nickname: string): Promise<MatchDto[]> {
    const user: SummonerDto = await this.getByName(nickname);
    const matchList: string[] = await this.getMatchList(user.puuid);
    const matches: MatchDto[] = [];

    for (let i = 0; i < matchList.length; i++) {
      matches.push(await this.getMatch(matchList[i]));
    }

    return matches;
  }
}
