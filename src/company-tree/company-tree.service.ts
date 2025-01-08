import { Injectable } from '@nestjs/common';
import { Company } from './company-tree.model';
import axios from 'axios';

@Injectable()
export class CompanyService {
  private readonly companyApiUrl =
    'https://5f27781bf5d27e001612e057.mockapi.io/webprovise/companies';
  private readonly travelApiUrl =
    'https://5f27781bf5d27e001612e057.mockapi.io/webprovise/travels';

  async getCompanyTree(id?: string): Promise<Company[]> {
    const [companies, travels] = await Promise.all([
      this.fetchCompanies(),
      this.fetchTravels(),
    ]);

    const companyMap = this.buildCompanyMap(companies);
    this.calculateTravelCosts(companyMap, travels);

    let roots;

    if (id && companyMap.has(id)) {
      roots = this.buildTree(companyMap, id);
    } else {
      roots = this.buildTree(companyMap);
    }
    this.calculateTotalCosts(roots);

    return roots;
  }

  private async fetchCompanies(): Promise<any[]> {
    const { data } = await axios.get(this.companyApiUrl);
    return data;
  }

  private async fetchTravels(): Promise<any[]> {
    const { data } = await axios.get(this.travelApiUrl);
    return data;
  }

  private buildCompanyMap(companies: any[]): Map<string, Company> {
    const map = new Map<string, Company>();
    companies.forEach((company) => {
      map.set(company.id, {
        ...company,
        cost: 0,
        children: [],
      });
    });
    return map;
  }

  private calculateTravelCosts(
    companyMap: Map<string, Company>,
    travels: any[],
  ) {
    travels.forEach((travel) => {
      const company = companyMap.get(travel.companyId);
      if (company) {
        company.cost += parseFloat(travel.price) || 0;
      }
    });
  }

  private buildTree(
    companyMap: Map<string, Company>,
    companyId?: string,
  ): Company[] {
    const roots: Company[] = [];

    if (companyId) {
      const company = companyMap.get(companyId);
      if (company) {
        this.buildSubTree(company, companyMap);
        roots.push(company);
      }
    } else {
      companyMap.forEach((company) => {
        if (company.parentId === '0') {
          roots.push(company);
        } else {
          const parent = companyMap.get(company.parentId);
          if (parent) {
            parent.children.push(company);
          }
        }
      });
    }

    return roots;
  }

  private buildSubTree(
    company: Company,
    companyMap: Map<string, Company>,
  ): void {
    company.children = [];

    companyMap.forEach((child) => {
      if (child.parentId === company.id) {
        company.children.push(child);
        this.buildSubTree(child, companyMap);
      }
    });
  }

  private calculateTotalCosts(companies: Company[]): void {
    companies.forEach((company) => {
      this.calculateCostRecursive(company);
    });
  }

  private calculateCostRecursive(company: Company): void {
    company.children.forEach((child) => {
      this.calculateCostRecursive(child);
      company.cost += child.cost; // Add the cost of child companies to the parent
    });
  }
}
