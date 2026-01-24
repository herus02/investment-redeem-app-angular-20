# Sistema de Resgate de Investimentos (Angular 20)

Esta é uma aplicação que simula um **resgate personalizado de fundos de investimento em ações**. Esse projeto é parte de um desafio técnico feito para a Coopersystem. 😍💚👕

## TL:DR - Screenshots e Acesso
Link: https://herus02.github.io/investment-redeem-app-angular-20/

### Screenshots
- Listagem dos dados (home)
![Tela inicial](https://herus02.github.io/investment-redeem-app-angular-20/img/1.png)
- Dados do investimento:
![Tela de Resgate](https://herus02.github.io/investment-redeem-app-angular-20/img/2.png)
- Apresentar erros na tela de Investimento:![Erros na tela de Resgate](https://herus02.github.io/investment-redeem-app-angular-20/img/3.png) 
- Modal de erros na tela de Investimento:
![Erro em mais de um campo na tela de Resgate](https://herus02.github.io/investment-redeem-app-angular-20/img/4.png)
![Erro em um campo diferente do primeiro exemplo](https://herus02.github.io/investment-redeem-app-angular-20/img/5.png)
- Modal de Sucesso:![Modal de sucesso na tela de Resgate](https://herus02.github.io/investment-redeem-app-angular-20/img/6.png)

## Funcionalidades
Implementadas até o momento:

- Listagem de investimentos em tabela responsiva e botões com ações:
  - Visualizar (ícone de busca)
  - Editar (ícone de lápis)
  - Excluir (ícone de lixeira)
- Formatação de valores em Real
- Interface alinhada ao screenshot fornecido
- Testes unitários dos componentes e do service

## Requisitos
- Node.js (versão 22 .12 ou superior)
- npm

## Instalação
1. Instale as dependências:
```bash
npm  install
```
## Execução
Execute a aplicação em modo de desenvolvimento:
```bash
npm  start
```
A aplicação estará disponível em `http://localhost:4200`

## API
A aplicação consome a API mock:
```
GET https://api.mockfly.dev/mocks/8036277f-7108-4101-bd93-8d4ab9707da2/investiments
```
## Tecnologias Utilizadas
- Angular 20
  - Control Flow
  - Standalone Components
  - `Inject()` para importar services
- Bootstrap 5
- RxJS
- TypeScript
- Testes com Jasmine/Karma

## Resultado dos testes
- Cobertura de testes acima de 90%:
![Cobertura de testes](https://herus02.github.io/investment-redeem-app-angular-20/img/7.png)
- Testes cobertos:
![Cobertura de testes](https://herus02.github.io/investment-redeem-app-angular-20/img/8.png)
