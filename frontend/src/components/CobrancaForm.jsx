import { useState } from "react";

const initialState = {
  nomeCliente: "",
  valor: "",
  dataVencimento: ""
};

function CobrancaForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await onSubmit({
      nomeCliente: form.nomeCliente,
      valor: Number(form.valor),
      dataVencimento: form.dataVencimento
    });

    setForm(initialState);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Nova cobranca</h2>

      <label>
        Nome do cliente
        <input
          name="nomeCliente"
          value={form.nomeCliente}
          onChange={handleChange}
          placeholder="Ex: Maria Souza"
          required
        />
      </label>

      <label>
        Valor
        <input
          name="valor"
          type="number"
          min="0.01"
          step="0.01"
          value={form.valor}
          onChange={handleChange}
          placeholder="Ex: 150.75"
          required
        />
      </label>

      <label>
        Data de vencimento
        <input
          name="dataVencimento"
          type="date"
          value={form.dataVencimento}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Criar cobranca"}
      </button>
    </form>
  );
}

export default CobrancaForm;
