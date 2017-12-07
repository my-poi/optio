SELECT *
FROM Schedules
WHERE employeeId IN ?
AND CAST(CONCAT(year, '-', month, '-', 1) AS DATE) >= ?
AND CAST(CONCAT(year, '-', month, '-', 1) AS DATE) <= ?;