using System.Reflection.Metadata;
using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using CostExplorer.Domain;
using CostExplorer.Interfaces;
using CostExplorer.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace CostExplorer.Tests
{
    [TestClass]
    public class CostsControllerTest
    {
        private ICostsService costService;

        [TestMethod]
        public async Task GetCostsTest()
        {
            DateTime from = new DateTime(2020, 1, 1);
            DateTime to = new DateTime(2020, 12, 1);

            List<MonthCost> returnedList = new List<MonthCost>();

            PeriodCost periodMonth2 = new PeriodCost() {
                month = 2,
                year = 2020
            };
            Cost bugsCostMonth2 = new Cost() {
                cant = 100,
                unitCost = 2,
            };
            Cost usersCostMonth2 = new Cost() {
                cant = 13,
                unitCost = 5,
            };
            PeriodCost periodMonth5 = new PeriodCost()
            {
                month = 5,
                year = 2020
            };
            Cost bugsCostMonth5 = new Cost() {
                cant = 167,
                unitCost = 4,
            };
            Cost usersCostMonth5 = new Cost() {
                cant = 7,
                unitCost = 6,
            };

            MonthCost monthCost2 = new MonthCost() {
                id = 1,
                bugs = bugsCostMonth2,
                users = usersCostMonth2,
                period = periodMonth2
            };
            MonthCost monthCost5 = new MonthCost() {
                id = 2,
                bugs = bugsCostMonth5,
                users = usersCostMonth5,
                period = periodMonth5
            };
            returnedList.Add(monthCost2);
            returnedList.Add(monthCost5);

            var mockCostService = new Mock<ICostsService>();
            mockCostService.Setup(m => m.GetCosts(from, to, 1)).Returns(returnedList);
            
            var controller = new CostsController(
                mockCostService.Object,
                (new Mock<ILoggerManager>()).Object,
                (new Mock<IPingService>()).Object);

            controller.ControllerContext = new ControllerContext();
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            
            User usr = new User() { id = 1, organizationId = 1 };
            TokenContent tokenCont = new TokenContent() { user = usr, organizationId = 1 };
            Token token = new Token() { exp = 10000, iat = 10000, data = tokenCont };
            controller.ControllerContext.HttpContext.Items["Token"] = token;

            var queryParam = new CostsFilterOptions() { From = from, To = to };

            var result = await controller.Get(queryParam);
            var okResult = result as OkObjectResult;

            List<MonthCost> model = okResult.Value as List<MonthCost>;
            
            mockCostService.VerifyAll();

            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsFalse(model == null);
            Assert.AreEqual(model.Count, 2);
        }

        [TestMethod]
        public void Ping()
        {
            PingObject ping = new PingObject() 
            {
                PostgresMessage = "Postgres status: OK",
                RabbitMessage = "Rabbit status: OK"
            };
            var mock = new Mock<IPingService>();
            mock.Setup(m => m.Ping()).Returns(ping);
            
            var controller = new CostsController(
                (new Mock<ICostsService>()).Object,
                (new Mock<ILoggerManager>()).Object,
                mock.Object);

            var result = controller.Ping();
            var okResult = result as OkObjectResult;
            
            mock.VerifyAll();

            Assert.AreEqual(200, okResult.StatusCode);
        }
    }
}
