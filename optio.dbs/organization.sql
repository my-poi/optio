CREATE DATABASE OptioOrganization;

USE OptioOrganization;

CREATE TABLE CompanyUnits (
  id INT NOT NULL AUTO_INCREMENT,
  parentId INT NOT NULL,
  sortOrder SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  sign VARCHAR(10) NOT NULL,
  phone1 VARCHAR(20) NOT NULL,
  phone2 VARCHAR(20) NOT NULL,
  fax VARCHAR(20) NOT NULL,
  email VARCHAR(254) NOT NULL,
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

CREATE TABLE Positions (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY Name (name)
);

CREATE TABLE Employees (
  id INT NOT NULL AUTO_INCREMENT,
  positionId INT NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  phone1 VARCHAR(20) NOT NULL,
  phone2 VARCHAR(20) NOT NULL,
  fax VARCHAR(20) NOT NULL,
  email VARCHAR(254) NOT NULL,
  photo VARCHAR(100) NOT NULL,
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
