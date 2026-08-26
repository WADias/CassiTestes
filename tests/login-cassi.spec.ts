import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';

dotenv.config();

const cpf = process.env.CASSI_CPF;
const senha = process.env.CASSI_SENHA;

test.describe('Login CASSI - CPF ou CNPJ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://servicosonline.hml.cassi.com.br/GASC/v2/Usuario/Login/Prestador');
    await page.getByRole('button', { name: /prestador/i }).click();
  });

  test('deve realizar login com CPF válido', async ({ page }) => {
    // Validar se as variáveis de ambiente estão configuradas
    if (!cpf || !senha) {
      throw new Error('CASSI_CPF e CASSI_SENHA devem estar definidas no .env');
    }

    const cpfInput = page.getByRole('textbox', { name: /CPF ou CNPJ/i });
    await cpfInput.waitFor({ state: 'visible' });
    await cpfInput.click();
    await cpfInput.fill(cpf);

    const autenticarButton = page.getByRole('button', { name: /autenticar/i });
    await expect(autenticarButton).toBeEnabled();
    await autenticarButton.click();

    const senhaInput = page.locator('#senha');
    await senhaInput.waitFor({ state: 'visible' });
    await senhaInput.fill(senha);

    const realizarLoginButton = page.getByRole('button', { name: /realizar login/i });
    await expect(realizarLoginButton).toBeEnabled();
    await realizarLoginButton.click();

    await page.waitForURL(/PortalServicos\/Prestador/i, { timeout: 10000 });

    await expect(page.getByText(/MENSAGEM IMPORTANTE/i)).toBeVisible();
    await page.getByRole('button', { name: /fechar/i }).click();
    
    await expect(page.getByText(/Prestador - Portal de Serviços/i)).toBeVisible();
  }); 
});