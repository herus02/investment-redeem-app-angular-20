import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { httpInterceptor } from './http.interceptor';
import { Investment } from '../models/investment.model';

describe('HttpInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add x-token header to requests', () => {
    const testUrl = 'https://api.mockfly.dev/test';
    const mockResponse = {
      response: {
        status: '200',
        data: {
          listaInvestimentos: []
        }
      }
    };

    httpClient.get<Investment[]>(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.get('x-token')).toBe('token-valor');
    req.flush(mockResponse);
  });

  it('should extract listaInvestimentos from response.data.listaInvestimentos', (done) => {
    const testUrl = 'https://api.mockfly.dev/test';
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

    httpClient.get<Investment[]>(testUrl).subscribe({
      next: (data: Investment[]) => {
        expect(data).toEqual(mockInvestments);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(1);
        expect(data[0].nome).toBe('INVESTIMENTO I');
        expect(data[0].saldoTotal).toBe(39321.29);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.get('x-token')).toBe('token-valor');
    req.flush(mockResponse);
  });

  it('should handle response with data.listaInvestimentos (fallback)', (done) => {
    const testUrl = 'https://api.mockfly.dev/test';
    const mockInvestments: Investment[] = [
      {
        nome: 'INVESTIMENTO II',
        objetivo: 'Viajen dos sonhos',
        saldoTotal: 7300,
        indicadorCarencia: 'N',
        acoes: []
      }
    ];

    const mockResponse = {
      data: {
        listaInvestimentos: mockInvestments
      }
    };

    httpClient.get<Investment[]>(testUrl).subscribe({
      next: (data: Investment[]) => {
        expect(data).toEqual(mockInvestments);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(mockResponse);
  });

  it('should return original response if structure does not match', (done) => {
    const testUrl = 'https://api.mockfly.dev/test';
    const mockResponse = { someOtherStructure: 'value' };

    httpClient.get<any>(testUrl).subscribe({
      next: (data: any) => {
        expect(data).toEqual(mockResponse);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(mockResponse);
  });

  it('should handle empty listaInvestimentos array', (done) => {
    const testUrl = 'https://api.mockfly.dev/test';
    const mockResponse = {
      response: {
        status: '200',
        data: {
          listaInvestimentos: []
        }
      }
    };

    httpClient.get<Investment[]>(testUrl).subscribe({
      next: (data: Investment[]) => {
        expect(data).toEqual([]);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(0);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(mockResponse);
  });
});
