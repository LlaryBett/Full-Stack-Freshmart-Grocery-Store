import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Package,
  Clock,
  AlertCircle,
  BarChart2,
  Home,
  ClipboardList,
  Settings as SettingsIcon,
  Box
} from 'lucide-react';
import Chart from 'react-apexcharts';
import Sidebar from './Sidebar';

const Dashboard = () => {
  // Sample data for demonstration
  const stats = [
    {
      title: 'Total Sales',
      value: '$24,780',
      change: '+12.5%',
      isIncrease: true,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: '1,482',
      change: '+8.2%',
      isIncrease: true,
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Customers',
      value: '3,274',
      change: '+5.7%',
      isIncrease: true,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Average Order Value',
      value: '$168',
      change: '-2.3%',
      isIncrease: false,
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const salesChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value}k`
      }
    },
    colors: ['#22c55e'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}k`
      }
    }
  };

  const salesChartSeries = [
    {
      name: 'Sales',
      data: [31, 40, 28, 51, 42, 109, 100]
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      date: '2024-03-10',
      amount: '$156.00',
      status: 'Delivered'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      date: '2024-03-10',
      amount: '$245.00',
      status: 'Processing'
    },
    {
      id: '#ORD-003',
      customer: 'Robert Johnson',
      date: '2024-03-09',
      amount: '$98.50',
      status: 'Pending'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Williams',
      date: '2024-03-09',
      amount: '$312.00',
      status: 'Delivered'
    },
    {
      id: '#ORD-005',
      customer: 'Michael Brown',
      date: '2024-03-09',
      amount: '$187.25',
      status: 'Processing'
    }
  ];

  const lowStockItems = [
    {
      name: 'Organic Bananas',
      stock: 5,
      threshold: 10
    },
    {
      name: 'Fresh Strawberries',
      stock: 8,
      threshold: 15
    },
    {
      name: 'Avocados',
      stock: 3,
      threshold: 12
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar: fixed height, non-scrollable */}
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      {/* Main content: scrollable */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center ${
                  stat.isIncrease ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.isIncrease ? (
                    <ArrowUp size={16} className="mr-1" />
                  ) : (
                    <ArrowDown size={16} className="mr-1" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts and Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            <Chart 
              options={salesChartOptions}
              series={salesChartSeries}
              type="area"
              height={350}
            />
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Low Stock Alert</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {lowStockItems.length} items
              </span>
            </div>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {item.stock} units left (Min: {item.threshold})
                    </p>
                  </div>
                  <button className="text-sm text-green-500 hover:text-green-600 font-medium">
                    Restock
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full bg-orange-50 text-orange-600 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
              View All Low Stock Items
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <button className="text-green-500 hover:text-green-600 text-sm font-medium">
                View All Orders
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button className="text-green-500 hover:text-green-600 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Pending Tasks</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                4 tasks
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Update inventory count</h3>
                  <p className="text-xs text-gray-500">Due in 2 hours</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Process refund requests</h3>
                  <p className="text-xs text-gray-500">Due today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">System Alerts</h2>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                2 new
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Payment system maintenance</h3>
                  <p className="text-xs text-gray-500">Scheduled for tonight at 2 AM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Backup in progress</h3>
                  <p className="text-xs text-gray-500">25% completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;