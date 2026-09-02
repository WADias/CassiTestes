# Testes de Login CASSI

![Playwright](https://img.shields.io/badge/Playwright-Testing-45ba4b?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Status](https://img.shields.io/badge/Status-Validado-success)

Este projeto automatiza testes de autenticação do portal CASSI usando Playwright, com foco em cenários de login válidos e inválidos.

## Objetivo

Validar o comportamento das telas de autenticação para:

- CPF válido
- CNPJ válido
- documento inválido
- senha inválida
- campos vazios ou mal preenchidos

## Estrutura do projeto

| Arquivo | Descrição |
| --- | --- |
| `tests/login-cassi.spec.ts` | Login com CPF válido |
| `tests/login-cnpj.spec.ts` | Login com CNPJ válido |
| `tests/login-invalido.spec.ts` | Validações de erro, senha inválida e documento inválido |
| `tests/.env` | Variáveis sensíveis do ambiente |

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- navegador Chromium via Playwright
- acesso ao ambiente CASSI habilitado
- arquivo `tests/.env` configurado com dados válidos

## Instalação

```bash
npm install
```

## Configuração de ambiente

Crie ou ajuste o arquivo `tests/.env` com os valores corretos:

```env
CASSI_CPF="Valor Correto"
CASSI_CNPJ="Valor Correto"
CASSI_SENHA=sua_senha
```

> O projeto carrega esse arquivo automaticamente durante a execução dos testes.

## Execução dos testes

### 1) Modo headless (sem interface gráfica)

```bash
npx playwright test tests/login-cassi.spec.ts --project=chromium
```

```bash
npx playwright test tests/login-cnpj.spec.ts --project=chromium
```

```bash
npx playwright test tests/login-invalido.spec.ts --project=chromium
```

### 2) Modo headed (com interface gráfica visível)

```bash
npx playwright test tests/login-cassi.spec.ts --project=chromium --headed
```

```bash
npx playwright test tests/login-cnpj.spec.ts --project=chromium --headed
```

```bash
npx playwright test tests/login-invalido.spec.ts --project=chromium --headed
```

### 3) Executar a suíte completa

```bash
npx playwright test tests/login-cassi.spec.ts tests/login-cnpj.spec.ts tests/login-invalido.spec.ts --project=chromium --reporter=line
```

### 4) Abrir relatório HTML

```bash
npx playwright show-report
```

## Ajustes implementados

Durante a correção, foram aplicadas as seguintes melhorias:

- leitura correta do arquivo `.env` no diretório do projeto
- seleção explícita do perfil “Prestador” antes do login
- uso do seletor real do campo `#cpfCnpj`
- troca de `fill()` por `pressSequentially()` para simular a digitação real do usuário
- ajuste dos asserts para refletir as mensagens reais da aplicação:
  - `CPF Inválido`
  - `CNPJ Inválido`
  - `Senha inválida`

## Troubleshooting

### Erro: `No tests found`

Verifique se o caminho do arquivo está correto e se o arquivo termina com `.spec.ts` dentro da pasta `tests`.

```bash
npx playwright test --list
```

### Erro: botão de autenticação permanece desabilitado

Isso geralmente acontece quando:

- o perfil “Prestador” não foi selecionado
- o campo `#cpfCnpj` não foi preenchido com digitação real
- o valor informado não atende ao formato esperado pela tela

### Erro: variável de ambiente indefinida

Confirme que o arquivo `tests/.env` existe e contém as variáveis:

```env
CASSI_CPF=
CASSI_CNPJ=
CASSI_SENHA=
```

### Erro de login em ambiente externo

Se a aplicação estiver instável ou afetada por rede, volte a executar com modo visível:

```bash
npx playwright test tests/login-cassi.spec.ts --project=chromium --headed
```

## Cenários cobertos

| Cenário | Resultado esperado |
| --- | --- |
| CPF válido | Login concluído com sucesso |
| CNPJ válido | Login concluído com sucesso |
| CPF/CNPJ vazio | Botão de autenticação desabilitado |
| CPF/CNPJ mal formatado | Botão de autenticação desabilitado |
| CPF/CNPJ inválido | Mensagem `CPF Inválido` ou `CNPJ Inválido` |
| Senha incorreta | Mensagem `Senha inválida` |
| Senha vazia ou apenas espaços | Validação de erro exibida |

## Como contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração.
3. Ajuste ou adicione cenários em `tests/`.
4. Execute a suíte localmente.
5. Abra um pull request com descrição clara da mudança.

```bash
npx playwright test tests/login-cassi.spec.ts tests/login-cnpj.spec.ts tests/login-invalido.spec.ts --project=chromium --reporter=line
```

## Fluxo de CI

Para integração contínua, recomenda-se:

1. instalar dependências
2. validar o arquivo de ambiente
3. executar a suíte completa em modo headless
4. publicar o relatório HTML em caso de falha

```bash
npm install
npx playwright test tests/login-cassi.spec.ts tests/login-cnpj.spec.ts tests/login-invalido.spec.ts --project=chromium --reporter=line
```

## Checklist de release

- [ ] ambiente de testes configurado
- [ ] arquivo `.env` preenchido corretamente
- [ ] suíte executada com sucesso
- [ ] relatório revisado
- [ ] alterações commitadas e enviadas para o repositório
- [ ] validação manual final em ambiente estável

## Validação final

A suíte completa foi executada com sucesso e validada com o resultado abaixo:

```bash
11 passed (26.3s)
```
