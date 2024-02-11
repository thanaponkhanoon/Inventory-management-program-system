package main

import (
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/controller"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

const PORT = "8080"

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	//User
	r.GET("/employees", controller.ListEmployees)
	r.GET("/employee/:id", controller.GetEmployee)
	r.PATCH("/employees", controller.UpdateEmployee)
	r.DELETE("/employees/:id", controller.DeleteEmployee)
	r.PATCH("/employee", controller.CreateEmployee)
	//Master
	r.GET("/master", controller.GetAllMaster)
	r.GET("/master/:id", controller.GetMasterByID)
	r.POST("/master", controller.CreateMaster)
	r.PATCH("/master", controller.UpdateMaster)
	r.DELETE("/master/:id", controller.DeleteMaster)
	//Detail
	r.GET("/detail", controller.GetAllDetail)
	r.GET("/detail/:id", controller.GetDetailByID)
	r.POST("/detail", controller.CreateDetail)
	r.PATCH("/detail", controller.UpdateDetail)
	r.DELETE("/detail/:id", controller.DeleteDetail)
	//Header
	r.GET("/header", controller.GetAllHeader)
	r.GET("/header/:id", controller.GetHeaderByID)
	r.POST("/header", controller.CreateHeader)
	r.PATCH("/header", controller.UpdateHeader)
	r.DELETE("/header/:id", controller.DeleteHeader)
	//Customer
	r.GET("/customer", controller.GetAllCustomer)
	r.GET("/customer/:id", controller.GetCustomerByID)
	r.POST("/customer", controller.CreateCustomer)
	r.PATCH("/customer", controller.UpdateCustomer)
	r.DELETE("/customer/:id", controller.DeleteCustomer)
	//Product
	r.GET("/product", controller.GetAllProduct)
	r.GET("/product/:id", controller.GetProductByID)
	r.POST("/product", controller.CreateProduct)
	r.PATCH("/product", controller.UpdateProduct)
	r.DELETE("/product/:id", controller.DeleteProductByID)

	// Authentication Routes
	

	// Run the server
	r.Run("localhost: " + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT,DELETE,PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
