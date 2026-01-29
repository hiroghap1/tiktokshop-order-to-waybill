import type { NormalizedOrder, YamatoRecord, ShipperInfo } from './types';
import { formatPostalCode } from './tiktokParser';

/**
 * ヤマト B2クラウド 用のCSVヘッダー
 */
export const YAMATO_HEADERS = [
  'お客様管理番号',
  '送り状種類',
  'クール区分',
  '伝票番号',
  '出荷予定日',
  'お届け予定日',
  '配達時間帯',
  'お届け先コード',
  'お届け先電話番号',
  'お届け先電話番号(枝番)',
  'お届け先郵便番号',
  'お届け先住所',
  'お届け先住所（アパートマンション名）',
  'お届け先会社・部門名１',
  'お届け先会社・部門名２',
  'お届け先名',
  'お届け先名(カナ)',
  '敬称',
  'ご依頼主コード',
  'ご依頼主電話番号',
  'ご依頼主電話番号(枝番)',
  'ご依頼主郵便番号',
  'ご依頼主住所',
  'ご依頼主住所（アパートマンション名）',
  'ご依頼主名',
  'ご依頼主名(カナ)',
  '品名コード１',
  '品名１',
  '品名コード２',
  '品名２',
  '荷扱い１',
  '荷扱い２',
  '記事',
  'コレクト代金引換額（税込）',
  '内消費税額等',
  '止置き',
  '営業所コード',
  '発行枚数',
  '個数口表示フラグ',
  'ご請求先顧客コード',
  'ご請求先分類コード',
  '運賃管理番号',
];

/**
 * NormalizedOrderをヤマトB2クラウド形式に変換
 */
export function convertToYamato(order: NormalizedOrder, shipper: ShipperInfo): YamatoRecord {
  // 住所: 都道府県 + 市区町村 + 町名 + 詳細住所1
  const address = `${order.prefecture}${order.city}${order.town}${order.address1}`;
  
  // 品名（25文字まで）
  const productName = order.productName.slice(0, 25);
  
  // 郵便番号にハイフンを追加
  const postalCodeWithHyphen = formatPostalCode(order.postalCode);
  const shipperPostalCodeWithHyphen = formatPostalCode(shipper.postalCode);
  
  return {
    お客様管理番号: order.orderId,
    送り状種類: '0', // 0:発払い
    クール区分: '0', // 0:通常
    伝票番号: '',
    出荷予定日: '',
    お届け予定日: '',
    配達時間帯: '',
    お届け先コード: '',
    お届け先電話番号: order.phone,
    'お届け先電話番号(枝番)': '',
    お届け先郵便番号: postalCodeWithHyphen,
    お届け先住所: address,
    'お届け先住所（アパートマンション名）': order.address2,
    'お届け先会社・部門名１': '',
    'お届け先会社・部門名２': '',
    お届け先名: order.recipientName,
    'お届け先名(カナ)': order.recipientNameKana,
    敬称: '様',
    ご依頼主コード: '',
    ご依頼主電話番号: shipper.phone,
    'ご依頼主電話番号(枝番)': '',
    ご依頼主郵便番号: shipperPostalCodeWithHyphen,
    ご依頼主住所: shipper.address1,
    'ご依頼主住所（アパートマンション名）': shipper.address2,
    ご依頼主名: shipper.name,
    'ご依頼主名(カナ)': '',
    品名コード１: '',
    品名１: productName,
    品名コード２: '',
    品名２: '',
    荷扱い１: '',
    荷扱い２: '',
    記事: '',
    'コレクト代金引換額（税込）': '',
    内消費税額等: '',
    止置き: '',
    営業所コード: '',
    発行枚数: '',
    個数口表示フラグ: '',
    ご請求先顧客コード: shipper.customerCode,
    ご請求先分類コード: '',
    運賃管理番号: '01',
  };
}

/**
 * 複数のオーダーをヤマトCSV形式の文字列に変換
 */
export function convertOrdersToYamatoCSV(orders: NormalizedOrder[], shipper: ShipperInfo): string {
  const records = orders.map(order => convertToYamato(order, shipper));
  
  // ヘッダー行
  const headerRow = YAMATO_HEADERS.join(',');
  
  // データ行
  const dataRows = records.map(record => {
    return YAMATO_HEADERS.map(header => {
      const value = record[header as keyof YamatoRecord] || '';
      // カンマや改行を含む場合はダブルクォートで囲む
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\r\n');
}
