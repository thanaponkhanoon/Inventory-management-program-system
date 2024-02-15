import { CustomerInterface } from "./ICustomer";
import { HeaderInterface } from "./IHeader";
import { ProductInterface } from "./IProduct";

export interface DetailInterface{
    ID:             number,
    HeaderID:       number,
    Header:         HeaderInterface,
    ProductID:      number,
    Product:        ProductInterface
    CustomerID:     number,
    Customer:       CustomerInterface,
    Ord_date:       Date | null,
    Fin_date:       Date | null,
    Amount:         number,
    TOT_PRC:        number,
}