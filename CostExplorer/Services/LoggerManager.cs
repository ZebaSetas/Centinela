using System;
using System.IO;
using System.Reflection;
using System.Xml;
using log4net;
using log4net.Config;
using CostExplorer.Interfaces;

namespace CostExplorer.Services
{
    public class LoggerManager : ILoggerManager
    {
        private readonly log4net.ILog _logger = LogManager.GetLogger(typeof(LoggerManager));

        public LoggerManager()
        {
            try
            {
                XmlDocument log4netConfig = new XmlDocument();

                using (var fs = File.OpenRead("log4net.config"))
                {
                    log4netConfig.Load(fs);
                    var repo = log4net.LogManager.CreateRepository(Assembly.GetEntryAssembly(), typeof(log4net.Repository.Hierarchy.Hierarchy));
                    XmlConfigurator.Configure(repo, log4netConfig["log4net"]);
                    _logger.Info("Log System Initialized");
                }
            }
            catch (Exception ex)
            {
                _logger.Error("Error", ex);
            }
        }
        public void Debug(string message)
        {
            _logger.Debug(message);
        }
        public void Info(string message)
        {
            _logger.Info(message);
        }
        public void Warn(string message)
        {
            _logger.Warn(message);
        }
        public void Error(string message)
        {
            _logger.Error(message);
        }
        public void Crit(string message)
        {
            _logger.Fatal(message);
        }
    }
}