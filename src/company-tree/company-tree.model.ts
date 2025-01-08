import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Company {
  @Field()
  id: string;

  @Field()
  createdAt: string;

  @Field()
  name: string;

  @Field()
  parentId: string;

  @Field(() => Float)
  cost: number;

  @Field(() => [Company], { nullable: true })
  children?: Company[];
}
