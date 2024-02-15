package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestProductCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format Product", func(t *testing.T) {
		product := Product{
			Product_id:   "id12345678",
			Product_name: "sutthipong",
			Cost_unit:    5,
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(product)

		// เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		// เช็คว่ามันว่างไหม
		g.Expect(err).To(BeNil())

		fmt.Println(err)
	})
}

func TestProductNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	product := Product{
		Product_id:   "id12345678",
		Product_name: "", // ต้องเป็นค่าว่างเพื่อให้เกิด error
		Cost_unit:    5,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(product)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).NotTo(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).NotTo(BeNil())

	// ตรวจสอบข้อความของ err ว่ามีข้อความที่คาดหวังหรือไม่
	g.Expect(err.Error()).To(Equal("Product_name cannot be blank"))
}

func TestCostUnit(t *testing.T) {
	g := NewGomegaWithT(t)

	q := []int{
		0,
		10000000,
	}

	for _, c := range q {
		product := Product{
			Product_id:   "id12345678",
			Product_name: "sutthipong",
			Cost_unit:    c,
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(product)

	g.Expect(ok).NotTo(BeTrue()) //OK ไม่เป็น true

	g.Expect(err).ToNot(BeNil()) //เช็คว่ามันว่างไหม

	g.Expect(err.Error()).To(Equal("Cost_unit must be in the range 1-9999999")) //ส่ง error msg

	}

}

func TestProductIDMustTenChaaracter(t *testing.T) {
	g := NewGomegaWithT(t)

	Product_id := []string{
		"",
		"C1",
		"C1234",
		"C12",
	}
	for _, o := range Product_id {
		product := Product{
			Product_id:   o,
			Product_name: "sutthipong",
			Cost_unit:    5,
		}

		ok, err := govalidator.ValidateStruct(product)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Product_id must be 10 characters long"))
	}
}

func TestCustomerCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format Customer", func(t *testing.T) {
		customer := Customer{
			Cus_id:   "id12345678",
			Cus_name: "sutthipong",
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(customer)

		// เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		// เช็คว่ามันว่างไหม
		g.Expect(err).To(BeNil())

		fmt.Println(err)
	})
}

func TestCustomerIDMustTenChaaracter(t *testing.T) {
	g := NewGomegaWithT(t)

	Cus_id := []string{
		"",
		"C1",
		"C1234",
		"C12",
	}
	for _, o := range Cus_id {
		customer := Customer{
			Cus_id:   o,
			Cus_name: "sutthipong",
		}

		ok, err := govalidator.ValidateStruct(customer)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Cus_id must be 10 characters long"))
	}
}

func TestCustomerNameNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	customer := Customer{
		Cus_id:   "id12345678",
		Cus_name: "",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(customer)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ err ได้
	g.Expect(ok).NotTo(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).NotTo(BeNil())

	// ตรวจสอบข้อความของ err ว่ามีข้อความที่คาดหวังหรือไม่
	g.Expect(err.Error()).To(Equal("Cus_name cannot be blank"))
}

func TestHeaderCorrect(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run("Check format Header", func(t *testing.T) {
		header := Header{
			Order_no: 1,
			Order_date: time.Now(),
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(header)

		// เช็คว่ามันเป็นค่าจริงไหม
		g.Expect(ok).To(BeTrue())

		// เช็คว่ามันว่างไหม
		g.Expect(err).To(BeNil())

		fmt.Println(err)
	})
}

func TestHeaderNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

		header := Header{
			Order_no: 1,
			Order_date:       time.Now().Add(-24 * time.Hour), //ผิด
		}
		// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(header)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Order_date not be past"))
}