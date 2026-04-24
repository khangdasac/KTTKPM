# PowerShell Load Testing Script - 1000 concurrent requests

param(
    [int]$totalRequests = 1000,
    [int]$concurrentRequests = 100,
    [string]$url = "http://localhost:3000/api/data"
)

Write-Host "🚀 Starting Load Test" -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host "Total Requests: $totalRequests" -ForegroundColor Cyan
Write-Host "Concurrent: $concurrentRequests" -ForegroundColor Cyan
Write-Host ""

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$successCount = 0
$failCount = 0
$totalTime = 0
$times = @()

# Run requests in batches
for ($batch = 0; $batch -lt [Math]::Ceiling($totalRequests / $concurrentRequests); $batch++) {
    $batchSize = [Math]::Min($concurrentRequests, $totalRequests - ($batch * $concurrentRequests))
    
    Write-Host "Batch $($batch + 1): Sending $batchSize requests..." -ForegroundColor Yellow
    
    # Create parallel jobs for concurrent requests
    $jobs = @()
    for ($i = 0; $i -lt $batchSize; $i++) {
        $job = Start-Job -ScriptBlock {
            param($url)
            $requestStart = Get-Date
            try {
                $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 10
                $requestTime = (Get-Date) - $requestStart
                [PSCustomObject]@{
                    Success = $true
                    Time = $requestTime.TotalMilliseconds
                    Status = $response.StatusCode
                }
            } catch {
                $requestTime = (Get-Date) - $requestStart
                [PSCustomObject]@{
                    Success = $false
                    Time = $requestTime.TotalMilliseconds
                    Error = $_.Exception.Message
                }
            }
        } -ArgumentList $url
        
        $jobs += $job
    }
    
    # Wait for all jobs to complete
    foreach ($job in $jobs) {
        $result = Wait-Job -Job $job | Receive-Job
        $times += $result.Time
        
        if ($result.Success) {
            $successCount++
        } else {
            $failCount++
        }
        
        Remove-Job -Job $job
    }
    
    Write-Host "✓ Batch completed. Success: $successCount, Failed: $failCount" -ForegroundColor Green
}

$stopwatch.Stop()
$avgTime = ($times | Measure-Object -Average).Average
$minTime = ($times | Measure-Object -Minimum).Minimum
$maxTime = ($times | Measure-Object -Maximum).Maximum
$rps = $totalRequests / $stopwatch.Elapsed.TotalSeconds

Write-Host ""
Write-Host "=" * 50 -ForegroundColor Magenta
Write-Host "📊 LOAD TEST RESULTS" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Magenta
Write-Host "Total Requests: $totalRequests" -ForegroundColor Cyan
Write-Host "Successful: $successCount ✓" -ForegroundColor Green
Write-Host "Failed: $failCount ✗" -ForegroundColor Red
Write-Host "Total Time: $([Math]::Round($stopwatch.Elapsed.TotalSeconds, 2))s" -ForegroundColor Cyan
Write-Host "Requests/Second: $([Math]::Round($rps, 2)) RPS" -ForegroundColor Yellow
Write-Host "Avg Response Time: $([Math]::Round($avgTime, 2))ms" -ForegroundColor Cyan
Write-Host "Min Response Time: $([Math]::Round($minTime, 2))ms" -ForegroundColor Cyan
Write-Host "Max Response Time: $([Math]::Round($maxTime, 2))ms" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Magenta
