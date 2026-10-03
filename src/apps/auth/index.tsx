import { LoginForm } from './login-form'

export function SignIn() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div
        className='relative hidden h-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat lg:flex dark:border-r'
        style={{
          backgroundImage: "url('images/background.jpg')",
        }}
      >
        <div className='absolute inset-0' />
      </div>

      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[500px]'>
          <div className='flex flex-col items-center space-y-1.5 text-center'>
            <h1 className='font-syncopate text-primary text-3xl font-black tracking-tight md:text-4xl'>
              Smark
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
