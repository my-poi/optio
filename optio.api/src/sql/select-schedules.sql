SELECT DISTINCT
S.companyUnitId,
S.companyUnitName,
S.companyUnitPath,
CU.path,
MIN(S.created) AS created,
MAX(S.updated) AS updated
FROM Schedules AS S
INNER JOIN OptioOrganization.CompanyUnits AS CU
ON CU.id = S.companyUnitId
WHERE year = ?
AND month = ?
GROUP BY S.companyUnitId,
S.companyUnitName,
S.companyUnitPath;