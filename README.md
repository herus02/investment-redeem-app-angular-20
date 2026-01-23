# Sistema de Resgate de Investimentos (Angular 20)

Esta é uma aplicação que simula um **resgate personalizado de fundos de investimento em ações**. Esse projeto é parte de um desafio técnico feito para a Coopersystem. 😍💚👕


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

## Tecnologias Utilizadas
- Angular 20
  - Control Flow
  - Standalone Components
  - `Inject()` para importar services
  - Interceptor para tratar o retorno
- Bootstrap 5
- RxJS
- TypeScript
- Testes unitários com Jasmine/Karma