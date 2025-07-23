# Database Schema

## Users Table
- **id**: Integer, Primary Key, Auto Increment
- **username**: String, Unique, Not Null
- **email**: String, Unique, Not Null
- **password_hash**: String, Not Null
- **created_at**: DateTime, Default: Current Timestamp

## Records Table
- **id**: Integer, Primary Key, Auto Increment
- **user_id**: Integer, Foreign Key (references Users.id), Not Null
- **description**: Text, Not Null
- **status**: String, Not Null (e.g., 'active', 'resolved', 'archived')
- **created_at**: DateTime, Default: Current Timestamp
- **updated_at**: DateTime, Default: Current Timestamp on update

## Notifications Table
- **id**: Integer, Primary Key, Auto Increment
- **user_id**: Integer, Foreign Key (references Users.id), Not Null
- **message**: String, Not Null
- **is_read**: Boolean, Default: False
- **created_at**: DateTime, Default: Current Timestamp

## Geolocation Table
- **id**: Integer, Primary Key, Auto Increment
- **record_id**: Integer, Foreign Key (references Records.id), Not Null
- **latitude**: Float, Not Null
- **longitude**: Float, Not Null
- **created_at**: DateTime, Default: Current Timestamp

## Admin Actions Table
- **id**: Integer, Primary Key, Auto Increment
- **admin_id**: Integer, Foreign Key (references Users.id), Not Null
- **action**: String, Not Null
- **record_id**: Integer, Foreign Key (references Records.id), Not Null
- **created_at**: DateTime, Default: Current Timestamp

## Indexes
- Create indexes on `username` and `email` in the Users table for faster lookups.
- Create indexes on `user_id` in the Records and Notifications tables for efficient querying.