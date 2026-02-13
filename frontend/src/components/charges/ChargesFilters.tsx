interface ChargesFiltersProps {
  statusFilter: string;
  orderBy: 'dueDate' | 'amount' | 'status';
  order: 'asc' | 'desc';
  loading?: boolean;
  onStatusChange: (status: string) => void;
  onOrderByChange: (orderBy: 'dueDate' | 'amount' | 'status') => void;
  onOrderChange: (order: 'asc' | 'desc') => void;
  onApply: () => void;
}

export default function ChargesFilters({
  statusFilter,
  orderBy,
  order,
  loading = false,
  onStatusChange,
  onOrderByChange,
  onOrderChange,
  onApply,
}: ChargesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="PAGO">Pago</option>
          <option value="VENCIDO">Vencido</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Ordenar por
        </label>
        <select
          value={orderBy}
          onChange={(e) => onOrderByChange(e.target.value as any)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="dueDate">Data de Vencimento</option>
          <option value="amount">Valor</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Direção
        </label>
        <select
          value={order}
          onChange={(e) => onOrderChange(e.target.value as any)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={onApply}
          disabled={loading}
          className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Carregando...' : 'Aplicar Filtros'}
        </button>
      </div>
    </div>
  );
}
