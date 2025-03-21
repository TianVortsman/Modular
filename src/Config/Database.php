<?php
namespace App\Config;

/**
 * Database Configuration
 * 
 * Provides configuration for different database connections
 */
class Database
{
    /**
     * Get main database connection configuration
     * 
     * @return array Configuration for main database
     */
    public static function getMainConfig(): array
    {
        // Read from environment variables if available (Docker)
        $host = getenv('DB_HOST') ?: 'host.docker.internal';
        $username = getenv('DB_USER') ?: 'Tian';
        $password = getenv('DB_PASSWORD') ?: 'Modul@rdev@2024';
        
        return [
            'host' => $host,
            'port' => '5432',
            'dbname' => 'modular_system',
            'username' => $username,
            'password' => $password,
            // Add connection timeout and other options
            'connect_timeout' => 5,      // 5 seconds timeout
            'sslmode' => 'prefer',       // Prefer SSL if available
            'options' => '',             // Additional connection options
            'fallback_host' => '127.0.0.1'  // Try this IP if primary host fails
        ];
    }
    
    /**
     * Get client database connection configuration
     * 
     * @param string $account_number Client account number
     * @return array Configuration for client database
     */
    public static function getClientConfig(string $account_number): array
    {
        // Read from environment variables if available (Docker)
        $host = getenv('DB_HOST') ?: 'host.docker.internal';
        $username = getenv('DB_USER') ?: 'Tian';
        $password = getenv('DB_PASSWORD') ?: 'Modul@rdev@2024';
        
        return [
            'host' => $host,
            'port' => '5432',
            'dbname' => $account_number,
            'username' => $username,
            'password' => $password,
            // Add connection timeout and other options
            'connect_timeout' => 5,      // 5 seconds timeout
            'sslmode' => 'prefer',       // Prefer SSL if available
            'options' => '',             // Additional connection options
            'fallback_host' => '127.0.0.1'  // Try this IP if primary host fails
        ];
    }
} 