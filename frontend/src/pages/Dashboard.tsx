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
import parseCurrencyToNumber from '../utils/number';
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
          return sum + parseCurrencyToNumber(charge.amount);
        }, 0);

        const paidAmount = paymentsData.reduce((sum, payment) => {
          return sum + parseCurrencyToNumber(payment.amount);
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

  // Mock data for revenue chart
  const revenueData = [
    { month: 'Jan', paid: 12500, pending: 8000 },
    { month: 'Fev', paid: 15000, pending: 6500 },
    { month: 'Mar', paid: 18000, pending: 7200 },
    { month: 'Abr', paid: 16500, pending: 5800 },
    { month: 'Mai', paid: 20000, pending: 9000 },
    { month: 'Jun', paid: 22000, pending: 7500 },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Visão geral do sistema de cobranças</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChargePieChart data={pieChartData} />
        <RevenueBarChart data={revenueData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo Rápido
        </h3>
        
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
      </div>
    </div>
  );
}
