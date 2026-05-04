import { NotFoundMark } from '@/components/not-found-mark'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-3 py-8 text-gray-600">
      <section className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-xl bg-white px-8 py-12 text-center">
        <NotFoundMark className="h-auto w-40 text-gray-400 sm:w-48" />

        <div className="flex max-w-[484px] flex-col items-center gap-3 text-center">
          <h1 className="text-xl font-bold">Link não encontrado</h1>
          <p className="text-md text-gray-500">
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida. Saiba mais em{' '}
            <a className="font-semibold text-blue-base" href="/">
              brev.ly
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
