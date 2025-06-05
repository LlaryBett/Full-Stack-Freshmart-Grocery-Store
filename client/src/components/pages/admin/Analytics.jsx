import Chart from 'react-apexcharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Sidebar from './Sidebar';

const Analytics = () => {
  // Sample data for demonstration
  const stats = [
    {
      title: 'Revenue Growth',
      value: '+32.5%',
      change: '+8.2%',
      isIncrease: true,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'New Customers',
      value: '+2,345',
      change: '+12.5%',
      isIncrease: true,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Order Growth',
      value: '+15.8%',
      change: '-2.3%',
      isIncrease: false,
      icon: ShoppingBag,
      color: 'bg-green-500'
    }
  ];

  const revenueChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `$ ${val} thousands`
      }
    },
    colors: ['#22c55e', '#3b82f6']
  };

  const revenueChartSeries = [
    {
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63]
    },
    {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91]
    }
  ];

  const customerChartOptions = {
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
      type: 'datetime',
      categories: [
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
        '2024-03-06',
        '2024-03-07'
      ]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    },
    colors: ['#8b5cf6']
  };

  const customerChartSeries = [
    {
      name: 'New Customers',
      data: [31, 40, 28, 51, 42, 109, 100]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Revenue Analysis</h2>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>This Year</option>
                  <option>Last Year</option>
                  <option>Last 2 Years</option>
                </select>
              </div>
              <Chart 
                options={revenueChartOptions}
                series={revenueChartSeries}
                type="bar"
                height={350}
              />
            </div>

            {/* Customer Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Customer Growth</h2>
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <Chart 
                options={customerChartOptions}
                series={customerChartSeries}
                type="area"
                height={350}
              />
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>
              <div className="space-y-4">
                {[
                  { name: 'Organic Bananas', sales: 1234, growth: '+12%' },
                  { name: 'Fresh Strawberries', sales: 987, growth: '+8%' },
                  { name: 'Avocados', sales: 865, growth: '+5%' }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                    <span className="text-green-500 text-sm font-medium">{product.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Demographics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Demographics</h2>
              <div className="space-y-4">
                {[
                  { age: '18-24', percentage: 15 },
                  { age: '25-34', percentage: 35 },
                  { age: '35-44', percentage: 25 },
                  { age: '45+', percentage: 25 }
                ].map((demo, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Age {demo.age}</span>
                      <span className="text-gray-800 font-medium">{demo.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${demo.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Channels */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Channels</h2>
              <div className="space-y-4">
                {[
                  { channel: 'Website', sales: '$12,345', percentage: 45 },
                  { channel: 'Mobile App', sales: '$8,765', percentage: 35 },
                  { channel: 'Marketplace', sales: '$5,432', percentage: 20 }
                ].map((channel, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{channel.channel}</span>
                      <span className="text-gray-800 font-medium">{channel.sales}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;