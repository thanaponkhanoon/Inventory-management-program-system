package controller

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

func CreateHeader(c *gin.Context){
	var header 		entity.Header
	var customer	entity.Customer

	if err := c.ShouldBindJSON(&header); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", header.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	HD := entity.Header{
		Order_no: 	header.Order_no,
		Customer: 	customer,
		Order_date: header.Order_date.Local(),
	}

	if err := entity.DB().Create(&HD).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"data": HD})
}

func GetAllHeader(c *gin.Context){
	var header	[]entity.Header
	if err := entity.DB().Model(&entity.Header{}).Preload("Customer").Find(&header).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": header})
}

func GetHeaderByID(c *gin.Context) {
	var header entity.Header
	Id := c.Param("id")
	if err := entity.DB().Model(&entity.Header{}).Where("ID = ?", Id).Preload("Customer").Find(&header); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("HeaderID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": header})
}

func UpdateHeader(c *gin.Context){
	var header 		entity.Header
	var customer	entity.Customer

	if err := c.ShouldBindJSON(&header); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", header.ID).First(&entity.Header{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "header not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", header.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	header.Order_date = header.Order_date.Local()

	if err := entity.DB().Save(&header).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": header})
}

func DeleteHeader(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Header{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "header ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("HeaderID :  Id%s deleted.", Id)})
}