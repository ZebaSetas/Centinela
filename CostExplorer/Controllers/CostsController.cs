using System;
using Microsoft.AspNetCore.Mvc;
using CostExplorer.WebApi.Controllers.Filters;
using CostExplorer.Interfaces;
using CostExplorer.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CostExplorer.WebApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CostsController : ControllerBase
    {
        private ICostsService costService;
        private IPingService pingService;
        private readonly ILoggerManager logger;

        public CostsController(ICostsService costService, ILoggerManager logger, IPingService pingService) : base() { 
            this.costService = costService;
            this.logger = logger;
            this.pingService = pingService;
        }
        
        [TypeFilter(typeof(ProtectFilter), Arguments = new object[] { (int)Role.ADMIN })]
        [HttpGet()]
        public async Task<IActionResult> Get([FromQuery] CostsFilterOptions queryParams) {
            try 
            {
                Token token = (Token)this.HttpContext.Items["Token"];
                logger.Info("New request from userId: " + token.data.user.id + " arrived to obtain Costs for his Organization");
                if(!queryParams.HasOptions()){
                    logger.Error("Missing required query paramteters on url");
                    throw new ArgumentException("Missing required query parameters");
                }

                logger.Debug("Querying service for a report from: " +
                     queryParams.From.ToShortDateString() + " To: " + queryParams.To.ToShortDateString() +
                      " for organizationId: " + token.data.organizationId);
                List<MonthCost> result = this.costService.GetCosts(
                    queryParams.From,
                    queryParams.To,
                    token.data.organizationId
                    );
                return Ok(result);
            }
            catch(ArgumentException exception) 
            {
                return BadRequest(exception.Message);
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }

        [HttpGet("ping")]
        public IActionResult Ping() {
            try 
            {
                logger.Info("Ping request arrived");

                string result = JsonConvert.SerializeObject(this.pingService.Ping());               
                //string result = JsonSerializer.Serialize(this.pingService.Ping());
                    
                return Ok(result);
            }
            catch(ArgumentException exception) 
            {
                return BadRequest(exception.Message);
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }
    }
}