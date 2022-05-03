DROP DATABASE IF EXISTS coshh;
CREATE DATABASE coshh;

\c coshh

CREATE TYPE matter_state AS ENUM ('liquid', 'solid');
CREATE TYPE hazard AS ENUM (
    'None',
    'Explosive',
    'Flammable',
    'Oxidising',
    'Corrosive',
    'Acute toxicity',
    'Hazardous to the environment',
    'Health hazard/Hazardous to the ozone layer',
    'Serious health hazard',
    'Gas under pressure'
    );

CREATE TYPE storage_temp AS ENUM (
    'Shelf',
    '+4',
    '-20',
    '-80'
    );

CREATE TABLE chemical
(
    id                SERIAL PRIMARY KEY,
    cas_number        VARCHAR(255),
    chemical_name     VARCHAR(255) NOT NULL,
    photo_path        VARCHAR(255),
    matter_state      matter_state,
    quantity          VARCHAR(255) DEFAULT '0',
    added             DATE,
    expiry            DATE,
    safety_data_sheet VARCHAR(255),
    coshh_link        VARCHAR(255),
    lab_location      VARCHAR(255),
    storage_temp      storage_temp NOT NULL,
    is_archived       BOOLEAN      NOT NULL
);

CREATE TABLE chemical_to_hazard
(
    id         INT,
    hazard     hazard
);
