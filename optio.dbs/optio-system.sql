CREATE DATABASE OptioSystem;

USE OptioSystem;

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  userName VARCHAR(20) NOT NULL,
  passwordHash VARCHAR(44) NOT NULL,
  email VARCHAR(320) NOT NULL,
  lastActivity DATETIME,
  previousActivity DATETIME,
  isLocked BOOL NOT NULL,
  created DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uxUserName (userName),
  UNIQUE KEY uxEmail (email)
);

CREATE TABLE Roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uxName (name)
);

CREATE TABLE UsersInRoles (
  userId INT NOT NULL,
  roleId INT NOT NULL,
  PRIMARY KEY (userId, roleId),
  CONSTRAINT fkUsersUsersInRolesUserId
    FOREIGN KEY (userId)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fkRolesUsersInRolesRoleId
    FOREIGN KEY (roleId)
    REFERENCES roles (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
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
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

CREATE TABLE UserActivities (
  id INT NOT NULL AUTO_INCREMENT,
  activity DATETIME NOT NULL,
  userId INT NOT NULL,
  userIp VARCHAR(39) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fkUsersUserActivitiesUserId
    FOREIGN KEY (userId)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);
