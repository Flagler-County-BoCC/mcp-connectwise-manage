import { createHttpClient } from './http-client.js';
import { AgreementsService } from '../tools/agreements/agreements.service.js';
import { CompaniesService } from '../tools/companies/companies.service.js';
import { ProjectsService } from '../tools/projects/projects.service.js';
import { SalesService } from '../tools/sales/sales.service.js';
import { ServiceDeskService } from '../tools/service/service.service.js';
import { SetupService } from '../tools/setup/setup.service.js';
import { TimeService } from '../tools/time/time.service.js';

const httpClient = createHttpClient();

export const agreementsService = new AgreementsService(httpClient);
export const companiesService = new CompaniesService(httpClient);
export const projectsService = new ProjectsService(httpClient);
export const salesService = new SalesService(httpClient);
export const serviceDeskService = new ServiceDeskService(httpClient);
export const setupService = new SetupService(httpClient);
export const timeService = new TimeService(httpClient);
