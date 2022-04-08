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

CREATE TABLE coshh
(
    cas_number          VARCHAR(255) PRIMARY KEY,
    chemical_name       VARCHAR(255),
    photo_path          VARCHAR(255),
    matter_state        matter_state,
    quantity            VARCHAR(255),
    added               DATE,
    expiry              DATE,
    safety_data_sheet   VARCHAR(255),
    coshh_link          VARCHAR(255)
);

CREATE TABLE chemical_to_hazard (chem_id VARCHAR(255),hazard hazard);

INSERT INTO coshh(
    cas_number,
    chemical_name,
    photo_path,
    matter_state,
    quantity,
    added,
    expiry,
    safety_data_sheet,
    coshh_link )
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
    'link-to-cosh'
), (
    
    '6020-87-8',
    'creatine monohydrate 222222',
    'some-path',
    'solid',
    '100g',
    '2022-04-08',
    '2023-04-08',
    'link-to-sds',
    'link-to-cosh'
);
