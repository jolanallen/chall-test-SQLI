CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

-- Table User
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    role VARCHAR(20) DEFAULT 'VIEWER',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Post
CREATE TABLE IF NOT EXISTS Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorId INT,
    FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);

-- Table Follower
CREATE TABLE IF NOT EXISTS Follower (
    id INT AUTO_INCREMENT PRIMARY KEY,
    followerId INT,
    followingId INT,
    FOREIGN KEY (followerId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (followingId) REFERENCES User(id) ON DELETE CASCADE,
    UNIQUE KEY follower_following (followerId, followingId)
);
