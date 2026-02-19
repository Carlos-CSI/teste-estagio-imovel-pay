import { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ChargePieChart from '../components/dashboard/ChargePieChart';
import RevenueBarChart from '../components/dashboard/RevenueBarChart';
import Spinner from '../components/common/Spinner';
import { chargesApi } from '../api/charges';
import { customersApi } from '../api/customers';
import { paymentsApi } from '../api/payments';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../contexts/AppContext';
import { ChargeStatus } from '../types';

export default function Dashboard() {
  const { addToast } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCharges: 0,
    totalRevenue: 0,
    paidAmount: 0,
  });

  const [chargesByStatus, setChargesByStatus] = useState({
    pending: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0,
  });

  const [revenueData, setRevenueData] = useState<
    Array<{ month: string; paid: number; pending: number }>
  >([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);

        // Load all data in parallel
        const [customersData, chargesData, paymentsData] = await Promise.all([
          customersApi.getAll(),
          chargesApi.getAll({ limit: 1000 }),
          paymentsApi.getAll(),
        ]);

        if (!mounted) return;

        // Calculate stats
        const totalCustomers = customersData.length;
        const totalCharges = chargesData.data.length;

        const totalRevenue = chargesData.data.reduce((sum, charge) => {
          return sum + Number(charge.amount);
        }, 0);

        const paidAmount = paymentsData.reduce((sum, payment) => {
          return sum + Number(payment.amount);
        }, 0);

        // Count charges by status
        const statusCount = {
          pending: 0,
          paid: 0,
          overdue: 0,
          cancelled: 0,
        };

        chargesData.data.forEach((charge) => {
          if (charge.status === ChargeStatus.PENDENTE) statusCount.pending++;
          else if (charge.status === ChargeStatus.PAGO) statusCount.paid++;
          else if (charge.status === ChargeStatus.VENCIDO) statusCount.overdue++;
          else if (charge.status === ChargeStatus.CANCELADO) statusCount.cancelled++;
        });

        if (!mounted) return;

        setStats({
          totalCustomers,
          totalCharges,
          totalRevenue,
          paidAmount,
        });

        setChargesByStatus(statusCount);

        // Build revenue data for the last 6 months from real API data
        const now = new Date();
        const revenue = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const year = date.getFullYear();
          const month = date.getMonth();
          const label = date.toLocaleString('pt-BR', { month: 'short' });

          const paid = paymentsData
            .filter((p) => {
              const d = new Date(p.paidAt);
              return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum, p) => sum + Number(p.amount), 0);

          const pending = chargesData.data
            .filter((c) => {
              const d = new Date(c.dueDate);
              return (
                d.getFullYear() === year &&
                d.getMonth() === month &&
                (c.status === ChargeStatus.PENDENTE || c.status === ChargeStatus.VENCIDO)
              );
            })
            .reduce((sum, c) => sum + Number(c.amount), 0);

          return { month: label, paid, pending };
        });

        setRevenueData(revenue);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (mounted) addToast('error', 'Erro ao carregar dados do dashboard');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [addToast]);

  const pieChartData = [
    { name: 'Pendente', value: chargesByStatus.pending, color: '#f59e0b' },
    { name: 'Pago', value: chargesByStatus.paid, color: '#10b981' },
    { name: 'Vencido', value: chargesByStatus.overdue, color: '#ef4444' },
    { name: 'Cancelado', value: chargesByStatus.cancelled, color: '#6b7280' },
  ];


  if (isLoading) {
    return (
      <section className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
        <Spinner />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema de cobranças</p>
      </header>

      {/* Stats Grid */}
      <section aria-label="Estatísticas principais" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Clientes"
          value={stats.totalCustomers}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total de Cobranças"
          value={stats.totalCharges}
          icon={FileText}
          color="yellow"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Valor Recebido"
          value={formatCurrency(stats.paidAmount)}
          icon={DollarSign}
          color="green"
          trend={{ value: 20, isPositive: true }}
        />
      </section>

      {/* Charts Grid */}
      <section aria-label="Gráficos de relatório" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChargePieChart data={pieChartData} />
        <RevenueBarChart data={revenueData} />
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-lg border border-gray-200 p-6" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Rápido
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">Cobranças Pendentes</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{chargesByStatus.pending}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium">Cobranças Pagas</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{chargesByStatus.paid}</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-medium">Cobranças Vencidas</p>
            <p className="text-2xl font-bold text-red-900 mt-1">{chargesByStatus.overdue}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
