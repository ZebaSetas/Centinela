# Centinela Bug Reporter for NodeJS
## Larrosa-Settimo-Zawrzykraj  
  
## This module can be used to report bugs to the SaaS Centinela  

### Installation
    install the package with: `npm install centinela-bug-reporter`  

### Configuration

* First you will be required to configure 3 parameters.  
  
    Add to your application config file in: `config\default.json`  
    The config file must contain the following parameters

    ```
    {
      "centinela-bug-reporter": {
          "server_url": "<<REST_url_to_post_bugs>>"
          , "keyConnection": "<<evironment_defined_token_string>>"
          , "server_timeout": 1000
      }
   }
  
* Include this package into your application  

    `const CentinelaBugReporter = require('centinela-bug-reporter')`

### Usage  

    let result = await CentinelaBugReporter.reportBug(<<bug_title>>, <<bug_description>>, <<bug_severity>>)
    
    Required parameters: <<bug_title>>, <<bug_severity>>

    Available severities:  
    * SEVERITY.HIGH
    * SEVERITY.MEDIUM_HIGH
    * SEVERITY.MEDIUM_LOW
    * SEVERITY.LOW
    
    Example:
      let result = await CentinelaBugReporter.reportBug("Title", "Description", CentinelaBugReporter.SEVERITY.MEDIUM_HIGH);

### Returns
    * If Successfull
        Returns an integer meaning the JobId for the bug to be processed
    * If UnSuccessfull
        Throws Exeption with Error
            * Missing Required bug title
            * Missing Required severity number
            * Severity number out of range ( 1 - 4 )






