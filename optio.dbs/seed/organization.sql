USE OptioOrganization;

INSERT INTO CompanyUnits VALUES (1, 0, 1, 'Firma XYZ', 'Firma XYZ', 'XYZ', '711 231 234', '', '', '', true, false, false, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (2, 1, 2, 'Wydział A', 'Wydział A', '', '', '', '', '', true, false, false, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (3, 2, 3, 'Oddział A', 'Wydział A/Oddział A', '', '', '', '', '', true, true, true, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (4, 2, 4, 'Oddział B', 'Wydział A/Oddział B', '', '', '', '', '', true, true, true, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (5, 1, 5, 'Wydział B', 'Wydział B', '', '', '', '', '', true, true, true, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (6, 1, 6, 'Wydział C', 'Wydział C', '', '', '', '', '', true, false, false, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (7, 3, 7, 'Referat I', 'Wydział A/Oddział A/Referat I', '', '', '', '', '', true, true, false, false, false, 1, '2015-06-07T00:00:00', null, null);
INSERT INTO CompanyUnits VALUES (8, 3, 8, 'Referat II', 'Wydział A/Oddział A/Referat II', '', '', '', '', '', true, true, true, false, false, 1, '2015-06-07T00:00:00', null, null);

INSERT INTO Employees VALUES (1, 'Maciej', 'Tokarz', '519 585 106', '', '', 'maciej.tokarz@my-poi.pl', 'assets/photos/employees/b1c9945d-bc77-4872-a56e-d5d47027cd87.png', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (2, 'Anna', 'Szymańska', '122 399 966', '', '', '', 'assets/photos/employees/1055defc-3931-4655-82c9-25980bee8e4e.png', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (3, 'Aleksandra', 'Zawadzka', '855 877 854', '', '', '', 'assets/photos/employees/692ab8c9-af0c-4a91-8d35-84239d9a0b2b.png', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (4, 'Waldemar', 'Marciniak', '566 655 488', '', '', '', 'assets/photos/employees/4751cd61-f165-45df-a545-824becc03009.png', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (5, 'Jerzy', 'Adamowski', '200 188 188', '', '', '', 'assets/photos/employees/532c448d-7fd6-4db8-b323-499aa7df3092.png', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (6, 'Edyta', 'Jabłońska', '222 999 111', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (7, 'Paweł', 'Lisiak', '333 222 111', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (8, 'Natalia', 'Socha', '745 778 889', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (9, 'Marcel', 'Muszyński', '654 698 663', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (10, 'Filip', 'Sobczak', '745 985 985', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (11, 'Julian', 'Mróz', '452 214 325', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (12, 'Szymon', 'Zalewski', '478 598 665', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (13, 'Jan', 'Jaworski', '855 774 996', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (14, 'Mateusz', 'Dąbrowski', '112 223 335', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (15, 'Radosław', 'Walczak', '445 554 665', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (16, 'Kajetan', 'Marciniak', '114 225 336', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (17, 'Andrzej', 'Żak', '995 775 886', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (18, 'Natalia', 'Sadowska', '442 551 662', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);
INSERT INTO Employees VALUES (19, 'Alicja', 'Wojciechowska', '115 448 559', '', '', '', '', 1, '2015-06-07T00:00:00', null, null);

INSERT INTO Classifications VALUES (1, 3, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (2, 3, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (3, 3, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (4, 3, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (5, 4, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (6, 4, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');
INSERT INTO Classifications VALUES (7, 7, '2013-01-01', NULL, 1, '2016-06-07T12:10:00');