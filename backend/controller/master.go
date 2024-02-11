package controller

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/thanaponkhanoon/Inventory-management-program-system/entity"
)

func CreateMaster(c *gin.Context){
	var customer 	entity.Customer
	var product		entity.Product
	var detail		entity.Detail
	var master		entity.Master

	if err := c.ShouldBindJSON(&master); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", master.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", master.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}
	
	if tx := entity.DB().Where("id = ?", master.DetailID).First(&detail); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "detail not found"})
		return
	}

	MT := entity.Master{
		Customer: 	customer,
		Product: 	product,
		Doc_date: 	master.Doc_date.Local(),
		Detail: 	detail,
		Sys_date: 	master.Sys_date.Local(),
		Amount: 	master.Amount,
		Cost_tot:	master.Cost_tot,
	}

	if err := entity.DB().Create(&MT).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"data": MT})
}

func GetAllMaster(c *gin.Context){
	var master	[]entity.Master
	if err := entity.DB().Model(&entity.Master{}).Preload("Customer").Preload("Product").Preload("Detail").Find(&master).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": master})
}

func GetMasterByID(c *gin.Context) {
	var master	[]entity.Master
	Id := c.Param("id")
	if err := entity.DB().Model(&entity.Master{}).Where("ID = ?", Id).Preload("Customer").Preload("Product").Preload("Detail").Find(&master); err.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("MasterID :  Id%s not found.", Id)})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": master})
}

func UpdateMaster(c *gin.Context){
	var customer 	entity.Customer
	var product		entity.Product
	var detail		entity.Detail
	var master		entity.Master

	if err := c.ShouldBindJSON(&master); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", detail.ID).First(&entity.Master{}); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "master not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", master.CustomerID).First(&customer); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", master.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}
	
	if tx := entity.DB().Where("id = ?", master.DetailID).First(&detail); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "detail not found"})
		return
	}

	master.Doc_date = master.Doc_date.Local()
	master.Sys_date = master.Sys_date.Local() 

	if err := entity.DB().Save(&master).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": master})
}

func DeleteMaster(c *gin.Context) {
	Id := c.Param("id")
	if tx := entity.DB().Delete(&entity.Master{}, Id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "master ID not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": fmt.Sprintf("MasterID :  Id%s deleted.", Id)})
}