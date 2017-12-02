SELECT 
  employeeId, 
  companyUnitId, 
  DATE_FORMAT(validFrom, '%Y-%m-%d') AS validFrom, 
  DATE_FORMAT(validTo, '%Y-%m-%d') AS validTo, 
  createdBy, 
  created
FROM Classifications;