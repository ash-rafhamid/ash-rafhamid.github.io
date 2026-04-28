import { motion } from 'framer-motion'
import { GraduationCap, Code2, Brain, Smartphone } from 'lucide-react'

const About = () => {
  const highlights = [
    {
      icon: GraduationCap,
      title: 'Academic Excellence',
      description: 'BSc in Computer Science with CGPA 3.9/4.00',
    },
    {
      icon: Code2,
      title: 'Problem Solving',
      description: 'Strong foundation in Data Structures & Algorithms',
    },
    {
      icon: Brain,
      title: 'AI/ML Expertise',
      description: 'Deep Learning, NLP, Transformers, and Neural Networks',
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Android development with Java and Firebase',
    },
  ]

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            About Me
          </h2>
          <div className="w-20 h-1 bg-slate-900 dark:bg-slate-100 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm a passionate Software Engineer with a strong academic background in Computer Science, graduating with a CGPA of 3.9/4.00. My expertise lies in building intelligent systems using Machine Learning and Deep Learning technologies.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I specialize in Natural Language Processing, Transformer architectures, and have hands-on experience with neural networks including CNNs and RNNs. My deep understanding of attention mechanisms, self-attention, and multi-head attention allows me to work on cutting-edge AI projects.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Beyond AI/ML, I'm an experienced Android developer and competitive programmer with 500+ LeetCode problems solved. I'm passionate about creating real-world solutions that make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-slate-800 dark:bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white dark:text-slate-900" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
