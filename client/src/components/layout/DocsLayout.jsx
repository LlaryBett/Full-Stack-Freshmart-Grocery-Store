import Header from './Header';
import Footer from './Footer';

const DocsLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DocsLayout;
