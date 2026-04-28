import { motion } from 'framer-motion'
import { Brain, Zap, Network, Eye, Layers, GitBranch, TrendingUp } from 'lucide-react'

const MLShowcase = () => {
  const concepts = [
    {
      icon: Network,
      title: 'Neural Networks',
      description: 'Deep understanding of forward propagation, activation functions, and building multi-layer networks from scratch',
      color: 'from-slate-700 to-slate-800',
    },
    {
      icon: GitBranch,
      title: 'Backpropagation',
      description: 'Expert knowledge of gradient computation, chain rule application, and weight updates in deep networks',
      color: 'from-gray-700 to-gray-800',
    },
    {
      icon: TrendingUp,
      title: 'Gradient Descent',
      description: 'Proficient in optimization algorithms including SGD, Adam, and learning rate scheduling',
      color: 'from-zinc-700 to-zinc-800',
    },
    {
      icon: Layers,
      title: 'CNN Architecture',
      description: 'Hands-on experience with convolutional layers, pooling, and building image classification models',
      color: 'from-stone-700 to-stone-800',
    },
    {
      icon: Brain,
      title: 'RNN & Sequence Models',
      description: 'Working knowledge of recurrent networks, LSTM, and sequential data processing',
      color: 'from-slate-600 to-slate-700',
    },
    {
      icon: Zap,
      title: 'Transformer Architecture',
      description: 'Deep expertise in modern transformers, understanding the complete architecture and implementation',
      color: 'from-gray-600 to-gray-700',
    },
    {
      icon: Eye,
      title: 'Attention Mechanism',
      description: 'Comprehensive understanding of Query, Key, Value concepts, self-attention, and multi-head attention',
      color: 'from-zinc-600 to-zinc-700',
    },
  ]

  return (
    <section id="ml-ai" className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            AI/ML Deep Dive
          </h2>
          <div className="w-20 h-1 bg-slate-900 dark:bg-slate-100 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Beyond surface-level knowledge — showcasing deep understanding of advanced AI concepts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {concepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${concept.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <concept.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{concept.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{concept.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-slate-900 dark:bg-slate-800 rounded-xl p-8 text-white border border-slate-700"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">🎯</p>
              <p className="font-semibold text-lg mb-1">Hands-On Experience</p>
              <p className="text-slate-300">Building ML models from scratch with Python</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">📊</p>
              <p className="font-semibold text-lg mb-1">Model Lifecycle</p>
              <p className="text-slate-300">Complete pipeline: training, evaluation, deployment</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">🚀</p>
              <p className="font-semibold text-lg mb-1">Continuous Learning</p>
              <p className="text-slate-300">Active on Kaggle, implementing latest research</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MLShowcase
