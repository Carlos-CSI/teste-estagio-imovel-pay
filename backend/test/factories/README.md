# Factories de Teste

Este diretório contém *factories* reutilizáveis usadas pelos testes unitários e de integração.

Objetivo
- Gerar dados de teste consistentes e fáceis de customizar.
- Evitar repetição e colisões entre testes.

Local
- Arquivos: `test/factories/*`
- Barrel: `test/factories/index.ts` reexporta todas as factories para imports limpos.

Como usar
- Importe diretamente do índice:

```ts
import { makeCustomer, makeCreateCustomerDto, resetCustomerIdCounter } from '../../test/factories';
```

- Exemplo em um spec:

```ts
beforeEach(() => {
  resetCustomerIdCounter();
});

it('cria cliente', async () => {
  // Arrange
  const dto = makeCreateCustomerDto({ cpf: '11122233344' });
  const saved = makeCustomer({ cpf: dto.cpf });
  service.create.mockResolvedValue(saved);

  // Act
  const result = await controller.create(dto);

  // Assert
  expect(result).toEqual(saved);
});
```

Boas práticas
- Use `overrides` para customizar campos: `makeCustomer({ name: 'X' })`.
- Para IDs previsíveis em unit tests, use um contador resetável (`resetCustomerIdCounter`) no `beforeEach()`.
- Se precisar de unicidade global (e2e, concorrência), prefira `uuid`/`nanoid` na factory quando apropriado.
- Mantenha as factories pequenas e focadas; crie helpers quando houver lógica repetida.

Adicionar novas factories
- Crie um arquivo `test/factories/novo.factory.ts` e exporte funções.
- Atualize `test/factories/index.ts` com `export * from './novo.factory';`.

Motivação
- Factories ajudam a escrever testes mais legíveis, DRY e fáceis de manter. Elas são preferíveis a fixtures estáticas quando você precisa gerar variações ou garantir isolamento entre testes.
