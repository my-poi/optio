CREATE DATABASE OptioSystem;

USE OptioSystem;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  fullName VARCHAR(70) NOT NULL,
  email VARCHAR(320) NOT NULL,
  passwordHash VARCHAR(44) NOT NULL,
  lastActivity DATETIME,
  previousActivity DATETIME,
  recoveryId VARCHAR(36),
  isLocked BOOL NOT NULL,
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uxName (name),
  UNIQUE KEY uxEmail (email),
  CONSTRAINT fkUsersUsersCreatedBy
    FOREIGN KEY (createdBy)
    REFERENCES Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  fullName VARCHAR(70) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uxName (name)
);

CREATE TABLE UsersInRoles (
  userId INT NOT NULL,
  roleId INT NOT NULL,
  PRIMARY KEY (userId, roleId),
  CONSTRAINT fkUsersUsersInRolesUserId
    FOREIGN KEY (userId)
    REFERENCES Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fkRolesUsersInRolesRoleId
    FOREIGN KEY (roleId)
    REFERENCES Roles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Tokens (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  userIp VARCHAR(39) NOT NULL,
  tokenIat DATETIME NOT NULL,
  tokenExp DATETIME NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fkUsersTokensUserId
    FOREIGN KEY (userId)
    REFERENCES Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE UserActivities (
  userId INT NOT NULL,
  userIp VARCHAR(39) NOT NULL,
  activity DATETIME NOT NULL,
  PRIMARY KEY (userId, activity),
  CONSTRAINT fkUsersUserActivitiesUserId
    FOREIGN KEY (userId)
    REFERENCES Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
