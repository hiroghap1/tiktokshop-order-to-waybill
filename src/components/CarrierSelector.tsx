import type { CarrierType } from '../converters/types';

interface CarrierSelectorProps {
  value: CarrierType;
  onChange: (carrier: CarrierType) => void;
}

export function CarrierSelector({ value, onChange }: CarrierSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="carrier"
          value="sagawa"
          checked={value === 'sagawa'}
          onChange={() => onChange('sagawa')}
          className="w-4 h-4 text-blue-600"
        />
        <span className="text-gray-700">佐川急便 e飛伝Ⅲ</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="carrier"
          value="yamato"
          checked={value === 'yamato'}
          onChange={() => onChange('yamato')}
          className="w-4 h-4 text-blue-600"
        />
        <span className="text-gray-700">ヤマト運輸 B2クラウド</span>
      </label>
    </div>
  );
}
