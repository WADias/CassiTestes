import { test, expect } from '@playwright/test';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const cnpj = process.env.CASSI_CNPJ;
const senha = process.env.CASSI_SENHA;

test.describe('Login CASSI - CPF ou CNPJ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://servicosonline.hml.cassi.com.br/GASC/v2/Usuario/Login/Prestador');
    await page.getByRole('button', { name: /prestador/i }).click();
  });

  test('deve realizar login com CNPJ válido', async ({ page }) => {
    if (!cnpj || !senha) {
      throw new Error('CASSI_CNPJ ou CASSI_SENHA não foram configurados no arquivo .env');
    }

    const cpfInput = page.locator('#cpfCnpj');
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.pressSequentially(cnpj);

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeEnabled();
    await autenticarButton.click();

    const senhaInput = page.locator('#senha');
    await senhaInput.waitFor({ state: 'visible' });
    await senhaInput.fill(senha);

    const realizarLoginButton = page.getByRole('button', { name: /realizar login/i });
    await expect(realizarLoginButton).toBeEnabled();
    await realizarLoginButton.click();

    await expect(page).toHaveURL(/PortalServicos\/Prestador/i);

    await expect(page.getByText(/MENSAGEM IMPORTANTE/i)).toBeVisible();
    await page.getByRole('button', { name: /fechar/i }).click();

    await expect(page.getByText(/Prestador - Portal de Serviços/i)).toBeVisible();
  });
});