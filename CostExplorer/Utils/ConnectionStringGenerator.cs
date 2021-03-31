using System;

namespace CostExplorer.Utils
{
    public class ConnectionStringGenerator 
    {
        public static string GetConnection() 
        {
            var host = Environment.GetEnvironmentVariable("DATABASE_HOST");
            var port = Environment.GetEnvironmentVariable("DATABASE_PORT");
            var username = Environment.GetEnvironmentVariable("DATABASE_USER");
            var password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
            var dbName = Environment.GetEnvironmentVariable("DATABASE_NAME");

            string connectionString = "Server=" + host + ";port=" + port + ";Username=" + username + ";Password=" + password + ";Database=" + dbName;
            return connectionString;
        }
    }
}