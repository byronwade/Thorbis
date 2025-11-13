/**
 * Transaction History Component
 *
 * Display, filter, search, and export bank transaction history
 */

"use client";

import { FileDown, Loader2, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getTransactions, syncTransactions } from "@/actions/plaid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  merchant_name: string | null;
  category_name: string | null;
  pending: boolean;
  iso_currency_code: string;
}

interface TransactionHistoryProps {
  bankAccountId: string;
  companyId: string;
  bankAccountName?: string;
}

export function TransactionHistory({
  bankAccountId,
  companyId,
  bankAccountName,
}: TransactionHistoryProps) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  // Fetch transactions
  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        const result = await getTransactions(bankAccountId, {
          limit: 100,
        });

        if (result.success && result.data) {
          setTransactions(result.data.transactions);
          setFilteredTransactions(result.data.transactions);
        } else {
          const errorMsg = result.success
            ? "Unknown error"
            : result.error || "Unknown error";
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to fetch transactions");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [bankAccountId, toast]);

  // Filter transactions based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter((txn) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        txn.description?.toLowerCase().includes(searchLower) ||
        txn.merchant_name?.toLowerCase().includes(searchLower) ||
        txn.category_name?.toLowerCase().includes(searchLower) ||
        txn.amount.toString().includes(searchLower)
      );
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  // Sync transactions
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncTransactions(companyId);

      if (result.success && result.data) {
        toast.success(`Synced ${result.data.synced} transactions`);

        // Refresh transactions
        const refreshResult = await getTransactions(bankAccountId, {
          limit: 100,
        });

        if (refreshResult.success && refreshResult.data) {
          setTransactions(refreshResult.data.transactions);
          setFilteredTransactions(refreshResult.data.transactions);
        }
      } else {
        const errorMsg = result.success
          ? "Unknown error"
          : result.error || "Unknown error";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error syncing transactions:", error);
      toast.error("Failed to sync transactions");
    } finally {
      setIsSyncing(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = [
      "Date",
      "Description",
      "Merchant",
      "Category",
      "Amount",
      "Status",
      "Currency",
    ];

    const rows = filteredTransactions.map((txn) => [
      txn.date,
      txn.description || "",
      txn.merchant_name || "",
      txn.category_name || "",
      txn.amount.toFixed(2),
      txn.pending ? "Pending" : "Completed",
      txn.iso_currency_code,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${bankAccountName || bankAccountId}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Transactions exported to CSV");
  };

  // Format currency
  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {bankAccountName && `${bankAccountName} - `}
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={isSyncing}
              onClick={handleSync}
              size="sm"
              variant="outline"
            >
              {isSyncing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 size-4" />
              )}
              Sync Now
            </Button>
            <Button
              disabled={filteredTransactions.length === 0}
              onClick={handleExport}
              size="sm"
              variant="outline"
            >
              <FileDown className="mr-2 size-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            value={searchTerm}
          />
        </div>

        {/* Transactions Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {searchTerm
              ? "No transactions found matching your search"
              : "No transactions yet"}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">
                      {new Date(txn.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{txn.description}</div>
                        {txn.merchant_name && (
                          <div className="text-muted-foreground text-sm">
                            {txn.merchant_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {txn.category_name && (
                        <Badge variant="outline">{txn.category_name}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span
                        className={
                          txn.amount < 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {formatCurrency(
                          Math.abs(txn.amount),
                          txn.iso_currency_code
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {txn.pending ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : (
                        <Badge variant="default">Completed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
