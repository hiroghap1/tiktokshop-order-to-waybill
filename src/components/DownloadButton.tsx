interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  carrierName: string;
}

export function DownloadButton({ onClick, disabled, carrierName }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-3 px-6 rounded-lg font-medium text-white
        transition-colors duration-200
        ${disabled 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `}
    >
      {disabled ? (
        'CSVファイルをアップロードしてください'
      ) : (
        <>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {carrierName}用CSVをダウンロード
          </span>
        </>
      )}
    </button>
  );
}
