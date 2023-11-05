import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-900 text-white p-4">
      <nav>
        <ul className="flex justify-end space-x-4">
          <li>
            <Link href="/privacy-policy">
            Privacy Policy
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;