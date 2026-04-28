import { motion } from 'framer-motion'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      skills: ['C++', 'C', 'Java', 'Python', 'SQL'],
      color: 'from-slate-700 to-slate-800',
    },
    {
      title: 'Backend & Web Development',
      skills: ['Spring Boot', 'Java', 'REST API', 'Maven', 'MySQL'],
      color: 'from-slate-600 to-slate-700',
    },
    {
      title: 'Mobile Development',
      skills: ['Android Studio', 'Java (Android)', 'XML', 'Firebase', 'Google Maps API'],
      color: 'from-slate-500 to-slate-600',
    },
    {
      title: 'Machine Learning',
      skills: ['Scikit-learn', 'Pandas', 'NumPy', 'TF-IDF', 'Naive Bayes', 'Logistic Regression', 'Random Forest'],
      color: 'from-gray-700 to-gray-800',
    },
    {
      title: 'Deep Learning',
      skills: ['Neural Networks', 'CNN', 'RNN', 'PyTorch', 'TensorFlow', 'Model Training & Evaluation'],
      color: 'from-gray-600 to-gray-700',
    },
    {
      title: 'Advanced AI Concepts',
      skills: [
        'Transformer Architecture',
        'Attention Mechanism',
        'Self-Attention',
        'Multi-Head Attention',
        'Encoder-Decoder Models',
        'Backpropagation',
        'Gradient Descent',
      ],
      color: 'from-zinc-700 to-zinc-800',
    },
    {
      title: 'Cloud & DevOps',
      skills: ['AWS (EC2, S3, Lambda)', 'Cloud Computing Basics', 'Git', 'GitHub'],
      color: 'from-zinc-600 to-zinc-700',
    },
    {
      title: 'Tools & Platforms',
      skills: ['Git', 'VS Code', 'Android Studio', 'Streamlit', 'Kaggle', 'LeetCode', 'Codeforces'],
      color: 'from-stone-600 to-stone-700',
    },
  ]

  return (
    <section id="skills" className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-slate-900 dark:bg-slate-100 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className={`inline-block px-4 py-2 bg-gradient-to-r ${category.color} rounded-lg mb-4`}>
                <h3 className="font-bold text-white">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 p-8 bg-slate-900 dark:bg-slate-800 rounded-xl text-white text-center border border-slate-700"
        >
          <p className="text-xl font-semibold mb-2">💡 Core Strength</p>
          <p className="text-lg">
            I can build ML models from scratch using Python and have hands-on experience with classification, NLP, and
            comprehensive model evaluation
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
