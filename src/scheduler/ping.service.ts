import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class PingService {
  private readonly httpAgent = new http.Agent({ keepAlive: true });
  private readonly httpsAgent = new https.Agent({ keepAlive: true });

  async executePing(url: string, timeoutMs: number) {
    const startTime = Date.now();
    try {
      const response = await axios.get(url, {
        timeout: timeoutMs,
        httpAgent: this.httpAgent,
        httpsAgent: this.httpsAgent,
      });
      return {
        success: true,
        statusCode: response.status,
        responseTime: Date.now() - startTime,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        statusCode: axiosError.response ? axiosError.response.status : 0,
        responseTime: Date.now() - startTime,
      };
    }
  }
}
