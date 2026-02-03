import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link href="/upload" className="rounded px-3 py-2 text-white hover:bg-gray-700">
            Upload
          </Link>
          <Link href="/data" className="rounded px-3 py-2 text-white hover:bg-gray-700">
            Data
          </Link>
        </div>
      </div>
    </nav>
  );
}
