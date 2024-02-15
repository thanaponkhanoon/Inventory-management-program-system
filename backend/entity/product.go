package entity

import (
	"time"
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model

	Product_id   string	`gorm:"uniqueIndex" valid:"matches(^.{10}$)~Product_id must be 10 characters long,required~Product_id must be 10 characters long"`
	Product_name string `valid:"required~Product_name cannot be blank"`
	Cost_unit    int	`valid:"required~Cost_unit must be in the range 1-9999999, range(1|9999999)~Cost_unit must be in the range 1-9999999"`

	Masters []Master `gorm:"foreignKey:ProductID"`
	Details []Detail `gorm:"foreignKey:ProductID"`
}

type Customer struct {
	gorm.Model

	Cus_id   string	`gorm:"uniqueIndex" valid:"matches(^.{10}$)~Cus_id must be 10 characters long,required~Cus_id must be 10 characters long"`
	Cus_name string	`valid:"required~Cus_name cannot be blank"`

	Masters []Master `gorm:"foreignKey:CustomerID"`
	Headers []Header `gorm:"foreignKey:CustomerID"`
	Details []Detail `gorm:"foreignKey:CustomerID"`
}

type Header struct {
	gorm.Model

	Order_no int	

	CustomerID *uint
	Customer   Customer `gorm:"references:id"`

	Order_date time.Time `valid:"Past~Order_date not be past,required~Order_date not be past"`

	Details  []Detail `gorm:"foreignKey:HeaderID"`
}

type Detail struct {
	gorm.Model

	HeaderID *uint	
	Header   Header `gorm:"references:id"`

	CustomerID *uint
	Customer   Customer `gorm:"references:id"`

	ProductID *uint
	Product   Product `gorm:"references:id"`

	Ord_date time.Time //วันที่กำหนดส่งตามแผน
	Fin_date time.Time //วันส่งสินค้าจริง
	Amount   int       //จำนวนที่สั่ง
	TOT_PRC  int       //ราคารวม

	Masters []Master `gorm:"foreignKey:DetailID"`
}

type Master struct {
	gorm.Model

	CustomerID *uint	
	Customer   Customer `gorm:"references:id"`

	ProductID *uint
	Product   Product `gorm:"references:id"`

	Doc_date time.Time

	DetailID *uint
	Detail   Detail `gorm:"references:id"`

	Sys_date time.Time

	Amount   int //จำนวนที่สั่ง
	Cost_tot int //ราคารวม
}

func init() {
	govalidator.CustomTypeTagMap.Set("Past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute*-10)) || t.Equal(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("Present", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(10-time.Minute)) && t.Before(time.Now().Add(10+time.Minute))
	})

}