import Papa from 'papaparse';
import type { TikTokOrder, NormalizedOrder } from './types';

/**
 * 電話番号から (+81) を除去し、ハイフン区切りに変換
 * 例: (+81)08012345678 → 080-1234-5678
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // (+81) を除去
  let cleaned = phone.replace(/\(\+81\)/g, '').trim();
  
  // 数字以外を除去
  cleaned = cleaned.replace(/\D/g, '');
  
  // 先頭の0を確認（日本の電話番号は0から始まる）
  if (!cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  
  // 携帯電話 (090, 080, 070) の場合: XXX-XXXX-XXXX
  if (cleaned.match(/^0[789]0/)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // 固定電話 (03, 06等) の場合: XX-XXXX-XXXX または XXX-XXX-XXXX
  if (cleaned.length === 10) {
    // 市外局番2桁の場合 (03, 06等)
    if (cleaned.match(/^0[1-9]/)) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
  }
  
  // その他の場合はそのまま返す
  return cleaned;
}

/**
 * 郵便番号にハイフンを追加
 * 例: 1008111 → 100-8111
 */
export function formatPostalCode(postalCode: string): string {
  if (!postalCode) return '';
  
  // 数字以外を除去
  const cleaned = postalCode.replace(/\D/g, '');
  
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  return cleaned;
}

/**
 * 郵便番号からハイフンを除去
 * 例: 100-8111 → 1008111
 */
export function removePostalCodeHyphen(postalCode: string): string {
  if (!postalCode) return '';
  return postalCode.replace(/\D/g, '');
}

/**
 * TikTok Shop CSVをパースしてNormalizedOrderの配列に変換
 */
export function parseTikTokCSV(csvText: string): Promise<NormalizedOrder[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<TikTokOrder>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const orders = results.data.map((row): NormalizedOrder => {
            // 注文IDの末尾のタブや空白を除去
            const orderId = (row['注文ID'] || '').trim();
            const skuId = (row['SKU ID'] || '').trim();
            const packageId = (row['荷物ID'] || '').trim();
            
            return {
              orderId,
              productName: row['商品名'] || '',
              quantity: parseInt(row['数量'] || '1', 10) || 1,
              recipientName: row['受取人'] || '',
              recipientNameKana: `${row['名'] || ''} ${row['姓'] || ''}`.trim(),
              phone: formatPhoneNumber(row['電話番号'] || ''),
              postalCode: removePostalCodeHyphen(row['郵便番号'] || ''),
              prefecture: row['都道府県'] || '',
              city: row['市区町村'] || '',
              town: row['町名'] || '',
              address1: row['詳細住所1'] || '',
              address2: row['詳細住所2'] || '',
              orderAmount: row['注文金額'] || '',
              skuId,
              packageId,
            };
          });
          
          resolve(orders);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

/**
 * ファイルを読み込んでテキストとして返す
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };
    reader.readAsText(file, 'UTF-8');
  });
}
