import React, { useEffect, useState } from "react";
import { useAuth } from "../../use-auth-client";
import { swago_backend } from "../../../../declarations/swago_backend";
import { MainNavbar } from "./MainNavbar";
export const TransactionHistory = () => {
  const { principal: whoami } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        if (!whoami) return;

        const history = await swago_backend.get_user_transaction_history(
          whoami
        );
        console.log("Transaction history:", history);
        setTransactions(history);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError("Failed to fetch transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [whoami]);

  const formatTime = (nanoseconds) => {
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(nanoseconds) / 1_000_000;
    return new Date(milliseconds).toLocaleString();
  };

  const shortenPrincipal = (principal) => {
    const text = principal.toString();
    return `${text.slice(0, 6)}...${text.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="container">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-[#101a23]  min-h-screen">
      <MainNavbar />
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-3xl text-center mt-12">Transaction History</h2>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1e293b] rounded-lg overflow-hidden">
              <thead className="bg-[#2a3642]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3642]">
                {transactions.map((tx, index) => (
                  <tr
                    key={index}
                    className="hover:bg-[#2a3642] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatTime(tx.t_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono">
                        {shortenPrincipal(tx.t_from)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono">
                        {shortenPrincipal(tx.t_to)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {Number(tx.t_amount)} SWAG
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          tx.t_from.toString() === whoami.toString()
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {tx.t_from.toString() === whoami.toString()
                          ? "Sent"
                          : "Received"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Your Principal: {whoami ? whoami.toText() : "No Principal"}
        </div>
      </div>
    </div>
  );
};
