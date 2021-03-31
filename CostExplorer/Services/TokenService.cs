using System.Net;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Text.Json;
using CostExplorer.Domain;
using CostExplorer.Interfaces;

namespace CostExplorer.Services
{

    public class TokenService: ITokenService
    {
        private static HttpClient _CLIENT;
        private static Dictionary<string, Token> validTokens;
        private static Dictionary<string, AuthenticationErrorResponse> invalidTokens;
        private readonly ILoggerManager logger;
        public TokenService(ILoggerManager logger)
        {
            this.logger = logger;
            
            if (_CLIENT == null)
            {
                _CLIENT = new HttpClient();
                string url = Environment.GetEnvironmentVariable("AUTHENTICATION_SERVICE_URI");
                if(url is null)
                {
                    this.logger.Error("Missing required Environment Variable AUTHENTICATION_SERVICE_URI");
                    throw new MissingFieldException("Missing required Environment Variable AUTHENTICATION_SERVICE_URI");
                }
                _CLIENT.BaseAddress = new Uri(url);
                _CLIENT.Timeout = TimeSpan.FromSeconds(2);
            }
            if (validTokens == null){
                validTokens = new Dictionary<string, Token>();
            }
            if( invalidTokens == null)
            {
                invalidTokens = new Dictionary<string, AuthenticationErrorResponse>();
            }
        }

        public async Task<Token> Verify(string token)
        {       
            Token tokenResult = new Token();
            if( validTokens.ContainsKey(token)) {
                this.logger.Debug("Token verified from memory caché");
                tokenResult = validTokens[token];
            } else  if( invalidTokens.ContainsKey(token)) {
                this.logger.Debug("Token invalid from memory caché");
                AuthenticationErrorResponse err = invalidTokens[token];
                throw new UnauthorizedAccessException("Unauthorized, "+  err.error);
            }
            else {
                this.logger.Debug("Token not cached, requesting verification with Authentication Service");
                _CLIENT.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(token);
                HttpResponseMessage response = await _CLIENT.GetAsync("");
                string responseString = await response.Content.ReadAsStringAsync();

                if(response.StatusCode == HttpStatusCode.Unauthorized) {
                    AuthenticationErrorResponse err = JsonSerializer.Deserialize<AuthenticationErrorResponse>(responseString);
                    invalidTokens.Add(token,err);
                    this.logger.Debug("Token verification successfull, User is Unauthorized");
                    throw new UnauthorizedAccessException(response.StatusCode.ToString() + ", "+  err.error);
                }
                this.logger.Debug("Token verification successfull, User is Authorized");
                tokenResult = JsonSerializer.Deserialize<Token>(responseString);
                validTokens.Add(token, tokenResult);
           }           
            return tokenResult;
        }
    }
}

