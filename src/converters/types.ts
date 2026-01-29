// TikTok Shop 注文データの型定義
export interface TikTokOrder {
  注文ID: string;
  注文状況: string;
  注文のサブ状況: string;
  'キャンセル/返品のタイプ': string;
  通常の注文または予約注文: string;
  'SKU ID': string;
  セラーSKU: string;
  商品名: string;
  バリエーション: string;
  数量: string;
  返品済みのSKU数: string;
  SKUの元の価格: string;
  'SKU小計（割引前）': string;
  'プラットフォームが資金提供を行うSKU割引': string;
  セラーSKU割引: string;
  'SKU小計（割引後）': string;
  割引後の送料: string;
  元の送料: string;
  セラー送料割引: string;
  プラットフォーム送料割引: string;
  プラットフォーム割引: string;
  注文金額: string;
  注文の返金額: string;
  注文作成時刻: string;
  注文の支払い日時: string;
  発送準備完了日時: string;
  発送日時: string;
  配達日時: string;
  キャンセル日時: string;
  'キャンセル元：': string;
  キャンセル理由: string;
  フルフィルメントタイプ: string;
  倉庫名: string;
  追跡ID: string;
  配達オプションのタイプ: string;
  配送業者名: string;
  カスタマーのユーザー名: string;
  受取人: string;
  名: string;
  姓: string;
  国: string;
  郵便番号: string;
  都道府県: string;
  市区町村: string;
  町名: string;
  詳細住所1: string;
  詳細住所2: string;
  支払い方法: string;
  電話番号: string;
  '重量（kg）': string;
  商品カテゴリー: string;
  荷物ID: string;
  セラーメモ: string;
  配送先情報: string;
  統合リスト: string;
  カスタマーからのメッセージ: string;
}

// パース後の正規化されたオーダーデータ
export interface NormalizedOrder {
  orderId: string;
  productName: string;
  quantity: number;
  recipientName: string;
  recipientNameKana: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  town: string;
  address1: string;
  address2: string;
  orderAmount: string;
  skuId: string;
  packageId: string;
}

// 発送元情報
export interface ShipperInfo {
  name: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  // ヤマト用
  customerCode: string;
}

// 佐川 e飛伝Ⅲ CSV形式
export interface SagawaRecord {
  お届け先コード: string;
  お届け先電話番号: string;
  お届け先郵便番号: string;
  お届け先住所1: string;
  お届け先住所2: string;
  お届け先住所3: string;
  お届け先名称1: string;
  お届け先名称2: string;
  ご依頼主コード: string;
  ご依頼主電話番号: string;
  ご依頼主郵便番号: string;
  ご依頼主住所1: string;
  ご依頼主住所2: string;
  ご依頼主名称1: string;
  ご依頼主名称2: string;
  荷姿コード: string;
  品名1: string;
  品名2: string;
  出荷個数: string;
  '便種（スピード）': string;
  '便種（クール）': string;
  配達日: string;
  配達指定時間帯: string;
  代引金額: string;
  消費税: string;
  決済種別: string;
  保険金額: string;
  指定シール1: string;
  指定シール2: string;
  指定シール3: string;
  お届け先敬称: string;
  お客様管理番号: string;
  お客様コード: string;
  部署名1: string;
  部署名2: string;
}

// ヤマト B2クラウド CSV形式
export interface YamatoRecord {
  お客様管理番号: string;
  送り状種類: string;
  クール区分: string;
  伝票番号: string;
  出荷予定日: string;
  お届け予定日: string;
  配達時間帯: string;
  お届け先コード: string;
  お届け先電話番号: string;
  'お届け先電話番号(枝番)': string;
  お届け先郵便番号: string;
  お届け先住所: string;
  'お届け先住所（アパートマンション名）': string;
  'お届け先会社・部門名１': string;
  'お届け先会社・部門名２': string;
  お届け先名: string;
  'お届け先名(カナ)': string;
  敬称: string;
  ご依頼主コード: string;
  ご依頼主電話番号: string;
  'ご依頼主電話番号(枝番)': string;
  ご依頼主郵便番号: string;
  ご依頼主住所: string;
  'ご依頼主住所（アパートマンション名）': string;
  ご依頼主名: string;
  'ご依頼主名(カナ)': string;
  品名コード１: string;
  品名１: string;
  品名コード２: string;
  品名２: string;
  荷扱い１: string;
  荷扱い２: string;
  記事: string;
  'コレクト代金引換額（税込）': string;
  内消費税額等: string;
  止置き: string;
  営業所コード: string;
  発行枚数: string;
  個数口表示フラグ: string;
  ご請求先顧客コード: string;
  ご請求先分類コード: string;
  運賃管理番号: string;
}

// 配送会社の種類
export type CarrierType = 'sagawa' | 'yamato';

// バリデーションエラー
export interface ValidationError {
  row: number;
  field: string;
  message: string;
}
