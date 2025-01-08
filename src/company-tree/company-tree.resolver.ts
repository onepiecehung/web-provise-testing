import { Resolver, Query, Args } from '@nestjs/graphql';
import { Company } from './company-tree.model';
import { CompanyService } from './company-tree.service';

@Resolver(() => Company)
export class CompanyTreeResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => [Company], { name: 'companyTree' })
  async getCompanyTree(
    @Args('id', { type: () => String, nullable: true }) id?: string,
  ) {
    return this.companyService.getCompanyTree(id);
  }
}
