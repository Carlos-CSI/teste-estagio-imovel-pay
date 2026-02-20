function Pagination({ paginaAtual, totalPaginas, onChange }) {
  return (
    <div className="paginacao-controles">
      <button
        disabled={paginaAtual === 0}
        onClick={() => onChange(paginaAtual - 1)}
      >
        ⬅️
      </button>

      <span>
        Página {paginaAtual + 1} de {totalPaginas || 1}
      </span>

      <button
        disabled={paginaAtual + 1 >= totalPaginas}
        onClick={() => onChange(paginaAtual + 1)}
      >
        ➡️
      </button>
    </div>
  );
}

export default Pagination;
