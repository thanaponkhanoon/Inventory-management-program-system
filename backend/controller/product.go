package controller

import (
	"fmt"
	"net/http"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

func CreateProduct(c *gin.Context){
	var product	entity.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	PD := entity.Product{
		Product_id: 	product.Product_id,
		Product_name: 	product.Product_name,
		Cost_unit: 		product.Cost_unit,
	}

	if _, err := govalidator.ValidateStruct(product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&PD).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": PD})
}

func GetAllProduct(c *gin.Context){
	var product []entity.Product

	if err := entity.DB().Model(&entity.Product{}).Find(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func GetProductByID(c *gin.Context) {
	var product entity.Product

	Id := c.Param("id")
	if err := entity.DB().Model(&entity.Product{}).Where("ID = ?", Id).Find(&product); err.RowsAffected == 0{
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("ProductID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func UpdateProduct(c *gin.Context) {
	var product entity.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", product.ID).First(&entity.Product{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}
	if err := entity.DB().Save(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, err := govalidator.ValidateStruct(product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func DeleteProductByID(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Product{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("ProductID :  Id%s deleted.", Id)})
}