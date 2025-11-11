import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':slug/services')
  services(@Param('slug') slug: string) {
    return this.publicService.barbershopBySlug(slug);
  }

  @Get(':slug/availability')
  availability(@Param('slug') slug: string, @Query('date') date: string) {
    return this.publicService.availability(slug, date);
  }

  @Post(':slug/book')
  book(@Param('slug') slug: string, @Body() body: any) {
    return this.publicService.createBooking(slug, body);
  }
}
