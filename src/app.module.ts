import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { CompanyTreeResolver } from './company-tree/company-tree.resolver';
import { CompanyService } from './company-tree/company-tree.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [CompanyTreeResolver, CompanyService],
})
export class AppModule {}
