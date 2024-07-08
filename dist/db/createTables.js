"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (db) => db.execute(`BEGIN; 
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS Users (
                userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- must be unique
                firstName VARCHAR NOT NULL, -- must not be null
                lastName VARCHAR NOT NULL, -- must not be null
                email VARCHAR NOT NULL UNIQUE, -- must be unique and must not be null
                password VARCHAR NOT NULL, -- must not be null
                phone VARCHAR,
                orgs VARCHAR[] NOT NULL, -- must not be null); 
        CREATE TABLE IF NOT EXISTS Organisations (
                orgId UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- must be unique
                name VARCHAR NOT NULL, -- must not be null
                description TEXT NOT NULL, -- must not be null); 
        END;`);
