package controller

import (
	"fmt"
	"net/http"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

func CreateCustomer(c *gin.Context){
	var customer	entity.Customer

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	CT := entity.Customer{
		Cus_id:		customer.Cus_id,
		Cus_name: 	customer.Cus_name,
	}

	if _, err := govalidator.ValidateStruct(customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&CT).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"data": CT})
}

func GetAllCustomer(c *gin.Context){
	var customer []entity.Customer

	if err := entity.DB().Model(&entity.Customer{}).Find(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customer})
}

func GetCustomerByID(c *gin.Context) {
	var customer entity.Customer
	Id := c.Param("id")
	if err := entity.DB().Model(&entity.Customer{}).Where("ID = ?", Id).Find(&customer); err.RowsAffected == 0{
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("CustomerID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customer})
}

func UpdateCustomer(c *gin.Context) {
	var customer entity.Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", customer.ID).First(&entity.Customer{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}
	if err := entity.DB().Save(&customer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": customer})
}

func DeleteCustomerByID(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Customer{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("CustomerID :  Id%s deleted.", Id)})
}