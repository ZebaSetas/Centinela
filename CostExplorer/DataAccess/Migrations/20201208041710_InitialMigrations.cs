using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace CostExplorer.WebApi.DataAccess.Migrations
{
    public partial class InitialMigrations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CostsHistory",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Month = table.Column<int>(nullable: false),
                    Year = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false),
                    BugCost = table.Column<double>(nullable: false),
                    UserCost = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostsHistory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrganizationsCosts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Month = table.Column<int>(nullable: false),
                    Year = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false),
                    BugsAmount = table.Column<long>(nullable: false),
                    UsersAmount = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationsCosts", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CostsHistory");

            migrationBuilder.DropTable(
                name: "OrganizationsCosts");
        }
    }
}
