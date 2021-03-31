using System.Net.Http;
using System.Net.Http.Headers;
using System;
using CostExplorer.Interfaces;
using System.Collections.Generic;
using CostExplorer.Domain;
using Microsoft.EntityFrameworkCore;

namespace CostExplorer.Services
{
    public class PingService : IPingService
    {
        private DbContext Context;
        public PingService(DbContext context)
        {
            Context = context;
        }

        public PingObject Ping()
        {
            PingObject ping = new PingObject();

            string rabbitMsg = "Rabbit status: ";
            string postgresMsg = "Postgres status: ";
            string rabbitOkMsg = rabbitMsg + "OK";
            string postgresOKMsg = postgresMsg + "OK";
            string rabbitErrorMsg = rabbitMsg + "ERROR ";
            string postgresErrorMsg = postgresMsg + "ERROR ";

            try
            {
                bool retorno = Context.Database.CanConnect(); 

                if (retorno)
                {
                    ping.PostgresMessage = rabbitOkMsg;
                    ping.RabbitMessage = postgresOKMsg;
                }
                else
                {
                    ping.PostgresMessage = postgresErrorMsg;
                    ping.RabbitMessage = rabbitErrorMsg;
                }
            }
            catch (Exception e) 
            {
                ping.PostgresMessage = postgresErrorMsg + e.Message;
                ping.RabbitMessage = rabbitErrorMsg + e.Message;
            }

            return ping;
        }
    }
}