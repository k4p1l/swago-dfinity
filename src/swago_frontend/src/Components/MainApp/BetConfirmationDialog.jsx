// BetConfirmationDialog.jsx
export const BetConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  betAmount,
  betType,
  isProcessing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Your Bet</h3>

        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to bet{" "}
            <span className="font-bold text-white">{betAmount} SWAG</span>{" "}
            tokens on{" "}
            <span className="font-bold text-white">
              {betType.toUpperCase()}
            </span>
            ?
          </p>

          <div className="bg-[#2D3748] p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Bet Amount:</span>
              <span className="text-white font-bold">{betAmount} SWAG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Outcome:</span>
              <span
                className={`font-bold ${
                  betType === "yes" ? "text-green-500" : "text-red-500"
                }`}
              >
                {betType.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 ${
                betType === "yes"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white rounded-lg transition-colors`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                "Confirm Bet"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
