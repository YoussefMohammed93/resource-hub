"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiTester, ApiTestResult, ApiTestSummary } from "@/lib/api-test";
import { Loader2, Play, CheckCircle, XCircle, Clock } from "lucide-react";

export function ApiDebugPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [summary, setSummary] = useState<ApiTestSummary | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      const testResults = await apiTester.runBasicTests();
      setResults(testResults);
      setSummary(apiTester.getSummary());
    } catch (error) {
      console.error("Failed to run API tests:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Success" : "Failed"}
      </Badge>
    );
  };

  // Only show in development or when explicitly enabled
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_API_DEBUG !== "true"
  ) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          API Debug Panel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test API endpoints to verify connectivity and responses
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run API Tests
              </>
            )}
          </Button>

          {summary && (
            <div className="flex items-center gap-4 text-sm">
              <span>
                <strong>{summary.successful}</strong> /{" "}
                <strong>{summary.total}</strong> passed
              </span>
              <Badge variant="outline">
                {summary.successRate.toFixed(1)}% success rate
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{summary.averageResponseTime}ms avg</span>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test Results</h3>
            <div className="grid gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.success)}
                    <span className="font-medium">{result.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {result.timing}ms
                    </span>
                    {getStatusBadge(result.success)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.some((r) => !r.success) && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-600">Errors</h3>
            <div className="space-y-2">
              {results
                .filter((r) => !r.success)
                .map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="font-medium text-red-800">
                      {result.endpoint}
                    </div>
                    <div className="text-sm text-red-600">{result.error}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>Mock Data: {process.env.NEXT_PUBLIC_USE_MOCK_DATA}</p>
          <p>API Logging: {process.env.NEXT_PUBLIC_ENABLE_API_LOGGING}</p>
        </div>
      </CardContent>
    </Card>
  );
}
