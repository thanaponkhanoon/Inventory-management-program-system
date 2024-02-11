package entity

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Product_id		string
	Product_name	string
	Cost_unit		int

	Masters			[]Master	`gorm:"foreignKey:ProductID"`
	Details			[]Detail	`gorm:"foreignKey:ProductID"`
}

type Customer struct {
	gorm.Model

	Customer_id		string
	Custome_name	string

	Masters			[]Master	`gorm:"foreignKey:CustomerID"`
	Headers			[]Header	`gorm:"foreignKey:CustomerID"`
}

type Header struct {
	gorm.Model

	Order_no		int

	CustomerID		*uint
	Customer		Customer	`gorm:"references:id"`

	Order_date		time.Time	//วันที่สั่ง

	Details			[]Detail	`gorm:"foreignKey:HeaderID"`
}

type Detail struct {
	gorm.Model

	HeaderID		*uint
	Header			Header		`gorm:"references:id"`

	ProductID		*uint
	Product			Product		`gorm:"references:id"`

	Ord_date		time.Time	//วันที่กำหนดส่งตามแผน
	Fin_date		time.Time	//วันส่งสินค้าจริง
	Amount			int			//จำนวนที่สั่ง
	Cost_unit		int			//ราคาต่อหน่วย
	TOT_PRC			int			//ราคารวม

	Masters			[]Master	`gorm:"foreignKey:DetailID"`
}

type Master struct {
	gorm.Model

	CustomerID		*uint
	Customer		Customer	`gorm:"references:id"`

	ProductID		*uint
	Product			Product		`gorm:"references:id"`

	Doc_date		time.Time

	DetailID		*uint
	Detail			Detail		`gorm:"references:id"`

	Sys_date		time.Time

	Amount			int			//จำนวนที่สั่ง
	Cost_tot		int			//ราคารวม
}