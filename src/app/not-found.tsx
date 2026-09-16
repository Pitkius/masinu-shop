import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <Link href="/" className="mt-6 inline-block text-accent">
        Home
      </Link>
    </div>
  );
}
