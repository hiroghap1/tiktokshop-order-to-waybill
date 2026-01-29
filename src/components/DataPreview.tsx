import type { NormalizedOrder } from '../converters/types';
import { formatPostalCode } from '../converters/tiktokParser';

interface DataPreviewProps {
  orders: NormalizedOrder[];
}

export function DataPreview({ orders }: DataPreviewProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">プレビュー</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                注文ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                宛名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                電話番号
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                郵便番号
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                住所
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                商品名
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                数量
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => {
              const fullAddress = `${order.prefecture}${order.city}${order.town}${order.address1}${order.address2 ? ' ' + order.address2 : ''}`;
              return (
                <tr key={order.orderId + '-' + index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap font-mono">
                    {order.orderId.slice(-8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {order.recipientName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {order.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {formatPostalCode(order.postalCode)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={fullAddress}>
                    {fullAddress}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={order.productName}>
                    {order.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap text-center">
                    {order.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          読み込み件数: <span className="font-medium">{orders.length}件</span>
        </p>
      </div>
    </div>
  );
}
