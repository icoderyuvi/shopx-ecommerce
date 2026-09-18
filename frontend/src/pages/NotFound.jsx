import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="text-center">

        <p className="text-8xl font-bold tracking-tight">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-3 max-w-md text-gray-500">
          Sorry, the page you are looking for does not exist
          or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Go Home
          </Link>

          <Link
            to="/products"
            className="rounded-lg border px-6 py-3 font-semibold transition hover:bg-gray-50"
          >
            Browse Products
          </Link>

        </div>

      </div>
    </main>
  )
}

export default NotFound