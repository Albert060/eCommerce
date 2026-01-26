import { ProductFilterProvider } from '@/lib/product-context';
import Navbar from '@/components/navbar'; // Adjust the path as needed
import Sidebar from './sidebar'; // Adjust the path as needed

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductFilterProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProductFilterProvider>
  );
}