import { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { CarrierSelector } from './components/CarrierSelector';
import { DataPreview } from './components/DataPreview';
import { ShipperSettings } from './components/ShipperSettings';
import { DownloadButton } from './components/DownloadButton';
import { useLocalStorage } from './hooks/useLocalStorage';
import { parseTikTokCSV, readFileAsText } from './converters/tiktokParser';
import { convertOrdersToSagawaCSV } from './converters/sagawaConverter';
import { convertOrdersToYamatoCSV } from './converters/yamatoConverter';
import type { NormalizedOrder, CarrierType, ShipperInfo } from './converters/types';

const DEFAULT_SHIPPER: ShipperInfo = {
  name: '',
  phone: '',
  postalCode: '',
  address1: '',
  address2: '',
  customerCode: '',
};

function App() {
  const [orders, setOrders] = useState<NormalizedOrder[]>([]);
  const [carrier, setCarrier] = useState<CarrierType>('sagawa');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [shipper, setShipper] = useLocalStorage<ShipperInfo>('shipper-info', DEFAULT_SHIPPER);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await readFileAsText(file);
      const parsedOrders = await parseTikTokCSV(text);
      
      if (parsedOrders.length === 0) {
        setError('CSVファイルに有効なデータがありません');
        return;
      }
      
      setOrders(parsedOrders);
    } catch (err) {
      console.error('CSV parse error:', err);
      setError('CSVファイルの読み込みに失敗しました。ファイル形式を確認してください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (orders.length === 0) return;
    
    // 発送元情報のバリデーション
    if (!shipper.name || !shipper.phone || !shipper.postalCode || !shipper.address1) {
      setError('発送元情報を設定してください');
      setIsSettingsOpen(true);
      return;
    }
    
    // ヤマトの場合は顧客コードも確認
    if (carrier === 'yamato' && !shipper.customerCode) {
      setError('ヤマト運輸用のご請求先顧客コードを設定してください');
      setIsSettingsOpen(true);
      return;
    }
    
    setError(null);
    
    // CSV生成
    let csvContent: string;
    let filename: string;
    
    if (carrier === 'sagawa') {
      csvContent = convertOrdersToSagawaCSV(orders, shipper);
      filename = `sagawa_ehiden_${formatDate(new Date())}.csv`;
    } else {
      csvContent = convertOrdersToYamatoCSV(orders, shipper);
      filename = `yamato_b2_${formatDate(new Date())}.csv`;
    }
    
    // Shift-JISに変換してダウンロード
    downloadCSV(csvContent, filename);
  }, [orders, carrier, shipper]);

  const carrierName = carrier === 'sagawa' ? '佐川急便 e飛伝Ⅲ' : 'ヤマト運輸 B2クラウド';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            TikTok Shop → 送り状CSV変換
          </h1>
          <p className="text-gray-600">
            TikTok Shopの注文データを配送会社のCSVに変換します
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>

          {/* Carrier Selection & Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700 mb-3">変換先</h2>
                <CarrierSelector value={carrier} onChange={setCarrier} />
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                発送元設定
              </button>
            </div>
            
            {/* Shipper Info Summary */}
            {shipper.name && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <span className="font-medium">発送元:</span> {shipper.name} / {shipper.phone} / {shipper.address1}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Data Preview */}
          {orders.length > 0 && (
            <DataPreview orders={orders} />
          )}

          {/* Download Button */}
          <DownloadButton
            onClick={handleDownload}
            disabled={orders.length === 0}
            carrierName={carrierName}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>データはブラウザ上で処理され、サーバーに送信されません</p>
        </div>
      </div>

      {/* Settings Modal */}
      <ShipperSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shipper={shipper}
        onSave={setShipper}
      />
    </div>
  );
}

/**
 * 日付をYYYYMMDD形式にフォーマット
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * CSVをダウンロード（Shift-JIS変換）
 */
function downloadCSV(content: string, filename: string) {
  // BOMなしUTF-8でダウンロード（e飛伝Ⅲ、B2クラウドともにUTF-8対応）
  // 必要に応じてShift-JIS変換を追加
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default App;
