DROP DATABASE IF EXISTS coshh;
CREATE DATABASE coshh;

\c coshh

CREATE TYPE matter_state AS ENUM('liquid', 'solid');
CREATE TYPE hazard AS ENUM(
    'Explosive',
    'Flammable',
    'Oxidising',
    'Corrosive',
    'Acute toxicity',
    'Hazardous to the environment',
    'Ozone',
    'Serious health hazard',
    'Gas under pressure'
);

CREATE TYPE storage_temp AS ENUM(
    'Shelf',
    '+4',
    '-20',
    '-80'
);

CREATE TABLE chemical
(
    cas_number          VARCHAR(255) PRIMARY KEY,
    chemical_name       VARCHAR(255) NOT NULL,
    photo_path          VARCHAR(255) NOT NULL,
    matter_state        matter_state NOT NULL,
    quantity            VARCHAR(255) NOT NULL DEFAULT '0',
    added               DATE,
    expiry              DATE,
    safety_data_sheet   VARCHAR(255) NOT NULL,
    coshh_link          VARCHAR(255),
    lab_location        VARCHAR(255),
    storage_temp        storage_temp NOT NULL,
    is_archived         BOOLEAN NOT NULL
);

CREATE TABLE chemical_to_hazard (cas_number VARCHAR(255), hazard hazard);

INSERT INTO chemical_to_hazard (
    cas_number,
    hazard
)
VALUES (
    '6020-87-7',
    'Explosive'
), (
    '6020-87-7',
    'Flammable'
);

INSERT INTO chemical(
    cas_number,
    chemical_name,
    photo_path,
    matter_state,
    quantity,
    added,
    expiry,
    safety_data_sheet,
    coshh_link,
    lab_location,
    storage_temp,
    is_archived )
VALUES 
(
    '6020-87-7',
    'creatine monohydrate',
    'some-path',
    'solid',
    '100g',
    '2022-04-08',
    '2023-04-08',
    'link-to-sds',
    'link-to-cosh',
    'some-location',
    'Shelf',
    'false'
), (
    
    '6020-87-8',
    'creatine monohydrate 222222',
    'some-path',
    'solid',
    '100g',
    '2022-04-08',
    '2023-04-08',
    'link-to-sds',
    'link-to-cosh',
    'some-location',
    'Shelf',
    'false'
);

