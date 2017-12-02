CREATE DATABASE OptioOrganization;

USE OptioOrganization;

CREATE TABLE CompanyUnits (
  id INT NOT NULL AUTO_INCREMENT,
  parentId INT NOT NULL,
  sortOrder SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  sign VARCHAR(10),
  phone1 VARCHAR(20),
  phone2 VARCHAR(20),
  fax VARCHAR(20),
  email VARCHAR(254),
  isExpanded BOOL NOT NULL,
  isClassified BOOL NOT NULL,
  isScheduled BOOL NOT NULL,
  isPosition BOOL NOT NULL,
  isHidden BOOL NOT NULL,
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  updatedBy INT NOT NULL,
  updated DATETIME NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT UsersCompanyUnits1
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersCompanyUnits2
    FOREIGN KEY (updatedBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Employees (
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  phone1 VARCHAR(20),
  phone2 VARCHAR(20),
  fax VARCHAR(20),
  email VARCHAR(254),
  photo VARCHAR(100),
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  updatedBy INT NOT NULL,
  updated DATETIME NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT UsersEmployees1
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersEmployees2
    FOREIGN KEY (updatedBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Classifications (
  employeeId INT NOT NULL,
  companyUnitId INT NOT NULL,
  validFrom DATE NOT NULL,
  validTo DATE,
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  PRIMARY KEY (employeeId, companyUnitId, validFrom),
  CONSTRAINT EmployeesClassifications
    FOREIGN KEY (employeeId)
    REFERENCES Employees (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT CompanyUnitsClassifications
    FOREIGN KEY (companyUnitId)
    REFERENCES CompanyUnits (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersClassifications
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
