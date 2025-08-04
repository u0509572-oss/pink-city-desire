import { FiCalendar, FiClock, FiCheck, FiUsers } from "react-icons/fi"

const Dashboard = () => {
  const stats = [
    {
      title: "Total Bookings",
      count: 156,
      icon: FiCalendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Bookings",
      count: 23,
      icon: FiClock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Bookings",
      count: 133,
      icon: FiCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Girls Profiles",
      count: 45,
      icon: FiUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your booking management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>


    </div>
  )
}

export default Dashboard
