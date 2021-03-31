![.NET Core](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-CostExplorer/workflows/.NET%20Core/badge.svg)

# Microservice - CostExplorer
## Larrosa-Settimo-Zawrzykraj

This microservice allows users to obtaint costs reports for their organization.

* Listens for messages with the following topics:
    * `bug.create` Allows to receive if a bug has been created and increments the database record of created bugs per month.
    * `user.create` Allows to receive if a bug has been created and increments the database record of created bugs per month.

## Available endpoints   

### POST /api/v1/costs?from=`2020-12-07`&to=`2020-12-11`
This endpoint will return a report of created bugs and users for the logged user organization for a time period.

### GET /api/v1/costs/ping
Returns the health status of the microservice and it's dependencies.


## Available scripts
### Execution
**In the folder CostExplorer:**
* For creating the migrations execute:
    - dotnet ef migrations add <<migration_name>> -o ./DataAccess/Migrations

* To run the application and if the migrations are allready created execute:
    - dotnet ef database update.
