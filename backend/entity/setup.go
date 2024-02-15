package entity

import (
	"time"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("ระบบโปรแกรมบริหารจัดการสินค้าคงคลัง.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	database.AutoMigrate(
		&Employee{},
		&Product{},
		&Customer{},
		&Header{},
		&Detail{},
		&Master{},
	)

	db = database

	passwordEmployee1, err := bcrypt.GenerateFromPassword([]byte("12345"), 14)
	Employee1 := Employee{
		FirstName:	"thna",
		LastName:	"srimeang",
		Email:    	"thanapon@gmail.com",
		Password: string(passwordEmployee1),
	}
	db.Raw("SELECT * FROM employees WHERE email = ?", "thanaponkhanoon1123@gmail.com").Scan(&Employee1)
	passwordEmployee2, err := bcrypt.GenerateFromPassword([]byte("1234512126"), 14)
	Employee2 := Employee{
		FirstName:	"thanathon",
		LastName:	"pongpak",
		Email:		"thanathon@gmail.com",
		Password: string(passwordEmployee2),
	}
	db.Raw("SELECT * FROM employees WHERE email = ?", "thanaponkhanoon1123@gmail.com").Scan(&Employee2)
	passwordEmployee3, err := bcrypt.GenerateFromPassword([]byte("123426"), 14)
	Employee3 := Employee{
		FirstName:	"sukda",
		LastName:	"mama",
		Email:    	"sakda@gmail.com",
		Password: string(passwordEmployee3),
	}
	db.Raw("SELECT * FROM employees WHERE email = ?", "thanaponkhanoon1123@gmail.com").Scan(&Employee3)

	// Product
	product1 := Product{
		Product_id:		"id12345678",
		Product_name: 	"Net",
		Cost_unit: 		2,
	}
	db.Model(&Product{}).Create(&product1)
	
	product2 := Product{
		Product_id:		"id22345678",
		Product_name: 	"Stew",
		Cost_unit: 		2,
	}
	db.Model(&Product{}).Create(&product2)
	
	product3 := Product{
		Product_id:		"id32345678",
		Product_name: 	"Fishnet",
		Cost_unit: 		2,
	}
	db.Model(&Product{}).Create(&product3)

	// Customer
	customer1 := Customer{
		Cus_id: 	"id48952173",
		Cus_name: 	"Jaidee",
	}
	db.Model(&Customer{}).Create(&customer1)

	customer2 := Customer{
		Cus_id: 	"id28954746",
		Cus_name: 	"Manee",
	}
	db.Model(&Customer{}).Create(&customer2)
	
	customer3 := Customer{
		Cus_id: 	"id37896542",
		Cus_name: 	"Malee",
	}
	db.Model(&Customer{}).Create(&customer3)
	
	// Header
	header1 := Header{
		Order_no: 		1,
		Customer: 		customer1,
		Order_date: 	time.Now(),
	}
	db.Model(&Header{}).Create(&header1)

	header2 := Header{
		Order_no: 		2,
		Customer: 		customer2,
		Order_date: 	time.Now(),
	}
	db.Model(&Header{}).Create(&header2)

	header3 := Header{
		Order_no: 		3,
		Customer: 		customer2,
		Order_date: 	time.Now(),
	}
	db.Model(&Header{}).Create(&header3)

	// Detail
	detail1 := Detail{
		Header: 		header1,
		Product: 		product1,
		Customer: 		customer1,
		Ord_date: 		time.Now(),
		Fin_date: 		time.Now().AddDate(+0, +0, +7),
		Amount: 		2,
		TOT_PRC: 		calculateTOTPRC(2, 2),
	}
	db.Model(&Detail{}).Create(&detail1)

	detail2 := Detail{
		Header: 		header2,
		Product: 		product2,
		Customer: 		customer2,
		Ord_date: 		time.Now(),
		Fin_date: 		time.Now().AddDate(+0, +0, +7),
		Amount: 		2,
		TOT_PRC: 		calculateTOTPRC(2, 2),
	}
	db.Model(&Detail{}).Create(&detail2)

	detail3 := Detail{
		Header: 		header3,
		Product: 		product3,
		Customer: 		customer3,
		Ord_date: 		time.Now(),
		Fin_date: 		time.Now().AddDate(+0, +0, +7),
		Amount: 		2,
		TOT_PRC: 		calculateTOTPRC(2, 2),
	}
	db.Model(&Detail{}).Create(&detail3)

	// Master
	master1 := Master{
		Customer: 		customer1,
		Product: 		product1,
		Doc_date: 		time.Now(),
		Detail: 		detail1,
		Sys_date: 		time.Now(),
		Amount: 		2,
		Cost_tot: 		2,
	}
	db.Model(&Master{}).Create(&master1)

	master2 := Master{
		Customer: 		customer2,
		Product: 		product2,
		Doc_date: 		time.Now(),
		Detail: 		detail2,
		Sys_date: 		time.Now(),
		Amount: 		2,
		Cost_tot: 		2,
	}
	db.Model(&Master{}).Create(&master2)

	master3 := Master{
		Customer: 		customer3,
		Product: 		product3,
		Doc_date: 		time.Now(),
		Detail: 		detail3,
		Sys_date: 		time.Now(),
		Amount: 		2,
		Cost_tot: 		2,
	}
	db.Model(&Master{}).Create(&master3)
}

func calculateTOTPRC(amount, costUnit int) int {
    return amount * costUnit
}