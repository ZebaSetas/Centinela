namespace CostExplorer.Interfaces {
    public interface ILoggerManager
    {

        void Debug(string message);
        void Info(string message);
        void Warn(string message);
        void Error(string message);
        void Crit(string message);

    }
}