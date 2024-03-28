import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern({cmd: 'process_searchs'})
  async findAllSearchs(): Promise<any>{
    return await this.searchService.processingSearch()
  }
}
