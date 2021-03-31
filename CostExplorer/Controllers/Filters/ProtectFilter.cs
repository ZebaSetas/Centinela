using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using CostExplorer.Domain;
using System.Threading.Tasks;
using CostExplorer.Interfaces;


namespace CostExplorer.WebApi.Controllers.Filters 
{
    public class ProtectFilter : Attribute, IActionFilter
    {
        private readonly int _role;
        private ITokenService service;

        public ProtectFilter(ITokenService service, int role)
        {
            _role = 1;
            this.service = service ?? throw new ArgumentNullException(nameof(service));
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            string headerToken = context.HttpContext.Request.Headers["Authorization"];
            if (headerToken == null) 
            {
                context.Result = new ContentResult() { StatusCode = 401, Content = "Authorization header is missing" };
            } 
            else 
            {
                try 
                {         
                    var task1 = this.service.Verify(headerToken);
                    Task.WaitAll(new Task[] { task1 });
                    Token token = task1.Result;
                    if(token.data.user.role != _role) {
                        throw new UnauthorizedAccessException("Unauthorized, User permissions do not allow this action");
                    }
                    
                    context.HttpContext.Items.Add("Token", token);
                    
                }
                catch (AggregateException ae) {
                    ae.Handle(ex => {
                        if(ex is UnauthorizedAccessException){
                            context.Result = new ContentResult() { 
                                StatusCode = 401,
                                Content = ex.Message
                            };
                            return ex is UnauthorizedAccessException;
                        }else {
                            context.Result = new ContentResult() { 
                                StatusCode = 400,
                                Content = ex.Message };
                            return ex is Exception;
                        }
                    });
                }
                catch (UnauthorizedAccessException e)
                {
                    context.Result = new ContentResult() { 
                        StatusCode = 401,
                        Content = e.Message };
                }
                catch (Exception e)
                {   
                    context.Result = new ContentResult() { 
                        StatusCode = 400,
                        Content = e.Message };
                }
            }
        }
    }
}