import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { InvestmentService } from './investment.service';
import { Investment } from '../models/investment.model';
import { httpInterceptor } from '../interceptors/http.interceptor';

describe('InvestmentService', () => {
  let service: InvestmentService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api.mockfly.dev/mocks/8036277f-7108-4101-bd93-8d4ab9707da2/investiments';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(InvestmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of investments', (done) => {
    const mockInvestments: Investment[] = [
      {
        nome: 'INVESTIMENTO I',
        objetivo: 'Minha aposentadoria',
        saldoTotal: 39321.29,
        indicadorCarencia: 'N',
        acoes: [
          {
            id: '1',
            nome: 'Banco do Brasil (BBAS3)',
            percentual: 28.1
          }
        ]
      }
    ];

    const mockResponse = {
      response: {
        status: '200',
        data: {
          listaInvestimentos: mockInvestments
        }
      }
    };

    service.getInvestments().subscribe({
      next: (investments) => {
        expect(investments).toBeDefined();
        expect(Array.isArray(investments)).toBe(true);
        expect(investments.length).toBe(1);
        expect(investments[0].nome).toBe('INVESTIMENTO I');
        expect(investments[0].saldoTotal).toBe(39321.29);
        done();
      }
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.get('x-token')).toBe('token-valor');
    req.flush(mockResponse);
  });

});
