import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold">متجر الأزياء الموحد</h2>
            <p className="text-gray-300 text-base">
              متجرك الشامل لجميع احتياجات الأزياء والخدمات المتعلقة بها.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">روابط سريعة</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-base text-gray-300 hover:text-white">
                      الرئيسية
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-base text-gray-300 hover:text-white">
                      المنتجات
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-base text-gray-300 hover:text-white">
                      الخدمات
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">الدعم</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                      اتصل بنا
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-base text-gray-300 hover:text-white">
                      الأسئلة الشائعة
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2023 متجر الأزياء الموحد. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}