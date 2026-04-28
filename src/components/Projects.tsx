import { motion } from 'framer-motion'
import { Smartphone, Brain, Database, ExternalLink } from 'lucide-react'

const Projects = () => {
  const projects = [
    {
      title: 'LocalFix',
      subtitle: 'Android Community Issue Reporting App',
      icon: Smartphone,
      tags: ['Android Studio', 'Java', 'Firebase', 'Google Maps API'],
      description: [
        'Community issue reporting system for infrastructure problems (potholes, broken streetlights)',
        'Image-based issue tagging with basic ML integration',
        'Voting system for prioritizing community issues',
        'GPS integration and live location tracking (planned)',
        'Real-time notification system (planned)',
      ],
      color: 'from-slate-700 to-slate-800',
    },
    {
      title: 'Email Spam Classifier',
      subtitle: 'Machine Learning NLP Project',
      icon: Brain,
      tags: ['Python', 'Scikit-learn', 'NLP', 'Streamlit'],
      description: [
        'Built complete ML pipeline: preprocessing → training → evaluation → deployment',
        'TF-IDF vectorization for text feature extraction',
        'Implemented multiple models: Naive Bayes, Logistic Regression, Random Forest',
        'Interactive Streamlit UI for real-time spam prediction',
        'Comprehensive model evaluation and comparison',
      ],
      color: 'from-gray-700 to-gray-800',
    },
    {
      title: 'Hospital Management System',
      subtitle: 'C Programming Project',
      icon: Database,
      tags: ['C', 'File Handling', 'Data Structures'],
      description: [
        'Complete CRUD operations for patients, doctors, and appointments',
        'Efficient file handling and data persistence',
        'Custom data structure implementation',
        'User-friendly command-line interface',
        'Robust error handling and validation',
      ],
      color: 'from-zinc-700 to-zinc-800',
    },
  ]

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-slate-900 dark:bg-slate-100 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <project.icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{project.subtitle}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-3 py-1 bg-gradient-to-r ${project.color} text-white rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2">
                    {project.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
