import { motion } from 'framer-motion'
import { Trophy, Code, Target, TrendingUp } from 'lucide-react'

const Achievements = () => {
  const achievements = [
    {
      icon: Code,
      number: '500+',
      title: 'LeetCode Problems',
      description: 'Solved across Easy, Medium, and Hard difficulties',
      color: 'from-slate-700 to-slate-800',
      link: 'https://leetcode.com/u/ash-rafhamid',
    },
    {
      icon: Target,
      number: '142',
      title: 'Codeforces Problems',
      description: 'Active competitive programming practice',
      color: 'from-gray-700 to-gray-800',
    },
    {
      icon: TrendingUp,
      number: 'Active',
      title: 'Kaggle Learner',
      description: 'Participating in ML competitions and learning',
      color: 'from-zinc-700 to-zinc-800',
    },
    {
      icon: Trophy,
      number: 'Daily',
      title: 'Algorithm Practice',
      description: 'Consistent problem-solving routine',
      color: 'from-stone-700 to-stone-800',
    },
  ]

  return (
    <section id="achievements" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Achievements & Practice
          </h2>
          <div className="w-20 h-1 bg-slate-900 dark:bg-slate-100 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.a
              key={index}
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group cursor-pointer"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className={`text-4xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2`}>
                  {achievement.number}
                </p>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Strong foundation in Data Structures & Algorithms with consistent practice across multiple competitive
            programming platforms. Dedicated to continuous improvement and mastering problem-solving skills.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements
