package controller

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

func CreateDetail(c *gin.Context){
	var header 		entity.Header
	var product		entity.Product
	var customer	entity.Customer
	var detail		entity.Detail

	if err := c.ShouldBindJSON(&detail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.HeaderID).First(&header); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "header not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	DT := entity.Detail{
		Header: 	header,
		Product: 	product,
		Customer: 	customer,
		Ord_date: 	detail.Ord_date.Local(),
		Fin_date: 	detail.Fin_date.Local(),
		Amount: 	detail.Amount,
		TOT_PRC: 	detail.TOT_PRC,
	}

	if err := entity.DB().Create(&DT).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"data": DT})
}

func GetAllDetail(c *gin.Context){
	var detail	[]entity.Detail
	if err := entity.DB().Model(&entity.Detail{}).Preload("Header").Preload("Product").Preload("Customer").Find(&detail).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": detail})
}

func GetDetailByID(c *gin.Context) {
	var detail	[]entity.Detail
	Id := c.Param("id")
	if err := entity.DB().Model(&entity.Detail{}).Where("ID = ?", Id).Preload("Header").Preload("Product").Preload("Customer").Find(&detail); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("DetailID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": detail})
}

func UpdateDetail(c *gin.Context){
	var header 		entity.Header
	var product		entity.Product
	var customer	entity.Customer
	var detail		entity.Detail

	if err := c.ShouldBindJSON(&detail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.ID).First(&entity.Detail{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "detail not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.HeaderID).First(&header); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "header not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	detail.Ord_date = detail.Ord_date.Local()
	detail.Fin_date = detail.Fin_date.Local() 

	if err := entity.DB().Save(&detail).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": detail})
}

func DeleteDetailByID(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Detail{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "detail ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("DetailID :  Id%s deleted.", Id)})
}