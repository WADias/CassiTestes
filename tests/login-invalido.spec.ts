import { test, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const cpf = process.env.CASSI_CPF;
const cnpj = process.env.CASSI_CNPJ;
const senha = process.env.CASSI_SENHA;

test.describe('Login CASSI - Dados inválidos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://servicosonline.hml.cassi.com.br/GASC/v2/Usuario/Login/Prestador');
    await page.getByRole('button', { name: /prestador/i }).click();
  });

  // ---------- CAMPO CPF/CNPJ VAZIO OU MAL FORMATADO ----------

  test('não deve habilitar "Autenticar" com campo CPF/CNPJ vazio', async ({ page }) => {
    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeDisabled();
  });

  test('não deve habilitar "Autenticar" com CPF/CNPJ em formato inválido (poucos dígitos)', async ({ page }) => {
    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.pressSequentially('123');

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeDisabled();
  });

  test('não deve habilitar "Autenticar" com CPF/CNPJ contendo letras', async ({ page }) => {
    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.pressSequentially('abcdefghijk');

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeDisabled();
  });

  // ---------- CPF/CNPJ COM FORMATO VÁLIDO, MAS DADO INVÁLIDO ----------

  const documentosInvalidos = [
    { tipo: 'CPF', valor: '11111111111' },
    { tipo: 'CNPJ', valor: '11111111111111' },
  ];

  for (const { tipo, valor } of documentosInvalidos) {
    test(`deve exibir mensagem de ${tipo} inválido`, async ({ page }) => {
      const cpfInput = page.locator('#cpfCnpj');
      await cpfInput.waitFor({ state: 'visible' });
      await cpfInput.click();
      await cpfInput.pressSequentially(valor);

      const autenticarButton = page.getByRole('button', { name: /autenticar/i });
      await expect(autenticarButton).toBeDisabled();
      await expect(page.getByText(new RegExp(`${tipo} Inválido`, 'i'))).toBeVisible();
    });
  }

  // ---------- SENHA INVÁLIDA COM CPF/CNPJ VÁLIDO (data-driven) ----------

  const credenciaisValidas = [
    { tipo: 'CPF', valor: cpf },
    { tipo: 'CNPJ', valor: cnpj },
  ];

  for (const { tipo, valor } of credenciaisValidas) {
    test(`deve exibir "Senha inválida" para senha incorreta com ${tipo} válido`, async ({ page }) => {
      if (!valor) throw new Error(`CASSI_${tipo} deve estar definida no .env`);

      const cpfInput = page.locator('#cpfCnpj');
      await cpfInput.waitFor({ state: 'visible' });
      await cpfInput.click();
      await cpfInput.pressSequentially(valor);

      const autenticarButton = page.getByRole('button', { name: /autenticar/i });
      await expect(autenticarButton).toBeEnabled();
      await autenticarButton.click();

      const senhaInput = page.locator('#senha');
      await senhaInput.waitFor({ state: 'visible' });
      await senhaInput.fill('senhaErradaXPTO123');

      const realizarLoginButton = page.getByRole('button', { name: /entrar|realizar login/i });
      await expect(realizarLoginButton).toBeEnabled();
      await realizarLoginButton.click();

      await expect(page.getByText(/Senha inválida/i)).toBeVisible();
      await expect(page).not.toHaveURL(/PortalServicos\/Prestador/i);
    });
  }

  // ---------- SENHA VAZIA OU SÓ COM ESPAÇOS ----------

  test('não deve habilitar "Realizar login" com campo senha vazio', async ({ page }) => {
    if (!cpf) throw new Error('CASSI_CPF deve estar definida no .env');

    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.pressSequentially(cpf);

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeEnabled();
    await autenticarButton.click();

    const senhaInput = page.locator('#senha');
    await senhaInput.waitFor({ state: 'visible' });
    // não preenche a senha

    const realizarLoginButton = page.getByRole('button', { name: /realizar login/i });
    await expect(realizarLoginButton).toBeDisabled();
  });

  test('deve exibir "Senha inválida" com senha contendo apenas espaços', async ({ page }) => {
    if (!cpf) throw new Error('CASSI_CPF deve estar definida no .env');

    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.pressSequentially(cpf);

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeEnabled();
    await autenticarButton.click();

    const senhaInput = page.locator('#senha');
    await senhaInput.waitFor({ state: 'visible' });
    await senhaInput.fill('    ');

    const realizarLoginButton = page.getByRole('button', { name: /entrar|realizar login/i });
    await expect(realizarLoginButton).toBeEnabled();
    await realizarLoginButton.click();

    await expect(page.getByText(/Senha inválida/i)).toBeVisible();
  });
});