import { Module } from '@nestjs/common';
import { CompanyTreeResolver } from './company-tree.resolver';

@Module({
  providers: [CompanyTreeResolver],
})
export class CompanyTreeModule {}
