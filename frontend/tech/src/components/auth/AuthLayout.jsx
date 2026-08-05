import { motion } from 'framer-motion';
import { Compass, Globe, Plane, Sparkles } from 'lucide-react';
import Logo from '../common/Logo';

function RouteVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M40 280 Q120 180 200 220 T360 120"
          stroke="url(#routeGrad)"
          strokeWidth="2"
          strokeDasharray="8 6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M60 320 Q180 200 280 260 T380 180"
          stroke="url(#routeGrad2)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {[
        { Icon: Plane, top: '18%', left: '12%', delay: 0.2 },
        { Icon: Globe, top: '55%', left: '70%', delay: 0.5 },
        { Icon: Compass, top: '72%', left: '25%', delay: 0.8 },
        { Icon: Sparkles, top: '30%', left: '78%', delay: 0.4 },
      ].map(({ Icon, top, left, delay }, i) => (
        <motion.div
          key={i}
          className="absolute flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm"
          style={{ top, left }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay, duration: 0.5 }}
        >
          <Icon className="h-5 w-5 text-white/80" strokeWidth={1.5} />
        </motion.div>
      ))}

      {[
        { top: '22%', left: '35%' },
        { top: '45%', left: '55%' },
        { top: '38%', left: '82%' },
      ].map((pos, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-white/60 shadow-lg shadow-violet-500/30"
          style={pos}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
        />
      ))}
    </div>
  );
}

export default function AuthLayout({ children, headline, subtext }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col">
        <div className="absolute inset-0 gradient-ai" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="relative z-10 flex flex-1 flex-col p-10 xl:p-14">
          <Logo size="lg" className="[&_span]:text-white [&_span_span]:text-white/90" />

          <div className="my-auto max-w-lg">
            <motion.h1
              className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {headline}
            </motion.h1>
            <motion.p
              className="text-base leading-relaxed text-white/75 xl:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {subtext}
            </motion.p>
          </div>

          <div className="relative h-48 xl:h-64">
            <RouteVisual />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-surface px-6 py-10 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Logo size="md" />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
