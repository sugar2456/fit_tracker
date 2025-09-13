import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <main className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
            Fit Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            あなたのフィットネス目標を追跡し、健康的な生活をサポートします
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                運動記録
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                日々の運動を記録し、進捗を可視化
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                データ分析
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                詳細な統計とグラフで成果を確認
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3D地図
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                活動ルートを3D地図で確認
              </p>
            </div>
          </div>
          
          <div className="mt-12 space-x-4">
            <Link href="/map">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
                3D地図を見る
              </button>
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
              今すぐ始める
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
