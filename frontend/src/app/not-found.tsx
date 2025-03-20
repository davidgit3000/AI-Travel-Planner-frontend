import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl xl:text-4xl font-bold dark:text-slate-100">
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Could not find the requested resource
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Return Home
        </Link>
      </main>
    </div>
  );
}
