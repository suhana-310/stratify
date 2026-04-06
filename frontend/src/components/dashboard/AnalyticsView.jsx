import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, Target } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function AnalyticsView() {
  const metrics = [
    { title: 'Project Completion Rate', value: '94%', change: '+5%', icon: Target, color: 'text-green-500' },
    { title: 'Team Productivity', value: '87%', change: '+12%', icon: TrendingUp, color: 'text-blue-500' },
    { title: 'Average Task Time', value: '2.4h', change: '-0.3h', icon: Clock, color: 'text-purple-500' },
    { title: 'Active Team Members', value: '24', change: '+3', icon: Users, color: 'text-primary' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">Track performance and insights</h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-black/60 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-black">{metric.value}</p>
                    <p className="text-sm text-green-500 mt-1">{metric.change} from last month</p>
                  </div>
                  <div className={`p-3 bg-highlight/20 rounded-lg ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-black/60">Chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', tasks: 24, completion: 95 },
                  { name: 'Mike Kim', tasks: 18, completion: 89 },
                  { name: 'Emily Rodriguez', tasks: 21, completion: 92 },
                  { name: 'John Doe', tasks: 16, completion: 87 }
                ].map((member, index) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-black">{member.name}</p>
                        <p className="text-sm text-black/60">{member.tasks} tasks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{member.completion}%</p>
                      <div className="w-16 bg-highlight/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${member.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}