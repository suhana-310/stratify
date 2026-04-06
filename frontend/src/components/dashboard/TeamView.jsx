import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function TeamView() {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Product Manager',
      email: 'sarah@company.com',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ',
      status: 'online',
      projects: 3,
      tasks: 12
    },
    {
      id: 2,
      name: 'Mike Kim',
      role: 'Senior Developer',
      email: 'mike@company.com',
      phone: '+1 (555) 234-5678',
      avatar: 'MK',
      status: 'online',
      projects: 2,
      tasks: 8
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UI/UX Designer',
      email: 'emily@company.com',
      phone: '+1 (555) 345-6789',
      avatar: 'ER',
      status: 'away',
      projects: 4,
      tasks: 15
    },
    {
      id: 4,
      name: 'John Doe',
      role: 'Backend Developer',
      email: 'john@company.com',
      phone: '+1 (555) 456-7890',
      avatar: 'JD',
      status: 'offline',
      projects: 1,
      tasks: 6
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Manage your team members and roles</h2>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg font-medium text-primary">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{member.name}</h3>
                      <p className="text-sm text-black/60">{member.role}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-highlight/20 rounded">
                    <MoreHorizontal className="w-4 h-4 text-black/60" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-black/70">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-black/70">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-highlight/20">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-black">{member.projects}</p>
                    <p className="text-xs text-black/60">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-black">{member.tasks}</p>
                    <p className="text-xs text-black/60">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-medium px-2 py-1 rounded-full ${
                      member.status === 'online' ? 'bg-green-100 text-green-600' :
                      member.status === 'away' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}