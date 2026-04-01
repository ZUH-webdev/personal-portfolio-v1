import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Moon, SunMedium, Menu, X } from 'lucide-react'
import HeroSection from '../sections/HeroSection'
import AboutSection from '../sections/AboutSection'
import ServicesSection from '../sections/ServicesSection'
import ProjectsSection from '../sections/ProjectsSection'
import ExperienceSection from '../sections/ExperienceSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import ContactSection from '../sections/ContactSection'
import Header from './Header'
import profile from '../../public/profilePic.jpeg'

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Testimonials' },
]

function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const Layout = () => {
  // Theme logic removed
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalStatus, setModalStatus] = useState('idle') // idle | sending | success

  // Modal contact form submit handler (same logic as ContactSection)
  const handleModalSubmit = async (event) => {
    event.preventDefault()
    if (modalStatus === 'sending') return
    setModalStatus('sending')

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      // eslint-disable-next-line no-console
      console.error(
        'EmailJS not configured. Update .env with:\n' +
        'VITE_EMAILJS_SERVICE_ID = your service id\n' +
        'VITE_EMAILJS_TEMPLATE_ID = your template id\n' +
        'VITE_EMAILJS_PUBLIC_KEY = your public key\n' +
        'See https://www.emailjs.com/'
      )
      alert('Email service not configured. Check browser console for setup instructions.')
      setModalStatus('idle')
      return
    }

    try {
      const form = event.target
      const formData = new FormData(form)
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }

      await emailjs.send(serviceId, templateId, payload, publicKey)
      setModalStatus('success')
      form.reset()
      setTimeout(() => {
        setModalStatus('idle')
        setShowModal(false)
      }, 2000)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send contact message', err)
      setModalStatus('idle')
    }
  }

  // Theme effect removed

  // Theme toggle removed

  const handleNavClick = (id) => {
    setMobileOpen(false)
    scrollToId(id)
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Noise texture overlay for 'Elite' feel */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Background gradient accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <Header 
        handleNavClick={handleNavClick}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        setShowModal={setShowModal}
        profile={profile}
      />

      {/* App shell */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-4 top-24 z-50 rounded-2xl border border-white/10 bg-slate-900/90 p-4 backdrop-blur-2xl md:hidden"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full rounded-lg py-4 text-center text-lg font-medium hover:bg-white/5"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

         {/* Contact Modal */}
         <AnimatePresence>
           {showModal && (
             <motion.div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
               <motion.div
                 className="relative w-full max-w-md rounded-xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl"
                 initial={{ scale: 0.92, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.92, opacity: 0 }}
                 transition={{ type: 'spring', stiffness: 300, damping: 24 }}
               >
                 <button
                   className="absolute right-4 top-4 rounded-full bg-slate-800/60 p-1 text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none"
                   onClick={() => setShowModal(false)}
                   aria-label="Close modal"
                 >
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
                 </button>
                 <h2 className="mb-2 text-xl font-bold text-white">Start a Project</h2>
                 <p className="mb-6 text-sm text-slate-300">Let’s discuss your requirements and how I can help.</p>
                 <form onSubmit={handleModalSubmit} className="space-y-4">
                   <div>
                     <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1">Name</label>
                     <input
                       id="name"
                       name="name"
                       type="text"
                       required
                       className="w-full rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                       placeholder="Your name"
                     />
                   </div>
                   <div>
                     <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                     <input
                       id="email"
                       name="email"
                       type="email"
                       required
                       className="w-full rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                       placeholder="you@email.com"
                     />
                   </div>
                   <div>
                     <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1">Project Specifications</label>
                     <textarea
                       id="message"
                       name="message"
                       required
                       rows={4}
                       className="w-full rounded-lg border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                       placeholder="Describe your project..."
                     />
                   </div>
                   <div className="pt-2">
                     <button
                       type="submit"
                       disabled={modalStatus === 'sending'}
                       className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-white shadow transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-70"
                     >
                       {modalStatus === 'sending' ? 'Sending…' : 'Send message'}
                     </button>
                   </div>
                   <div className="h-6 text-center text-xs">
                     <AnimatePresence>
                       {modalStatus === 'success' && (
                         <motion.span
                           initial={{ opacity: 0, y: 4 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -4 }}
                           transition={{ duration: 0.2 }}
                           className="text-emerald-300"
                         >
                           Message sent! I’ll be in touch shortly.
                         </motion.span>
                       )}
                     </AnimatePresence>
                   </div>
                 </form>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>

         {/* Main content */}
        <motion.main
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-24 py-10 sm:py-16"
        >
          <HeroSection onCtaScroll={scrollToId} />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <ExperienceSection />
          <TestimonialsSection />
          <ContactSection />
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-slate-800/70 py-6 text-sm text-slate-400">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Zain Ul Hassan. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ZUH-webdev"
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/zain-ul-hassan-dev"
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                LinkedIn
              </a>
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-slate-300 shadow-sm shadow-slate-900/70">
                Freelance & Full-time Available
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout

