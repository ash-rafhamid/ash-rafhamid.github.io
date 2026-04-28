import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-8 px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Ashraf Hamid Mojumder
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
