function Home() {
  return (
    <main>

      <section className="bg-gray-100 px-6 py-24 text-center">

        <h1 className="text-5xl font-bold">
          Discover Your Next Favorite
        </h1>

        <p className="mt-4 text-gray-600">
          Shop the latest products at great prices.
        </p>

        <a
          href="/products"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Shop Now
        </a>

      </section>

    </main>
  )
}

export default Home