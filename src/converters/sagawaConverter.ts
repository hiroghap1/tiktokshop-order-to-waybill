import type { NormalizedOrder, SagawaRecord, ShipperInfo } from './types';

/**
 * 佐川 e飛伝Ⅲ 用のCSVヘッダー
 */
export const SAGAWA_HEADERS = [
  'お届け先コード',
  'お届け先電話番号',
  'お届け先郵便番号',
  'お届け先住所1',
  'お届け先住所2',
  'お届け先住所3',
  'お届け先名称1',
  'お届け先名称2',
  'ご依頼主コード',
  'ご依頼主電話番号',
  'ご依頼主郵便番号',
  'ご依頼主住所1',
  'ご依頼主住所2',
  'ご依頼主名称1',
  'ご依頼主名称2',
  '荷姿コード',
  '品名1',
  '品名2',
  '出荷個数',
  '便種（スピード）',
  '便種（クール）',
  '配達日',
  '配達指定時間帯',
  '代引金額',
  '消費税',
  '決済種別',
  '保険金額',
  '指定シール1',
  '指定シール2',
  '指定シール3',
  'お届け先敬称',
  'お客様管理番号',
  'お客様コード',
  '部署名1',
  '部署名2',
];

/**
 * NormalizedOrderを佐川e飛伝Ⅲ形式に変換
 */
export function convertToSagawa(order: NormalizedOrder, shipper: ShipperInfo): SagawaRecord {
  // 住所1: 都道府県 + 市区町村
  const address1 = `${order.prefecture}${order.city}`;
  
  // 住所2: 町名 + 詳細住所1
  const address2 = `${order.town}${order.address1}`;
  
  // 住所3: 詳細住所2（建物名等）
  const address3 = order.address2;
  
  // 品名（30文字まで）
  const productName = order.productName.slice(0, 30);
  
  return {
    お届け先コード: '',
    お届け先電話番号: order.phone,
    お届け先郵便番号: order.postalCode,
    お届け先住所1: address1,
    お届け先住所2: address2,
    お届け先住所3: address3,
    お届け先名称1: order.recipientName,
    お届け先名称2: '',
    ご依頼主コード: '',
    ご依頼主電話番号: shipper.phone,
    ご依頼主郵便番号: shipper.postalCode,
    ご依頼主住所1: shipper.address1,
    ご依頼主住所2: shipper.address2,
    ご依頼主名称1: shipper.name,
    ご依頼主名称2: '',
    荷姿コード: '',
    品名1: productName,
    品名2: '',
    出荷個数: order.quantity.toString(),
    '便種（スピード）': '',
    '便種（クール）': '',
    配達日: '',
    配達指定時間帯: '',
    代引金額: '',
    消費税: '',
    決済種別: '',
    保険金額: '',
    指定シール1: '',
    指定シール2: '',
    指定シール3: '',
    お届け先敬称: '様',
    お客様管理番号: order.orderId,
    お客様コード: '',
    部署名1: '',
    部署名2: '',
  };
}

/**
 * 複数のオーダーを佐川CSV形式の文字列に変換
 */
export function convertOrdersToSagawaCSV(orders: NormalizedOrder[], shipper: ShipperInfo): string {
  const records = orders.map(order => convertToSagawa(order, shipper));
  
  // ヘッダー行
  const headerRow = SAGAWA_HEADERS.join(',');
  
  // データ行
  const dataRows = records.map(record => {
    return SAGAWA_HEADERS.map(header => {
      const value = record[header as keyof SagawaRecord] || '';
      // カンマや改行を含む場合はダブルクォートで囲む
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\r\n');
}
