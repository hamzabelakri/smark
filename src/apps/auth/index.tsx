import { useTranslation } from 'react-i18next'
import { LoginForm } from './login-form'

// Mirrored diagonal wash covering the left side
const WASH_CLIP = 'lg:[clip-path:polygon(0_0,36%_0,96%_100%,0_100%)]'

export function SignIn() {
  const { t } = useTranslation()

  return (
    <div className='bg-background relative min-h-svh overflow-hidden'>
      {/* ───────── Background image: fully visible on the right side ───────── */}
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: "url('images/background.jpg')" }}
      />
      {/* ───────── Muted wash: form side (left) only ───────── */}
      <div
        aria-hidden='true'
        className={`dark bg-background/85 absolute inset-0 ${WASH_CLIP}`}
      />
      {/* brand-colour tip in the bottom-right corner */}
      <div
        aria-hidden='true'
        className='bg-primary absolute right-0 bottom-0 hidden h-16 w-24 lg:block'
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />

      <div className='relative grid min-h-svh lg:grid-cols-2'>
        {/* ───────── Left: form ───────── */}
        <main className='dark text-foreground flex flex-col px-8 pt-14 pb-10 lg:order-1 lg:px-[10%]'>
          <h1 className='font-syncopate text-primary text-3xl font-black tracking-tight md:text-4xl'>
            Smark
          </h1>

          {/* Form fills the remaining height and stays vertically centered */}
          <div className='flex flex-1 items-center'>
            <div className='w-full max-w-[22rem]'>
              <LoginForm />
            </div>
          </div>
        </main>

        {/* ───────── Right: headline over the image ───────── */}
        <aside className='hidden flex-col px-12 pt-14 text-white lg:order-2 lg:flex'>
          <p className='text-sm text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]'>
            {t('login_tagline', {
              defaultValue:
                'Parking system management – everything in one place.',
            })}
          </p>
        </aside>
      </div>
    </div>
  )
}
