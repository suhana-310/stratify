import { motion } from 'framer-motion'

export default function Integrations() {
  const integrations = [
    { name: 'Slack', category: 'Communication', logo: '💬' },
    { name: 'GitHub', category: 'Development', logo: '🐙' },
    { name: 'Google Drive', category: 'Storage', logo: '📁' },
    { name: 'Figma', category: 'Design', logo: '🎨' },
    { name: 'Zoom', category: 'Video', logo: '📹' },
    { name: 'Jira', category: 'Project Management', logo: '📋' },
    { name: 'Dropbox', category: 'Storage', logo: '📦' },
    { name: 'Trello', category: 'Organization', logo: '📌' }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
            Seamless
            <span className="block text-primary-500">Integrations</span>
          </h2>
          <p className="text-lg text-secondary-700 max-w-3xl mx-auto">
            Connect with your favorite tools and streamline your workflow. 
            Over 100+ integrations available.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(230, 165, 32, 0.3)"
              }}
              className="bg-white rounded-xl p-6 shadow-lg border border-primary-200 text-center cursor-pointer hover:border-primary-400 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{integration.logo}</div>
              <h3 className="font-semibold text-secondary-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-secondary-600">{integration.category}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-secondary-700 mb-6">
            Don't see your favorite tool? We're constantly adding new integrations.
          </p>
          <motion.button
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request Integration
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}