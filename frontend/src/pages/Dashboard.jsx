import RequestForm from "../components/RequestForm";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 py-10 flex justify-center">
        <div className="w-full max-w-6xl md:w-4/5">
          <header className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
              API Tester Dashboard
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Build, send, and inspect API requests with ease.
            </p>
          </header>

          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 md:p-10">
            <RequestForm />
          </div>

          <footer className="mt-16 text-center text-sm text-gray-500">
            Built with 💻 for developers —{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              View Docs
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
