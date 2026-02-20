import { useState, useEffect, useRef } from "react";
//---Remove caracteres não numéricos e aplica formatação de CPF (000.000.000-00) ---//
const aplicarMascaraCPF = (valor) => {
  // 1. Remove tudo que não é número e limita a 11 caracteres
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
  // 2. Aplica a formatação baseada na quantidade de números digitados
  return apenasNumeros
    .replace(/(\d{3})(\d)/, "$1.$2") // Primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // Segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Hífen
};
// Formata telefone para (99) 99999-9999
const aplicarMascaraTelefone = (valor) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1") // Garante que não ultrapasse 11 dígitos
    .slice(0, 15);
};

function CobrancaForm({ onSalvar, onCancelar, cobrancaEditando, loading }) {
  const [form, setForm] = useState({
    nomeCliente: "",
    valor: "",
    dataVencimento: "",
    cpf: "",
    email: "",
    telefone: "",
  });

  // Referências para manipulação direta do foco nos elementos do DOM
  const nomeRef = useRef(null);
  const valorRef = useRef(null);
  const dataRef = useRef(null);
  const cpfRef = useRef(null);
  const emailRef = useRef(null);
  const telefoneRef = useRef(null);
  const botaoSalvarRef = useRef(null);

  // --- Função para poder pular ao clicar em ENTER ---
  const pularFoco = (e, proximoCampoRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (proximoCampoRef && proximoCampoRef.current) {
        proximoCampoRef.current.focus();
      }
    }
  };

  // Preenche o formulário quando o componente recebe dados para edição
  useEffect(() => {
    if (cobrancaEditando) {
      setForm({
        ...cobrancaEditando,
        // Converte o valor numérico vindo da API para formato de moeda brasileira
        valor: cobrancaEditando.valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      });
    }
  }, [cobrancaEditando]);

  const formatarMoeda = (valor) => {
    let v = valor.replace(/\D/g, "");
    if (!v) return "";
    return (Math.abs(v) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  // Converte a string formatada "R$ 1.234,56" de volta para número 1234.56 para persistência
  const limparValor = (valor) => {
    return parseFloat(
      valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );
  };

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = () => {
    const valorLimpo = limparValor(form.valor);

    // Validações básicas de segurança antes da submissão
    if (!form.nomeCliente.trim()) {
      alert("Nome obrigatório");
      return;
    }

    if (isNaN(valorLimpo) || valorLimpo <= 0) {
      alert("Valor inválido");
      return;
    }

    // Envia os dados finais e formatados para serem salvos no banco de dados através do componente pai
    onSalvar({
      ...form,
      valor: valorLimpo,
    });
  };

  /* Renderização do formulário de cobrança.
  Utiliza refs para gerenciar a navegação via teclado (Enter/Tab) entre os campos 
  e máscaras específicas para formatação de dados em tempo real.
*/
  return (
    <div className="formulario-container">
      <input
        ref={nomeRef}
        placeholder="Nome"
        value={form.nomeCliente}
        onChange={(e) => handleChange("nomeCliente", e.target.value)}
        onKeyDown={(e) => pularFoco(e, valorRef)} // Pula para Valor
      />

      <input
        ref={valorRef}
        placeholder="Valor"
        value={form.valor}
        onChange={(e) => handleChange("valor", formatarMoeda(e.target.value))}
        onKeyDown={(e) => pularFoco(e, dataRef)} // Pula para Data
      />

      <input
        ref={dataRef}
        type="date"
        value={form.dataVencimento}
        onChange={(e) => handleChange("dataVencimento", e.target.value)}
        onKeyDown={(e) => pularFoco(e, cpfRef)} // Pula para CPF
      />

      <input
        ref={cpfRef}
        placeholder="CPF"
        value={form.cpf}
        onChange={(e) => handleChange("cpf", aplicarMascaraCPF(e.target.value))}
        onKeyDown={(e) => pularFoco(e, emailRef)} // Pula para Email
      />

      <input
        ref={emailRef}
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onKeyDown={(e) => pularFoco(e, telefoneRef)} // Pula para Telefone
      />

      <input
        ref={telefoneRef}
        placeholder="Telefone"
        value={form.telefone}
        onChange={(e) =>
          handleChange("telefone", aplicarMascaraTelefone(e.target.value))
        }
        onKeyDown={(e) => pularFoco(e, botaoSalvarRef)} // Pula para o Botão Salvar
      />

      <div className="botoes-formulario">
        <button
          ref={botaoSalvarRef}
          onClick={handleSubmit}
          disabled={loading}
          className="btn-salvar"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>

        <button onClick={onCancelar} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default CobrancaForm;
