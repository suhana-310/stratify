import React from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SettingsView() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      color: 'text-blue-500'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you receive updates and alerts',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage your password and security settings',
      color: 'text-red-500'
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your workspace',
      color: 'text-purple-500'
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your language and regional preferences',
      color: 'text-primary'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">Manage your account and preferences</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-highlight/20 rounded-lg ${section.color}`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black mb-2">{section.title}</h3>
                    <p className="text-sm text-black/70 mb-4">{section.description}</p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
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